import bcssLogo from "../../assets/logos/BcssLogo.png";

function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <div className="powered-by-section">
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