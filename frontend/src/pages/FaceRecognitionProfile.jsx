import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  FiClock,
  FiInfo,
  FiAlertOctagon,
  FiEye,
  FiDownload,
  FiCamera,
  FiShield,
  FiArrowLeft,
  FiX
} from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import frsData from "../data/frsData";

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

function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, 13, { animate: true, duration: 1 });
    }
  }, [center, map]);
  return null;
}

function FaceRecognitionProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeProfile, setActiveProfile] = useState(null);
  const [mapCenter, setMapCenter] = useState([17.4035, 78.4705]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [evidenceTab, setEvidenceTab] = useState("detection");

  // Quick Action States
  const [showProfileDossier, setShowProfileDossier] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignOfficer, setAssignOfficer] = useState("Insp. S. Mahesh");
  const [assignPriority, setAssignPriority] = useState("High Priority");
  const [assignNotes, setAssignNotes] = useState("");

  const timelineRef = useRef(null);
  const evidenceRef = useRef(null);

  useEffect(() => {
    const profile = frsData.find((item) => item.id === id);
    if (profile) {
      setActiveProfile(profile);
      if (profile.timeline && profile.timeline.length > 0) {
        setMapCenter(profile.timeline[0].coords);
      }
    }
  }, [id]);

  const handleBack = () => {
    // Return to the search results, preserving search state if it was passed
    navigate("/frs", { state: location.state });
  };

  const handleExportReport = () => {
    const toastId = toast.loading("Generating intelligence dossier PDF...", { position: "top-right" });
    setTimeout(() => {
      toast.success(`PDF report exported for ${activeProfile.name} successfully!`, { id: toastId, icon: "📄" });
    }, 800);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    if (!activeProfile) return;
    activeProfile.currentStatus = `Assigned - ${assignOfficer}`;
    activeProfile.notes = `[Investigation Assigned on 2026-07-07 by Control Center] Assigned to ${assignOfficer} (${assignPriority}) with instructions: "${assignNotes || "No notes provided"}".\n\n` + activeProfile.notes;
    
    toast.success(`Case assigned to ${assignOfficer} (${assignPriority})`, {
      icon: "👮",
      position: "top-right"
    });
    setShowAssignModal(false);
    setAssignNotes("");
  };

  if (!activeProfile) {
    return <div style={{ padding: "40px" }}>Loading profile or profile not found...</div>;
  }

  return (
    <div className="frs-container" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Toaster position="top-right" />
      
      <div className="frs-meta-header" style={{ marginBottom: 0 }}>
        <button 
          className="frs-btn-outline" 
          onClick={handleBack}
          style={{ width: "fit-content", border: "none", background: "transparent", padding: 0, color: "var(--text-secondary)", fontSize: "14px", cursor: "pointer" }}
        >
          <FiArrowLeft style={{ marginRight: "6px" }} /> Back to Search Results
        </button>
        <h1 style={{ marginTop: "12px", fontSize: "28px" }}>Intelligence Profile: {activeProfile.name}</h1>
      </div>

      <div className="frs-profile-workspace" style={{ padding: "0" }}>
        <div className="frs-details-panel">
          
          {/* Suspect Photograph and Primary Demographics */}
          <div className="frs-details-header-card">
            <div className="frs-details-photo">
              <img src={activeProfile.photo} alt={activeProfile.name} />
              {activeProfile.watchlistStatus === "HIGH RISK" && (
                <div className="photo-danger-indicator">HIGH RISK</div>
              )}
            </div>
            
            <div className="frs-details-primary">
              <div className="frs-details-id-row">
                <span className="details-face-id">{activeProfile.id}</span>
                <span className="details-confidence">
                  Match: {activeProfile.confidenceScore}
                </span>
              </div>
              
              <h2 className="details-name">{activeProfile.name}</h2>
              
              <div className="details-demographics">
                <span><strong>Age:</strong> {activeProfile.age} Yrs</span>
                <span className="details-separator">&bull;</span>
                <span><strong>Gender:</strong> {activeProfile.gender}</span>
              </div>

              <div className="details-badges-row">
                {activeProfile.watchlistStatus !== "None" && (
                  <span className={`details-status-badge ${activeProfile.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                    <FiAlertOctagon /> {activeProfile.watchlistStatus}
                  </span>
                )}
                {activeProfile.watchlistStatus === "MISSING PERSON" && (
                  <span className="details-status-badge status-missing-banner">
                    Missing Person Sighting Active
                  </span>
                )}
                {activeProfile.watchlistStatus === "HIGH RISK" && (
                  <span className="details-status-badge status-high-risk-banner">
                    High Priority Capture
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Alert Banners */}
          {activeProfile.watchlistStatus === "HIGH RISK" && (
            <div className="frs-alert-banner warning">
              <FiAlertOctagon />
              <span><strong>CRITICAL ALERT:</strong> Subject is flagged as HIGH RISK. Field agents must exercise caution and coordinate with local dispatch before approaching.</span>
            </div>
          )}
          {activeProfile.watchlistStatus === "MISSING PERSON" && (
            <div className="frs-alert-banner info">
              <FiInfo />
              <span><strong>MISSING PERSON ALERT:</strong> Subject matches missing person bulletin. If located, secure welfare check and report immediately to case officer.</span>
            </div>
          )}

          {/* Suspect Investigation Details Grid */}
          <div className="frs-details-section">
            <h3>Investigation Profile Details</h3>
            <div className="frs-details-grid">
              <div className="frs-details-cell">
                <span className="cell-label">Case Number</span>
                <span className="cell-value highlighted">{activeProfile.caseNumber}</span>
              </div>
              <div className="frs-details-cell">
                <span className="cell-label">Last Seen Date & Time</span>
                <span className="cell-value">
                  {activeProfile.timeline[0]?.date} &bull; {activeProfile.timeline[0]?.time}
                </span>
              </div>
              <div className="frs-details-cell">
                <span className="cell-label">Last Seen Camera</span>
                <span className="cell-value">{activeProfile.timeline[0]?.camera || "N/A"}</span>
              </div>
              <div className="frs-details-cell">
                <span className="cell-label">Last Seen Location</span>
                <span className="cell-value">{activeProfile.address}</span>
              </div>
              <div className="frs-details-cell">
                <span className="cell-label">Known Vehicles</span>
                <span className="cell-value">{activeProfile.vehicles.join(", ") || "None Registered"}</span>
              </div>
              <div className="frs-details-cell">
                <span className="cell-label">Previous Violations</span>
                <span className="cell-value">{activeProfile.timeline.length} Incidents Sighted</span>
              </div>
              <div className="frs-details-cell full-width">
                <span className="cell-label">Investigation Notes</span>
                <p className="cell-value notes-text">{activeProfile.notes}</p>
              </div>
            </div>
          </div>

          {/* Detection Map */}
          <div className="frs-details-section">
            <h3>Detection Map &bull; Sighted Cameras</h3>
            <div className="frs-map-container">
              <MapContainer
                center={mapCenter}
                zoom={13}
                scrollWheelZoom={false}
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
                      Time: {loc.time}<br />
                      Officer: {loc.officer}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Recent Sighting Timeline (Newest to Oldest) */}
          <div className="frs-details-section" ref={timelineRef}>
            <h3>Recent Sighting Timeline</h3>
            <div className="frs-details-timeline">
              {activeProfile.timeline.map((violation) => (
                <div
                  key={violation.id}
                  className={`frs-timeline-card ${violation.status.toLowerCase() === "in progress" ? "critical" : ""}`}
                >
                  <div className="timeline-card-dot"></div>
                  <div className="timeline-card-header">
                    <span className="timeline-card-title">{violation.violationType}</span>
                    <span className="timeline-card-time">
                      <FiClock /> {violation.date} &bull; {violation.time}
                    </span>
                  </div>
                  <div className="timeline-card-grid">
                    <div className="timeline-card-cell">
                      <span className="timeline-card-label">Camera</span>
                      <span className="timeline-card-val">{violation.camera}</span>
                    </div>
                    <div className="timeline-card-cell">
                      <span className="timeline-card-label">Location</span>
                      <span className="timeline-card-val">{violation.location}</span>
                    </div>
                    <div className="timeline-card-cell">
                      <span className="timeline-card-label">Case Status</span>
                      <span
                        className="timeline-card-val"
                        style={{
                          color: violation.status === "Resolved" ? "var(--low)" :
                            violation.status === "Pending" ? "var(--high)" : "var(--critical)",
                          fontWeight: "bold"
                        }}
                      >
                        {violation.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Gallery */}
          <div className="frs-details-section" ref={evidenceRef}>
            <h3>Evidence Gallery</h3>
            <div className="frs-evidence-grid">
              {activeProfile.evidence.map((ev, idx) => (
                <div key={ev.id} className="evidence-card">

                  {/* ── CCTV Thumbnail Frame ── */}
                  <div
                    className="ev-thumb-frame"
                    style={{ backgroundImage: `url(${ev.image})` }}
                  >
                    {/* Darkening vignette + scanlines */}
                    <div className="ev-thumb-scanlines" />

                    {/* Bounding box with corner brackets */}
                    <div className="ev-thumb-bbox">
                      <span className="ev-thumb-bbox-corner tl" />
                      <span className="ev-thumb-bbox-corner tr" />
                      <span className="ev-thumb-bbox-corner bl" />
                      <span className="ev-thumb-bbox-corner br" />
                    </div>

                    {/* HUD top bar */}
                    <div className="ev-thumb-hud-top">
                      <span className="ev-thumb-hud-cam">
                        <span className="ev-thumb-rec" />
                        {activeProfile.timeline[idx]?.camera || activeProfile.timeline[0]?.camera || "C-Net"}
                      </span>
                      <span className="ev-thumb-hud-type">{ev.type}</span>
                    </div>

                    {/* HUD bottom bar */}
                    <div className="ev-thumb-hud-bot">
                      <span className="ev-thumb-hud-ts">
                        {activeProfile.timeline[0]?.date} {activeProfile.timeline[0]?.time}
                      </span>
                      <span className="ev-thumb-hud-conf">{activeProfile.confidenceScore}</span>
                    </div>
                  </div>

                  <div className="evidence-details-box">
                    <div className="evidence-meta">
                      <div className="evidence-location">{activeProfile.lastSeen}</div>
                      <div className="evidence-time-row">
                        <span>{activeProfile.timeline[0]?.date} &bull; {activeProfile.timeline[0]?.time}</span>
                      </div>
                      <div className="evidence-row-data">
                        <span className="evidence-lbl">AI Confidence</span>
                        <span className="evidence-val">{activeProfile.confidenceScore}</span>
                      </div>
                      <div className="evidence-row-data">
                        <span className="evidence-lbl">Anomaly</span>
                        <span className="evidence-val">
                          {activeProfile.watchlistStatus !== "None" ? activeProfile.watchlistStatus : "Face Identification"}
                        </span>
                      </div>
                      <div className="evidence-row-data">
                        <span className="evidence-lbl">Severity</span>
                        <span 
                          className={`priority-tag ${
                            activeProfile.watchlistStatus === "WANTED" || activeProfile.watchlistStatus === "HIGH RISK" ? "critical" : 
                            activeProfile.watchlistStatus === "MISSING PERSON" ? "high" : "low"
                          }`} 
                          style={{ fontSize: "11px", padding: "2px 6px", borderRadius: "4px" }}
                        >
                          {activeProfile.watchlistStatus === "WANTED" || activeProfile.watchlistStatus === "HIGH RISK" ? "CRITICAL" : 
                           activeProfile.watchlistStatus === "MISSING PERSON" ? "HIGH" : "LOW"}
                        </span>
                      </div>
                    </div>
                    <button type="button" className="evidence-btn-view" onClick={() => setSelectedEvidence(ev)}>
                      View Evidence
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="frs-details-actions">
            <button 
              type="button" 
              className="frs-action-btn-outline"
              onClick={() => setShowProfileDossier(true)}
            >
              <FiEye /> View Complete Profile
            </button>
            <button 
              type="button" 
              className="frs-action-btn-outline"
              onClick={() => timelineRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <FiClock /> View Detection History
            </button>
            <button 
              type="button" 
              className="frs-action-btn-outline"
              onClick={() => evidenceRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              <FiCamera /> View Evidence
            </button>
            <button 
              type="button" 
              className="frs-action-btn-outline"
              onClick={handleExportReport}
            >
              <FiDownload /> Export Report
            </button>
            <button 
              type="button" 
              className="frs-action-btn-primary"
              onClick={() => setShowAssignModal(true)}
            >
              <FiShield /> Assign Investigation
            </button>
          </div>
        </div>
      </div>

      {/* Evidence Full View Modal — Tabbed */}
      {selectedEvidence && (
        <div className="frs-modal-overlay" onClick={() => { setSelectedEvidence(null); setEvidenceTab("detection"); }}>
          <div className="frs-modal-content evidence-modal" onClick={e => e.stopPropagation()}>

            {/* ── Modal Header ── */}
            <div className="frs-modal-header">
              <div className="ev-modal-header-info">
                <span className="micro-label micro-label--accent">Evidence File</span>
                <h3 style={{ margin: "4px 0 0", fontSize: "17px", fontWeight: 800, letterSpacing: "-0.01em" }}>
                  {selectedEvidence.title}
                </h3>
              </div>
              <button className="frs-modal-close" onClick={() => { setSelectedEvidence(null); setEvidenceTab("detection"); }}>
                <FiX />
              </button>
            </div>

            {/* ── Tab Bar ── */}
            <div className="ev-tab-bar">
              {[
                { key: "detection", label: "Detection" },
                { key: "ocr",       label: "OCR / Meta" },
                { key: "location",  label: "Location" },
                { key: "audit",     label: "Audit Trail" },
              ].map(tab => (
                <button
                  key={tab.key}
                  className={`ev-tab-btn${evidenceTab === tab.key ? " active" : ""}`}
                  onClick={() => setEvidenceTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── Tab Panels ── */}
            <div className="frs-modal-body ev-tab-body">

              {/* DETECTION */}
              {evidenceTab === "detection" && (
                <div className="ev-tab-panel">
                  <div className="ev-detection-grid">
                    {/* Image */}
                    <div className="ev-img-frame">
                      <img
                        src={selectedEvidence.image}
                        alt="Evidence frame"
                        className="ev-evidence-img"
                      />
                      <div className="ev-img-badge">
                        <span className="ev-rec-dot" />
                        {selectedEvidence.type}
                      </div>
                    </div>
                    {/* Detection info rows */}
                    <div className="ev-detection-meta">
                      <div className="ev-field">
                        <span className="ev-field-label">Evidence ID</span>
                        <span className="ev-field-val highlighted">{selectedEvidence.id}</span>
                      </div>
                      <div className="ev-field">
                        <span className="ev-field-label">Detection Type</span>
                        <span className="ev-field-val">{selectedEvidence.type}</span>
                      </div>
                      <div className="ev-field">
                        <span className="ev-field-label">AI Confidence</span>
                        <span className="ev-field-val highlighted">{activeProfile.confidenceScore}</span>
                      </div>
                      <div className="ev-field">
                        <span className="ev-field-label">Classification</span>
                        <span className="ev-field-val">
                          {activeProfile.watchlistStatus !== "None" ? activeProfile.watchlistStatus : "Face Identification"}
                        </span>
                      </div>
                      <div className="ev-field">
                        <span className="ev-field-label">Watchlist Status</span>
                        <span className={`ev-field-val status-chip ${
                          activeProfile.watchlistStatus === "WANTED" || activeProfile.watchlistStatus === "HIGH RISK" ? "critical" :
                          activeProfile.watchlistStatus === "MISSING PERSON" ? "high" : "low"
                        }`}>
                          {activeProfile.watchlistStatus}
                        </span>
                      </div>
                      <div className="ev-field">
                        <span className="ev-field-label">Case Number</span>
                        <span className="ev-field-val highlighted">{activeProfile.caseNumber}</span>
                      </div>
                    </div>
                  </div>
                  {/* Action row */}
                  <div className="ev-action-row">
                    <button className="ev-action-btn primary">⬇ Download Frame</button>
                    <button className="ev-action-btn">📋 Copy Evidence ID</button>
                    <button className="ev-action-btn danger">🚨 Flag for Review</button>
                  </div>
                </div>
              )}

              {/* OCR / METADATA */}
              {evidenceTab === "ocr" && (
                <div className="ev-tab-panel">
                  <div className="ev-section-label">Optical Character Recognition</div>
                  <div className="ev-meta-block">
                    <div className="ev-field">
                      <span className="ev-field-label">Camera ID</span>
                      <span className="ev-field-val highlighted">{activeProfile.timeline[0]?.camera || "C-Net"}</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Timestamp</span>
                      <span className="ev-field-val">
                        {activeProfile.timeline[0]?.date} &bull; {activeProfile.timeline[0]?.time}
                      </span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Linked Vehicle</span>
                      <span className="ev-field-val highlighted">
                        {activeProfile.vehicles.join(", ") || "None Registered"}
                      </span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">OCR Plate Read</span>
                      <span className="ev-field-val">{activeProfile.vehicles[0] || "—"}</span>
                    </div>
                  </div>
                  <div className="ev-section-label" style={{ marginTop: "20px" }}>File Metadata</div>
                  <div className="ev-meta-block">
                    <div className="ev-field">
                      <span className="ev-field-label">Evidence Type</span>
                      <span className="ev-field-val">{selectedEvidence.type}</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Resolution</span>
                      <span className="ev-field-val">1920 × 1080 px</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Frame Size</span>
                      <span className="ev-field-val">2.4 MB</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Encoding</span>
                      <span className="ev-field-val">H.264 / MJPEG</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Integrity Hash</span>
                      <span className="ev-field-val ev-mono">SHA-256: a3f9…d14c</span>
                    </div>
                  </div>
                </div>
              )}

              {/* LOCATION */}
              {evidenceTab === "location" && (
                <div className="ev-tab-panel">
                  <div className="ev-section-label">Last Known Position</div>
                  <div className="ev-meta-block">
                    <div className="ev-field">
                      <span className="ev-field-label">Location</span>
                      <span className="ev-field-val">{activeProfile.lastSeen}</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Zone</span>
                      <span className="ev-field-val">{activeProfile.timeline[0]?.location || "—"}</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">GPS Coordinates</span>
                      <span className="ev-field-val ev-mono">
                        {activeProfile.timeline[0]?.coords
                          ? `${activeProfile.timeline[0].coords[0].toFixed(4)}, ${activeProfile.timeline[0].coords[1].toFixed(4)}`
                          : "—"}
                      </span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Detection Camera</span>
                      <span className="ev-field-val highlighted">{activeProfile.timeline[0]?.camera || "—"}</span>
                    </div>
                  </div>
                  <div className="ev-section-label" style={{ marginTop: "20px" }}>Sighting History ({activeProfile.timeline.length} events)</div>
                  <div className="ev-location-timeline">
                    {activeProfile.timeline.map((tl, idx) => (
                      <div key={tl.id} className="ev-location-item">
                        <div className="ev-location-dot" />
                        <div className="ev-location-info">
                          <span className="ev-location-title">{tl.location} &mdash; {tl.camera}</span>
                          <span className="ev-location-sub">{tl.date} &bull; {tl.time} &bull; {tl.violationType}</span>
                        </div>
                        <span className={`status-chip ${
                          tl.status === "Resolved" ? "resolved" :
                          tl.status === "In Progress" ? "in-progress" : "pending"
                        }`}>{tl.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIT TRAIL */}
              {evidenceTab === "audit" && (
                <div className="ev-tab-panel">
                  <div className="ev-section-label">Chain of Custody</div>
                  <div className="ev-audit-list">
                    {[
                      { time: "2026-07-07 18:22", actor: "System (Auto)",           action: "Evidence packet created & hashed" },
                      { time: "2026-07-07 18:24", actor: "Operator Kumar",           action: "Evidence record accessed" },
                      { time: "2026-07-07 18:25", actor: `${activeProfile.timeline[0]?.officer || "SI A. Kavitha"}`, action: "Case file reviewed" },
                      { time: "2026-07-07 17:05", actor: "System (AI Engine)",       action: "Confidence score computed: " + activeProfile.confidenceScore },
                      { time: "2026-07-07 10:15", actor: "Camera " + (activeProfile.timeline[0]?.camera || "C-Net"), action: "Frame captured at " + (activeProfile.timeline[0]?.location || activeProfile.lastSeen) },
                    ].map((entry, i) => (
                      <div key={i} className="ev-audit-entry">
                        <span className="ev-audit-time">{entry.time}</span>
                        <div className="ev-audit-body">
                          <span className="ev-audit-actor">{entry.actor}</span>
                          <span className="ev-audit-action">{entry.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="ev-section-label" style={{ marginTop: "20px" }}>Integrity Verification</div>
                  <div className="ev-meta-block">
                    <div className="ev-field">
                      <span className="ev-field-label">Hash Status</span>
                      <span className="ev-field-val" style={{ color: "var(--low)" }}>✓ Verified — No tampering detected</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Last Verified</span>
                      <span className="ev-field-val">2026-07-07 18:22 IST</span>
                    </div>
                    <div className="ev-field">
                      <span className="ev-field-label">Custodian</span>
                      <span className="ev-field-val">TGICCC Central Evidence Store</span>
                    </div>
                  </div>
                </div>
              )}

            </div>{/* /ev-tab-body */}
          </div>
        </div>
      )}

      {/* Assign Investigation Modal */}
      {showAssignModal && (
        <div className="frs-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="frs-modal-content assign-modal" onClick={e => e.stopPropagation()}>
            <div className="frs-modal-header">
              <h3>Assign Investigation</h3>
              <button className="frs-modal-close" onClick={() => setShowAssignModal(false)}>
                <FiX />
              </button>
            </div>
            <div className="frs-modal-body">
              <form onSubmit={handleAssignSubmit} className="assign-form">
                <div className="form-group">
                  <label>Assign To Officer/Unit</label>
                  <select value={assignOfficer} onChange={e => setAssignOfficer(e.target.value)} required>
                    <option value="Insp. S. Mahesh">Insp. S. Mahesh (Anti-Terror Squad)</option>
                    <option value="Insp. K. Reddy">Insp. K. Reddy (Cyberabad CID)</option>
                    <option value="Task Force Team Alpha">Task Force Team Alpha</option>
                    <option value="Task Force Team Bravo">Task Force Team Bravo</option>
                    <option value="Local Station (Banjara Hills)">Local Station (Banjara Hills)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority Level</label>
                  <select value={assignPriority} onChange={e => setAssignPriority(e.target.value)} required>
                    <option value="Critical">Critical (Immediate Dispatch)</option>
                    <option value="High Priority">High Priority (Within 1 Hour)</option>
                    <option value="Standard">Standard</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Additional Notes / Instructions</label>
                  <textarea 
                    value={assignNotes} 
                    onChange={e => setAssignNotes(e.target.value)}
                    placeholder="E.g., Suspect is flagged as high risk. Coordinate with local patrols before engaging."
                    rows="4"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" className="frs-btn-outline" onClick={() => setShowAssignModal(false)}>Cancel</button>
                  <button type="submit" className="frs-btn-search">Confirm Assignment</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Complete Profile Dossier Modal */}
      {showProfileDossier && (
        <div className="frs-modal-overlay" onClick={() => setShowProfileDossier(false)}>
          <div className="frs-modal-content dossier-modal" onClick={e => e.stopPropagation()}>
            <div className="frs-modal-header">
              <h3>Complete Intelligence Dossier</h3>
              <button className="frs-modal-close" onClick={() => setShowProfileDossier(false)}>
                <FiX />
              </button>
            </div>
            <div className="frs-modal-body dossier-body">
              <div className="dossier-left">
                <img src={activeProfile.photo} alt={activeProfile.name} className="dossier-photo" />
                <h2 className="dossier-name">{activeProfile.name}</h2>
                <div className="dossier-id">ID: {activeProfile.id}</div>
                {activeProfile.watchlistStatus !== "None" && (
                  <div className={`dossier-badge ${activeProfile.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                    {activeProfile.watchlistStatus}
                  </div>
                )}
              </div>
              <div className="dossier-right">
                <div className="dossier-section">
                  <h4>Personal Information</h4>
                  <p><strong>Age:</strong> {activeProfile.age}</p>
                  <p><strong>Gender:</strong> {activeProfile.gender}</p>
                  <p><strong>Known Aliases:</strong> {activeProfile.name} "Anna"</p>
                  <p><strong>Primary Address:</strong> 14-2, Old City, Hyderabad</p>
                </div>
                <div className="dossier-section">
                  <h4>Criminal Record & Links</h4>
                  <p><strong>Total Cases Linked:</strong> {activeProfile.timeline.length + 2}</p>
                  <p><strong>Primary Case No:</strong> {activeProfile.caseNumber}</p>
                  <p><strong>Associated Vehicles:</strong> {activeProfile.vehicles.join(", ") || "None"}</p>
                </div>
                <div className="dossier-section">
                  <h4>Physical Characteristics</h4>
                  <p><strong>Height:</strong> 175cm</p>
                  <p><strong>Build:</strong> Medium</p>
                  <p><strong>Distinguishing Marks:</strong> Scar on left eyebrow</p>
                </div>
              </div>
            </div>
            <div className="dossier-footer">
              <button className="frs-btn-outline" onClick={() => setShowProfileDossier(false)}>Close Dossier</button>
              <button className="frs-btn-primary" onClick={handleExportReport}><FiDownload /> Print Dossier</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FaceRecognitionProfile;
