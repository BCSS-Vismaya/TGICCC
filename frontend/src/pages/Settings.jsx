import { useState, useEffect } from "react";
import { 
  FiUserPlus, 
  FiShield, 
  FiCheck, 
  FiSun, 
  FiMoon, 
  FiBell, 
  FiUser, 
  FiFileText, 
  FiCpu, 
  FiCheckCircle, 
  FiSave,
  FiX
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import incidents from "../data/incidents";

// Seeded mock users list
const initialUsers = [
  { id: "U-001", name: "K. Srinivas", role: "ADMINISTRATOR", unit: "TGICCC HQ", status: "Active", lastActive: "2 min ago" },
  { id: "U-002", name: "P. Ramesh", role: "SUPERVISOR", unit: "Charminar Control", status: "Active", lastActive: "8 min ago" },
  { id: "U-003", name: "A. Kavitha", role: "OPERATOR", unit: "Banjara Hills Control", status: "Active", lastActive: "1 hr ago" },
  { id: "U-004", name: "M. Pavan", role: "OPERATOR", unit: "Secunderabad Control", status: "On Leave", lastActive: "Yesterday" },
  { id: "U-005", name: "L. Suresh", role: "READ ONLY", unit: "Press Liaison", status: "Active", lastActive: "20 min ago" }
];

// Initial user permissions mappings
const initialUserPermissions = {
  "U-001": ["Access FRS", "View Anomalies", "Configure Notifications", "Download Evidence", "Export Reports", "Manage Users", "Manage System Settings"],
  "U-002": ["Access FRS", "View Anomalies", "Configure Notifications", "Download Evidence", "Export Reports"],
  "U-003": ["Access FRS", "View Anomalies", "Download Evidence"],
  "U-004": ["Access FRS", "View Anomalies", "Download Evidence"],
  "U-005": ["View Anomalies"]
};

// All system permissions list
const systemPermissions = [
  "Access FRS",
  "View Anomalies",
  "Configure Notifications",
  "Download Evidence",
  "Export Reports",
  "Manage Users",
  "Manage System Settings"
];

// Audit log entries
const auditLogs = [
  { time: "30 Jun, 17:05:12", user: "K. Srinivas", action: "Modified Notification Rules", ip: "10.0.4.12", status: "Success" },
  { time: "30 Jun, 16:30:45", user: "P. Ramesh", action: "Downloaded Evidence (CAM-0059)", ip: "10.0.12.82", status: "Success" },
  { time: "30 Jun, 15:10:22", user: "A. Kavitha", action: "Viewed FRS Suspect (FACE-1000)", ip: "10.0.8.19", status: "Success" },
  { time: "30 Jun, 14:02:11", user: "L. Suresh", action: "Attempted User Management Access", ip: "10.0.22.14", status: "Denied" }
];

function Settings() {
  const [activeTab, setActiveTab] = useState("User Management");
  const [users, setUsers] = useState(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState("U-001");
  const [userPermissions, setUserPermissions] = useState(initialUserPermissions);

  // Theme state
  const [themeMode, setThemeMode] = useState("light");

  // Notification Preferences Toggles
  const [notifPreferences, setNotifPreferences] = useState({
    email: true,
    sms: true,
    alarm: false,
    dashboard: true
  });

  // Profile Settings
  const [profile, setProfile] = useState({
    name: "Operator Kumar",
    role: "Dispatcher Officer",
    badge: "TS-14801",
    email: "kumar.ops@tgpolice.gov.in",
    phone: "+91 98765 43210",
    unit: "Hyderabad Command Center"
  });

  // System Configuration
  const [sysConfig, setSysConfig] = useState({
    centerName: "Traffic & Geo-Integrated Command & Control Centre",
    backupServer: "192.168.10.45",
    logRetention: "90 Days",
    scanInterval: "5 Seconds",
    emergencyMode: "Standard Operations"
  });

  // Add User modal states
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("OPERATOR");
  const [newUserUnit, setNewUserUnit] = useState("");
  const [newUserStatus, setNewUserStatus] = useState("Active");

  // Sync theme changes with DOM root
  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark-theme");
      toast.success("Dark Mode enabled");
    } else {
      document.documentElement.classList.remove("dark-theme");
      toast.success("Light Mode enabled");
    }
  };

  // Toggle permission for the selected user
  const handlePermissionToggle = (permission) => {
    setUserPermissions(prev => {
      const activeUserPerms = prev[selectedUserId] || [];
      const updatedPerms = activeUserPerms.includes(permission)
        ? activeUserPerms.filter(p => p !== permission)
        : [...activeUserPerms, permission];

      return {
        ...prev,
        [selectedUserId]: updatedPerms
      };
    });
    toast.success("User permissions updated successfully");
  };

  // Handle Add User Submit
  const handleAddUserSubmit = (e) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserUnit.trim()) {
      toast.error("Please fill in all user details");
      return;
    }

    const nextId = `U-${String(users.length + 1).padStart(3, "0")}`;
    const newUserObj = {
      id: nextId,
      name: newUserName,
      role: newUserRole,
      unit: newUserUnit,
      status: newUserStatus,
      lastActive: "Just now"
    };

    setUsers([...users, newUserObj]);
    
    // Assign default empty permissions
    setUserPermissions(prev => ({
      ...prev,
      [nextId]: ["View Anomalies"]
    }));

    toast.success(`User ${newUserName} added successfully`);
    
    // Reset Form
    setNewUserName("");
    setNewUserUnit("");
    setNewUserRole("OPERATOR");
    setAddUserOpen(false);
  };

  // Profile save confirmation
  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success("Dispatcher profile details saved successfully.");
  };

  // System config save confirmation
  const handleSysConfigSave = (e) => {
    e.preventDefault();
    toast.success("System configurations successfully saved to registry.");
  };

  // Notification preferences save confirmation
  const handleNotifPrefsSave = () => {
    toast.success("Notification preferences updated.");
  };

  return (
    <div className="settings-container">
      {/* Toast Alert stacks */}
      <Toaster position="top-right" />

      {/* Header */}
      <div className="status-header-row">
        <div className="status-header-info">
          <span className="module-tag">Configuration</span>
          <h1>Settings</h1>
          <p>Manage users, theme, notifications, audit logs, and system configuration for TGICCC.</p>
        </div>
      </div>

      {/* Tab Navigation row */}
      <div className="settings-tab-bar">
        {["User Management", "Theme", "Notifications", "Profile", "Audit Logs", "System Config"].map((tab) => (
          <button
            key={tab}
            type="button"
            className={`settings-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1 — User Management */}
      {activeTab === "User Management" && (
        <div className="status-panel-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>User Roles & Permissions</h3>
            <button 
              type="button" 
              className="frs-btn-search"
              style={{ display: "flex", gap: "6px", alignItems: "center", padding: "10px 16px", fontSize: "14px" }}
              onClick={() => setAddUserOpen(true)}
            >
              <FiUserPlus /> Add User
            </button>
          </div>

          <div className="status-table-container">
            <table className="status-health-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Unit</th>
                  <th>Status</th>
                  <th>Last Active</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr 
                    key={u.id}
                    className={`clickable-tr ${selectedUserId === u.id ? "selected-user" : ""}`}
                    onClick={() => setSelectedUserId(u.id)}
                  >
                    <td>{u.id}</td>
                    <td style={{ fontWeight: "700" }}>{u.name}</td>
                    <td>
                      <span className={`role-badge ${u.role.toLowerCase().replace(/\s+/g, "-")}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.unit}</td>
                    <td>{u.status}</td>
                    <td style={{ color: "var(--text-secondary)" }}>{u.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Specific Permissions checklist */}
          {selectedUserId && (
            <div className="permissions-section">
              <h4>Available Permissions for {(users.find(u => u.id === selectedUserId))?.name}</h4>
              <div className="permissions-grid">
                {systemPermissions.map((permission) => {
                  const activeUserPerms = userPermissions[selectedUserId] || [];
                  const isChecked = activeUserPerms.includes(permission);
                  return (
                    <button
                      key={permission}
                      type="button"
                      className={`permission-pill ${isChecked ? "checked" : ""}`}
                      onClick={() => handlePermissionToggle(permission)}
                    >
                      {isChecked && <FiCheck />}
                      <span>{permission}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2 — Theme Selector */}
      {activeTab === "Theme" && (
        <div className="status-panel-card">
          <h3>Theme Selection</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            Select your preferred system theme mode for the TGICCC administration console.
          </p>
          
          <div className="theme-options-grid">
            <div 
              className={`theme-card ${themeMode === "light" ? "active" : ""}`}
              onClick={() => handleThemeChange("light")}
            >
              <FiSun className="theme-card-icon" />
              <h4>Light Mode</h4>
            </div>
            <div 
              className={`theme-card ${themeMode === "dark" ? "active" : ""}`}
              onClick={() => handleThemeChange("dark")}
            >
              <FiMoon className="theme-card-icon" />
              <h4>Dark Mode</h4>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 — Notification Preferences & Active Feed */}
      {activeTab === "Notifications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Notifications Feed */}
          <div className="status-panel-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <div>
                <h3 style={{ margin: 0 }}>Recent Dispatched Notifications</h3>
                <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px", marginBottom: 0 }}>
                  Real-time operational alerts logged by the TGICCC dispatch system.
                </p>
              </div>
              <span className="live-badge" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span className="live-dot" style={{ display: "inline-block" }}></span> LIVE ALERTS
              </span>
            </div>

            <div className="notifications-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {incidents.slice(0, 5).map((notif) => (
                <div 
                  key={notif.id} 
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between",
                    padding: "14px 18px", 
                    borderRadius: "10px", 
                    border: "1px solid var(--border)", 
                    background: "rgba(255, 255, 255, 0.01)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span 
                      style={{ 
                        width: "8px", 
                        height: "8px", 
                        borderRadius: "50%", 
                        background: notif.severity === "Critical" ? "var(--critical)" : 
                                    notif.severity === "High" ? "var(--high)" : 
                                    notif.severity === "Medium" ? "var(--medium)" : "var(--low)",
                        boxShadow: `0 0 8px ${notif.severity === "Critical" ? "var(--critical)" : 
                                    notif.severity === "High" ? "var(--high)" : 
                                    notif.severity === "Medium" ? "var(--medium)" : "var(--low)"}`
                      }}
                    ></span>
                    <div>
                      <div style={{ fontWeight: "700", fontSize: "14px", color: "var(--text-primary)" }}>{notif.title}</div>
                      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "2px" }}>
                        {notif.location} &bull; {notif.camera}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{notif.time}</span>
                    <span 
                      className={`status-chip ${notif.status.toLowerCase().replace(/\s+/g, "-")}`}
                      style={{ fontSize: "11px", padding: "4px 10px" }}
                    >
                      {notif.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="status-panel-card">
            <h3 style={{ margin: 0 }}>System Notification Preferences</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px", marginBottom: "16px" }}>
              Choose which delivery targets dispatch alert summaries to your local console session.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
              <label className="form-checkbox-item" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={notifPreferences.email}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, email: e.target.checked })}
                />
                <span style={{ color: "var(--text-primary)" }}>Enable Email Alert Dispatching</span>
              </label>
              
              <label className="form-checkbox-item" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={notifPreferences.sms}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, sms: e.target.checked })}
                />
                <span style={{ color: "var(--text-primary)" }}>Enable SMS Text Alerts</span>
              </label>

              <label className="form-checkbox-item" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={notifPreferences.alarm}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, alarm: e.target.checked })}
                />
                <span style={{ color: "var(--text-primary)" }}>Trigger Audio Alarms on Critical Anomalies</span>
              </label>

              <label className="form-checkbox-item" style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input 
                  type="checkbox"
                  checked={notifPreferences.dashboard}
                  onChange={(e) => setNotifPreferences({ ...notifPreferences, dashboard: e.target.checked })}
                />
                <span style={{ color: "var(--text-primary)" }}>Display Desktop Dashboard Alerts</span>
              </label>

              <button 
                type="button" 
                className="frs-btn-search"
                style={{ width: "fit-content", marginTop: "12px", padding: "10px 18px" }}
                onClick={handleNotifPrefsSave}
              >
                Update Preferences
              </button>
            </div>
          </div>
          
        </div>
      )}

      {/* Tab 4 — Profile Settings */}
      {activeTab === "Profile" && (
        <div className="status-panel-card">
          <h3>Dispatcher Profile Settings</h3>
          
          <form onSubmit={handleProfileSave} className="profile-form-grid">
            <div className="form-section">
              <label>Name</label>
              <input 
                type="text" 
                className="form-select" 
                value={profile.name} 
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              />
            </div>
            
            <div className="form-section">
              <label>Role</label>
              <input 
                type="text" 
                className="form-select" 
                value={profile.role} 
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label>Badge ID</label>
              <input 
                type="text" 
                className="form-select" 
                value={profile.badge} 
                disabled
              />
            </div>

            <div className="form-section">
              <label>Email Address</label>
              <input 
                type="email" 
                className="form-select" 
                value={profile.email} 
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label>Contact Number</label>
              <input 
                type="text" 
                className="form-select" 
                value={profile.phone} 
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label>Current Assigned Unit</label>
              <input 
                type="text" 
                className="form-select" 
                value={profile.unit} 
                onChange={(e) => setProfile({ ...profile, unit: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <button type="submit" className="frs-btn-search" style={{ width: "fit-content" }}>
                <FiSave /> Save Profile Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 5 — Audit Logs */}
      {activeTab === "Audit Logs" && (
        <div className="status-panel-card">
          <h3>System Audit Logs</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            A log of administrative actions performed on the TGICCC security network.
          </p>

          <div className="status-table-container">
            <table className="status-health-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>IP Address</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log, idx) => (
                  <tr key={idx}>
                    <td style={{ color: "var(--text-secondary)" }}>{log.time}</td>
                    <td style={{ fontWeight: "700" }}>{log.user}</td>
                    <td>{log.action}</td>
                    <td>{log.ip}</td>
                    <td>
                      <span className={`audit-status-tag ${log.status.toLowerCase()}`}>
                        {log.status === "Success" ? <FiCheckCircle style={{ marginRight: "4px" }} /> : <FiX style={{ marginRight: "4px" }} />}
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6 — System Config */}
      {activeTab === "System Config" && (
        <div className="status-panel-card">
          <h3>System Configuration</h3>
          
          <form onSubmit={handleSysConfigSave} className="config-form-grid">
            <div className="form-section">
              <label>Command Center Name</label>
              <input 
                type="text" 
                className="form-select" 
                value={sysConfig.centerName} 
                onChange={(e) => setSysConfig({ ...sysConfig, centerName: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label>Backup Server IP</label>
              <input 
                type="text" 
                className="form-select" 
                value={sysConfig.backupServer} 
                onChange={(e) => setSysConfig({ ...sysConfig, backupServer: e.target.value })}
              />
            </div>

            <div className="form-section">
              <label>Log Retention Period</label>
              <select 
                className="form-select" 
                value={sysConfig.logRetention}
                onChange={(e) => setSysConfig({ ...sysConfig, logRetention: e.target.value })}
              >
                <option value="30 Days">30 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="180 Days">180 Days</option>
                <option value="365 Days">365 Days</option>
              </select>
            </div>

            <div className="form-section">
              <label>AI Scan Frequency</label>
              <select 
                className="form-select" 
                value={sysConfig.scanInterval}
                onChange={(e) => setSysConfig({ ...sysConfig, scanInterval: e.target.value })}
              >
                <option value="1 Second">1 Second</option>
                <option value="5 Seconds">5 Seconds</option>
                <option value="10 Seconds">10 Seconds</option>
                <option value="30 Seconds">30 Seconds</option>
              </select>
            </div>

            <div className="form-section">
              <label>Emergency Alert Mode Level</label>
              <select 
                className="form-select" 
                value={sysConfig.emergencyMode}
                onChange={(e) => setSysConfig({ ...sysConfig, emergencyMode: e.target.value })}
              >
                <option value="Standard Operations">Standard Operations</option>
                <option value="Elevated Surveillance">Elevated Surveillance</option>
                <option value="High Alert Mode">High Alert Mode</option>
              </select>
            </div>

            <div style={{ gridColumn: "1/-1" }}>
              <button type="submit" className="frs-btn-search" style={{ width: "fit-content" }}>
                <FiSave /> Save System Configurations
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add User Modal Overlay */}
      {addUserOpen && (
        <div className="dialog-modal-overlay">
          <form onSubmit={handleAddUserSubmit} className="dialog-modal-card" style={{ width: "460px" }}>
            <div className="dialog-modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>Add New User</span>
              <button 
                type="button" 
                className="frs-mock-camera-close" 
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: "18px" }}
                onClick={() => setAddUserOpen(false)}
              >
                <FiX />
              </button>
            </div>
            
            <div className="dialog-modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-section">
                <label>Full Name</label>
                <input 
                  type="text" 
                  className="form-select" 
                  placeholder="Enter operator name..."
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                />
              </div>

              <div className="form-section">
                <label>Assigned Unit / Office</label>
                <input 
                  type="text" 
                  className="form-select" 
                  placeholder="e.g. TGICCC HQ, Kukatpally Station..."
                  value={newUserUnit}
                  onChange={(e) => setNewUserUnit(e.target.value)}
                />
              </div>

              <div className="form-section">
                <label>Role</label>
                <select 
                  className="form-select"
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                >
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="OPERATOR">Operator</option>
                  <option value="READ ONLY">Read Only</option>
                </select>
              </div>

              <div className="form-section">
                <label>Status</label>
                <select 
                  className="form-select"
                  value={newUserStatus}
                  onChange={(e) => setNewUserStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="dialog-modal-actions">
              <button 
                type="button" 
                className="frs-btn-outline"
                onClick={() => setAddUserOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="frs-btn-search"
                style={{ padding: "10px 20px" }}
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default Settings;