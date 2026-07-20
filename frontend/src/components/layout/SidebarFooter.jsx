import bcssLogo from "../../assets/logos/BcssLogo.png";

function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <div className="system-status-indicator" style={{ marginTop: 0, paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", width: "100%" }}>
        <span className="pulse-dot"></span>
        <span>SYSTEM ONLINE</span>
      </div>

      <div className="powered-by-section" style={{ marginTop: "12px" }}>
        <span className="powered-by-label">Powered by</span>
        <div className="powered-by-card">
          <img 
            src={bcssLogo} 
            alt="Blue Cloud Softech Solutions" 
            className="powered-by-logo" 
          />
        </div>
      </div>
      
    </div>
  );
}

export default SidebarFooter;