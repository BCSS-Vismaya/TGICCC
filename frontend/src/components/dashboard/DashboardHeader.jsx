import { useState, useEffect } from "react";
import { 
  FiBriefcase, 
  FiCalendar, 
  FiRefreshCw, 
  FiVideo, 
  FiAlertCircle, 
  FiCpu, 
  FiUser 
} from "react-icons/fi";
import incidents from "../../data/incidents";
import { useSeverity } from "../../context/SeverityContext";

function DashboardHeader() {
  const { getSeverity } = useSeverity();
  const [timeStr, setTimeStr] = useState("");
  const [syncTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const formattedDate = d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
      const formattedTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setTimeStr(`${formattedDate}, ${formattedTime}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const dynamicIncidents = incidents.map(i => ({
    ...i,
    severity: getSeverity(i.title)
  }));

  const activeCount = dynamicIncidents.filter(i => i.status !== "Resolved").length;

  const getShift = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return "Morning Shift";
    if (hour >= 14 && hour < 22) return "Afternoon Shift";
    return "Night Shift";
  };

  return (
    <div className="ops-header" style={{ padding: "12px 20px" }}>
      <div className="ops-info-strip" style={{ borderTop: "none", paddingTop: 0 }}>
        <div className="ops-info-item">
          <FiBriefcase className="ops-info-icon" />
          <span>{getShift()}</span>
        </div>
        <div className="ops-info-separator">|</div>
        
        <div className="ops-info-item">
          <FiCalendar className="ops-info-icon" />
          <span>{timeStr}</span>
        </div>
        <div className="ops-info-separator">|</div>

        <div className="ops-info-item">
          <FiRefreshCw className="ops-info-icon" />
          <span>Sync: {syncTime}</span>
        </div>
        <div className="ops-info-separator">|</div>

        <div className="ops-info-item">
          <FiVideo className="ops-info-icon" />
          <span>22 Cameras Online</span>
        </div>
        <div className="ops-info-separator">|</div>

        <div className="ops-info-item">
          <FiAlertCircle className="ops-info-icon" />
          <span>{activeCount} Active Incidents</span>
        </div>
        <div className="ops-info-separator">|</div>

        <div className="ops-info-item">
          <FiCpu className="ops-info-icon" />
          <span>System Health 98%</span>
        </div>
        <div className="ops-info-separator">|</div>

        <div className="ops-info-item">
          <FiUser className="ops-info-icon" />
          <span>Operator Kumar</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;