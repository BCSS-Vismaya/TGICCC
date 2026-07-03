import {
  FiGrid,
  FiUser,
  FiAlertTriangle,
  FiCpu,
  FiActivity,
  FiBell,
  FiSettings,
} from "react-icons/fi";

const NAVIGATION = [
  {
    title: "Dashboard",
    icon: FiGrid,
    path: "/",
  },
  {
    title: "Face Recognition",
    icon: FiUser,
    path: "/frs",
  },
  {
    title: "Anomalies",
    icon: FiAlertTriangle,
    path: "/anomalies",
  },
  {
    title: "AI Assistant",
    icon: FiCpu,
    path: "/assistant",
  },
  {
    title: "System Status",
    icon: FiActivity,
    path: "/system-status",
  },
  {
    title: "Notification Configuration",
    icon: FiBell,
    path: "/notifications",
  },
  {
    title: "Settings",
    icon: FiSettings,
    path: "/settings",
  },
];

export default NAVIGATION;