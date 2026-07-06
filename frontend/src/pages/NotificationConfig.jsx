import { useState, useEffect } from "react";
import { 
  FiBell, 
  FiSave, 
  FiRefreshCw, 
  FiSettings, 
  FiCheckCircle, 
  FiAlertTriangle, 
  FiClock, 
  FiX, 
  FiCheck,
  FiSend,
  FiPlus,
  FiTrash2,
  FiEdit2
} from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useSeverity, initialDefaultRules } from "../context/SeverityContext";

// History logs
const initialHistory = [
  { time: "30 Jun, 15:44", event: "Crowd Detection", severity: "CRITICAL", channel: "Dashboard", recipient: "Fire Department", status: "Delivered" },
  { time: "30 Jun, 14:45", event: "Fight Detection", severity: "HIGH", channel: "Control Room Alarm", recipient: "Fire Department", status: "Pending" },
  { time: "30 Jun, 08:40", event: "Water Logging", severity: "CRITICAL", channel: "Control Room Alarm", recipient: "Traffic Police", status: "Delivered" },
  { time: "30 Jun, 08:19", event: "Camera Offline", severity: "CRITICAL", channel: "Email", recipient: "Fire Department", status: "Delivered" },
  { time: "30 Jun, 06:45", event: "Fight Detection", severity: "HIGH", channel: "Email", recipient: "Police Control Room", status: "Delivered" },
  { time: "30 Jun, 04:12", event: "Crowd Detection", severity: "HIGH", channel: "Dashboard", recipient: "Supervisor", status: "Delivered" }
];

function NotificationConfig() {
  const { rules, setRules } = useSeverity();
  const [history, setHistory] = useState(initialHistory);

  // Modal / Drawer edit state
  const [editingRule, setEditingRule] = useState(null);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Edit Drawer Form states
  const [formEnabled, setFormEnabled] = useState(false);
  const [formMinSeverity, setFormMinSeverity] = useState("Medium");
  const [formRecipients, setFormRecipients] = useState([]);

  // Open Edit Drawer
  const handleEditClick = (rule) => {
    setEditingRule(rule);
    setFormEnabled(rule.enabled);
    setFormMinSeverity(rule.minSeverity);
    // Deep copy recipients list and set edit modes to false by default
    setFormRecipients(rule.recipients.map(r => ({ ...r, isEditing: false })));
  };

  // Close Edit Drawer
  const handleDrawerClose = () => {
    setEditingRule(null);
  };

  // Add Recipient Row
  const handleAddRecipient = () => {
    const newId = `temp-${Date.now()}`;
    setFormRecipients(prev => [
      ...prev,
      {
        id: newId,
        name: "",
        channel: "Email",
        channelId: "",
        duration: "Always",
        status: "Active",
        isEditing: true
      }
    ]);
  };

  // Remove Recipient Row
  const handleRemoveRecipient = (id) => {
    const updated = formRecipients.filter(r => r.id !== id);
    setFormRecipients(updated);
    // If no recipients left, automatically disable notifications
    if (updated.length === 0) {
      setFormEnabled(false);
    }
  };

  // Update Recipient Row values
  const handleUpdateRecipientField = (id, field, value) => {
    setFormRecipients(prev => prev.map(r => {
      if (r.id === id) {
        // Reset channelId if changing channel to keep placeholders clean
        if (field === "channel") {
          return { ...r, [field]: value, channelId: "" };
        }
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  // Toggle Edit status for Recipient Row
  const handleToggleRowEdit = (id, state) => {
    setFormRecipients(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, isEditing: state };
      }
      return r;
    }));
  };

  // Save Drawer changes
  const handleDrawerSave = () => {
    setRules(prevRules => prevRules.map(r => {
      if (r.id === editingRule.id) {
        // Remove helper key isEditing before saving
        const cleanRecipients = formRecipients.map(({ isEditing, ...rest }) => rest);
        
        // Recompute distinct active channels
        const activeChannels = [...new Set(cleanRecipients.filter(rec => rec.status === "Active").map(rec => rec.channel))];

        return {
          ...r,
          enabled: formEnabled,
          minSeverity: formMinSeverity,
          recipients: cleanRecipients,
          channels: activeChannels.length > 0 ? activeChannels : ["Dashboard"]
        };
      }
      return r;
    }));
    toast.success(`Updated configuration for ${editingRule.title}`);
    setEditingRule(null);
  };

  // Inline rule enabled toggle click
  const handleToggleRule = (ruleId) => {
    setRules(prevRules => prevRules.map(r => {
      if (r.id === ruleId) {
        const nextState = !r.enabled;
        if (nextState && (!r.recipients || r.recipients.length === 0)) {
          toast.error(`Cannot enable ${r.title} notifications: No recipients configured.`, {
            duration: 4000
          });
          return r;
        }
        toast.success(`${r.title} notifications ${nextState ? "enabled" : "disabled"}`);
        return { ...r, enabled: nextState };
      }
      return r;
    }));
  };

  // Inline severity select change
  const handleSeverityChange = (ruleId, val) => {
    setRules(prevRules => prevRules.map(r => {
      if (r.id === ruleId) {
        return { ...r, minSeverity: val };
      }
      return r;
    }));
    toast.success(`Severity threshold updated`);
  };

  // Reset all to default configurations
  const handleResetToDefault = () => {
    setRules(initialDefaultRules);
    toast.success("Notification configurations reset to factory defaults");
  };

  // Save changes Globally
  const handleSaveAll = () => {
    toast.success("All operational rules successfully dispatched and written to database.");
  };

  // Send Test Notification
  const handleSendTestNotification = () => {
    setIsTestModalOpen(true);
  };

  const handleConfirmTestAlert = () => {
    setIsTestModalOpen(false);
    toast.success("Test alert dispatched: Fake Number Plate (Critical) -> Police Control Room (Delivered) via Dashboard Notification", {
      duration: 5000,
      icon: "🔔"
    });
    
    // Add to history
    const now = new Date();
    const mockTime = `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })}, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    setHistory(prev => [
      {
        time: mockTime,
        event: "Fake Number Plate (Test)",
        severity: "CRITICAL",
        channel: "Dashboard",
        recipient: "Police Control Room",
        status: "Delivered"
      },
      ...prev
    ]);
  };

  // Check placeholder dynamically based on channel
  const getChannelPlaceholder = (channel) => {
    if (channel === "Email") return "example@telangana.gov.in";
    return "+91 9876543210";
  };

  // Determine Save Button state
  const isFormValid = formRecipients.every(r => r.name.trim() !== "" && r.channelId.trim() !== "");
  
  const checkIfChanged = () => {
    if (!editingRule) return false;
    if (formEnabled !== editingRule.enabled) return true;
    if (formMinSeverity !== editingRule.minSeverity) return true;
    if (formRecipients.length !== editingRule.recipients.length) return true;
    for (let i = 0; i < formRecipients.length; i++) {
      const fr = formRecipients[i];
      const or = editingRule.recipients[i];
      if (!or || fr.name !== or.name || fr.channel !== or.channel || fr.channelId !== or.channelId || fr.duration !== or.duration || fr.status !== or.status) {
        return true;
      }
    }
    return false;
  };

  const hasChanges = checkIfChanged();
  const showValidation = formEnabled && formRecipients.length === 0;
  const isSaveDisabled = !isFormValid || !hasChanges || showValidation;

  return (
    <div className="notify-container">
      {/* Toast Alert stack handler */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header Area */}
      <div className="notify-header-row">
        <div className="notify-header-info" style={{ width: "100%" }}>
          <span className="module-tag">Administration</span>
          <h1 style={{ marginTop: "4px" }}>Notification Configuration</h1>
        </div>
      </div>

      {/* Section 1 — Notification Rules Table */}
      <div className="status-panel-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Notification Rules</h3>
          <button 
            type="button" 
            className="frs-btn-search" 
            style={{ padding: "8px 16px", fontSize: "13px", height: "fit-content", display: "inline-flex", alignItems: "center", gap: "6px" }}
            onClick={handleSaveAll}
          >
            <FiSave /> Save Changes
          </button>
        </div>
        
        <div className="status-table-container">
          <table className="status-health-table">
            <thead>
              <tr>
                <th>AI Detection</th>
                <th>Notification</th>
                <th>Min Severity</th>
                <th>Channels</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule.id}>
                  <td style={{ fontWeight: "700" }}>{rule.title}</td>
                  <td>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={rule.enabled} 
                        onChange={() => handleToggleRule(rule.id)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ width: "120px", padding: "6px 10px" }}
                      value={rule.minSeverity}
                      onChange={(e) => handleSeverityChange(rule.id, e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </td>
                  <td style={{ color: "var(--text-secondary)", fontSize: "13px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {rule.enabled ? rule.channels.join(", ") : "Disabled"}
                  </td>
                  <td>
                    <button 
                      type="button" 
                      className="frs-btn-outline" 
                      style={{ padding: "6px 12px", fontSize: "13px", display: "flex", gap: "6px", alignItems: "center" }}
                      onClick={() => handleEditClick(rule)}
                    >
                      <FiSettings /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* Section 5 — Live Dispatch Log History */}
      <div className="status-panel-card">
        <h3>Live Dispatch Log</h3>
        
        <div className="status-table-container">
          <table className="status-health-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Event</th>
                <th>Severity</th>
                <th>Channel</th>
                <th>Recipient</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ color: "var(--text-secondary)" }}>{log.time}</td>
                  <td style={{ fontWeight: "700" }}>{log.event}</td>
                  <td>
                    <span className={`priority-tag ${log.severity.toLowerCase()}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td>{log.channel}</td>
                  <td>{log.recipient}</td>
                  <td>
                    <span className={`history-status-badge ${log.status.toLowerCase()}`}>
                      {log.status === "Delivered" && <FiCheckCircle style={{ marginRight: "4px", verticalAlign: "middle" }} />}
                      {log.status === "Pending" && <FiClock style={{ marginRight: "4px", verticalAlign: "middle" }} />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Drawer Sidebar panel */}
      {editingRule && (
        <>
          <div className="drawer-overlay" onClick={handleDrawerClose} />
          <div className="drawer-panel">
            <div className="drawer-header">
              <h3>Edit Rule: {editingRule.title}</h3>
              <button 
                type="button" 
                className="frs-mock-camera-close" 
                onClick={handleDrawerClose}
              >
                <FiX />
              </button>
            </div>

            <div className="drawer-body">
              {/* Toggle Switch */}
              <div className="form-section">
                <label>Enable Notifications</label>
                <div className="form-control-row">
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={formEnabled}
                      onChange={(e) => {
                        const nextChecked = e.target.checked;
                        if (nextChecked && formRecipients.length === 0) {
                          toast.error("At least one recipient must be added before enabling notifications.");
                          setFormEnabled(false);
                        } else {
                          setFormEnabled(nextChecked);
                        }
                      }}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>
                    {formEnabled ? "Active" : "Inactive"}
                  </span>
                </div>

                {showValidation && (
                  <div className="validation-message-alert">
                    <FiAlertTriangle />
                    <span>At least one active recipient must be configured before notifications can be enabled.</span>
                  </div>
                )}
              </div>

              {/* Recipients Section */}
              <div className="recipients-section">
                <div className="recipients-section-header">
                  <h4>Recipients</h4>
                  {formRecipients.length > 0 && (
                    <button 
                      type="button" 
                      className="btn-circular-add"
                      onClick={handleAddRecipient}
                    >
                      <FiPlus /> Add Recipient
                    </button>
                  )}
                </div>

                {formRecipients.length > 0 ? (
                  <div className="status-table-container" style={{ border: "1px solid var(--border)", borderRadius: "8px" }}>
                    <table className="recipients-table">
                      <thead>
                        <tr>
                          <th style={{ width: "120px" }}>Channel</th>
                          <th>Name</th>
                          <th>Channel ID</th>
                          <th style={{ width: "140px" }}>Duration</th>
                          <th style={{ width: "100px" }}>Status</th>
                          <th style={{ width: "90px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formRecipients.map((rec) => (
                          <tr key={rec.id}>
                            {rec.isEditing ? (
                              <>
                                <td>
                                  <select 
                                    className="table-input-inline"
                                    value={rec.channel}
                                    onChange={(e) => handleUpdateRecipientField(rec.id, "channel", e.target.value)}
                                  >
                                    <option value="Email">Email</option>
                                    <option value="Phone">Phone</option>
                                    <option value="SMS">SMS</option>
                                  </select>
                                </td>
                                <td>
                                  <input 
                                    type="text"
                                    className="table-input-inline"
                                    value={rec.name}
                                    placeholder="Rahul Sharma"
                                    onChange={(e) => handleUpdateRecipientField(rec.id, "name", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <input 
                                    type="text"
                                    className="table-input-inline"
                                    value={rec.channelId}
                                    placeholder={getChannelPlaceholder(rec.channel)}
                                    onChange={(e) => handleUpdateRecipientField(rec.id, "channelId", e.target.value)}
                                  />
                                </td>
                                <td>
                                  <select 
                                    className="table-input-inline"
                                    value={["Always", "1 Day", "1 Week", "1 Month", "Until Disabled"].includes(rec.duration) ? rec.duration : "custom"}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      if (val === "custom") {
                                        const today = new Date().toISOString().split('T')[0];
                                        handleUpdateRecipientField(rec.id, "duration", today);
                                      } else {
                                        handleUpdateRecipientField(rec.id, "duration", val);
                                      }
                                    }}
                                  >
                                    <option value="Always">Always</option>
                                    <option value="1 Day">1 Day</option>
                                    <option value="1 Week">1 Week</option>
                                    <option value="1 Month">1 Month</option>
                                    <option value="Until Disabled">Until Disabled</option>
                                    <option value="custom">Until Date...</option>
                                  </select>
                                  {!["Always", "1 Day", "1 Week", "1 Month", "Until Disabled"].includes(rec.duration) && (
                                    <input 
                                      type="date"
                                      className="table-input-inline"
                                      style={{ marginTop: "6px" }}
                                      value={rec.duration}
                                      min={new Date().toISOString().split('T')[0]}
                                      onChange={(e) => handleUpdateRecipientField(rec.id, "duration", e.target.value)}
                                    />
                                  )}
                                </td>
                                <td>
                                  <select 
                                    className="table-input-inline"
                                    value={rec.status}
                                    onChange={(e) => handleUpdateRecipientField(rec.id, "status", e.target.value)}
                                  >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                  </select>
                                </td>
                                <td>
                                  <div className="row-actions-cell">
                                    <button 
                                      type="button" 
                                      className="row-action-btn save"
                                      title="Confirm Edit"
                                      onClick={() => {
                                        if (rec.name.trim() === "" || rec.channelId.trim() === "") {
                                          toast.error("Please enter Name and Channel ID");
                                        } else {
                                          handleToggleRowEdit(rec.id, false);
                                        }
                                      }}
                                    >
                                      <FiCheck />
                                    </button>
                                    <button 
                                      type="button" 
                                      className="row-action-btn delete"
                                      title="Delete Recipient"
                                      onClick={() => handleRemoveRecipient(rec.id)}
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </td>
                              </>
                            ) : (
                              <>
                                <td style={{ fontWeight: "600" }}>{rec.channel}</td>
                                <td>{rec.name}</td>
                                <td style={{ fontFamily: "monospace" }}>{rec.channelId}</td>
                                <td>
                                  {["Always", "1 Day", "1 Week", "1 Month", "Until Disabled"].includes(rec.duration) 
                                    ? rec.duration 
                                    : `Until ${rec.duration}`}
                                </td>
                                <td>
                                  <span className={`status-chip ${rec.status === "Active" ? "in-progress" : "new"}`} style={{ padding: "4px 8px", fontSize: "11px", margin: 0 }}>
                                    {rec.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="row-actions-cell">
                                    <button 
                                      type="button" 
                                      className="row-action-btn edit"
                                      title="Edit Row"
                                      onClick={() => handleToggleRowEdit(rec.id, true)}
                                    >
                                      <FiEdit2 />
                                    </button>
                                    <button 
                                      type="button" 
                                      className="row-action-btn delete"
                                      title="Delete Recipient"
                                      onClick={() => handleRemoveRecipient(rec.id)}
                                    >
                                      <FiTrash2 />
                                    </button>
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="recipients-empty-state">
                    <h5>No recipients configured.</h5>
                    <p>Add your first recipient to enable notifications.</p>
                    <button 
                      type="button" 
                      className="btn-circular-add"
                      style={{ padding: "8px 18px", fontSize: "13px" }}
                      onClick={handleAddRecipient}
                    >
                      <FiPlus /> Add Recipient
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="drawer-footer">
              <button 
                type="button" 
                className="frs-btn-outline" 
                onClick={handleDrawerClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="frs-btn-search"
                style={{ padding: "10px 20px" }}
                disabled={isSaveDisabled}
                onClick={handleDrawerSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}

      {/* Test Notification Confirmation Dialog Modal */}
      {isTestModalOpen && (
        <div className="dialog-modal-overlay">
          <div className="dialog-modal-card">
            <div className="dialog-modal-header">
              Verify Test Notification
            </div>
            <div className="dialog-modal-body">
              This will dispatch a simulated AI alarm event across the TGICCC notification pipelines to verify delivery rules. Proceed?
            </div>
            <div className="dialog-modal-actions">
              <button 
                type="button" 
                className="frs-btn-outline"
                onClick={() => setIsTestModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="frs-btn-search"
                style={{ padding: "10px 20px" }}
                onClick={handleConfirmTestAlert}
              >
                Confirm Test Alert
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default NotificationConfig;