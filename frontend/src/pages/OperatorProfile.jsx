import { useState } from "react";
import { 
  FiLock, 
  FiGlobe, 
  FiBell, 
  FiLogOut, 
  FiSun, 
  FiMoon 
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import toast, { Toaster } from "react-hot-toast";
import "../styles/profile.css";

function OperatorProfile({ onLogout }) {
  const { isDark, toggleTheme } = useTheme();
  
  // Simulated Interactive States
  const [status, setStatus] = useState("Available");
  const [language, setLanguage] = useState("English");
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  
  // Password Change Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    toast.success("Password updated successfully.");
    setIsPasswordModalOpen(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleStatusChange = (newVal) => {
    setStatus(newVal);
    toast.success(`Status updated to ${newVal}.`);
  };

  return (
    <div className="profile-container">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Info */}
      <div className="profile-header-row">
        <span className="profile-category">Identity & Security</span>
        <h1>Operator Profile</h1>
        <p>Review credentials, active shift schedules, telemetry activity logs, and account configuration parameters.</p>
      </div>

      <div className="profile-grid">
        
        {/* Left Column — Info & Shift & Responsibilities */}
        <div className="profile-left-col">
          
          {/* Card 1 — Identity */}
          <div className="profile-card-box">
            <div className="profile-id-section">
              <div className="profile-avatar-wrapper">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="120" height="120" rx="20" fill="#23404A"/>
                  <circle cx="60" cy="50" r="22" fill="#cbd5e1"/>
                  <path d="M28 92 C28 75, 40 70, 60 70 C80 70, 92 75, 92 92" fill="#cbd5e1"/>
                  {/* Glowing Headset */}
                  <path d="M38 50 C38 35, 82 35, 82 50" stroke="#3b82f6" stroke-width="4" stroke-linecap="round"/>
                  <rect x="34" y="46" width="8" height="12" rx="3" fill="#3b82f6"/>
                  <rect x="78" y="46" width="8" height="12" rx="3" fill="#3b82f6"/>
                  <path d="M42 54 L52 62" stroke="#3b82f6" stroke-width="2"/>
                  {/* Collar Star Emblem */}
                  <path d="M55 76 L65 76 L60 84 Z" fill="#fbbf24"/>
                </svg>
              </div>
              <div className="profile-id-text">
                <span className="profile-badge-tag">SI Rank</span>
                <h2>Operator Kumar</h2>
                <p className="profile-emp-id">Employee ID: <strong>TS-14801</strong></p>
                <p className="profile-department">Cyberabad Traffic Control Department</p>
              </div>
            </div>

            <div className="profile-contact-list">
              <div className="profile-contact-item">
                <span className="contact-label">Official Email</span>
                <span className="contact-value">kumar.ts14801@telangana.gov.in</span>
              </div>
              <div className="profile-contact-item">
                <span className="contact-label">Duty Role</span>
                <span className="contact-value">Supervisor / Operator</span>
              </div>
            </div>
          </div>

          {/* Card 2 — Current Shift */}
          <div className="profile-card-box">
            <h3>Current Active Shift</h3>
            <div className="profile-shift-grid">
              <div className="shift-metric">
                <span className="shift-metric-label">Active Shift</span>
                <span className="shift-metric-value">Morning Shift</span>
              </div>
              <div className="shift-metric">
                <span className="shift-metric-label">Shift Timing</span>
                <span className="shift-metric-value">08:00 – 16:00</span>
              </div>
              <div className="shift-metric">
                <span className="shift-metric-label">Logged In Since</span>
                <span className="shift-metric-value">08:03 AM</span>
              </div>
              <div className="shift-metric">
                <span className="shift-metric-label">Last Login Date</span>
                <span className="shift-metric-value">2026-07-01 08:01 AM</span>
              </div>
            </div>

            <div className="profile-status-action" style={{ marginTop: "18px", borderTop: "1px solid var(--border)", paddingTop: "16px" }}>
              <label style={{ fontSize: "12px", fontWeight: "700", textTransform: "uppercase", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                Operational Availability Status
              </label>
              <select 
                className="form-select" 
                value={status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                style={{ width: "100%" }}
              >
                <option value="Available">Available (Green)</option>
                <option value="Busy">Busy (Orange)</option>
                <option value="Offline">Offline (Gray)</option>
              </select>
            </div>
          </div>

          {/* Card 3 — Responsibilities */}
          <div className="profile-card-box">
            <h3>Assigned Responsibilities</h3>
            
            <div style={{ marginBottom: "16px" }}>
              <span className="responsibilities-section-title">Anomalies Supervised</span>
              <div className="pill-group" style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <span className="summary-pill active-channel">Fire Detection</span>
                <span className="summary-pill active-channel">Road Accidents</span>
                <span className="summary-pill active-channel">Fake Number Plate</span>
              </div>
            </div>

            <div>
              <span className="responsibilities-section-title">Assigned Regions</span>
              <div className="pill-group" style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                <span className="summary-pill recipient-role">South Zone</span>
                <span className="summary-pill recipient-role">Charminar</span>
                <span className="summary-pill recipient-role">Banjara Hills</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column — Permissions & KPIs & Activity */}
        <div className="profile-right-col">
          
          {/* Today's Stats Summary KPIs */}
          <div className="profile-kpi-row">
            <div className="profile-kpi-card">
              <span className="kpi-label">Incidents Reviewed</span>
              <span className="kpi-value">18</span>
            </div>
            <div className="profile-kpi-card">
              <span className="kpi-label">Alerts Acknowledged</span>
              <span className="kpi-value">12</span>
            </div>
            <div className="profile-kpi-card">
              <span className="kpi-label">Cases Assigned</span>
              <span className="kpi-value">4</span>
            </div>
            <div className="profile-kpi-card">
              <span className="kpi-label">Avg Response Time</span>
              <span className="kpi-value">2.8 min</span>
            </div>
          </div>

          {/* Card 5 — Recent Activity Timeline */}
          <div className="profile-card-box">
            <h3>Recent Shift Activity</h3>
            <div className="profile-activity-timeline">
              <div className="activity-item">
                <span className="activity-time">09:42 AM</span>
                <span className="activity-desc">Reviewed Tree Fall incident #1006</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">09:28 AM</span>
                <span className="activity-desc">Updated Road Accident status to Acknowledged</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">09:12 AM</span>
                <span className="activity-desc">Acknowledged Fire Detection alert from camera C19</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">08:57 AM</span>
                <span className="activity-desc">Viewed FRS matches list profile for FACE-1002</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">08:03 AM</span>
                <span className="activity-desc">Logged In at Terminal Cyberabad-TS-4</span>
              </div>
            </div>
          </div>

          {/* Card 6 — Account Settings */}
          <div className="profile-card-box">
            <h3>Account Settings</h3>
            <div className="settings-options-list">
              
              <div className="setting-option-row">
                <div className="setting-option-info">
                  <FiLock className="setting-icon" />
                  <div>
                    <span className="option-title">Change Password</span>
                    <p className="option-subtitle">Update account credential keys for security compliance.</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="frs-btn-outline" 
                  style={{ padding: "6px 12px", fontSize: "12.5px" }}
                  onClick={() => setIsPasswordModalOpen(true)}
                >
                  Change
                </button>
              </div>

              <div className="setting-option-row">
                <div className="setting-option-info">
                  {isDark ? <FiSun className="setting-icon" /> : <FiMoon className="setting-icon" />}
                  <div>
                    <span className="option-title">Global Theme Option</span>
                    <p className="option-subtitle">Toggle light or space-navy theme styles.</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={isDark} 
                    onChange={toggleTheme}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-option-row">
                <div className="setting-option-info">
                  <FiBell className="setting-icon" />
                  <div>
                    <span className="option-title">Notification Alerts</span>
                    <p className="option-subtitle">Dispatch email and SMS warning notifications.</p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}>
                    <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
                    Email
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}>
                    <input type="checkbox" checked={smsNotif} onChange={(e) => setSmsNotif(e.target.checked)} />
                    SMS
                  </label>
                </div>
              </div>

              <div className="setting-option-row">
                <div className="setting-option-info">
                  <FiGlobe className="setting-icon" />
                  <div>
                    <span className="option-title">Operational Language</span>
                    <p className="option-subtitle">Select command console localization.</p>
                  </div>
                </div>
                <select 
                  className="form-select" 
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    toast.success(`Language changed to ${e.target.value}.`);
                  }}
                  style={{ width: "120px", padding: "4px 8px", fontSize: "13px" }}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Telugu">Telugu</option>
                </select>
              </div>

              <div className="setting-option-row" style={{ borderBottom: "none", paddingBottom: 0 }}>
                <div className="setting-option-info">
                  <FiLogOut className="setting-icon" style={{ color: "var(--critical)" }} />
                  <div>
                    <span className="option-title" style={{ color: "var(--critical)" }}>Terminate Session</span>
                    <p className="option-subtitle">Logout of Cyberabad operations portal immediately.</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  style={{ padding: "6px 14px", border: "1px solid var(--critical)", color: "var(--critical)" }}
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Password Change Dialog Modal */}
      {isPasswordModalOpen && (
        <div className="dialog-modal-overlay">
          <div className="dialog-modal-card" style={{ maxWidth: "420px" }}>
            <div className="dialog-modal-header">
              Change Account Password
            </div>
            <form onSubmit={handlePasswordChangeSubmit}>
              <div className="dialog-modal-body" style={{ display: "flex", flexDirection: "column", gap: "12px", textAlign: "left" }}>
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Current Password</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    placeholder="Enter current password"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: "600", marginBottom: "6px", display: "block" }}>New Password</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Enter new password"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "12.5px", fontWeight: "600", marginBottom: "6px", display: "block" }}>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="settings-input" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    placeholder="Confirm new password"
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", boxSizing: "border-box" }}
                  />
                </div>
              </div>
              <div className="dialog-modal-actions">
                <button 
                  type="button" 
                  className="frs-btn-outline" 
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="frs-btn-search"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default OperatorProfile;
