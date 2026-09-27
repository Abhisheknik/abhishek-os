"use client";

import { portfolio } from "@/data/portfolio";
import { Stagger, StaggerItem, FadeUp } from "@/components/ui/ScrollReveal";

// Mini pipeline flow component
function PipelineFlow({ nodes, color }: { nodes: { label: string; sub?: string }[]; color: string }) {
  return (
    <div className="flex items-center gap-0 overflow-x-auto pb-1 select-none">
      {nodes.map((n, i) => (
        <div key={n.label} className="flex items-center shrink-0">
          <div className="flex flex-col items-center gap-1">
            <div className="rounded px-2 py-1 text-[9px] font-bold tracking-widest border"
              style={{ backgroundColor: `${color}12`, borderColor: `${color}40`, color }}>
              {n.label}
            </div>
            {n.sub && <div className="text-[8px]" style={{ color: n.sub === "SSE" || n.sub === "✓" ? "#4ade80" : "#9090b0" }}>{n.sub}</div>}
          </div>
          {i < nodes.length - 1 && (
            <div className="w-6 h-px mx-0.5 shrink-0" style={{ backgroundColor: `${color}30` }} />
          )}
        </div>
      ))}
    </div>
  );
}

const PROJECT_ACCENT: Record<string, { color: string; bg: string; glow: string }> = {
  "multi-agent-support": { color: "#a78bfa", bg: "rgba(167,139,250,0.06)", glow: "rgba(167,139,250,0.15)" },
  "data-extraction":     { color: "#38bdf8", bg: "rgba(56,189,248,0.06)",  glow: "rgba(56,189,248,0.12)" },
  "megan-ai-hub":        { color: "#34d399", bg: "rgba(52,211,153,0.06)",  glow: "rgba(52,211,153,0.12)" },
};

type ProjectMeta = {
  metrics: [string, string][];
  flow: { label: string; sub?: string }[];
};

const PROJECT_META: Record<string, ProjectMeta> = {
  "multi-agent-support": {
    metrics: [["75%","token saved"],["4","agent rounds"],["3","LLM providers"]],
    flow: [
      { label:"USER", sub:"query" }, { label:"INTENT" }, { label:"RAG", sub:"sqlite" },
      { label:"TOOLS", sub:"gemini" }, { label:"STREAM", sub:"SSE" },
    ],
  },
  "data-extraction": {
    metrics: [["OCR","pytesseract"],["Regex","pipeline"],["Streamlit","dashboard"]],
    flow: [
      { label:"INPUT", sub:"document" }, { label:"OCR", sub:"image→text" },
      { label:"REGEX", sub:"extract" }, { label:"PANDAS", sub:"transform" },
      { label:"EXPORT", sub:"✓" },
    ],
  },
  "megan-ai-hub": {
    metrics: [["8+","AI tools"],["2","platforms"],["1","unified app"]],
    flow: [
      { label:"USER", sub:"mobile" }, { label:"ROUTER", sub:"intent" },
      { label:"AI APIs", sub:"GPT/Gemini" }, { label:"FIREBASE", sub:"storage" },
      { label:"OUTPUT", sub:"✓" },
    ],
  },
};

interface Props {
  onOpen: (id: string) => void;
  projects?: typeof portfolio.projects;
}

export default function ProjectCards({ onOpen, projects }: Props) {
  const all = projects ?? portfolio.projects;
  const featured = all.find((p) => "featured" in p && p.featured);
  const rest = all.filter((p) => !("featured" in p && p.featured));

  return (
    <div className="mt-2 space-y-3">
      {/* ── Featured hero card ── */}
      {featured && (() => {
        const acc = PROJECT_ACCENT[featured.id] ?? PROJECT_ACCENT["multi-agent-support"];
        return (
          <FadeUp>
            <button
              onClick={() => onOpen(featured.id)}
              className="w-full text-left rounded-xl border overflow-hidden group transition-all"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = acc.color;
                e.currentTarget.style.boxShadow = `0 0 32px ${acc.glow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Banner */}
              <div
                className="relative px-6 pt-5 pb-4 overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${acc.bg} 0%, transparent 100%)` }}
              >
                {/* Decorative grid dots */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(${acc.color} 1px, transparent 1px)`,
                  backgroundSize: "24px 24px",
                }} />

                <div className="relative flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-bold tracking-[.25em] px-2 py-0.5 rounded-full border"
                        style={{ color: acc.color, borderColor: `${acc.color}50`, backgroundColor: `${acc.color}15` }}>
                        FEATURED PROJECT
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-[#4ade80] tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] pulse" /> LIVE
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[var(--text)] leading-tight max-w-lg">{featured.name}</h3>
                  </div>

                  {/* Impact metrics */}
                  <div className="flex gap-3 shrink-0">
                    {[["75%", "token saved"], ["4", "agent rounds"], ["3", "LLM providers"]].map(([val, label]) => (
                      <div key={label} className="text-center">
                        <div className="text-base font-bold" style={{ color: acc.color }}>{val}</div>
                        <div className="text-[9px] text-[var(--muted)] leading-tight">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Architecture flow */}
                <PipelineFlow nodes={PROJECT_META["multi-agent-support"].flow} color={acc.color} />
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <p className="text-xs leading-6 text-[var(--muted)] mb-4 max-w-2xl">{featured.description}</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {featured.tags.map((t) => (
                      <span key={t} className="rounded border px-2 py-0.5 text-[10px]"
                        style={{ borderColor: `${acc.color}30`, color: acc.color, backgroundColor: `${acc.color}10` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {"live" in featured && featured.live && (
                      <a
                        href={featured.live as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1.5 text-[10px] font-semibold tracking-widest px-2.5 py-1 rounded-full border transition-colors"
                        style={{ color: "#4ade80", borderColor: "rgba(74,222,128,0.35)", backgroundColor: "rgba(74,222,128,0.08)" }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] pulse" />
                        LIVE DEMO
                      </a>
                    )}
                    <span className="text-[10px] font-semibold tracking-widest transition-colors"
                      style={{ color: acc.color }}>
                      VIEW PROJECT →
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </FadeUp>
        );
      })()}

      {/* ── Other projects — same visual weight as featured ── */}
      <Stagger className="space-y-3" staggerDelay={0.08}>
        {rest.map((p) => {
          const acc  = PROJECT_ACCENT[p.id] ?? { color: "#38bdf8", bg: "rgba(56,189,248,0.06)", glow: "rgba(56,189,248,0.12)" };
          const meta = PROJECT_META[p.id];
          return (
            <StaggerItem key={p.id}>
              <button
                onClick={() => onOpen(p.id)}
                className="w-full text-left rounded-xl border overflow-hidden transition-all"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--card)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = acc.color;
                  e.currentTarget.style.boxShadow = `0 0 32px ${acc.glow}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Banner — same as featured */}
                <div className="relative px-6 pt-5 pb-4 overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${acc.bg} 0%, transparent 100%)` }}>
                  {/* Dot grid */}
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `radial-gradient(${acc.color} 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }} />

                  <div className="relative flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[9px] font-bold tracking-[.25em] px-2 py-0.5 rounded-full border"
                          style={{ color: acc.color, borderColor: `${acc.color}50`, backgroundColor: `${acc.color}15` }}>
                          PROJECT
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-[var(--text)] leading-tight">{p.name}</h3>
                    </div>

                    {/* Metrics */}
                    {meta && (
                      <div className="flex gap-4 shrink-0">
                        {meta.metrics.map(([val, label]) => (
                          <div key={label} className="text-center">
                            <div className="text-base font-bold" style={{ color: acc.color }}>{val}</div>
                            <div className="text-[9px] text-[var(--muted)] leading-tight">{label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pipeline flow */}
                  {meta && <PipelineFlow nodes={meta.flow} color={acc.color} />}
                </div>

                {/* Body */}
                <div className="px-6 py-4">
                  <p className="text-xs leading-6 text-[var(--muted)] mb-4 max-w-2xl">{p.description}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded border px-2 py-0.5 text-[10px]"
                          style={{ borderColor: `${acc.color}30`, color: acc.color, backgroundColor: `${acc.color}10` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] font-semibold tracking-widest" style={{ color: acc.color }}>
                      VIEW PROJECT →
                    </span>
                  </div>
                </div>
              </button>
            </StaggerItem>
          );
        })}
      </Stagger>
    </div>
  );
}
