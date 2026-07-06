import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import FaceRecognition from "../pages/FaceRecognition";
import Anomalies from "../pages/Anomalies";
import AnomalyDetail from "../pages/AnomalyDetail";
import AIAssistant from "../pages/AIAssistant";
import SystemStatus from "../pages/SystemStatus";
import NotificationConfig from "../pages/NotificationConfig";
import Settings from "../pages/Settings";
import OperatorProfile from "../pages/OperatorProfile";
import AlertDetail from "../pages/AlertDetail";

function AppRoutes({ onLogout }) {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/frs" element={<FaceRecognition />} />
      <Route path="/anomalies" element={<Anomalies />} />
      <Route path="/anomalies/:type" element={<AnomalyDetail />} />
      <Route path="/alerts/:id" element={<AlertDetail />} />
      <Route path="/assistant" element={<AIAssistant />} />
      <Route path="/system-status" element={<SystemStatus />} />
      <Route
        path="/notifications"
        element={<NotificationConfig />}
      />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<OperatorProfile onLogout={onLogout} />} />
    </Routes>
  );
}

export default AppRoutes;