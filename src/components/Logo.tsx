export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 170"
        className="absolute -top-6 w-full max-w-[420px] h-auto"
        aria-hidden
      >
        <defs>
          <linearGradient id="chrome-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8f97a3" />
            <stop offset="25%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#6b7280" />
            <stop offset="75%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#9ca3af" />
          </linearGradient>
        </defs>
        <path
          d="M 20 55 C 90 5, 310 5, 380 55"
          fill="none"
          stroke="url(#chrome-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 40 140 C 110 175, 290 175, 360 140"
          fill="none"
          stroke="url(#chrome-stroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g transform="translate(378, 30)">
          <path
            d="M0 -11 L2.4 -2.4 L11 0 L2.4 2.4 L0 11 L-2.4 2.4 L-11 0 L-2.4 -2.4 Z"
            fill="#ffffff"
          />
        </g>
      </svg>

      <h1
        className="shine-text relative bg-gradient-to-b from-zinc-300 via-white to-zinc-400 bg-clip-text font-extrabold uppercase italic tracking-tight text-transparent
        text-[3.4rem] leading-none sm:text-[5rem] drop-shadow-[0_2px_10px_rgba(180,190,210,0.35)]"
        style={{ fontStretch: "condensed" }}
      >
        Noche
      </h1>

      <div
        className="-mt-1 h-[3px] w-40 sm:w-56 rounded-full opacity-80"
        style={{
          background:
            "linear-gradient(to right, transparent, #7fb8ff, #ffffff, #7fb8ff, transparent)",
          boxShadow: "0 0 12px 1px rgba(120,180,255,0.6)",
        }}
      />

      <div className="mt-3 flex items-center gap-3 sm:gap-4">
        <span className="h-[6px] w-10 sm:w-14 border-t-2 border-b-2 border-zinc-400/70" />
        <span className="bg-gradient-to-b from-zinc-300 via-white to-zinc-400 bg-clip-text text-transparent font-semibold tracking-[0.45em] text-sm sm:text-base pl-1">
          PLATEADA
        </span>
        <span className="h-[6px] w-10 sm:w-14 border-t-2 border-b-2 border-zinc-400/70" />
      </div>
    </div>
  );
}
