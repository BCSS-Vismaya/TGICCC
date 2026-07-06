import { useState } from "react";
import { FiVideo } from "react-icons/fi";

// The strict 22 camera dataset
const systemCameras = [
  { id: "C01", location: "Saifabad Old PS", health: 86, connectivity: "Fiber", status: "Online" },
  { id: "C02", location: "Punjagutta X Road", health: 94, connectivity: "5G", status: "Online" },
  { id: "C03", location: "Nampally T Junction", health: 91, connectivity: "Fiber", status: "Online" },
  { id: "C04", location: "Road 12 MRC Gate", health: 80, connectivity: "5G", status: "Online" },
  { id: "C05", location: "Gun Park", health: 80, connectivity: "Fiber", status: "Online" },
  { id: "C06", location: "Secretariat", health: 85, connectivity: "Fiber", status: "Online" },
  { id: "C07", location: "Chilkalguda X Road", health: 81, connectivity: "5G", status: "Online" },
  { id: "C08", location: "Ranigunj", health: 0, connectivity: "Fiber", status: "Offline" },
  { id: "C09", location: "HTP Complex", health: 87, connectivity: "5G", status: "Online" },
  { id: "C10", location: "Moghal Ka Nala", health: 85, connectivity: "Fiber", status: "Online" },
  { id: "C11", location: "Ayodhya", health: 88, connectivity: "5G", status: "Online" },
  { id: "C12", location: "Shaikpet Nala", health: 83, connectivity: "Fiber", status: "Online" },
  { id: "C13", location: "Park Continental", health: 92, connectivity: "5G", status: "Online" },
  { id: "C14", location: "BRK Bhavan", health: 79, connectivity: "Fiber", status: "Online" },
  { id: "C15", location: "Golnaka Amberpet", health: 0, connectivity: "5G", status: "Offline" },
  { id: "C16", location: "Charminar", health: 91, connectivity: "5G", status: "Online" },
  { id: "C17", location: "Afzalgunj", health: 90, connectivity: "Fiber", status: "Online" },
  { id: "C18", location: "Madina", health: 94, connectivity: "5G", status: "Online" },
  { id: "C19", location: "Gulzar House", health: 88, connectivity: "Fiber", status: "Online" },
  { id: "C20", location: "SJ Bridge", health: 84, connectivity: "5G", status: "Online" },
  { id: "C21", location: "Iqbal Minar", health: 95, connectivity: "Fiber", status: "Online" },
  { id: "C22", location: "Tourist Hotel Kachiguda", health: 92, connectivity: "5G", status: "Online" }
];

function SystemStatus() {
  const [cameras] = useState(systemCameras);



  const getHealthStatus = (health, status) => {
    if (status === "Offline" || health === 0) return "Offline";
    if (health >= 80) return "Online";
    return "Partially Working";
  };

  const getHealthStatusBadgeClass = (health, status) => {
    if (status === "Offline" || health === 0) return "badge-red";
    if (health >= 80) return "badge-green";
    return "badge-yellow";
  };

  const onlineCount = cameras.filter(c => c.status !== "Offline" && c.health >= 80).length;
  const offlineCount = cameras.filter(c => c.status === "Offline" || c.health === 0).length;
  const partiallyCount = cameras.filter(c => c.status !== "Offline" && c.health > 0 && c.health < 80).length;

  return (
    <div className="status-container">
      {/* Header Info */}
      <div className="status-header-row">
        <div className="status-header-info">
          <span className="module-tag">Infrastructure</span>
          <h1>System Status</h1>
        </div>
      </div>

      {/* 6 Telemetry status panels */}
      <div className="status-telemetry-grid">
        <div className="status-telemetry-card green">
          <span>Cameras Online</span>
          <h2>{onlineCount}</h2>
        </div>
        <div className="status-telemetry-card red">
          <span>Cameras Offline</span>
          <h2>{offlineCount}</h2>
        </div>
        <div className="status-telemetry-card amber">
          <span>Partially Working</span>
          <h2>{partiallyCount}</h2>
        </div>
        <div className="status-telemetry-card green">
          <span>Network</span>
          <h2 className="text-value">Stable</h2>
        </div>
        <div className="status-telemetry-card green">
          <span>Database</span>
          <h2 className="text-value">Healthy</h2>
        </div>
        <div className="status-telemetry-card green">
          <span>Server</span>
          <h2 className="text-value">Online</h2>
        </div>
      </div>

      {/* Camera Health Table panel */}
      <div className="status-panel-card">
        <h3>Camera Status</h3>
        
        <div className="status-table-container">
          <table className="status-health-table">
            <thead>
              <tr>
                <th>Camera</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((cam) => (
                <tr key={cam.id}>
                  <td>
                    <div className={`camera-cell ${cam.status === "Offline" ? "offline-node" : ""}`}>
                      <FiVideo /> {cam.id}
                    </div>
                  </td>
                  <td style={{ color: cam.status === "Offline" ? "#94a3b8" : "inherit" }}>
                    {cam.location}
                  </td>
                  <td>
                    <span className={`badge ${getHealthStatusBadgeClass(cam.health, cam.status)}`}>
                      {getHealthStatus(cam.health, cam.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

export default SystemStatus;