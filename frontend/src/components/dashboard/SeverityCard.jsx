import Card from "../common/Card";
import SEVERITY from "../../constants/severity";

function SeverityCard({ title, value }) {
  return (
    <Card className="severity-card">
      <div className="severity-top">
        <span className="severity-title">
          {title}
        </span>

        <span
          className="severity-dot"
          style={{
            background: SEVERITY[title],
          }}
        />
      </div>

      <h2
        style={{
          color: SEVERITY[title],
        }}
      >
        {value}
      </h2>

      <p className="severity-label">
        Active Incidents
      </p>
    </Card>
  );
}

export default SeverityCard;