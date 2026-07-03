import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUpload,
  FiMapPin,
  FiClock,
  FiInfo,
  FiAlertOctagon,
  FiX
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import frsData from "../data/frsData";

// Fix Leaflet marker icons by using a custom inline SVG Icon.
// This prevents missing asset loading bugs during production builds.
const customMarkerIcon = new L.DivIcon({
  html: `<div style="
    width: 16px; 
    height: 16px; 
    background-color: #EF4444; 
    border: 3px solid white; 
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  "></div>`,
  className: "custom-leaflet-dot",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8],
});

// A helper component to dynamically fly/center the map to the active location coordinates
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 12, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

function FaceRecognition() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredMatches, setFilteredMatches] = useState(frsData);
  const [activeProfile, setActiveProfile] = useState(frsData[0]);
  const [mapCenter, setMapCenter] = useState([17.4968, 78.3610]); // Default to Miyapur

  // Simulated Feature States
  const [uploadProcessing, setUploadProcessing] = useState(false);

  // Update filtered list based on Search and Selected Category
  useEffect(() => {
    let result = frsData;

    // Filter by category
    if (activeCategory === "Missing Persons") {
      result = result.filter(item => item.watchlistStatus === "MISSING PERSON");
    } else if (activeCategory === "High Risk") {
      result = result.filter(item => item.watchlistStatus === "HIGH RISK");
    } else if (activeCategory === "Watchlist Matches") {
      result = result.filter(item => item.watchlistStatus === "WANTED");
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.caseNumber.toLowerCase().includes(query) ||
          item.vehicles.some(v => v.toLowerCase().includes(query))
      );
    }

    setFilteredMatches(result);

    // If active profile is no longer in filtered list, pick the first matched profile
    if (result.length > 0) {
      const containsActive = activeProfile && result.some(item => item.id === activeProfile.id);
      if (!containsActive) {
        setActiveProfile(result[0]);
      }
    } else {
      setActiveProfile(null);
    }
  }, [searchQuery, activeCategory]);

  // Adjust map center whenever active profile changes
  useEffect(() => {
    if (activeProfile && activeProfile.timeline && activeProfile.timeline.length > 0) {
      setMapCenter(activeProfile.timeline[0].coords);
    }
  }, [activeProfile]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled reactively by useEffect, but we select first match if found
    if (filteredMatches.length > 0) {
      setActiveProfile(filteredMatches[0]);
    }
  };

  // Simulate Image Upload
  const handleUploadClick = () => {
    setUploadProcessing(true);
    setTimeout(() => {
      // Simulate matching Anitha Devi
      const match = frsData.find(item => item.id === "FACE-1003");
      if (match) {
        setActiveProfile(match);
        setSearchQuery("FACE-1003");
        setActiveCategory("All");
      }
      setUploadProcessing(false);
    }, 1500);
  };


  return (
    <div className="frs-container">
      {/* Header Info */}
      <div className="frs-meta-header">
        <span className="category-title">Face Recognition System (FRS)</span>
        <h1>Unified Police Intelligence Search</h1>
        <p>
          Search by name, vehicle, face ID, or case number. Pull citizen profile, violation timeline, sighted-camera map, and AI-attached evidence.
        </p>
      </div>

      {/* Unified Intelligent Search Bar */}
      <form onSubmit={handleSearchSubmit} className="frs-search-wrapper">
        <div className="frs-search-input-container">
          <FiSearch className="frs-search-icon" />
          <input
            type="text"
            placeholder="Search by Name, Number Plate, Face ID or Case Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              type="button" 
              className="frs-mock-camera-close" 
              onClick={() => setSearchQuery("")}
              style={{ fontSize: "14px" }}
            >
              <FiX />
            </button>
          )}
        </div>
        <button type="submit" className="frs-btn-search">
          Search
        </button>

        <button 
          type="button" 
          className="frs-btn-outline" 
          onClick={handleUploadClick}
          disabled={uploadProcessing}
        >
          <FiUpload />
          {uploadProcessing ? "Scanning Image..." : "Upload Image"}
        </button>


      </form>

      {/* Main Workspace Layout */}
      <div className="frs-workspace-grid">
        {/* Left matches List Sidebar */}
        <div className="frs-matches-sidebar">
          <h3>Matches</h3>
          
          <div className="frs-category-filters">
            {["All", "Recent Face Matches", "Missing Persons", "Watchlist Matches", "High Risk"].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`frs-filter-chip ${activeCategory === cat || (cat === "Recent Face Matches" && activeCategory === "All") ? "active" : ""}`}
                onClick={() => {
                  if (cat === "Recent Face Matches") {
                    setActiveCategory("All");
                  } else {
                    setActiveCategory(cat);
                  }
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="frs-matches-list">
            {filteredMatches.length > 0 ? (
              filteredMatches.map((item) => (
                <div
                  key={item.id}
                  className={`frs-match-item ${activeProfile?.id === item.id ? "active" : ""}`}
                  onClick={() => setActiveProfile(item)}
                >
                  <div className="frs-match-photo-container">
                    <img src={item.photo} alt={item.name} />
                  </div>
                  <div className="frs-match-info">
                    <div className="frs-match-name">{item.name}</div>
                    <div className="frs-match-meta">
                      {item.id} &bull; {item.confidenceScore}
                    </div>
                    {item.watchlistStatus !== "None" && (
                      <span className={`frs-match-badge ${item.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                        {item.watchlistStatus}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="frs-no-results">
                <FiInfo className="frs-no-results-icon" />
                <h4>No Matches Found</h4>
                <p>Try searching with another key or clear the search criteria.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right workspace details */}
        <div className="frs-profile-workspace">
          {activeProfile ? (
            <>
              {/* Citizen Profile Details Card */}
              <div className="frs-profile-card">
                <div className="frs-profile-image-container">
                  <img src={activeProfile.photo} alt={activeProfile.name} />
                </div>
                <div className="frs-profile-details">
                  <span className="frs-profile-id">{activeProfile.id}</span>
                  <h2 className="frs-profile-name">{activeProfile.name}</h2>
                  <div className="frs-profile-demographics">
                    Age {activeProfile.age} &bull; {activeProfile.gender}
                  </div>
                  
                  <div className="frs-profile-info-grid">
                    <div className="frs-info-item">
                      <span className="frs-info-label">Address</span>
                      <span className="frs-info-value">{activeProfile.address}</span>
                    </div>
                    <div className="frs-info-item">
                      <span className="frs-info-label">Known Aliases</span>
                      <span className="frs-info-value">{activeProfile.aliases}</span>
                    </div>
                    <div className="frs-info-item">
                      <span className="frs-info-label">Associated Vehicles</span>
                      <span className="frs-info-value">{activeProfile.vehicles.join(", ")}</span>
                    </div>
                    <div className="frs-info-item">
                      <span className="frs-info-label">Last Seen</span>
                      <span className="frs-info-value" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <FiMapPin style={{ color: "var(--primary)" }} /> {activeProfile.lastSeen} ({activeProfile.lastSeenTime})
                      </span>
                    </div>
                    <div className="frs-info-item">
                      <span className="frs-info-label">Case Number</span>
                      <span className="frs-info-value">{activeProfile.caseNumber}</span>
                    </div>
                    <div className="frs-info-item">
                      <span className="frs-info-label">Current Status</span>
                      <span className="frs-info-value">{activeProfile.currentStatus}</span>
                    </div>
                  </div>

                  <div className="frs-profile-badges-row">
                    {activeProfile.watchlistStatus !== "None" && (
                      <span className={`frs-badge status-${activeProfile.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                        <FiAlertOctagon /> {activeProfile.watchlistStatus}
                      </span>
                    )}
                    <span className="frs-badge confidence">
                      Confidence {activeProfile.confidenceScore}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sighted Cameras Map */}
              <div className="frs-section-card">
                <h3>Detection Map &bull; Sighted Cameras</h3>
                <div className="frs-map-container">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={12} 
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ChangeMapView center={mapCenter} />
                    {activeProfile.timeline.map((loc) => (
                      <Marker
                        key={loc.id}
                        position={loc.coords}
                        icon={customMarkerIcon}
                      >
                        <Popup>
                          <strong>{loc.violationType}</strong><br />
                          Camera: {loc.camera}<br />
                          Location: {loc.location}<br />
                          Time: {loc.time}
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="frs-no-results" style={{ padding: "80px" }}>
              <FiInfo className="frs-no-results-icon" style={{ fontSize: "50px" }} />
              <h4>No Active Profile Selected</h4>
              <p>Please select a suspect match profile from the left matches column, or search by query.</p>
            </div>
          )}
        </div>
      </div>

      {/* Full-Width Violations Timeline and Evidence Gallery */}
      {activeProfile && (
        <>
          {/* Previous Violations Timeline */}
          <div className="frs-section-card">
            <h3>Previous Violations Timeline</h3>
            <div className="frs-timeline">
              {activeProfile.timeline.map((violation) => (
                <div 
                  key={violation.id} 
                  className={`frs-timeline-item ${violation.status.toLowerCase() === "in progress" ? "critical" : ""}`}
                >
                  <div className="frs-timeline-dot"></div>
                  <div className="frs-timeline-header">
                    <span className="frs-timeline-title">{violation.violationType}</span>
                    <span className="frs-timeline-time">
                      <FiClock /> {violation.date} &bull; {violation.time}
                    </span>
                  </div>
                  <div className="frs-timeline-grid">
                    <div className="frs-timeline-cell">
                      <span className="frs-timeline-label">Camera</span>
                      <span className="frs-timeline-val">{violation.camera}</span>
                    </div>
                    <div className="frs-timeline-cell">
                      <span className="frs-timeline-label">Location</span>
                      <span className="frs-timeline-val">{violation.location}</span>
                    </div>
                    <div className="frs-timeline-cell">
                      <span className="frs-timeline-label">Officer</span>
                      <span className="frs-timeline-val">{violation.officer}</span>
                    </div>
                    <div className="frs-timeline-cell">
                      <span className="frs-timeline-label">Case Status</span>
                      <span className="frs-timeline-val" style={{
                        color: violation.status === "Resolved" ? "var(--low)" : 
                               violation.status === "Pending" ? "var(--high)" : "var(--critical)",
                        fontWeight: "bold"
                      }}>
                        {violation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Gallery */}
          <div className="frs-section-card">
            <h3>Evidence Gallery</h3>
            <div className="frs-evidence-grid">
              {activeProfile.evidence.map((ev) => (
                <div key={ev.id} className="frs-evidence-card">
                  <div className="frs-evidence-preview">
                    <img src={ev.image} alt={ev.title} />
                  </div>
                  <div className="frs-evidence-desc">
                    <span className="frs-evidence-title">{ev.title}</span>
                    <span className="frs-evidence-type">{ev.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}


    </div>
  );
}

export default FaceRecognition;