export function AppLogo({ className = "w-10 h-10", size = 40 }: { className?: string; size?: number }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_4px_12px_rgba(123,136,255,0.35)] transition-transform duration-300 hover:scale-105"
      >
        <defs>
          <linearGradient id="m3GradPrimary" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7b88ff" />
            <stop offset="50%" stopColor="#9373ee" />
            <stop offset="100%" stopColor="#38e08c" />
          </linearGradient>
          <linearGradient id="m3GradAccent" x1="16" y1="20" x2="48" y2="52" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#d1d5ff" stopOpacity="0.8" />
          </linearGradient>
          <filter id="m3Glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Squircle Background Base */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx="18"
          fill="url(#m3GradPrimary)"
        />

        {/* Inner Surface Glass Mask */}
        <rect
          x="5"
          y="5"
          width="54"
          height="54"
          rx="16"
          fill="#13131a"
          fillOpacity="0.88"
        />

        {/* Android Bot Head / Build Dome */}
        {/* Antenna 1 */}
        <line x1="24" y1="20" x2="20" y2="14" stroke="#7b88ff" strokeWidth="2.5" strokeLinecap="round" />
        {/* Antenna 2 */}
        <line x1="40" y1="20" x2="44" y2="14" stroke="#38e08c" strokeWidth="2.5" strokeLinecap="round" />

        {/* Android Head Dome */}
        <path
          d="M20 28 C20 21.3726 25.3726 16 32 16 C38.6274 16 44 21.3726 44 28 Z"
          fill="url(#m3GradAccent)"
        />

        {/* Eyes */}
        <circle cx="26" cy="23.5" r="1.8" fill="#13131a" />
        <circle cx="38" cy="23.5" r="1.8" fill="#13131a" />

        {/* Building Gear / Compilation Core Cube */}
        <rect
          x="19"
          y="31"
          width="26"
          height="21"
          rx="5"
          fill="#7b88ff"
          fillOpacity="0.18"
          stroke="#7b88ff"
          strokeWidth="1.8"
        />

        {/* Fast Lightning / Build Spark */}
        <path
          d="M33 33 L26 42 H32 L30 50 L38 41 H32 L34 33 Z"
          fill="#38e08c"
          filter="url(#m3Glow)"
        />

        {/* Corner Pro badge dot */}
        <circle cx="51" cy="13" r="3.5" fill="#38e08c" />
      </svg>
    </div>
  );
}
