import IncidentCard from "./IncidentCard";

function IncidentQueue({ filteredIncidents }) {
  if (filteredIncidents.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "var(--text-secondary)", fontSize: "15px", background: "white", border: "1.5px dashed var(--border)", borderRadius: "14px", marginTop: "16px" }}>
        No active incidents match your filter parameters.
      </div>
    );
  }

  return (
    <div className="incident-grid">
      {filteredIncidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
        />
      ))}
    </div>
  );
}

export default IncidentQueue;