export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: { w: 120, h: 28 }, md: { w: 160, h: 36 }, lg: { w: 220, h: 48 } };
  const d = dims[size];

  return (
    <div className="flex items-center gap-2" style={{ height: d.h }}>
      <svg
        width={d.h}
        height={d.h}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00D9FF" />
          </linearGradient>
        </defs>
        {/* Circuit pulse icon */}
        <circle cx="24" cy="24" r="22" stroke="url(#pulseGrad)" strokeWidth="2.5" fill="none" opacity="0.15" />
        <circle cx="24" cy="24" r="16" stroke="url(#pulseGrad)" strokeWidth="1.5" fill="none" opacity="0.1" />
        {/* Heartbeat/pulse line */}
        <polyline
          points="4,24 12,24 16,24 19,14 22,34 25,10 28,38 31,18 34,24 38,24 44,24"
          stroke="url(#pulseGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Circuit nodes */}
        <circle cx="12" cy="24" r="2" fill="#0066FF" />
        <circle cx="38" cy="24" r="2" fill="#00D9FF" />
        <circle cx="25" cy="10" r="1.5" fill="#0066FF" />
        <circle cx="28" cy="38" r="1.5" fill="#00D9FF" />
        {/* Circuit traces */}
        <line x1="25" y1="10" x2="25" y2="4" stroke="#0066FF" strokeWidth="1" opacity="0.5" />
        <line x1="28" y1="38" x2="28" y2="44" stroke="#00D9FF" strokeWidth="1" opacity="0.5" />
        <rect x="23.5" y="2" width="3" height="3" rx="0.5" fill="#0066FF" opacity="0.4" />
        <rect x="26.5" y="43" width="3" height="3" rx="0.5" fill="#00D9FF" opacity="0.4" />
      </svg>
      <div className="flex flex-col leading-none">
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: size === "sm" ? 16 : size === "md" ? 20 : 28,
            background: "linear-gradient(135deg, #0066FF, #00D9FF)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          TechPulse
        </span>
        {size !== "sm" && (
          <span
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 400,
              fontSize: size === "md" ? 9 : 11,
              color: "#6B7280",
              letterSpacing: "0.08em",
              marginTop: 1,
            }}
          >
            Sua conexao com o futuro
          </span>
        )}
      </div>
    </div>
  );
}
