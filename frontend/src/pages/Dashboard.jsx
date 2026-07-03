import { useState } from "react";
import FilterBar from "../components/dashboard/FilterBar";
import IncidentQueue from "../components/dashboard/IncidentQueue";
import incidents from "../data/incidents";
import toast, { Toaster } from "react-hot-toast";
import { FiAlertOctagon, FiClock, FiActivity, FiVideoOff } from "react-icons/fi";
import { useSeverity } from "../context/SeverityContext";

function Dashboard() {
  const { getSeverity } = useSeverity();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Time");
  
  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const handleRefresh = () => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    toast.success("Incident queue refreshed.");
  };

  const dynamicIncidents = incidents.map(incident => ({
    ...incident,
    severity: getSeverity(incident.title)
  }));

  // Filter & Sort Incidents
  const filteredIncidents = dynamicIncidents.filter(incident => {
    const matchesSearch = 
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toString().includes(searchQuery) ||
      incident.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.camera.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.officer.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSeverity = severityFilter === "All" || incident.severity.toLowerCase() === severityFilter.toLowerCase();
    
    return matchesSearch && matchesSeverity;
  }).sort((a, b) => {
    if (sortBy === "Time") {
      const parseTime = (timeStr) => {
        if (timeStr.includes("m ago")) return parseInt(timeStr);
        if (timeStr.includes("h ago")) return parseInt(timeStr) * 60;
        return 9999;
      };
      return parseTime(a.time) - parseTime(b.time);
    }
    if (sortBy === "Severity") {
      const severityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    }
    if (sortBy === "Status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // Calculate Operational Metrics
  const activeCount = dynamicIncidents.filter(i => i.status !== "Resolved").length;
  const criticalCount = dynamicIncidents.filter(i => i.severity === "Critical").length;
  const offlineCamerasCount = 2; // Fixed C08 & C15
  const avgResponseTime = "4.2 mins";

  return (
    <div className="dashboard-container">
      {/* Toast Alert stack helper */}
      <Toaster position="top-right" />

      {/* Operations Toolbar */}
      <FilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />

      {/* Quick Operations Summary Strip */}
      <div className="ops-summary-strip">
        <div className="ops-summary-item">
          <FiActivity style={{ color: "var(--primary)" }} />
          <span>Active Incidents: <strong>{activeCount}</strong></span>
        </div>
        
        <div className="ops-summary-item">
          <FiAlertOctagon style={{ color: "var(--critical)" }} />
          <span>Critical Incidents: <strong>{criticalCount}</strong></span>
        </div>

        <div className="ops-summary-item">
          <FiVideoOff style={{ color: "#e28743" }} />
          <span>Cameras Offline: <strong>{offlineCamerasCount}</strong></span>
        </div>

        <div className="ops-summary-item">
          <FiClock style={{ color: "#3498db" }} />
          <span>Avg. Response Time: <strong>{avgResponseTime}</strong></span>
        </div>
      </div>

      {/* Incident Grid */}
      <IncidentQueue filteredIncidents={filteredIncidents} />
    </div>
  );
}

export default Dashboard;