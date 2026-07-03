import { useState } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff, FiShield, FiLock as FiSecureLock } from "react-icons/fi";
import toast, { Toaster } from "react-hot-toast";

function Login({ onLogin }) {
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
        {/* Telangana Police Logo Shield Header */}
        <div className="login-header-group">
          {/* Custom Styled Police Shield Vector Graphic */}
          <svg className="login-shield-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Gold Shield Boundary */}
            <path d="M50 10 C80 15, 90 35, 90 65 C90 95, 70 110, 50 115 C30 110, 10 95, 10 65 C10 35, 20 15, 50 10 Z" fill="#20353F" stroke="#c29d38" strokeWidth="4" />
            {/* Inner Shield Fill Grid */}
            <path d="M50 15 C75 19, 84 37, 84 65 C84 90, 67 104, 50 109 C33 104, 16 90, 16 65 C16 37, 25 19, 50 15 Z" fill="#1b2a32" />
            {/* State Emblem Ashoka Pillar representation */}
            <g transform="translate(36, 32) scale(0.6)">
              {/* Lion Capital Silhouette in Gold */}
              <path d="M20 10 H28 V24 H20 Z M15 24 H33 V32 H15 Z M20 32 H28 V56 H20 Z" fill="#c29d38" />
              <circle cx='24' cy='18' r='7' fill='#c29d38'/>
              <circle cx='15' cy='28' r='5' fill='#c29d38'/>
              <circle cx='33' cy='28' r='5' fill='#c29d38'/>
              <rect x='10' y='56' width='28' height='6' fill='#c29d38' rx='2'/>
            </g>
            {/* Telangana Text Ribbon */}
            <path d="M20 90 Q50 98 80 90" fill="none" stroke="#c29d38" strokeWidth="8" strokeLinecap="round" />
            <text x="50" y="93" fill="#1b2a32" fontSize="6.5" fontWeight="900" textAnchor="middle" letterSpacing="0.2">TELANGANA POLICE</text>
          </svg>

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
      </div>
    </div>
  );
}

export default Login;
