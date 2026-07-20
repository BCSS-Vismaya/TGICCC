import { useState } from "react";
import FilterBar from "../components/dashboard/FilterBar";
import IncidentQueue from "../components/dashboard/IncidentQueue";
import incidents from "../data/incidents";
import toast, { Toaster } from "react-hot-toast";
import { useSeverity } from "../context/SeverityContext";

function Dashboard() {
  const { getSeverity } = useSeverity();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("TimeNewest");
  const [dateFilter, setDateFilter] = useState("");

  const [lastUpdated, setLastUpdated] = useState(() => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  });

  const handleRefresh = () => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    toast.success("Incident queue refreshed.");
  };

  const dynamicIncidents = incidents.map((incident) => ({
    ...incident,
    severity: getSeverity(incident.title),
  }));

  // ── Combined Filter ──────────────────────────────────────────────────────
  const filteredIncidents = dynamicIncidents
    .filter((incident) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        incident.title.toLowerCase().includes(q) ||
        incident.id.toLowerCase().includes(q) ||
        incident.location.toLowerCase().includes(q) ||
        incident.camera.toLowerCase().includes(q) ||
        incident.officer.toLowerCase().includes(q);

      const matchesSeverity =
        severityFilter === "All" ||
        incident.severity.toLowerCase() === severityFilter.toLowerCase();

      // Date filter: compare YYYY-MM-DD prefix of datetime
      const matchesDate =
        !dateFilter || incident.datetime.startsWith(dateFilter);

      let matchesStatus = true;
      if (sortBy.startsWith("Status")) {
        const targetStatus = sortBy.substring(6).toLowerCase();
        const incidentStatusClean = incident.status.toLowerCase().replace(/\s+/g, "");
        matchesStatus = incidentStatusClean === targetStatus;
      }

      return matchesSearch && matchesSeverity && matchesDate && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "TimeNewest":
          return new Date(b.datetime) - new Date(a.datetime);
        case "TimeOldest":
          return new Date(a.datetime) - new Date(b.datetime);
        case "All":
        default:
          return 0; // insertion order
      }
    });

  // ── KPI cards: computed from filteredIncidents ───────────────────────────
  const activeCount = filteredIncidents.filter(
    (i) => !["Resolved", "Closed"].includes(i.status)
  ).length;
  const criticalCount = filteredIncidents.filter(
    (i) => i.severity === "Critical"
  ).length;
  const offlineCamerasCount = 2; // Fixed C08 & C15
  const avgResponseTime = "4.2 mins";

  return (
    <div className="dashboard-container">
      <Toaster position="top-right" />

      {/* Operations Toolbar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        severityFilter={severityFilter}
        setSeverityFilter={setSeverityFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        lastUpdated={lastUpdated}
        onRefresh={handleRefresh}
      />

      {/* Operations Summary Stat Cards */}
      <div className="dashboard-telemetry-grid">
        <div className="dashboard-telemetry-card green">
          <span>Active Incidents</span>
          <h2>{activeCount}</h2>
        </div>
        <div className="dashboard-telemetry-card red">
          <span>Critical Alerts</span>
          <h2>{criticalCount}</h2>
        </div>
        <div className="dashboard-telemetry-card orange">
          <span>Cameras Offline</span>
          <h2>{offlineCamerasCount}</h2>
        </div>
        <div className="dashboard-telemetry-card blue">
          <span>Avg. Response Time</span>
          <h2>{avgResponseTime}</h2>
        </div>
      </div>

      {/* Incident Grid — empty state when no results */}
      {filteredIncidents.length === 0 ? (
        <div className="dashboard-empty-state">
          <span className="dashboard-empty-icon">📋</span>
          <h3>No incidents found</h3>
          <p>
            {dateFilter
              ? `No incidents recorded on ${new Date(dateFilter).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}.`
              : "No incidents match the current filters."}
          </p>
          {(searchQuery || dateFilter || severityFilter !== "All") && (
            <button
              className="dashboard-empty-clear-btn"
              onClick={() => {
                setSearchQuery("");
                setDateFilter("");
                setSeverityFilter("All");
              }}
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <IncidentQueue filteredIncidents={filteredIncidents} />
      )}
    </div>
  );
}

export default Dashboard;