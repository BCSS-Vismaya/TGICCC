import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { FiClock, FiMapPin, FiUser } from "react-icons/fi";
import StatusChip from "../common/StatusChip";

const badgeColors = {
  Critical: "red",
  High: "yellow",
  Medium: "blue",
  Low: "green",
};

/** Format ISO datetime → "08 Jul 2026  ·  12:45 PM" */
function formatDatetime(datetimeStr) {
  if (!datetimeStr) return { date: "—", time: "—" };
  const dt = new Date(datetimeStr);
  const date = dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const time = dt.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).toUpperCase();
  return { date, time };
}

function IncidentCard({ incident }) {
  const navigate = useNavigate();
  const { date, time } = formatDatetime(incident.datetime);

  return (
    <Card className={`incident-card severity-${incident.severity.toLowerCase()}`}>
      {/* Top: ID stamp + Severity badge */}
      <div className="incident-id-wrapper">
        <span className="incident-id micro-label">{incident.id}</span>
        <Badge color={badgeColors[incident.severity]}>
          {incident.severity}
        </Badge>
      </div>

      {/* Title */}
      <h3 className="incident-title">{incident.title}</h3>

      {/* Meta details */}
      <div className="incident-details">
        <div className="detail-row">
          <FiMapPin />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span className="micro-label">Location</span>
            <span>{incident.location}</span>
          </div>
        </div>

        <div className="detail-row">
          <FiClock />
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <span className="micro-label">Reported</span>
            <span className="incident-time-primary">{date} &nbsp;·&nbsp; {time}</span>
          </div>
        </div>

        <div className="detail-row">
          <FiUser />
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            <span className="micro-label">Officer</span>
            <span>{incident.officer}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="incident-footer">
        <StatusChip status={incident.status} />
        <Button onClick={() => navigate(`/alerts/${incident.id}`)}>
          View Alert
        </Button>
      </div>
    </Card>
  );
}

export default IncidentCard;