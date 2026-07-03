import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import SidebarLogo from "./SidebarLogo";
import SidebarMenu from "./SidebarMenu";
import SidebarFooter from "./SidebarFooter";
import { useTheme } from "../../context/ThemeContext";

function Sidebar({ onLogout }) {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <aside className="sidebar">
      <SidebarLogo />

      <SidebarMenu />

      {/* Operator Card & Actions */}
      <div className="sidebar-operator-section">
        <div className="operator-badge-card" onClick={() => navigate("/profile")} title="View Operator Profile">
          <div className="operator-avatar-pill">OP</div>
          <div className="operator-badge-info">
            <span className="operator-name">Operator Kumar</span>
            <span className="operator-badge-id">Operator • TS-14801</span>
          </div>
        </div>

        <div className="operator-actions-row">
          <button type="button" className="btn-sidebar-action" onClick={onLogout}>
            <FiLogOut /> <span>Logout</span>
          </button>
        </div>
      </div>

      <SidebarFooter />
    </aside>
  );
}

export default Sidebar;