export function StaticLayoutBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="sl-diamond"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M20 2 L38 20 L20 38 L2 20 Z"
              stroke="hsl(25 65% 45%)"
              strokeWidth="0.6"
              fill="none"
              opacity="0.2"
            />
          </pattern>

          <pattern
            id="sl-dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="12"
              cy="12"
              r="1.1"
              fill="hsl(25 65% 45%)"
              opacity="0.13"
            />
          </pattern>

          <clipPath id="sl-clip-tr">
            <rect x="864" y="0" width="576" height="320" />
          </clipPath>

          <clipPath id="sl-clip-bl">
            <rect x="0" y="580" width="430" height="320" />
          </clipPath>
        </defs>

        <rect width="1440" height="900" fill="url(#sl-dots)" opacity="0.55" />

        <rect
          x="864"
          y="0"
          width="576"
          height="320"
          fill="url(#sl-diamond)"
          clipPath="url(#sl-clip-tr)"
          opacity="0.65"
        />

        <path
          d="M1440 0 Q1440 280 1180 340 Q1060 370 980 480 L1440 480 Z"
          fill="hsl(25 65% 45%)"
          opacity="0.065"
        />

        <path
          d="M1340 0 Q1330 140 1230 210 Q1150 265 1090 320"
          stroke="hsl(30 15% 72%)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M1390 0 Q1380 170 1265 245 Q1180 295 1110 355"
          stroke="hsl(30 15% 72%)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M1440 30 Q1400 180 1295 260 Q1210 320 1140 380"
          stroke="hsl(25 65% 45%)"
          strokeWidth="0.9"
          fill="none"
          opacity="0.22"
        />

        <path
          d="M1440 0 A200 200 0 0 0 1240 0 L1240 0 Z"
          fill="hsl(15 70% 50%)"
          opacity="0.055"
        />
        <path
          d="M1440 0 A200 200 0 0 0 1240 0"
          stroke="hsl(15 70% 50%)"
          strokeWidth="1.1"
          fill="none"
          opacity="0.28"
        />
        <path
          d="M1440 0 A140 140 0 0 0 1300 0"
          stroke="hsl(15 70% 50%)"
          strokeWidth="0.6"
          fill="none"
          opacity="0.18"
        />

        <circle cx="1360" cy="55" r="3" fill="hsl(25 65% 45%)" opacity="0.22" />
        <circle cx="1395" cy="90" r="2" fill="hsl(25 65% 45%)" opacity="0.16" />
        <circle
          cx="1345"
          cy="110"
          r="2.5"
          fill="hsl(15 70% 50%)"
          opacity="0.2"
        />
        <circle
          cx="1380"
          cy="145"
          r="1.5"
          fill="hsl(25 65% 45%)"
          opacity="0.14"
        />
        <circle
          cx="1420"
          cy="170"
          r="2"
          fill="hsl(15 70% 50%)"
          opacity="0.15"
        />

        <rect
          x="0"
          y="580"
          width="430"
          height="320"
          fill="url(#sl-diamond)"
          clipPath="url(#sl-clip-bl)"
          opacity="0.65"
        />

        <path
          d="M0 900 Q0 620 260 560 Q380 530 460 420 L0 420 Z"
          fill="hsl(25 65% 45%)"
          opacity="0.065"
        />

        <path
          d="M100 900 Q110 760 210 690 Q290 635 350 580"
          stroke="hsl(30 15% 72%)"
          strokeWidth="0.8"
          fill="none"
          opacity="0.55"
        />
        <path
          d="M50 900 Q60 740 170 665 Q255 610 320 550"
          stroke="hsl(30 15% 72%)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
        />
        <path
          d="M0 870 Q40 720 145 645 Q230 585 300 525"
          stroke="hsl(25 65% 45%)"
          strokeWidth="0.9"
          fill="none"
          opacity="0.22"
        />

        <path
          d="M0 900 A200 200 0 0 1 200 900 L200 900 Z"
          fill="hsl(15 70% 50%)"
          opacity="0.055"
        />
        <path
          d="M0 900 A200 200 0 0 1 200 900"
          stroke="hsl(15 70% 50%)"
          strokeWidth="1.1"
          fill="none"
          opacity="0.28"
        />
        <path
          d="M0 900 A140 140 0 0 1 140 900"
          stroke="hsl(15 70% 50%)"
          strokeWidth="0.6"
          fill="none"
          opacity="0.18"
        />

        <circle cx="80" cy="845" r="3" fill="hsl(25 65% 45%)" opacity="0.22" />
        <circle cx="45" cy="810" r="2" fill="hsl(25 65% 45%)" opacity="0.16" />
        <circle cx="95" cy="790" r="2.5" fill="hsl(15 70% 50%)" opacity="0.2" />
        <circle
          cx="60"
          cy="755"
          r="1.5"
          fill="hsl(25 65% 45%)"
          opacity="0.14"
        />
        <circle cx="20" cy="730" r="2" fill="hsl(15 70% 50%)" opacity="0.15" />

        <path
          d="M0 0 Q120 0 120 120 L0 120 Z"
          fill="hsl(25 65% 45%)"
          opacity="0.05"
        />
        <path
          d="M0 0 Q85 0 85 85"
          stroke="hsl(30 15% 72%)"
          strokeWidth="0.6"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M0 0 Q52 0 52 52"
          stroke="hsl(15 70% 50%)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.18"
        />

        <path
          d="M1440 900 Q1320 900 1320 780 L1440 780 Z"
          fill="hsl(25 65% 45%)"
          opacity="0.05"
        />
        <path
          d="M1440 900 Q1355 900 1355 815"
          stroke="hsl(30 15% 72%)"
          strokeWidth="0.6"
          fill="none"
          opacity="0.45"
        />
        <path
          d="M1440 900 Q1388 900 1388 852"
          stroke="hsl(15 70% 50%)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.18"
        />

        {[72, 1354].map((x, i) => (
          <g key={i}>
            <rect
              x={x - 2}
              y="48"
              width="16"
              height="13"
              rx="1.5"
              fill="hsl(25 65% 45%)"
              opacity="0.1"
            />
            <rect
              x={x - 3}
              y="47"
              width="18"
              height="15"
              rx="2"
              stroke="hsl(30 15% 72%)"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </g>
        ))}
        {[72, 1354].map((x, i) => (
          <g key={i}>
            <rect
              x={x - 2}
              y="839"
              width="16"
              height="13"
              rx="1.5"
              fill="hsl(25 65% 45%)"
              opacity="0.1"
            />
            <rect
              x={x - 3}
              y="838"
              width="18"
              height="15"
              rx="2"
              stroke="hsl(30 15% 72%)"
              strokeWidth="0.5"
              fill="none"
              opacity="0.5"
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
