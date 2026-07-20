import { useEffect, useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  FiSearch,
  FiUpload,
  FiMapPin,
  FiClock,
  FiInfo,
  FiAlertOctagon,
  FiX,
  FiChevronRight,
  FiEye,
  FiDownload,
  FiCamera,
  FiShield
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

function FaceRecognition() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredMatches, setFilteredMatches] = useState(frsData);
  const [activeProfile, setActiveProfile] = useState(frsData[0]);
  const [mapCenter, setMapCenter] = useState([17.4035, 78.4705]);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  
  // Quick Action States
  const [showProfileDossier, setShowProfileDossier] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignOfficer, setAssignOfficer] = useState("Insp. S. Mahesh");
  const [assignPriority, setAssignPriority] = useState("High Priority");
  const [assignNotes, setAssignNotes] = useState("");

  // Refs for smooth scroll
  const listContainerRef = useRef(null);
  const timelineRef = useRef(null);
  const evidenceRef = useRef(null);

  // Filter records based on category and query
  useEffect(() => {
    let result = frsData;

    if (activeCategory === "Missing Persons") {
      result = result.filter(item => item.watchlistStatus === "MISSING PERSON");
    } else if (activeCategory === "High Risk") {
      result = result.filter(item => item.watchlistStatus === "HIGH RISK");
    } else if (activeCategory === "Watchlist Matches") {
      result = result.filter(item => item.watchlistStatus === "WANTED");
    }

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
    setVisibleCount(25); // Reset visible count on filter/search change

    if (result.length > 0) {
      const containsActive = activeProfile && result.some(item => item.id === activeProfile.id);
      if (!containsActive) {
        setActiveProfile(result[0]);
      }
    } else {
      setActiveProfile(null);
    }
  }, [searchQuery, activeCategory]);

  // Center map on the latest detection of selected profile
  useEffect(() => {
    if (activeProfile && activeProfile.timeline && activeProfile.timeline.length > 0) {
      // Timeline is sorted from newest to oldest, so index 0 is the latest detection
      setMapCenter(activeProfile.timeline[0].coords);
    }
  }, [activeProfile]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredMatches.length > 0) {
      setActiveProfile(filteredMatches[0]);
    }
  };

  const handleUploadClick = () => {
    setUploadProcessing(true);
    setTimeout(() => {
      const match = frsData.find(item => item.id === "FACE-1003");
      if (match) {
        setActiveProfile(match);
        setSearchQuery("FACE-1003");
        setActiveCategory("All");
      }
      setUploadProcessing(false);
    }, 1500);
  };

  // Scroll handler for infinite scroll
  const handleListScroll = (e) => {
    const target = e.target;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 80) {
      if (visibleCount < filteredMatches.length) {
        setVisibleCount(prev => prev + 25);
      }
    }
  };

  return (
    <div className="frs-container">
      <Toaster position="top-right" />
      <div className="frs-meta-header">
        <span className="category-title">Face Recognition System (FRS)</span>
        <h1>Unified Police Intelligence Search</h1>
      </div>

      {/* Search and Upload Bar */}
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
        
        {/* Left Search Results Panel */}
        <div className="frs-matches-sidebar">
          <div className="frs-results-panel">
            
            {/* Header info */}
            <div className="frs-results-header">
              <div>
                <h3>Search Results</h3>
                <div className="frs-results-info-meta">
                  <span className="results-count-badge">
                    {filteredMatches.length} Results Found
                  </span>
                  {filteredMatches.length > 0 && (
                    <span className="results-showing-text">
                      Showing 1–{Math.min(visibleCount, filteredMatches.length)} of {filteredMatches.length}
                    </span>
                  )}
                </div>
                
                {/* Active query / filter tag displays */}
                {(searchQuery.trim() !== "" || activeCategory !== "All") && (
                  <div className="frs-active-filters-summary">
                    {searchQuery.trim() !== "" && (
                      <span className="filter-summary-tag">
                        Query: <strong>"{searchQuery}"</strong>
                      </span>
                    )}
                    {activeCategory !== "All" && (
                      <span className="filter-summary-tag">
                        Category: <strong>{activeCategory}</strong>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter Chips */}
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

            {/* Compact Vertical List of Results */}
            <div 
              className="frs-compact-list-scroll"
              ref={listContainerRef}
              onScroll={handleListScroll}
            >
              {filteredMatches.length > 0 ? (
                <>
                  {filteredMatches.slice(0, visibleCount).map((item) => (
                    <div
                      key={item.id}
                      className={`frs-compact-row ${activeProfile?.id === item.id ? "active" : ""}`}
                      onClick={() => setActiveProfile(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setActiveProfile(item);
                        }
                      }}
                    >
                      <div className="frs-compact-avatar">
                        <img src={item.photo} alt={item.name} />
                      </div>
                      
                      <div className="frs-compact-details">
                        <div className="frs-compact-name-row">
                          <span className="frs-compact-name">{item.name}</span>
                          <span className="frs-compact-confidence">{item.confidenceScore}</span>
                        </div>
                        
                        <div className="frs-compact-id-row">
                          <span className="frs-compact-id">{item.id}</span>
                          {item.watchlistStatus !== "None" && (
                            <span className={`frs-compact-badge ${item.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                              {item.watchlistStatus}
                            </span>
                          )}
                        </div>
                        
                        <div className="frs-compact-location-row">
                          <FiMapPin />
                          <span className="frs-compact-location">{item.lastSeen}</span>
                        </div>
                      </div>

                      <div className="frs-compact-arrow-icon">
                        <FiChevronRight />
                      </div>
                    </div>
                  ))}
                  
                  {visibleCount < filteredMatches.length && (
                    <div className="frs-load-more-container">
                      <button
                        type="button"
                        className="frs-btn-load-more"
                        onClick={() => setVisibleCount(prev => prev + 25)}
                      >
                        Load More Results
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="frs-no-results">
                  <FiInfo className="frs-no-results-icon" />
                  <h4>No Matches Found</h4>
                  <p>Try searching with another query or clear filters.</p>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Selected Person Panel (Master-Detail) */}
        <div className="frs-profile-workspace">
          {activeProfile ? (
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
                    <span className="cell-value">{activeProfile.lastSeen}</span>
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
                  {activeProfile.evidence.map((ev) => (
                    <div key={ev.id} className="evidence-card">
                      <div className="evidence-preview-box">
                        <img src={ev.image} alt={ev.title} />
                        <span className="evidence-badge">{activeProfile.timeline[0]?.camera || "C-Net"}</span>
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
          ) : (
            <div className="frs-no-results-large">
              <FiInfo className="frs-no-results-icon" style={{ fontSize: "48px" }} />
              <h4>No Profile Selected</h4>
              <p>Please select a suspect match from the search results panel to display full case investigation detail.</p>
            </div>
          )}
        </div>

      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <div
          className="ev-modal-overlay"
          onClick={() => setSelectedEvidence(null)}
        >
          <div
            className="ev-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="ev-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>Evidence File — {selectedEvidence.title}</h2>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                  Case ID: {activeProfile.caseNumber} &nbsp;|&nbsp; Sighted: {activeProfile.timeline[0]?.date} {activeProfile.timeline[0]?.time}
                </p>
              </div>
              <button className="ev-modal-close" onClick={() => setSelectedEvidence(null)}>✕</button>
            </div>

            {/* Two-Column Body */}
            <div className="ev-modal-body">

              {/* Left: Simulated CCTV Frame */}
              <div className="ev-modal-frame-col">
                <div className="ev-mock-feed" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#0b1528" }}>
                  <img 
                    src={selectedEvidence.image} 
                    alt={selectedEvidence.title} 
                    style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} 
                  />

                  {/* Bounding box with corner brackets */}
                  <div className="ev-bbox">
                    <span className="ev-bbox-label">FACE ID: {activeProfile.id} &nbsp; {activeProfile.confidenceScore}</span>
                    <div className="ev-bbox-corner tl" />
                    <div className="ev-bbox-corner tr" />
                    <div className="ev-bbox-corner bl" />
                    <div className="ev-bbox-corner br" />
                  </div>

                  {/* HUD overlays */}
                  <div className="ev-hud-tl">CAM: {activeProfile.timeline[0]?.camera || "C01"} &nbsp;|&nbsp; FRS-NET</div>
                  <div className="ev-hud-tr ev-hud-rec"><span className="ev-rec-dot" />REC</div>
                  <div className="ev-hud-bl">{activeProfile.timeline[0]?.date} {activeProfile.timeline[0]?.time}</div>
                  <div className="ev-hud-br">{activeProfile.lastSeen.toUpperCase()}</div>
                </div>
                {/* Action bar */}
                <div className="ev-modal-actions">
                  <button type="button" className="ev-action-btn primary" onClick={() => setSelectedEvidence(null)}>⬇ Download Frame</button>
                  <button type="button" className="ev-action-btn" onClick={() => setSelectedEvidence(null)}>📋 Copy Case ID</button>
                  <button type="button" className="ev-action-btn danger" onClick={() => setSelectedEvidence(null)}>🚨 Flag for Review</button>
                </div>
              </div>

              {/* Right: Metadata Panels */}
              <div className="ev-modal-meta-col">

                {/* AI Detection */}
                <div className="ev-meta-card">
                  <div className="ev-meta-card-title">🤖 AI Biometric Detection</div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Target Name</span><span className="ev-meta-val">{activeProfile.name}</span></div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Face ID Reference</span><span className="ev-meta-val">{activeProfile.id}</span></div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Match Confidence</span><span className="ev-meta-val highlight">{activeProfile.confidenceScore}</span></div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Watchlist Status</span><span className="ev-meta-val highlight">{activeProfile.watchlistStatus}</span></div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Camera Node</span><span className="ev-meta-val">{activeProfile.timeline[0]?.camera || "C-Net"}</span></div>
                </div>

                {/* Case / Profile Metadata */}
                <div className="ev-meta-card">
                  <div className="ev-meta-card-title">👤 Suspect Demographic Intel</div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Age / Gender</span><span className="ev-meta-val">{activeProfile.age} Yrs / {activeProfile.gender}</span></div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Registered Address</span><span className="ev-meta-val">{activeProfile.address}</span></div>
                  <div className="ev-meta-row"><span className="ev-meta-lbl">Known Vehicles</span><span className="ev-meta-val">{activeProfile.vehicles.join(", ")}</span></div>
                </div>

                {/* Audit Chain */}
                <div className="ev-meta-card">
                  <div className="ev-meta-card-title">🔗 Audit Chain</div>
                  <div className="ev-audit-entry"><span className="ev-audit-time">Now</span><span>Viewed by Operator #4291</span></div>
                  <div className="ev-audit-entry"><span className="ev-audit-time">Sighted</span><span>Auto-captured by FRS Engine</span></div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Dossier Modal */}
      {showProfileDossier && (
        <div className="ev-modal-overlay" onClick={() => setShowProfileDossier(false)}>
          <div className="ev-modal-card dossier-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "800px" }}>
            <div className="ev-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>National Police Intelligence Dossier</h2>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                  Face ID: {activeProfile.id} &bull; Security Level: Restricted (Class-II)
                </p>
              </div>
              <button className="ev-modal-close" onClick={() => setShowProfileDossier(false)}>✕</button>
            </div>
            
            <div className="ev-modal-body" style={{ gridTemplateColumns: "200px 1fr", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                <div style={{ width: "160px", height: "180px", borderRadius: "12px", overflow: "hidden", border: "2px solid #e2e8f0" }}>
                  <img src={activeProfile.photo} alt={activeProfile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div className={`details-status-badge ${activeProfile.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`} style={{ textAlign: "center", width: "100%" }}>
                  {activeProfile.watchlistStatus}
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", textTransform: "uppercase" }}>Suspect Identity Record</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
                    <div><span style={{ fontSize: "11px", color: "#64748b" }}>Full Legal Name:</span> <div style={{ fontSize: "13px", fontWeight: "700" }}>{activeProfile.name}</div></div>
                    <div><span style={{ fontSize: "11px", color: "#64748b" }}>Case Reference:</span> <div style={{ fontSize: "13px", fontWeight: "700" }}>{activeProfile.caseNumber}</div></div>
                    <div><span style={{ fontSize: "11px", color: "#64748b" }}>Aliases:</span> <div style={{ fontSize: "13px", fontWeight: "600" }}>{activeProfile.aliases || "None"}</div></div>
                    <div><span style={{ fontSize: "11px", color: "#64748b" }}>Gender/Age:</span> <div style={{ fontSize: "13px", fontWeight: "600" }}>{activeProfile.gender} / {activeProfile.age} Yrs</div></div>
                    <div><span style={{ fontSize: "11px", color: "#64748b" }}>Address:</span> <div style={{ fontSize: "13px", fontWeight: "600" }}>{activeProfile.address}</div></div>
                    <div><span style={{ fontSize: "11px", color: "#64748b" }}>Vehicle Registration:</span> <div style={{ fontSize: "13px", fontWeight: "600" }}>{activeProfile.vehicles.join(", ") || "None"}</div></div>
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", textTransform: "uppercase" }}>Biometric Analysis</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                    <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Facial Symmetry Index</span>
                      <strong style={{ fontSize: "12px" }}>98.4% Match</strong>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Iris Code Reference</span>
                      <strong style={{ fontSize: "12px" }}>IRIS-IN-{activeProfile.id.split("-")[1]}</strong>
                    </div>
                    <div style={{ background: "#f8fafc", padding: "8px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                      <span style={{ fontSize: "10px", color: "#64748b", display: "block" }}>Confidence Score</span>
                      <strong style={{ fontSize: "12px", color: "var(--primary)" }}>{activeProfile.confidenceScore}</strong>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "var(--primary)", borderBottom: "1px solid #e2e8f0", paddingBottom: "4px", textTransform: "uppercase" }}>Intelligence Notes</h3>
                  <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.6", color: "#475569" }}>
                    {activeProfile.notes}
                  </p>
                </div>
              </div>
            </div>
            <div className="ev-modal-actions" style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button className="ev-action-btn" onClick={() => setShowProfileDossier(false)}>Close Dossier</button>
              <button className="ev-action-btn primary" onClick={() => { setShowProfileDossier(false); handleExportReport(); }}>Export Signed Copy</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Investigation Modal */}
      {showAssignModal && (
        <div className="ev-modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="ev-modal-card assignment-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "500px" }}>
            <div className="ev-modal-header">
              <div>
                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>Assign Case Investigation</h2>
                <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                  Assigning suspect {activeProfile.name} ({activeProfile.id})
                </p>
              </div>
              <button className="ev-modal-close" onClick={() => setShowAssignModal(false)}>✕</button>
            </div>
            
            <form onSubmit={handleAssignSubmit}>
              <div className="ev-modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "24px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>Assign to Intelligence Officer</label>
                  <select 
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px" }}
                    value={assignOfficer}
                    onChange={(e) => setAssignOfficer(e.target.value)}
                  >
                    <option value="Insp. S. Mahesh">Insp. S. Mahesh (West Zone Control)</option>
                    <option value="SI A. Kavitha">SI A. Kavitha (Traffic Division)</option>
                    <option value="PC L. Suresh">PC L. Suresh (Patrol Unit 12)</option>
                    <option value="Insp. K. Rao">Insp. K. Rao (Special Operations Group)</option>
                    <option value="Insp. G. Reddy">Insp. G. Reddy (Cyber Crime Cell)</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>Incident Priority Level</label>
                  <select 
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px" }}
                    value={assignPriority}
                    onChange={(e) => setAssignPriority(e.target.value)}
                  >
                    <option value="Routine Sighting">Routine Tracking</option>
                    <option value="High Priority">High Priority Sighting</option>
                    <option value="Urgent - Active Capture">Urgent - Dispatch & Active Capture</option>
                  </select>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", fontWeight: "700", color: "var(--text-secondary)" }}>Operator Instruction Notes</label>
                  <textarea 
                    rows={4}
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontSize: "13px", resize: "none" }}
                    placeholder="Enter dispatch directives, sighting verification guidelines, or coordination notes..."
                    value={assignNotes}
                    onChange={(e) => setAssignNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="ev-modal-actions" style={{ padding: "16px 24px", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="ev-action-btn" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="ev-action-btn primary">Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default FaceRecognition;
