import { FiSearch, FiRefreshCw } from "react-icons/fi";

function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  severityFilter, 
  setSeverityFilter, 
  sortBy, 
  setSortBy, 
  lastUpdated, 
  onRefresh 
}) {
  return (
    <div className="dashboard-toolbar">
      {/* Search Input Box */}
      <div className="toolbar-left-group">
        <div className="toolbar-search">
          <FiSearch />
          <input
            type="text"
            placeholder="Search Incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Severity filter select dropdown */}
        <div className="toolbar-select-wrapper">
          <label htmlFor="severity-select">Severity:</label>
          <select
            id="severity-select"
            className="toolbar-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort By select dropdown */}
        <div className="toolbar-select-wrapper">
          <label htmlFor="sort-select">Sort:</label>
          <select
            id="sort-select"
            className="toolbar-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Time">Time (Newest)</option>
            <option value="Severity">Severity (Highest)</option>
            <option value="Status">Status Name</option>
          </select>
        </div>
      </div>

      {/* Right details group: Timestamp + Refresh */}
      <div className="toolbar-right-group">
        <span className="toolbar-timestamp">
          Last Updated: {lastUpdated}
        </span>
        <button 
          type="button" 
          className="btn-toolbar-refresh"
          title="Refresh Queue"
          onClick={onRefresh}
        >
          <FiRefreshCw />
        </button>
      </div>
    </div>
  );
}

export default FilterBar;