import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiAlertTriangle,
  FiCpu,
  FiActivity,
  FiBell,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";

import ANOMALIES from "../../constants/anomalies";

function SidebarMenu() {
  const [openAnomalies, setOpenAnomalies] = useState(false);

  return (
    <nav className="sidebar-menu">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        <FiGrid />
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/frs"
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        <FiUser />
        <span>Face Recognition</span>
      </NavLink>

      <div
        className="menu-item"
        onClick={() => setOpenAnomalies(!openAnomalies)}
      >
        <FiAlertTriangle />
        <span>Anomalies</span>

        <div className="menu-arrow">
          {openAnomalies ? <FiChevronDown /> : <FiChevronRight />}
        </div>
      </div>

      {openAnomalies && (
        <div className="submenu">
          {ANOMALIES.map((item) => (
            <NavLink
    key={item}
    to={`/anomalies/${item
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
    className={({ isActive }) =>
        isActive ? "submenu-item active" : "submenu-item"
    }
>
              {item}
            </NavLink>
          ))}
        </div>
      )}

      <NavLink
        to="/assistant"
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        <FiCpu />
        <span>AI Assistant</span>
      </NavLink>

      <NavLink
        to="/system-status"
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        <FiActivity />
        <span>System Status</span>
      </NavLink>

      <NavLink
        to="/notifications"
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        <FiBell />
        <span>Notification Configuration</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? "menu-item active" : "menu-item"
        }
      >
        <FiSettings />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
}

export default SidebarMenu;