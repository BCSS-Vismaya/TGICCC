import { useNavigate } from "react-router-dom";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import {
  FiCamera,
  FiClock,
  FiMapPin,
  FiUser,
  FiActivity
} from "react-icons/fi";
import StatusChip from "../common/StatusChip";

const badgeColors = {
  Critical: "red",
  High: "yellow",
  Medium: "blue",
  Low: "green",
};

function IncidentCard({ incident }) {
  const navigate = useNavigate();

  const handleViewIncident = () => {
    navigate(`/alerts/${incident.id}`);
  };

  return (
    <Card className={`incident-card severity-${incident.severity.toLowerCase()}`}>
      {/* Header ID and Severity Badge */}
      <div className="incident-header">
        <span className="incident-id">{incident.id}</span>
        <Badge color={badgeColors[incident.severity]}>
          {incident.severity}
        </Badge>
      </div>

      {/* Incident Title */}
      <h3 className="incident-title">{incident.title}</h3>

      {/* Detailed Meta Stack */}
      <div className="incident-details">
        <div className="detail-row">
          <FiMapPin />
          <span>{incident.location}</span>
        </div>

        <div className="detail-row">
          <FiCamera />
          <span>{incident.camera}</span>
        </div>

        <div className="detail-row">
          <FiClock />
          <span>{incident.time}</span>
        </div>

        <div className="detail-row">
          <FiUser />
          <span>{incident.officer}</span>
        </div>
      </div>

      {/* Footer controls: Status and Action button */}
      <div className="incident-footer">
        <StatusChip status={incident.status} />
        <Button onClick={handleViewIncident}>
          View Alert
        </Button>
      </div>
    </Card>
  );
}

export default IncidentCard;