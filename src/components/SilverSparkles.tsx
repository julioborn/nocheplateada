function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260814);

const SPARKLE_COUNT = 90;
const FLARE_COUNT = 22;

const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
  const size = 1 + rand() * 6.5;
  return {
    key: i,
    left: rand() * 100,
    top: rand() * 100,
    size,
    twinkleDuration: 1.4 + rand() * 4.5,
    twinkleDelay: rand() * 7,
    driftDuration: 5 + rand() * 10,
    driftX: (rand() - 0.5) * 40,
    driftY: (rand() - 0.5) * 40,
    opacity: 0.5 + rand() * 0.5,
  };
});

const flares = Array.from({ length: FLARE_COUNT }, (_, i) => {
  const size = 8 + rand() * 20;
  return {
    key: i,
    left: rand() * 100,
    top: rand() * 100,
    size,
    rotate: rand() * 60 - 30,
    flareDuration: 3 + rand() * 6,
    flareDelay: rand() * 8,
    driftDuration: 7 + rand() * 8,
    driftX: (rand() - 0.5) * 24,
    driftY: (rand() - 0.5) * 24,
  };
});

export default function SilverSparkles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, rgba(180,190,205,0.18), transparent 70%)",
          animation: "glow-pulse 6s ease-in-out infinite",
        }}
      />
      {sparkles.map((s) => (
        <span
          key={`d-${s.key}`}
          className="sparkle"
          style={
            {
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              "--twinkle-duration": `${s.twinkleDuration}s`,
              "--twinkle-delay": `${s.twinkleDelay}s`,
              "--drift-duration": `${s.driftDuration}s`,
              "--drift-x": `${s.driftX}px`,
              "--drift-y": `${s.driftY}px`,
              "--sparkle-opacity": s.opacity,
            } as React.CSSProperties
          }
        />
      ))}
      {flares.map((f) => (
        <svg
          key={`f-${f.key}`}
          viewBox="0 0 24 24"
          className="star-flare"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              "--flare-rotate": `${f.rotate}deg`,
              "--flare-duration": `${f.flareDuration}s`,
              "--flare-delay": `${f.flareDelay}s`,
              "--drift-duration": `${f.driftDuration}s`,
              "--drift-x": `${f.driftX}px`,
              "--drift-y": `${f.driftY}px`,
            } as React.CSSProperties
          }
        >
          <path
            d="M12 0.5 L14.4 9.6 L23.5 12 L14.4 14.4 L12 23.5 L9.6 14.4 L0.5 12 L9.6 9.6 Z"
            fill="#ffffff"
          />
        </svg>
      ))}
    </div>
  );
}
