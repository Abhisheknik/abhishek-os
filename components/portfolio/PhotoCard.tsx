"use client";

// Placeholder photos from picsum.photos (swap seeds for real Pinterest photos later)
const PHOTO_SEEDS = [
  { seed: "arch1", id: 1 },
  { seed: "travel2", id: 2 },
  { seed: "street3", id: 3 },
  { seed: "nature4", id: 4 },
];

const VIDEO_SEEDS = [
  { seed: "cinema1", id: 5 },
  { seed: "film2", id: 6 },
  { seed: "urban3", id: 7 },
  { seed: "light4", id: 8 },
];

interface Props {
  icon: string;
  label: string;
  detail: string;
  type: "photo" | "video";
  pinterestUrl?: string;
}

export default function PhotoCard({ icon, label, detail, type, pinterestUrl = "#" }: Props) {
  const seeds = type === "photo" ? PHOTO_SEEDS : VIDEO_SEEDS;

  const accentColor = type === "photo" ? "#f59e0b" : "#38bdf8";
  const accentSoft = type === "photo" ? "rgba(245,158,11,0.08)" : "rgba(56,189,248,0.08)";
  const watermark = type === "photo" ? "◎" : "▶";

  return (
    <div
      className="relative rounded-xl overflow-hidden group cursor-pointer transition-colors"
      style={{
        minHeight: "140px",
        border: `1px solid var(--border)`,
        backgroundColor: "var(--card)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = accentColor)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
    >
      {/* Default state */}
      <div className="p-5 transition-opacity duration-300 group-hover:opacity-0 group-hover:pointer-events-none h-full">
        {/* Watermark */}
        <div className="absolute right-4 top-4 text-[56px] font-bold leading-none select-none pointer-events-none opacity-[0.06]"
          style={{ color: accentColor }} aria-hidden>{watermark}</div>
        {/* Icon badge */}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-base border"
          style={{ backgroundColor: accentSoft, borderColor: `${accentColor}33` }}>
          {icon}
        </div>
        <div className="text-sm font-bold text-[var(--text)] mb-1">{label}</div>
        <div className="text-xs leading-5 text-[var(--muted)]">{detail}</div>
        <div className="mt-3 text-[10px] tracking-widest opacity-60 transition-colors" style={{ color: accentColor }}>
          HOVER TO PREVIEW →
        </div>
      </div>

      {/* Hover state — photo grid */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="grid grid-cols-2 gap-0.5 h-full">
          {seeds.map(({ seed }, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={i}
              src={`https://picsum.photos/seed/${seed}/200/150`}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ))}
        </div>

        {/* Bottom gradient + link */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 flex items-end justify-between">
          <span className="text-[10px] font-semibold text-white/90 tracking-[.15em] uppercase">{label}</span>
          <a
            href={pinterestUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] text-white/80 tracking-widest hover:text-white transition"
          >
            PINTEREST →
          </a>
        </div>
      </div>
    </div>
  );
}
