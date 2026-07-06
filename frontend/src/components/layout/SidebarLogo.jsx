import Logo from "../common/Logo";

function SidebarLogo() {
  return (
    <div className="sidebar-logo">
      <div className="logo-icon">
        <Logo size={36} />
      </div>

      <div>
        <h2>TGICCC</h2>
        <p>Telangana Police</p>
      </div>
    </div>
  );
}

export default SidebarLogo;