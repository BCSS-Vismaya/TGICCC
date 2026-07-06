import { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield, FiLock as FiSecureLock } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import bcssLogo from "../assets/logos/BcssLogo.png";
import Logo from "../components/common/Logo";

function Login({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Please enter both administrative credentials");
      return;
    }

    // Mock validation
    toast.success("Security token verified. Access granted.");
    setTimeout(() => {
      onLogin();
      navigate("/");
    }, 800);
  };

  const handleForgotPassword = () => {
    toast.info("Password recovery request sent to Central System Administrator.");
  };

  return (
    <div className="login-viewport">
      <Toaster position="top-right" />
      <div className="login-grid-overlay"></div>

      <div className="login-card">
        {/* Telangana Police Logo Header */}
        <div className="login-header-group">
          <div className="login-logo-container">
            <Logo size={60} />
          </div>

          <div className="login-titles">
            <span>Telangana Police</span>
            <h2>TGICCC Portal Gateway</h2>
            <p>Traffic & Geo-Integrated Command & Control Centre</p>
          </div>
        </div>

        {/* Security badge */}
        <div className="security-gateway-badge">
          <FiSecureLock /> SECURE INTEL GATEWAY • AUTHENTICATED ACCESS
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-wrapper">
            <label htmlFor="username">Username</label>
            <div className="login-field-box">
              <FiUser className="prefix-icon" />
              <input
                id="username"
                type="text"
                placeholder="Enter administrative username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          <div className="login-input-wrapper">
            <label htmlFor="password">Password</label>
            <div className="login-field-box">
              <FiLock className="prefix-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter secure password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn-eye-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="login-remember-checkbox">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            
            <span onClick={handleForgotPassword} className="login-forgot-link">
              Forgot Password?
            </span>
          </div>

          <button type="submit" className="btn-login-submit">
            Access Portal Securely
          </button>
        </form>

        {/* Secure Disclaimer Footnote */}
        <div className="login-disclaimer">
          <strong>WARNING:</strong> Authorized personnel access only. Unauthorized entry attempts will be logged and prosecuted under the <strong>Information Technology (IT) Act</strong>.
        </div>

        {/* Powered by Branding inside the Login Card */}
        <div className="login-powered-by">
          <span className="login-powered-by-label">Powered by</span>
          <div className="login-powered-by-card">
            <img 
              src={bcssLogo} 
              alt="Blue Cloud Softech Solutions" 
              className="login-powered-by-logo" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
