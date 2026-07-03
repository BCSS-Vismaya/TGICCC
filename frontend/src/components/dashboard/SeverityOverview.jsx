import SeverityCard from "./SeverityCard";
import dashboardStats from "../../data/dashboardData";
import incidents from "../../data/incidents";
import { getSeverityCount } from "../../utils/severityHelpers";
import { useSeverity } from "../../context/SeverityContext";

function SeverityOverview() {
  const { getSeverity } = useSeverity();
  const dynamicIncidents = incidents.map(i => ({
    ...i,
    severity: getSeverity(i.title)
  }));

  return (
    <div className="dashboard-grid">
      {dashboardStats.map((item) => (
        <SeverityCard
          key={item.severity}
          title={item.title}
          value={getSeverityCount(dynamicIncidents, item.severity)}
        />
      ))}
    </div>
  );
}

export default SeverityOverview;