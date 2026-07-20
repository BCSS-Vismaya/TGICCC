import React from "react";

function Logo({ className = "logo-img", size = 32, variant = "venn" }) {
  if (variant === "venn") {
    // Return original abstract intersecting network logo
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ display: "block" }}
      >
        {/* Ring 1 - Top */}
        <circle 
          cx="50" 
          cy="38" 
          r="20" 
          stroke="url(#ringGold)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          fill="url(#fillGold)"
          fillOpacity="0.15"
        />
        {/* Ring 2 - Bottom Left */}
        <circle 
          cx="36" 
          cy="60" 
          r="20" 
          stroke="url(#ringBlue)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          fill="url(#fillBlue)"
          fillOpacity="0.15"
        />
        {/* Ring 3 - Bottom Right */}
        <circle 
          cx="64" 
          cy="60" 
          r="20" 
          stroke="url(#ringCyan)" 
          strokeWidth="3.5" 
          strokeLinecap="round"
          fill="url(#fillCyan)"
          fillOpacity="0.15"
        />
        <line x1="50" y1="38" x2="36" y2="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
        <line x1="36" y1="60" x2="64" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
        <line x1="64" y1="60" x2="50" y2="38" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
        <circle cx="50" cy="38" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="36" cy="60" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="64" cy="60" r="4.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="50" cy="52" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
        <defs>
          <linearGradient id="ringGold" x1="50" y1="18" x2="50" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
          <linearGradient id="fillGold" x1="50" y1="18" x2="50" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="ringBlue" x1="36" y1="40" x2="36" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="fillBlue" x1="36" y1="40" x2="36" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="ringCyan" x1="64" y1="40" x2="64" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
          <linearGradient id="fillCyan" x1="64" y1="40" x2="64" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Otherwise, render the official police-style badge logo (Default)
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "block" }}
    >
      {/* 8-pointed Gold Starburst/Sunburst Base */}
      {/* Created by overlaying two rounded squares rotated 45 degrees */}
      <rect 
        x="18" 
        y="18" 
        width="64" 
        height="64" 
        rx="8" 
        fill="url(#goldGrad)" 
        stroke="url(#goldStroke)"
        strokeWidth="1"
      />
      <rect 
        x="18" 
        y="18" 
        width="64" 
        height="64" 
        rx="8" 
        transform="rotate(45 50 50)" 
        fill="url(#goldGrad)" 
        stroke="url(#goldStroke)"
        strokeWidth="1"
      />

      {/* Inner Concentric Circle Shield (Deep Police Blue) */}
      <circle 
        cx="50" 
        cy="50" 
        r="28" 
        fill="url(#navyGrad)" 
        stroke="url(#goldStroke)" 
        strokeWidth="2.5" 
      />

      {/* Thin Crimson Red Accent Ring (represents protection/vigilance) */}
      <circle 
        cx="50" 
        cy="50" 
        r="21" 
        fill="none" 
        stroke="url(#redGrad)" 
        strokeWidth="2" 
      />

      {/* Central 5-pointed Gold Star */}
      <polygon 
        points="50,34 54,43 64,44 57,51 59,61 50,56 41,61 43,51 36,44 46,43" 
        fill="url(#goldStarGrad)" 
        stroke="url(#goldStarStroke)"
        strokeWidth="0.5"
      />

      {/* Defs / Gradients */}
      <defs>
        {/* Gold Starburst base gradient */}
        <linearGradient id="goldGrad" x1="18" y1="18" x2="82" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" /> {/* yellow-200 */}
          <stop offset="30%" stopColor="#eab308" /> {/* yellow-500 */}
          <stop offset="70%" stopColor="#ca8a04" /> {/* yellow-600 */}
          <stop offset="100%" stopColor="#854d0e" /> {/* yellow-800 */}
        </linearGradient>
        <linearGradient id="goldStroke" x1="18" y1="18" x2="82" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" opacity="0.6" />
          <stop offset="100%" stopColor="#a16207" opacity="0.8" />
        </linearGradient>

        {/* Navy/Blue Shield gradient */}
        <linearGradient id="navyGrad" x1="22" y1="22" x2="78" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a" /> {/* blue-900 */}
          <stop offset="50%" stopColor="#172554" /> {/* blue-950 */}
          <stop offset="100%" stopColor="#0b0f19" /> {/* dark-slate */}
        </linearGradient>

        {/* Crimson Red gradient */}
        <linearGradient id="redGrad" x1="29" y1="29" x2="71" y2="71" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" /> {/* red-500 */}
          <stop offset="100%" stopColor="#991b1b" /> {/* red-800 */}
        </linearGradient>

        {/* Center Star Gold gradient */}
        <linearGradient id="goldStarGrad" x1="36" y1="34" x2="64" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <linearGradient id="goldStarStroke" x1="36" y1="34" x2="64" y2="61" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Logo;
