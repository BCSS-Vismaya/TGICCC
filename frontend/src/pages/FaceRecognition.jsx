import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import frsData from "../data/frsData";



const formatSightingRecency = (item) => {
  if (!item.timeline || item.timeline.length === 0) return "—";
  const lastEvent = item.timeline[0];
  const isWithin24 = item.lastSeenTime.includes("h ago");
  
  if (isWithin24) {
    return lastEvent.time;
  } else {
    const dt = new Date(lastEvent.date);
    return dt.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }
};

function FaceRecognition() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || "");
  const [activeCategory, setActiveCategory] = useState(location.state?.activeCategory || "All");
  const [filteredMatches, setFilteredMatches] = useState(frsData);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(25);

  const listContainerRef = useRef(null);

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
  }, [searchQuery, activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleUploadClick = () => {
    setUploadProcessing(true);
    setTimeout(() => {
      const match = frsData.find(item => item.id === "FACE-1003");
      if (match) {
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

      {/* Main Workspace Layout - Full Width Table */}
      <div className="frs-workspace-full">
        <div className="frs-results-panel">
          
          {/* Header info */}
          <div className="frs-results-header">
            <div>
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

          {/* Full-width Enterprise Table */}
          <div 
            className="status-table-container"
            ref={listContainerRef}
            onScroll={handleListScroll}
            style={{ maxHeight: "65vh" }}
          >
            <table className="status-health-table frs-enterprise-table">
              <thead>
                <tr>
                  <th style={{ width: "80px", textAlign: "center" }}>S.No.</th>
                  <th style={{ width: "20%" }}>Name</th>
                  <th style={{ width: "100px" }}>Match</th>
                  <th style={{ width: "140px" }}>Status</th>
                  <th style={{ width: "25%", textAlign: "center" }}>Last Seen</th>
                  <th style={{ width: "150px", textAlign: "center" }}>Last Active</th>
                  <th style={{ width: "120px", textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatches.length > 0 ? (
                  filteredMatches.slice(0, visibleCount).map((item, index) => (
                    <tr 
                      key={item.id} 
                      className="frs-table-row"
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(`/frs/${item.id}`, { state: { searchQuery, activeCategory } })}
                    >
                      <td style={{ textAlign: "center", padding: "12px 16px", fontWeight: "600", color: "var(--text-secondary)" }}>
                        {index + 1}
                      </td>
                      <td style={{ fontWeight: "600" }}>{item.name}</td>
                      <td>
                        <span style={{ color: parseFloat(item.confidenceScore) > 95 ? "var(--success)" : "var(--text-secondary)", fontWeight: "600" }}>
                          {item.confidenceScore}
                        </span>
                      </td>
                      <td>
                        {item.watchlistStatus !== "None" ? (
                          <span className={`frs-compact-badge ${item.watchlistStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                            {item.watchlistStatus}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-tertiary)", fontSize: "12px" }}>Clear</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                          <FiMapPin style={{ color: "var(--text-tertiary)" }} /> {item.lastSeen}
                        </div>
                      </td>
                      <td style={{ textAlign: "center", fontWeight: "500", color: "var(--text-secondary)" }}>
                        {formatSightingRecency(item)}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <button className="frs-btn-view-profile">
                          View Profile
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                      No suspect profiles found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FaceRecognition;
