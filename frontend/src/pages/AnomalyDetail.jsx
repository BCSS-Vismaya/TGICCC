import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { 
  FiSearch, 
  FiActivity, 
  FiAlertTriangle, 
  FiVideo, 
  FiClock, 
  FiMapPin, 
  FiCheckCircle, 
  FiCalendar, 
  FiShield,
  FiXCircle
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import anomaliesData from "../data/anomaliesData";
import { useSeverity } from "../context/SeverityContext";

// Setup Hyderabad zones positions and coordinates lookup
const zoneCoordinates = {
  "Entire Hyderabad": { center: [17.3850, 78.4867], zoom: 11 },
  "North Zone": { center: [17.4399, 78.4983], zoom: 13 },
  "South Zone": { center: [17.3616, 78.4747], zoom: 13 },
  "East Zone": { center: [17.3660, 78.5300], zoom: 13 },
  "West Zone": { center: [17.4483, 78.3741], zoom: 13 },
  "Central Zone": { center: [17.4150, 78.4750], zoom: 13 },
  "Charminar": { center: [17.3616, 78.4747], zoom: 15 },
  "Secunderabad": { center: [17.4399, 78.4983], zoom: 15 },
  "Banjara Hills": { center: [17.4150, 78.4350], zoom: 15 },
  "Kukatpally": { center: [17.4855, 78.4100], zoom: 15 },
  "Gachibowli": { center: [17.4400, 78.3480], zoom: 15 }
};

// Generates dynamic Leaflet DivIcon based on camera status
const getMarkerIcon = (status) => {
  let color = "#16A34A"; // Green (Healthy)
  if (status === "Incident") {
    color = "#DC2626"; // Red (Incident)
  } else if (status === "Warning") {
    color = "#F59E0B"; // Amber (Warning)
  } else if (status === "Offline") {
    color = "#94a3b8"; // Grey (Offline)
  }
  return new L.DivIcon({
    html: `<div style="
      width: 14px; 
      height: 14px; 
      background-color: ${color}; 
      border: 2px solid white; 
      border-radius: 50%;
      box-shadow: 0 0 6px ${color};
    "></div>`,
    className: "custom-leaflet-dot",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7],
  });
};

// Map panning animator
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true, duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

// Convert YYYY-MM-DD calendar input to mock date format M/D/YYYY
const formatDateToMock = (dateStr) => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return "";
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  return `${month}/${day}/${year}`;
};

function AnomalyDetail() {
  const { type } = useParams();
  const data = anomaliesData[type];
  const { getSeverity } = useSeverity();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("Entire Hyderabad");
  const [mapCenter, setMapCenter] = useState([17.3850, 78.4867]);
  const [mapZoom, setMapZoom] = useState(11);
  const [selectedCameraId, setSelectedCameraId] = useState(null);

  // Evidence Gallery Sorter States
  const [evidenceDate, setEvidenceDate] = useState("");
  const [evidenceSeverity, setEvidenceSeverity] = useState("All");

  // Reset page filters on route param change
  useEffect(() => {
    setSearchQuery("");
    setSelectedZone("Entire Hyderabad");
    setMapCenter([17.3850, 78.4867]);
    setMapZoom(11);
    setSelectedCameraId(null);
    setEvidenceDate("");
    setEvidenceSeverity("All");
  }, [type]);

  if (!data) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <FiXCircle style={{ fontSize: "50px", color: "var(--critical)" }} />
        <h2 style={{ marginTop: "16px" }}>Anomaly Type Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          The requested anomaly module ID is invalid.
        </p>
      </div>
    );
  }

  // Handle Area/Zone dropdown changes
  const handleZoneChange = (e) => {
    const zoneName = e.target.value;
    setSelectedZone(zoneName);
    setSelectedCameraId(null); // Clear selected camera marker filter

    const zoomConfig = zoneCoordinates[zoneName];
    if (zoomConfig) {
      setMapCenter(zoomConfig.center);
      setMapZoom(zoomConfig.zoom);
    }
  };

  // Check if camera falls into selected zone hierarchy
  const matchesZoneFilter = (camera) => {
    if (selectedZone === "Entire Hyderabad") return true;
    
    // Support comma-separated strings of zones for a camera
    const cameraZones = typeof camera.zone === "string" 
      ? camera.zone.split(",").map(z => z.trim()) 
      : [camera.zone];

    if (cameraZones.includes(selectedZone)) return true;

    // Check broader zones mappings
    const northAreas = ["Secunderabad"];
    const southAreas = ["Charminar"];
    const westAreas = ["Gachibowli", "Kukatpally", "Banjara Hills", "West Zone"];
    const centralAreas = ["Banjara Hills", "Central Zone"];
    const eastAreas = ["East Zone"];

    if (selectedZone === "North Zone" && cameraZones.some(z => northAreas.includes(z))) return true;
    if (selectedZone === "South Zone" && cameraZones.some(z => southAreas.includes(z))) return true;
    if (selectedZone === "West Zone" && cameraZones.some(z => westAreas.includes(z))) return true;
    if (selectedZone === "Central Zone" && cameraZones.some(z => centralAreas.includes(z))) return true;
    if (selectedZone === "East Zone" && cameraZones.some(z => eastAreas.includes(z))) return true;

    return false;
  };

  // Check if camera matches search query
  const matchesSearch = (camera) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      camera.id.toLowerCase().includes(query) ||
      camera.name.toLowerCase().includes(query)
    );
  };

  // Filter cameras
  const filteredCameras = data.cameras.filter(
    (cam) => matchesZoneFilter(cam) && matchesSearch(cam)
  );

  // Filter detections (sorted newest first by default in mockup)
  const filteredDetections = data.detections.filter((det) => {
    // Match camera details
    const cameraObj = data.cameras.find((c) => c.id === det.camera);
    if (!cameraObj) return false;
    
    // Filter by active camera marker click selection
    if (selectedCameraId && det.camera !== selectedCameraId) return false;

    // Filter by zone hierarchy
    if (!matchesZoneFilter(cameraObj)) return false;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearchKey = det.camera.toLowerCase().includes(query) || 
                              det.location.toLowerCase().includes(query);
      if (!matchesSearchKey) return false;
    }

    return true;
  });

  // Filter evidence gallery
  const filteredEvidence = data.evidence.filter((ev) => {
    // Filter by active camera click selection
    if (selectedCameraId && ev.camera !== selectedCameraId) return false;

    // Filter by zone/hierarchy
    const cameraObj = data.cameras.find((c) => c.id === ev.camera);
    if (cameraObj && !matchesZoneFilter(cameraObj)) return false;

    // Filter by date picker
    if (evidenceDate) {
      const mockFormattedDate = formatDateToMock(evidenceDate);
      if (!ev.timestamp.startsWith(mockFormattedDate)) return false;
    }

    // Filter by severity selection
    const resolvedSeverity = getSeverity(ev.anomaly || data.title);
    if (evidenceSeverity !== "All" && resolvedSeverity.toUpperCase() !== evidenceSeverity.toUpperCase()) return false;

    // Filter by search bar query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesSearchKey = ev.cameraID?.toLowerCase().includes(query) || 
                              ev.location.toLowerCase().includes(query) || 
                              ev.camera.toLowerCase().includes(query);
      if (!matchesSearchKey) return false;
    }

    return true;
  });

  // Handle Map Camera marker click event
  const handleMarkerClick = (cam) => {
    setSelectedCameraId(cam.id);
    setMapCenter(cam.coords);
    setMapZoom(15);
  };

  // Calculate dynamic health bar coloring
  const getHealthFillColor = (health, status) => {
    if (status === "Offline") return "grey";
    if (health >= 80) return "green";
    if (health >= 50) return "amber";
    return "red";
  };

  return (
    <div className="anomaly-container">
      
      {/* Header section with Stats */}
      <div className="anomaly-header-wrapper">
        <div className="anomaly-title-block">
          <h1 style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
            {data.title}
            <span className={`priority-tag ${getSeverity(data.title).toLowerCase()}`} style={{ fontSize: "14px", padding: "4px 10px", borderRadius: "6px", margin: 0, textTransform: "uppercase" }}>
              {getSeverity(data.title)}
            </span>
          </h1>
          <p>{data.description}</p>
        </div>

        <div className="anomaly-stats-grid">
          <div className="anomaly-stat-panel">
            <span>Detections</span>
            <h2>{data.stats.detections}</h2>
          </div>
          <div className="anomaly-stat-panel green">
            <span>Active Cams</span>
            <h2>{data.stats.activeCams}</h2>
          </div>
          <div className="anomaly-stat-panel">
            <span>Total Cams</span>
            <h2>{data.stats.totalCams}</h2>
          </div>
        </div>
      </div>

      {/* Camera Health Section */}
      <div className="anomaly-panel-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Camera Health &bull; {data.title}</h3>
          <span className="module-tag">{filteredCameras.length} cameras</span>
        </div>

        <div className="camera-cards-grid">
          {filteredCameras.length > 0 ? (
            filteredCameras.map((cam) => (
              <div key={cam.id} className="camera-health-card">
                <div className="camera-card-top">
                  <span className="camera-card-id">{cam.id}</span>
                  <span className={`camera-status-indicator ${cam.status.toLowerCase()}`}>
                    <FiActivity /> {cam.status === "Incident" ? "Incident" : cam.status}
                  </span>
                </div>
                <div className="camera-card-name">{cam.name}</div>
                
                <div className="camera-progress-container">
                  <div className="camera-progress-label">
                    <span>Health</span>
                    <span>{cam.health}%</span>
                  </div>
                  <div className="camera-progress-bar-wrapper">
                    <div 
                      className={`camera-progress-fill ${getHealthFillColor(cam.health, cam.status)}`}
                      style={{ width: `${cam.health}%` }}
                    />
                  </div>
                </div>

                <div className="camera-meta-bottom">
                  <span className="camera-heartbeat">
                    <FiClock /> {cam.heartbeat}
                  </span>
                  <span className="camera-model-tag">{cam.aiModel}</span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              No camera nodes match the search filters.
            </div>
          )}
        </div>
      </div>

      {/* interactive map section */}
      <div className="anomaly-map-section">
        <div className="anomaly-section-header">
          <h3>Hyderabad &bull; {data.title} Cameras</h3>
          <div className="anomaly-map-legend">
            <div className="anomaly-legend-item">
              <span className="anomaly-legend-dot green"></span>
              <span>Healthy</span>
            </div>
            <div className="anomaly-legend-item">
              <span className="anomaly-legend-dot red"></span>
              <span>Active Incident</span>
            </div>
            <div className="anomaly-legend-item">
              <span className="anomaly-legend-dot grey"></span>
              <span>Offline</span>
            </div>
          </div>
        </div>

        <div className="anomaly-map-box">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ChangeMapView center={mapCenter} zoom={mapZoom} />
            {data.cameras.map((cam) => (
              <Marker
                key={cam.id}
                position={cam.coords}
                icon={getMarkerIcon(cam.status)}
                eventHandlers={{
                  click: () => handleMarkerClick(cam)
                }}
              >
                <Popup>
                  <div style={{ minWidth: "120px" }}>
                    <strong>{cam.id}</strong><br />
                    <span>{cam.name}</span><br />
                    <span>Status: <strong>{cam.status}</strong></span><br />
                    <span>Health: <strong>{cam.health}%</strong></span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {/* Search and Area Hierarchy Toolbar */}
      <div className="anomaly-control-bar">
        <div className="anomaly-search-input">
          <FiSearch style={{ color: "var(--text-secondary)" }} />
          <input
            type="text"
            placeholder="Search location or camera ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <select
          className="anomaly-dropdown"
          value={selectedZone}
          onChange={handleZoneChange}
        >
          <option value="Entire Hyderabad">Entire Hyderabad</option>
          <option value="North Zone">North Zone</option>
          <option value="South Zone">South Zone</option>
          <option value="East Zone">East Zone</option>
          <option value="West Zone">West Zone</option>
          <option value="Central Zone">Central Zone</option>
          <option value="Charminar">Charminar</option>
          <option value="Secunderabad">Secunderabad</option>
          <option value="Banjara Hills">Banjara Hills</option>
          <option value="Kukatpally">Kukatpally</option>
          <option value="Gachibowli">Gachibowli</option>
        </select>

        {/* Clear camera selection filter indicator */}
        {selectedCameraId && (
          <button 
            type="button" 
            className="frs-btn-outline" 
            style={{ padding: "8px 14px", fontSize: "13px" }}
            onClick={() => setSelectedCameraId(null)}
          >
            Clear Cam Filter ({selectedCameraId})
          </button>
        )}
      </div>

      {/* Recent Detections Section */}
      <div className="anomaly-panel-card">
        <h3>Recent Detections</h3>
        <div className="anomaly-detections-grid">
          {filteredDetections.length > 0 ? (
            filteredDetections.map((det) => (
              <div key={det.id} className="detection-card">
                <div className="detection-snapshot">
                  <img src={det.snapshot} alt={det.location} />
                  <span className={`detection-severity-tag ${getSeverity(data.title).toLowerCase()}`}>
                    {getSeverity(data.title)}
                  </span>
                  <span className="detection-camera-tag">{det.camera}</span>
                </div>
                <div className="detection-info">
                  <div className="detection-location">{det.location}</div>
                  <div className="detection-time">
                    <FiClock /> {det.timestamp}
                  </div>
                  <div className="detection-meta-row">
                    <span className="detection-confidence">{det.confidence} conf.</span>
                    <span className="detection-status" style={{
                      color: det.status === "Active" ? "var(--critical)" : "var(--low)"
                    }}>{det.status}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              No recent detections matching the selection parameters.
            </div>
          )}
        </div>
      </div>

      {/* Evidence Gallery Section */}
      <div className="anomaly-panel-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <h3>Evidence Gallery</h3>
          <div className="anomaly-gallery-filters">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <FiCalendar style={{ color: "var(--text-secondary)" }} />
              <input
                type="date"
                className="date-picker-input"
                value={evidenceDate}
                onChange={(e) => setEvidenceDate(e.target.value)}
              />
            </div>
            
            <select
              className="anomaly-dropdown"
              style={{ minWidth: "140px", padding: "8px 12px", fontSize: "13px" }}
              value={evidenceSeverity}
              onChange={(e) => setEvidenceSeverity(e.target.value)}
            >
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="frs-evidence-grid">
          {filteredEvidence.length > 0 ? (
            filteredEvidence.map((ev) => (
              <div key={ev.id} className="evidence-card">
                <div className="evidence-preview-box">
                  <img src={ev.snapshot} alt={ev.location} />
                  <span className="evidence-badge">{ev.camera}</span>
                </div>
                <div className="evidence-details-box">
                  <div className="evidence-meta">
                    <div className="evidence-location">{ev.location}</div>
                    <div className="evidence-time-row">
                      <span>{ev.timestamp}</span>
                    </div>
                    <div className="evidence-row-data">
                      <span className="evidence-lbl">AI Confidence</span>
                      <span className="evidence-val">{ev.confidence}</span>
                    </div>
                    <div className="evidence-row-data">
                      <span className="evidence-lbl">Anomaly</span>
                      <span className="evidence-val">{ev.anomaly}</span>
                    </div>
                    <div className="evidence-row-data">
                      <span className="evidence-lbl">Severity</span>
                      <span className={`priority-tag ${getSeverity(ev.anomaly || data.title).toLowerCase()}`} style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}>
                        {getSeverity(ev.anomaly || data.title).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <button type="button" className="evidence-btn-view">
                    View Evidence
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "1/-1", padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
              No evidence files match the selected filter query.
            </div>
          )}
        </div>
      </div>



    </div>
  );
}

export default AnomalyDetail;
