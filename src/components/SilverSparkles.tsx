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

const SPARKLE_COUNT = 55;

const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
  const size = 1.5 + rand() * 4;
  return {
    key: i,
    left: rand() * 100,
    top: rand() * 100,
    size,
    twinkleDuration: 2 + rand() * 4,
    twinkleDelay: rand() * 6,
    driftDuration: 6 + rand() * 10,
    driftX: (rand() - 0.5) * 40,
    driftY: (rand() - 0.5) * 40,
    opacity: 0.5 + rand() * 0.5,
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
          key={s.key}
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
    </div>
  );
}
