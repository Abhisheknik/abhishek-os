"use client";
import { portfolio } from "@/data/portfolio";
import { FadeUp, Stagger, StaggerItem } from "@/components/ui/ScrollReveal";

type Experience = (typeof portfolio.experience)[number];

const EXP_META: Record<string, { color: string; bg: string; tags: string[]; current?: boolean; logo?: string }> = {
  iMocha: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    current: true,
    logo: "/imocha-logo.gif",
    tags: ["C#", ".NET 8", "SQL Server", "Angular", "Azure", "Playwright", "REST APIs"],
  },
  "Alphansol Pvt. Ltd.": {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    tags: ["PHP", "CodeIgniter", "MySQL", "SEO"],
  },
  "Probity": {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    tags: ["Flutter", "Dart", "REST APIs", "GANs", "API Testing"],
  },
  "Hacktoberfest": {
    color: "#f97316",
    bg: "rgba(249,115,22,0.08)",
    logo: "/hacktoberfest-logo.svg",
    tags: ["Open Source", "Git", "Node.js", "Problem Solving"],
  },
  "Microsoft": {
    color: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    logo: "/microsoft-logo.svg",
    tags: ["Azure", "AI", "Cybersecurity", "GitHub", "Unity"],
  },
};

// Bold numbers/metrics inside a highlight string
function HighlightText({ text }: { text: string }) {
  const parts = text.split(/(\d[\d,+KkMm%]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\d[\d,+KkMm%]+$/.test(part) ? (
          <span key={i} className="font-bold text-[var(--text)]">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ExperienceSection({ experience }: { experience?: readonly Experience[] }) {
  const items = experience ?? portfolio.experience;
  return (
    <section className="mt-14">
      <FadeUp>
        <div className="mb-6 text-xs tracking-widest text-[var(--muted)]">EXPERIENCE</div>
      </FadeUp>

      <Stagger className="space-y-4">
        {items.map((exp) => {
          const meta = EXP_META[exp.company] ?? { color: "var(--accent)", bg: "var(--accent-soft)", tags: [] };
          const initial = exp.company.charAt(0).toUpperCase();

          return (
            <StaggerItem key={exp.company}>
              <div
                className="rounded-xl border p-5 sm:p-6 transition-colors group"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = meta.color)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                {/* Header row */}
                <div className="flex items-start gap-4 mb-4">
                  {/* Company badge */}
                  <div
                    className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden border"
                    style={{ backgroundColor: meta.logo ? "#fff" : meta.bg, borderColor: `${meta.color}33` }}
                  >
                    {meta.logo ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={meta.logo} alt={exp.company} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-sm font-bold" style={{ color: meta.color }}>{initial}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="font-bold text-base text-[var(--text)]">{exp.company}</span>
                      {meta.current && (
                        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-widest"
                          style={{ backgroundColor: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] pulse" />
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="text-sm" style={{ color: meta.color }}>{exp.role}</div>
                  </div>

                  <div className="shrink-0 text-right text-xs text-[var(--muted)] hidden sm:block">
                    <div>{exp.period}</div>
                    <div className="mt-0.5 opacity-70">{exp.location}</div>
                  </div>
                </div>

                {/* Period on mobile */}
                <div className="text-xs text-[var(--muted)] mb-3 sm:hidden">{exp.period} · {exp.location}</div>

                {/* Highlights */}
                <ul className="space-y-2 mb-4">
                  {exp.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-2.5 text-xs leading-6 text-[var(--muted)]">
                      <span className="shrink-0 mt-0.5" style={{ color: meta.color }}>→</span>
                      <HighlightText text={h} />
                    </li>
                  ))}
                </ul>

                {/* Tech tags */}
                {meta.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--border)]">
                    {meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded px-2 py-0.5 text-[10px] border"
                        style={{ backgroundColor: meta.bg, color: meta.color, borderColor: `${meta.color}22` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}
