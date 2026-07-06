import React from "react";

function Logo({ className = "logo-img", size = 32 }) {
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
      {/* Abstract Intersecting Network / Integration Rings */}
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

      {/* Central Integration Node & Connections */}
      <line x1="50" y1="38" x2="36" y2="60" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
      <line x1="36" y1="60" x2="64" y2="60" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
      <line x1="64" y1="60" x2="50" y2="38" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />

      {/* Linked Vertices (Nodes) */}
      <circle cx="50" cy="38" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="36" cy="60" r="4.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="64" cy="60" r="4.5" fill="#06b6d4" stroke="#ffffff" strokeWidth="1.5" />
      <circle cx="50" cy="52" r="3.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />

      {/* Gradients */}
      <defs>
        {/* Ring 1 Gradient */}
        <linearGradient id="ringGold" x1="50" y1="18" x2="50" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="fillGold" x1="50" y1="18" x2="50" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Ring 2 Gradient */}
        <linearGradient id="ringBlue" x1="36" y1="40" x2="36" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="fillBlue" x1="36" y1="40" x2="36" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* Ring 3 Gradient */}
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

export default Logo;
