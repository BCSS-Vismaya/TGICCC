import { useRef } from "react";
import { FiSearch, FiRefreshCw, FiX } from "react-icons/fi";

function FilterBar({ 
  searchQuery, 
  setSearchQuery, 
  severityFilter, 
  setSeverityFilter, 
  sortBy, 
  setSortBy,
  dateFilter,
  setDateFilter,
  lastUpdated, 
  onRefresh 
}) {
  const dateInputRef = useRef(null);

  return (
    <div className="dashboard-toolbar">
      {/* Left group: search + date picker + filters */}
      <div className="toolbar-left-group">

        {/* Search */}
        <div className="toolbar-search">
          <FiSearch className="toolbar-search-icon" />
          <input
            type="text"
            placeholder="Search Incidents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Picker — single native calendar icon only */}
        <div
          className="toolbar-date-wrapper"
          onClick={() => dateInputRef.current?.showPicker?.()}
        >
          <input
            ref={dateInputRef}
            type="date"
            id="date-filter"
            className="toolbar-date-input"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            title="Filter by alert date"
          />
          {dateFilter && (
            <button
              type="button"
              className="toolbar-date-clear"
              onClick={(e) => { e.stopPropagation(); setDateFilter(""); }}
              title="Clear date filter"
            >
              <FiX />
            </button>
          )}
        </div>

        {/* Severity Divider */}
        <div className="toolbar-divider" />

        {/* Severity filter */}
        <div className="toolbar-select-wrapper">
          <label htmlFor="severity-select">Severity:</label>
          <select
            id="severity-select"
            className="toolbar-select toolbar-select--severity"
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

        {/* Sort filter */}
        <div className="toolbar-select-wrapper">
          <label htmlFor="sort-select">Sort:</label>
          <select
            id="sort-select"
            className="toolbar-select toolbar-select--sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="All">All Incidents</option>
            <option value="TimeNewest">Time (Newest)</option>
            <option value="TimeOldest">Time (Oldest)</option>
            <option value="StatusNew">Status: New</option>
            <option value="StatusAcknowledged">Status: Acknowledged</option>
            <option value="StatusInProgress">Status: In Progress</option>
            <option value="StatusResolved">Status: Resolved</option>
          </select>
        </div>

      </div>

      {/* Right group: Refresh button */}
      <div className="toolbar-right-group">
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