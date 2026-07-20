import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FiMapPin, 
  FiCamera, 
  FiClock, 
  FiUser, 
  FiChevronLeft,
  FiActivity,
  FiCheckCircle,
  FiSend,
  FiBell
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import toast, { Toaster } from "react-hot-toast";

import incidents from "../data/incidents";
import StatusChip from "../components/common/StatusChip";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";

import "../styles/alertDetail.css";

// Dynamic camera coordinate lookup (Strictly 22 cameras dataset matching anomaliesData)
const cameraCoords = {
  C01: [17.4012, 78.4682],
  C02: [17.4250, 78.4550],
  C03: [17.3912, 78.4720],
  C04: [17.4140, 78.4340],
  C05: [17.3985, 78.4715],
  C06: [17.4062, 78.4712],
  C07: [17.4330, 78.5020],
  C08: [17.4342, 78.4870],
  C09: [17.4150, 78.4350],
  C10: [17.3520, 78.4780],
  C11: [17.4020, 78.4590],
  C12: [17.4120, 78.3970],
  C13: [17.4050, 78.4280],
  C14: [17.4042, 78.4750],
  C15: [17.3820, 78.5130],
  C16: [17.3616, 78.4747],
  C17: [17.3710, 78.4790],
  C18: [17.3670, 78.4760],
  C19: [17.3640, 78.4750],
  C20: [17.3750, 78.4680],
  C21: [17.4035, 78.4705],
  C22: [17.3870, 78.4910]
};

const badgeColors = {
  Critical: "red",
  High: "yellow",
  Medium: "blue",
  Low: "green",
};

// Generates dynamic Leaflet DivIcon based on severity/status
const getMarkerIcon = (severity) => {
  let color = "#ef4444"; // default red
  if (severity === "Low") color = "#16a34a";
  if (severity === "Medium") color = "#3b82f6";
  if (severity === "High") color = "#f59e0b";
  
  return new L.DivIcon({
    html: `<div style="
      width: 16px; 
      height: 16px; 
      background-color: ${color}; 
      border: 2px solid white; 
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
    "></div>`,
    className: "",
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

function AlertDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find target incident
  const rawIncident = incidents.find(item => item.id === id);

  // States
  const [incident, setIncident] = useState(rawIncident);
  const [status, setStatus] = useState(rawIncident ? rawIncident.status : "");
  const [officer, setOfficer] = useState(rawIncident ? rawIncident.officer : "");
  const [timeline, setTimeline] = useState([
    { time: "Just now", desc: "System status initialized on dashboard console.", type: "system" },
    { time: "2m ago", desc: "AI model trigger registered and queued to Operator desk.", type: "alert" },
    { time: "5m ago", desc: "Anomaly detected on CCTV feed node via deep learning heuristics.", type: "alert" }
  ]);

  useEffect(() => {
    if (rawIncident) {
      setIncident(rawIncident);
      setStatus(rawIncident.status);
      setOfficer(rawIncident.officer);
    }
  }, [id, rawIncident]);

  if (!incident) {
    return (
      <div className="alert-detail-container" style={{ padding: "40px", textAlign: "center" }}>
        <h2>Alert Not Found</h2>
        <p style={{ color: "var(--text-secondary)", margin: "16px 0" }}>
          The requested alert with ID {id} does not exist.
        </p>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  // Handle local status change simulation
  const handleUpdateStatus = (newStatus) => {
    setStatus(newStatus);
    toast.success(`Alert status updated to: ${newStatus}`);
    
    // Append to timeline
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeline(prev => [
      { time: timestamp, desc: `Status changed to ${newStatus} by Operator.`, type: "action" },
      ...prev
    ]);
  };

  // Handle patrol dispatch simulation
  const handleDispatch = () => {
    toast.success("Patrol unit dispatched successfully!", {
      icon: "🚔",
      duration: 3000
    });
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeline(prev => [
      { time: timestamp, desc: `Emergency response unit dispatched to ${incident.location}.`, type: "action" },
      ...prev
    ]);
  };

  // Handle sound alarm simulation
  const handleTriggerAlarm = () => {
    toast.error("Audio sirens and flashing sirens triggered on site camera!", {
      icon: "🚨",
      duration: 3500
    });
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTimeline(prev => [
      { time: timestamp, desc: `Siren trigger command successfully delivered to camera ${incident.camera}.`, type: "action" },
      ...prev
    ]);
  };

  const coords = cameraCoords[incident.camera] || [17.3850, 78.4867];

  return (
    <div className="alert-detail-container">
      <Toaster position="top-right" />

      {/* Back link */}
      <button 
        type="button" 
        className="alert-back-btn" 
        onClick={() => navigate("/")}
      >
        <FiChevronLeft /> Back to Dashboard
      </button>

      {/* Header Info */}
      <div className="status-header-row">
        <div className="status-header-info">
          <span className="module-tag">Emergency Dispatch Console</span>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Alert Details: {incident.title}</h1>
            <Badge color={badgeColors[incident.severity]}>
              {incident.severity}
            </Badge>
          </div>
          <p className="alert-id-tag">Incident Key: {incident.id}</p>
        </div>
        
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-secondary)" }}>Status:</span>
          <StatusChip status={status} />
        </div>
      </div>

      {/* Grid Layout */}
      <div className="alert-detail-grid">
        
        {/* Left Side: Meta & CCTV Video */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Card 1: Meta Information */}
          <div className="status-panel-card alert-meta-card">
            <div className="alert-meta-header">
              <h3>Incident Profile</h3>
              <span className="module-tag">Camera node: {incident.camera}</span>
            </div>

            <table className="alert-info-table">
              <tbody>
                <tr>
                  <td className="label">Location</td>
                  <td className="value">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <FiMapPin /> {incident.location}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="label">Camera Node</td>
                  <td className="value">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <FiCamera /> {incident.camera}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="label">First Detected</td>
                  <td className="value">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <FiClock /> {incident.time}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="label">Assigned Duty</td>
                  <td className="value">
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <FiUser /> {officer}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 2: CCTV Feed */}
          <div className="status-panel-card alert-cctv-container">
            <h3>Live CCTV Snapshot</h3>
            
            <div className="alert-cctv-screen">
              {/* Retro scanlines */}
              <div className="cctv-scanlines"></div>

              {/* Vector Mock Video Feed representing fake data */}
              <div className="cctv-placeholder-svg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" style={{ width: "100%", height: "100%" }}>
                  <rect width="640" height="360" fill="#0f172a" />
                  
                  {/* Grid Lines */}
                  <line x1="320" y1="0" x2="320" y2="360" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  <line x1="0" y1="180" x2="640" y2="180" stroke="rgba(255,255,255,0.05)" strokeDasharray="5,5" />
                  
                  {/* Decorative Camera Scope Circles */}
                  <circle cx="320" cy="180" r="100" stroke="rgba(34,197,94,0.15)" strokeWidth="1" fill="none" />
                  <circle cx="320" cy="180" r="140" stroke="rgba(34,197,94,0.08)" strokeWidth="1" fill="none" />
                  
                  {/* Mock Detection Elements */}
                  <g transform="translate(180, 100)">
                    {/* Bounding box */}
                    <rect x="0" y="0" width="280" height="160" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4,4" />
                    
                    {/* Corner accents */}
                    <path d="M 0 20 L 0 0 L 20 0" fill="none" stroke="#ef4444" strokeWidth="4" />
                    <path d="M 260 0 L 280 0 L 280 20" fill="none" stroke="#ef4444" strokeWidth="4" />
                    <path d="M 0 140 L 0 160 L 20 160" fill="none" stroke="#ef4444" strokeWidth="4" />
                    <path d="M 260 160 L 280 160 L 280 140" fill="none" stroke="#ef4444" strokeWidth="4" />
                    
                    {/* Text tag */}
                    <rect x="0" y="-30" width="180" height="30" fill="#ef4444" />
                    <text x="10" y="-9" fill="white" fontSize="13" fontFamily="monospace" fontWeight="bold">
                      {incident.title.toUpperCase()} (CONF: 97.4%)
                    </text>
                  </g>

                  {/* Tech HUD elements */}
                  <text x="30" y="320" fill="#22c55e" fontSize="12" fontFamily="monospace" fontWeight="700">
                    LATENCY: 42ms
                  </text>
                  <text x="30" y="340" fill="#22c55e" fontSize="12" fontFamily="monospace" fontWeight="700">
                    AI RESOLUTION: 4K @ 60 FPS
                  </text>
                </svg>
              </div>

              {/* Feed Text Overlays */}
              <div className="cctv-feed-overlay">
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div className="cctv-top-left">
                    <span className="cctv-rec-dot"></span>
                    <span>REC FEED [LIVE]</span>
                  </div>
                  <div className="cctv-top-right">
                    NODE: {incident.camera} &bull; {incident.location.toUpperCase()}
                  </div>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                  <div className="cctv-bottom-left">
                    TGICCC SECURE DISPATCH DESK &bull; ZOOM 1.0X
                  </div>
                  <div className="cctv-top-right">
                    UTC +05:30 &bull; {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map & Actions & Timeline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Card 3: Dispatch & Action Console */}
          <div className="status-panel-card alert-actions-panel">
            <h3>Operator Actions</h3>
            
            <div className="alert-actions-buttons">
              {status !== "Acknowledged" && (
                <button 
                  type="button" 
                  className="action-btn-custom dispatch" 
                  onClick={() => handleUpdateStatus("Acknowledged")}
                >
                  <FiCheckCircle /> Acknowledge
                </button>
              )}
              {status !== "Resolved" && (
                <button 
                  type="button" 
                  className="action-btn-custom dispatch" 
                  style={{ background: "var(--low)" }}
                  onClick={() => handleUpdateStatus("Resolved")}
                >
                  <FiCheckCircle /> Resolve Alert
                </button>
              )}
              {status !== "Pending" && (
                <button 
                  type="button" 
                  className="action-btn-custom dispatch" 
                  style={{ background: "#64748b" }}
                  onClick={() => handleUpdateStatus("Pending")}
                >
                  <FiActivity /> Set Pending
                </button>
              )}
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "16px", marginTop: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "12px" }}>
                Emergency Responders
              </span>
              <div className="alert-actions-buttons">
                <button 
                  type="button" 
                  className="action-btn-custom dispatch"
                  style={{ background: "#475569" }}
                  onClick={handleDispatch}
                >
                  <FiSend /> Dispatch Patrol
                </button>
                <button 
                  type="button" 
                  className="action-btn-custom alarm"
                  onClick={handleTriggerAlarm}
                >
                  <FiBell /> Site Siren
                </button>
              </div>
            </div>
          </div>

          {/* Card 4: Location Map */}
          <div className="status-panel-card" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "16px 16px 12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: "0" }}>Camera Staging Map</h3>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>
                  <span style={{ display: "inline-block", width: "8px", height: "8px", background: "var(--critical)", borderRadius: "50%", marginRight: "4px" }}></span>
                  Incident
                </span>
                <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-secondary)" }}>LAST SYNC: JUST NOW</span>
              </div>
            </div>
            <div className="alert-map-box">
              <MapContainer 
                center={coords} 
                zoom={15} 
                scrollWheelZoom={false}
                style={{ width: "100%", height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker position={coords} icon={getMarkerIcon(incident.severity)}>
                  <Popup>
                    <div style={{ fontSize: "13px", fontWeight: "700" }}>
                      Camera {incident.camera}<br/>
                      <span style={{ fontWeight: "500", color: "#64748b" }}>{incident.location}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Card 5: Audit Logs / Timeline */}
          <div className="status-panel-card alert-timeline-card">
            <h3>Response Log Timeline</h3>
            
            <div className="timeline-list">
              {timeline.map((item, idx) => (
                <div key={idx} className="timeline-item">
                  <div className={`timeline-dot ${item.type === "action" ? "active" : item.type === "alert" ? "alert" : ""}`}></div>
                  <div className="timeline-time">{item.time}</div>
                  <div className="timeline-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default AlertDetail;
