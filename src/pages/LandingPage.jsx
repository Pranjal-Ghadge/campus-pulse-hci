import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Handshake, Megaphone, Menu, X, ArrowUpRight, ShieldCheck, UserCheck } from "lucide-react";
import { useStudent } from "../context/StudentContext";

/**
 * High-fidelity architectural blueprint & schematic SVG of the iconic VJTI Central Clock Tower (Matunga, Mumbai).
 * Rendered with authentic technical CAD/blueprint lines, elevation grid, dimension markers, and watermark styling.
 */
function VJTIClockTowerBlueprint() {
  return (
    <svg
      viewBox="0 0 1200 900"
      aria-hidden="true"
      className="pointer-events-none absolute right-0 top-0 h-full w-full select-none object-cover object-right opacity-[0.22] sm:opacity-[0.26] md:opacity-[0.28] lg:opacity-[0.32]"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Architectural drafting grid */}
        <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1d4ed8" strokeWidth="0.5" strokeOpacity="0.15" />
          <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#1e40af" strokeWidth="0.8" strokeOpacity="0.25" />
        </pattern>
        {/* Diagonal architectural hatching */}
        <pattern id="archHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="8" stroke="#1e3a8a" strokeWidth="0.75" strokeOpacity="0.25" />
        </pattern>
      </defs>

      {/* Background blueprint grid */}
      <rect width="1200" height="900" fill="url(#archGrid)" />

      {/* Technical Schematic Dimensioning & Grid Axis Callouts */}
      <g stroke="#1d4ed8" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.6">
        {/* Vertical Centerline of Clock Tower */}
        <line x1="920" y1="60" x2="920" y2="860" />
        {/* Horizontal Elevation Levels */}
        <line x1="680" y1="120" x2="1160" y2="120" />
        <line x1="680" y1="210" x2="1160" y2="210" />
        <line x1="680" y1="320" x2="1160" y2="320" />
        <line x1="680" y1="420" x2="1160" y2="420" />
        <line x1="680" y1="540" x2="1160" y2="540" />
        <line x1="560" y1="660" x2="1160" y2="660" />
        <line x1="480" y1="810" x2="1160" y2="810" />
      </g>

      {/* Dimension Line & Measurement Annotations on Right Margin */}
      <g stroke="#1e40af" strokeWidth="1" opacity="0.75">
        <line x1="1140" y1="120" x2="1140" y2="810" />
        <line x1="1132" y1="120" x2="1148" y2="120" />
        <line x1="1132" y1="210" x2="1148" y2="210" />
        <line x1="1132" y1="320" x2="1148" y2="320" />
        <line x1="1132" y1="420" x2="1148" y2="420" />
        <line x1="1132" y1="540" x2="1148" y2="540" />
        <line x1="1132" y1="660" x2="1148" y2="660" />
        <line x1="1132" y1="810" x2="1148" y2="810" />
      </g>
      <g fill="#1e3a8a" fontSize="10" fontFamily="monospace" opacity="0.75">
        <text x="1155" y="124">+48.50M FINIAL</text>
        <text x="1155" y="214">+41.20M DOME</text>
        <text x="1155" y="324">+33.80M BELFRY</text>
        <text x="1155" y="424">+24.00M CLOCK</text>
        <text x="1155" y="544">+16.50M BALCONY</text>
        <text x="1155" y="664">+8.20M ROOF</text>
        <text x="1155" y="814">±0.00M PLINTH</text>
      </g>

      {/* Blueprint Title Block (Architectural Metadata) */}
      <g stroke="#1e3a8a" strokeWidth="1" opacity="0.6">
        <rect x="760" y="830" width="370" height="50" fill="#ffffff" fillOpacity="0.4" />
        <line x1="760" y1="855" x2="1130" y2="855" />
        <line x1="970" y1="830" x2="970" y2="880" />
      </g>
      <g fill="#1e3a8a" fontSize="8.5" fontFamily="monospace" opacity="0.8">
        <text x="770" y="847" fontWeight="bold">PROJECT: VJTI CENTRAL QUADRANGLE</text>
        <text x="770" y="872">DWG: MAIN TOWER ELEVATION SCHEMATIC</text>
        <text x="980" y="847">ESTD: 1887 MATUNGA</text>
        <text x="980" y="872">SCALE: 1:100 | REV-04</text>
      </g>

      {/* Symmetrical Campus Wings (East / West Building Blocks) */}
      <g stroke="#1e3a8a" strokeWidth="1.2" opacity="0.85">
        {/* West Wing Facade */}
        <rect x="520" y="660" width="310" height="150" />
        {/* Parapet Balustrade West */}
        <line x1="520" y1="645" x2="830" y2="645" />
        <line x1="520" y1="660" x2="830" y2="660" />
        {[535, 555, 575, 595, 615, 635, 655, 675, 695, 715, 735, 755, 775, 795, 815].map((x) => (
          <line key={`bal-w-${x}`} x1={x} y1="645" x2={x} y2="660" strokeWidth="0.8" />
        ))}
        {/* West Arched Windows - Upper Tier */}
        {[550, 610, 670, 730, 790].map((x) => (
          <g key={`win-u-${x}`}>
            <path d={`M ${x} 720 L ${x} 695 A 16 16 0 0 1 ${x + 32} 695 L ${x + 32} 720 Z`} />
            <line x1={x + 16} y1="680" x2={x + 16} y2="720" strokeWidth="0.75" />
            <line x1={x} y1="702" x2={x + 32} y2="702" strokeWidth="0.75" />
          </g>
        ))}
        {/* West Ground Floor Rectangular Arched Windows */}
        {[550, 610, 670, 730, 790].map((x) => (
          <g key={`win-g-${x}`}>
            <rect x={x} y="745" width="32" height="40" />
            <line x1={x + 16} y1="745" x2={x + 16} y2="785" strokeWidth="0.75" />
            <line x1={x} y1="765" x2={x + 32} y2="765" strokeWidth="0.75" />
          </g>
        ))}

        {/* East Wing Facade */}
        <rect x="1010" y="660" width="120" height="150" />
        <line x1="1010" y1="645" x2="1130" y2="645" />
        <line x1="1010" y1="660" x2="1130" y2="660" />
        {[1025, 1045, 1065, 1085, 1105, 1125].map((x) => (
          <line key={`bal-e-${x}`} x1={x} y1="645" x2={x} y2="660" strokeWidth="0.8" />
        ))}
        {[1030, 1080].map((x) => (
          <g key={`win-e-${x}`}>
            <path d={`M ${x} 720 L ${x} 695 A 16 16 0 0 1 ${x + 32} 695 L ${x + 32} 720 Z`} />
            <rect x={x} y="745" width="32" height="40" />
          </g>
        ))}

        {/* Continuous Plinth & Ground Rustication Courses */}
        <line x1="480" y1="810" x2="1140" y2="810" strokeWidth="2" />
        <line x1="480" y1="820" x2="1140" y2="820" strokeWidth="1" />
        <line x1="480" y1="830" x2="1140" y2="830" strokeWidth="1.5" />
      </g>

      {/* MAIN CENTRAL TOWER STRUCTURE (X = 830 to 1010, Center = 920) */}
      <g stroke="#1e3a8a" strokeWidth="1.4" opacity="0.95">
        {/* Tower Main Base (Level 0 - Level 2) */}
        <rect x="830" y="540" width="180" height="270" fill="#ffffff" fillOpacity="0.25" />

        {/* Quoin Masonry Blocks on Outer Corners */}
        {[550, 580, 610, 640, 670, 700, 730, 760].map((y, idx) => (
          <React.Fragment key={`quoin-${y}`}>
            <rect x="830" y={y} width={idx % 2 === 0 ? 18 : 10} height="18" fill="url(#archHatch)" />
            <rect x={1010 - (idx % 2 === 0 ? 18 : 10)} y={y} width={idx % 2 === 0 ? 18 : 10} height="18" fill="url(#archHatch)" />
          </React.Fragment>
        ))}

        {/* Monumental Entrance Portal (Base) */}
        <path d="M 885 810 L 885 750 A 35 35 0 0 1 955 750 L 955 810 Z" strokeWidth="1.75" />
        <path d="M 895 810 L 895 755 A 25 25 0 0 1 945 755 L 945 810 Z" strokeWidth="1" />
        {/* Portal Keystone */}
        <polygon points="915,712 925,712 928,724 912,724" fill="#1e3a8a" fillOpacity="0.3" />

        {/* Mid-Tower Decorative Arched Lancet Windows (Stage 2) */}
        <g strokeWidth="1.2">
          {/* Center Tall Arched Lancet Window */}
          <path d="M 905 640 L 905 580 A 15 15 0 0 1 935 580 L 935 640 Z" />
          <line x1="920" y1="565" x2="920" y2="640" strokeWidth="0.8" />
          <line x1="905" y1="605" x2="935" y2="605" strokeWidth="0.8" />
          {/* Left Flanking Window */}
          <path d="M 870 635 L 870 590 A 10 10 0 0 1 890 590 L 890 635 Z" />
          {/* Right Flanking Window */}
          <path d="M 950 635 L 950 590 A 10 10 0 0 1 970 590 L 970 635 Z" />
        </g>

        {/* Balcony Balustrade Course below Clock Stage */}
        <line x1="820" y1="540" x2="1020" y2="540" strokeWidth="2.5" />
        <line x1="825" y1="525" x2="1015" y2="525" strokeWidth="1.2" />
        {[835, 850, 865, 880, 895, 910, 925, 940, 955, 970, 985, 1000].map((x) => (
          <line key={`balc-${x}`} x1={x} y1="525" x2={x} y2="540" strokeWidth="0.8" />
        ))}

        {/* CLOCK STAGE (Stage 3, Y = 320 to 525) */}
        <rect x="840" y="340" width="160" height="185" fill="#ffffff" fillOpacity="0.3" />
        {/* Side decorative columns */}
        <line x1="850" y1="340" x2="850" y2="525" strokeWidth="1" strokeDasharray="6 2" />
        <line x1="990" y1="340" x2="990" y2="525" strokeWidth="1" strokeDasharray="6 2" />

        {/* Classical Pediment above Clock Face */}
        <polygon points="920,345 855,385 985,385" strokeWidth="1.5" fill="#ffffff" fillOpacity="0.4" />
        <polygon points="920,352 865,383 975,383" strokeWidth="0.8" />

        {/* CENTRAL CLOCK DIAL - High Detail Architectural Face */}
        <circle cx="920" cy="445" r="48" strokeWidth="2.5" fill="#ffffff" fillOpacity="0.8" />
        <circle cx="920" cy="445" r="42" strokeWidth="1" />
        <circle cx="920" cy="445" r="38" strokeWidth="0.6" strokeDasharray="1.5 2" />

        {/* 12 Hour Radial Markers (Roman Numeral Ticks) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 920 + 35 * Math.sin(rad);
          const y1 = 445 - 35 * Math.cos(rad);
          const x2 = 920 + 41 * Math.sin(rad);
          const y2 = 445 - 41 * Math.cos(rad);
          const isMajor = deg % 90 === 0;
          return (
            <line
              key={`hour-${deg}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={isMajor ? 2 : 1}
              stroke="#1e3a8a"
            />
          );
        })}

        {/* Clock Hands Set at 10:10 (Prestigious Institutional Time) */}
        {/* Hour Hand pointing towards 10 o'clock */}
        <line x1="920" y1="445" x2="904" y2="430" strokeWidth="2.5" stroke="#1e3a8a" strokeLinecap="round" />
        {/* Minute Hand pointing towards 2 o'clock */}
        <line x1="920" y1="445" x2="940" y2="425" strokeWidth="1.75" stroke="#1e3a8a" strokeLinecap="round" />
        {/* Center Pivot Boss */}
        <circle cx="920" cy="445" r="3.5" fill="#1e3a8a" />

        {/* Cornice Dentil Band below Belfry */}
        <line x1="835" y1="340" x2="1005" y2="340" strokeWidth="2.5" />
        <line x1="840" y1="330" x2="1000" y2="330" strokeWidth="1.2" />
        {[845, 855, 865, 875, 885, 895, 905, 915, 925, 935, 945, 955, 965, 975, 985, 995].map((x) => (
          <line key={`dentil-${x}`} x1={x} y1="330" x2={x} y2="340" strokeWidth="1.5" />
        ))}

        {/* BELFRY / LANTERN STAGE (Stage 4, Y = 210 to 330) */}
        <rect x="855" y="220" width="130" height="110" fill="#ffffff" fillOpacity="0.4" />
        {/* Triple Arched Belfry Openings */}
        {/* Center Bell Arch */}
        <path d="M 905 320 L 905 260 A 15 15 0 0 1 935 260 L 935 320 Z" strokeWidth="1.5" />
        {/* Left Arch */}
        <path d="M 870 320 L 870 270 A 10 10 0 0 1 890 270 L 890 320 Z" strokeWidth="1.2" />
        {/* Right Arch */}
        <path d="M 950 320 L 950 270 A 10 10 0 0 1 970 270 L 970 320 Z" strokeWidth="1.2" />

        {/* Horizontal Bell Acoustic Louvers */}
        {[275, 285, 295, 305, 315].map((y) => (
          <line key={`louver-${y}`} x1="907" y1={y} x2="933" y2={y} strokeWidth="0.8" />
        ))}

        {/* DOME & CUPOLA (Top Stage, Y = 110 to 220) */}
        {/* Dome Base Ring */}
        <line x1="850" y1="220" x2="990" y2="220" strokeWidth="2.5" />
        {/* Curving Gothic/Colonial Dome Ribs */}
        <path
          d="M 855 220 C 855 160, 900 135, 920 135 C 940 135, 985 160, 985 220 Z"
          strokeWidth="2"
          fill="#ffffff"
          fillOpacity="0.3"
        />
        {/* Vertical Dome Structural Ribs */}
        <path d="M 875 220 C 875 175, 905 145, 920 135" strokeWidth="1" strokeDasharray="3 1" />
        <path d="M 965 220 C 965 175, 935 145, 920 135" strokeWidth="1" strokeDasharray="3 1" />
        <line x1="920" y1="135" x2="920" y2="220" strokeWidth="1.2" />

        {/* SPIRE, CUPOLA FINIAL & LIGHTNING CONDUCTOR */}
        <polygon points="920,95 914,135 926,135" fill="#1e3a8a" fillOpacity="0.5" strokeWidth="1.2" />
        <line x1="920" y1="70" x2="920" y2="95" strokeWidth="2" />
        <circle cx="920" cy="80" r="4.5" fill="#1e3a8a" fillOpacity="0.8" />
        <line x1="913" y1="80" x2="927" y2="80" strokeWidth="1.5" />
      </g>
    </svg>
  );
}

/**
 * High-fidelity, institutional line illustration of university students collaborating
 * (inspired by image_1 layout at bottom-center-left).
 */
function StudentCollaborationIllustration() {
  return (
    <svg
      viewBox="0 0 540 280"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-4 sm:left-12 lg:left-24 h-48 sm:h-56 md:h-64 w-auto select-none opacity-40 sm:opacity-50 md:opacity-60 transition-opacity"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background whiteboard / presentation screen */}
      <rect x="120" y="30" width="180" height="120" rx="6" fill="#f0f7ff" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.6" />
      <rect x="135" y="45" width="70" height="70" rx="3" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.5" />
      <line x1="220" y1="55" x2="280" y2="55" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <line x1="220" y1="70" x2="270" y2="70" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <line x1="220" y1="85" x2="285" y2="85" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      <line x1="220" y1="100" x2="255" y2="100" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />

      {/* Desk surface */}
      <path d="M 20 220 L 460 220 L 480 235 L 0 235 Z" fill="#e2e8f0" stroke="#1e3a8a" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="60" y1="235" x2="60" y2="280" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.4" />
      <line x1="420" y1="235" x2="420" y2="280" stroke="#1e3a8a" strokeWidth="2" strokeOpacity="0.4" />

      {/* Open Laptop on Desk */}
      <g stroke="#1e3a8a" strokeWidth="1.5" fill="#ffffff">
        <path d="M 170 220 L 190 175 L 245 175 L 235 220 Z" fill="#eff6ff" />
        <line x1="160" y1="220" x2="245" y2="220" strokeWidth="3" strokeLinecap="round" />
        <rect x="195" y="185" width="30" height="20" rx="2" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1" strokeOpacity="0.7" />
      </g>

      {/* Student 1 (Left - seated at laptop, wearing glasses) */}
      <g stroke="#1e3a8a" strokeWidth="1.75" fill="#ffffff">
        {/* Head & Hair */}
        <circle cx="95" cy="120" r="18" fill="#ffffff" />
        <path d="M 80 115 Q 95 95 112 110 Q 110 120 102 120 Q 90 112 80 115 Z" fill="#1e3a8a" />
        {/* Glasses */}
        <circle cx="102" cy="122" r="5" fill="none" strokeWidth="1.2" />
        <path d="M 98 122 L 94 122" strokeWidth="1.2" />
        {/* Body & Arms */}
        <path d="M 70 185 C 70 145 120 145 120 185 Z" fill="#bfdbfe" fillOpacity="0.7" />
        <path d="M 95 160 L 140 195 L 175 210" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Student 2 (Center - standing male pointing to discussion board) */}
      <g stroke="#1e3a8a" strokeWidth="1.75" fill="#ffffff">
        <circle cx="210" cy="95" r="18" fill="#ffffff" />
        <path d="M 195 90 Q 210 70 228 85 Q 225 100 215 95 Q 205 90 195 90 Z" fill="#1e3a8a" />
        <path d="M 180 170 C 180 120 240 120 240 170 Z" fill="#dbeafe" />
        {/* Gesturing arm */}
        <path d="M 215 130 L 165 110" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Student 3 (Center-Right - standing female with notebook) */}
      <g stroke="#1e3a8a" strokeWidth="1.75" fill="#ffffff">
        <circle cx="295" cy="90" r="18" fill="#ffffff" />
        {/* Long hair */}
        <path d="M 280 85 C 280 60 320 60 315 95 C 315 120 310 135 305 140 C 295 120 280 115 280 85 Z" fill="#1e3a8a" />
        <circle cx="295" cy="90" r="14" fill="#ffffff" />
        <path d="M 265 170 C 265 118 325 118 325 170 Z" fill="#bfdbfe" fillOpacity="0.8" />
        {/* Holding notebook/binder */}
        <rect x="295" y="140" width="22" height="30" rx="2" fill="#1e40af" fillOpacity="0.7" stroke="#1e3a8a" strokeWidth="1.2" transform="rotate(-15 295 140)" />
      </g>

      {/* Student 4 (Right - leaning in to collaborate) */}
      <g stroke="#1e3a8a" strokeWidth="1.75" fill="#ffffff">
        <circle cx="375" cy="125" r="18" fill="#ffffff" />
        <path d="M 360 120 Q 375 100 392 115 Q 390 130 380 125 Z" fill="#1e3a8a" />
        <path d="M 345 185 C 345 148 405 148 405 185 Z" fill="#1d4ed8" fillOpacity="0.85" />
        <path d="M 365 155 L 320 185" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function LandingPage() {
  const { profile } = useStudent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smart role-based / auth routing
  const grievancePath = profile ? "/report" : "/login";
  const explorePath = profile ? "/explore" : "/login";
  const homePath = profile
    ? ["staff", "admin"].includes(profile.role) ? "/staff" : "/dashboard"
    : "/";

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-x-hidden bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* ========================================================
          1. INSTITUTIONAL TOP NAVIGATION BAR
          ======================================================== */}
      <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Top Left: VJTI Official Oval Emblem */}
          <Link
            to="/"
            className="group flex items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 rounded-lg"
            aria-label="VJTI Campus Pulse homepage"
          >
            <img
              src="/vjti-logo.png"
              alt="Veermata Jijabai Technological Institute (VJTI) Mumbai Emblem"
              className="h-14 sm:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-102"
            />
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[13px] font-bold uppercase tracking-wider text-[#0c2340]">
                Veermata Jijabai
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                Technological Institute
              </span>
            </div>
          </Link>

          {/* Top Right: Main Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-8 lg:gap-10 text-[15px] font-medium"
          >
            <Link
              to="/"
              className="relative text-[#1e3a8a] font-semibold py-1 transition-colors hover:text-[#0c2340] after:absolute after:bottom-0 after:left-0 after:h-[2.5px] after:w-full after:rounded-full after:bg-[#1e3a8a]"
            >
              Home
            </Link>
            <Link
              to={explorePath}
              className="text-slate-700 py-1 transition-colors hover:text-[#1e3a8a]"
            >
              Campus Voice
            </Link>
            <Link
              to={grievancePath}
              className="text-slate-700 py-1 transition-colors hover:text-[#1e3a8a]"
            >
              Grievance Redressal
            </Link>
            <Link
              to="/help"
              className="text-slate-700 py-1 transition-colors hover:text-[#1e3a8a]"
            >
              Resources
            </Link>

            {/* User status badge / Portal entry */}
            {profile ? (
              <Link
                to={homePath}
                className="ml-2 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 text-xs font-semibold text-blue-900 transition hover:bg-blue-100"
              >
                <UserCheck size={14} className="text-[#1e3a8a]" />
                {profile.name || "Dashboard"}
              </Link>
            ) : (
              <Link
                to="/login"
                className="ml-2 inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-50/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Navigation Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-slate-200 bg-white px-5 py-4 shadow-lg md:hidden">
            <nav className="flex flex-col gap-3 text-base font-medium">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-[#1e3a8a] font-semibold bg-blue-50/60"
              >
                Home
              </Link>
              <Link
                to={explorePath}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#1e3a8a]"
              >
                Campus Voice
              </Link>
              <Link
                to={grievancePath}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#1e3a8a]"
              >
                Grievance Redressal
              </Link>
              <Link
                to="/help"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#1e3a8a]"
              >
                Resources
              </Link>
              {profile ? (
                <Link
                  to={homePath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-900 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                  <UserCheck size={16} /> Open Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-slate-50 py-2.5 text-sm font-semibold text-slate-800"
                >
                  Sign In to Portal
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* ========================================================
          2. HERO SECTION
          Subtle watermark architectural blueprint of VJTI Clock Tower
          overlaid with light, professional blue gradient
          ======================================================== */}
      <section className="relative flex flex-1 flex-col justify-center overflow-hidden bg-white px-5 py-12 sm:px-8 sm:py-16 md:py-20 lg:py-24">
        {/* Light Professional Blue Gradient Overlays */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/30"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 z-0 h-[650px] w-[650px] rounded-full bg-blue-100/35 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-[450px] w-[450px] rounded-full bg-slate-100/50 blur-2xl"
        />

        {/* Subtle Watermark Architectural Blueprint of VJTI Central Clock Tower */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <VJTIClockTowerBlueprint />
        </div>

        {/* Bottom Left Student Collaboration Illustration (from image_1) */}
        <div className="pointer-events-none absolute inset-0 z-0 hidden sm:block">
          <StudentCollaborationIllustration />
        </div>

        {/* Bottom Right Watermark Emblem (matching image_1 lower right watermark) */}
        {/* <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 right-6 sm:bottom-8 sm:right-16 z-0 select-none opacity-15 sm:opacity-20 md:opacity-25"
        >
          <img
            src="/vjti-logo.png"
            alt=""
            className="h-28 sm:h-36 md:h-44 w-auto object-contain filter grayscale contrast-125"
          />
        </div> */}

        {/* HERO CONTENT CONTAINER */}
        <div className="relative z-10 mx-auto w-full max-w-4xl text-center">
          {/* Main Header Text (large, bold, dark blue font) */}
          <h1 className="text-3xl font-bold tracking-tight text-[#0c2340] sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] leading-[1.18] sm:leading-[1.15]">
            VJTI Campus Pulse: A Voice for Every Student
          </h1>

          {/* Sub-Header Text (medium weight, professional blue font) */}
          <p className="mx-auto mt-5 max-w-2xl text-base font-normal leading-relaxed text-[#1e3a8a]/85 sm:mt-6 sm:text-lg md:text-xl sm:font-medium">
            Your unified platform for academic life, campus updates, and grievance redressal.
          </p>

          {/* Two-Button Call-to-Action Cluster */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-5">
            {/* Button 1: Solid red background with white text */}
            <Link
              to={grievancePath}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#b91c1c] px-7 py-3 text-base font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#991b1b] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
            >
              Raise a Grievance
            </Link>

            {/* Button 2: Blue outline, blue text */}
            <Link
              to={explorePath}
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg border-2 border-[#1e3a8a] bg-transparent px-7 py-3 text-base font-semibold text-[#1e3a8a] transition-all duration-200 hover:bg-[#1e3a8a]/5 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 sm:w-auto"
            >
              Explore Campus News
            </Link>
          </div>

          {/* Trust Badges: Handshake & Megaphone with text */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:mt-10 sm:gap-10 text-xs sm:text-sm font-medium text-slate-700">
            {/* Secure & Confidential */}
            <div className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[#1e3a8a]">
                <Handshake size={17} strokeWidth={2.2} />
              </span>
              <span>Secure &amp; Confidential</span>
            </div>

            {/* Powered by VJTI Student Council */}
            <div className="inline-flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-[#1e3a8a]">
                <Megaphone size={17} strokeWidth={2.2} />
              </span>
              <span>Powered by VJTI Student Council</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FOOTER BAR
          Solid deep blue, with small text links:
          "VJTI Official Website" | "Student Handbook" | "Contact Help Desk"
          and the copyright "© 2024 VJTI"
          ======================================================== */}
      <footer className="relative z-20 border-t border-blue-950/20 bg-[#0c2340] text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-4 text-xs sm:flex-row sm:px-8 sm:text-[13px] text-blue-100/90">
          {/* Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <a
              href="https://vjti.ac.in"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white hover:underline focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              VJTI Official Website
            </a>
            <span aria-hidden="true" className="text-blue-300/40">|</span>
            <Link
              to="/help"
              className="transition-colors hover:text-white hover:underline focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              Student Handbook
            </Link>
            <span aria-hidden="true" className="text-blue-300/40">|</span>
            <Link
              to="/help"
              className="transition-colors hover:text-white hover:underline focus:outline-none focus:ring-1 focus:ring-blue-300"
            >
              Contact Help Desk
            </Link>
          </div>

          {/* Copyright notice */}
          <div className="font-normal text-blue-200/80">
            &copy; 2024 VJTI
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
