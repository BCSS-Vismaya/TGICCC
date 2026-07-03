import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiBell, FiMoon, FiSun, FiLogOut, FiClock } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useSeverity } from "../../context/SeverityContext";
import incidentsData from "../../data/incidents";

function TopNavbar({ onLogout }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { getSeverity } = useSeverity();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [alerts, setAlerts] = useState(incidentsData);
  const dropdownRef = useRef(null);
  const [timeStr, setTimeStr] = useState("");

  // Clock ticking effect
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const formattedDate = d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTimeStr(`${formattedDate} • ${formattedTime}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const clearAllAlerts = (e) => {
    e.stopPropagation();
    setAlerts([]);
  };

  return (
    <header className="top-navbar">

      <div className="navbar-left">
        <div className="navbar-title-small">
          TRAFFIC & GEO-INTEGRATED COMMAND & CONTROL CENTRE
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
          <h1 className="navbar-title" style={{ margin: 0 }}>
            Hyderabad Operations
          </h1>
          <span className="live-badge">
            <span className="live-dot"></span>
            LIVE
          </span>
        </div>
      </div>

      <div className="navbar-right">

        <button 
          type="button" 
          className="nav-icon-btn" 
          onClick={toggleTheme}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <FiSun /> : <FiMoon />}
        </button>

        <div className="notification-wrapper" ref={dropdownRef}>
          <button 
            type="button"
            className={`nav-icon-btn notification-btn ${isDropdownOpen ? "active" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="Recent Alerts"
          >
            <FiBell />
            {alerts.length > 0 && <span className="notification-dot"></span>}
          </button>

          {isDropdownOpen && (
            <div className="notifications-dropdown">
              <div className="dropdown-header">
                <h4>Recent Alerts</h4>
                {alerts.length > 0 && (
                  <button 
                     type="button"
                     className="dropdown-clear-btn"
                     onClick={clearAllAlerts}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="dropdown-body">
                {alerts.length > 0 ? (
                  alerts.map((alert) => {
                    const dynamicSeverity = getSeverity(alert.title);
                    return (
                      <div key={alert.id} className="dropdown-item">
                        <span className={`dropdown-item-indicator ${dynamicSeverity.toLowerCase()}`}></span>
                        <div className="dropdown-item-content">
                          <span className="dropdown-item-title">{alert.title}</span>
                          <div className="dropdown-item-meta">
                            <span>{alert.location}</span>
                            <span>{alert.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="dropdown-empty-state">
                    No new alerts
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="clock-card">
          <FiClock className="clock-icon" />
          <span>{timeStr}</span>
        </div>

        <div className="operator-card" onClick={() => navigate("/profile")} title="View Operator Profile">

          <div className="operator-name">
            Kumar
          </div>

          <div className="operator-id">
            TS-14801
          </div>

        </div>

        <button type="button" className="nav-icon-btn" onClick={onLogout} title="Logout">
          <FiLogOut />
        </button>

      </div>

    </header>
  );
}

export default TopNavbar;