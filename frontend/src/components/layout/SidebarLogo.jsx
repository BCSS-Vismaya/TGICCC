import appLogo from "../../assets/logos/AppLogo.png";

function SidebarLogo() {
  return (
    <div className="sidebar-logo">
      <div className="logo-icon">
        <img src={appLogo} alt="TGICCC Logo" className="logo-img" />
      </div>

      <div>
        <h2>TGICCC</h2>
        <p>Telangana Police</p>
      </div>
    </div>
  );
}

export default SidebarLogo;