"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Bot, Cloud, Wrench } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import type { LucideIcon } from "lucide-react";

type NodeKey = "BACKEND" | "AI / LLM" | "CLOUD" | "TOOLS";

const NODES: { key: NodeKey; icon: LucideIcon; skills: readonly string[] }[] = [
  { key: "BACKEND", icon: Cpu, skills: [...portfolio.skills.Backend, ...portfolio.skills.Languages] },
  { key: "AI / LLM", icon: Bot, skills: portfolio.skills.AI },
  { key: "CLOUD", icon: Cloud, skills: portfolio.skills["Cloud & DevOps"] },
  { key: "TOOLS", icon: Wrench, skills: portfolio.skills["Testing & Tools"] },
];

export default function AgentNetwork() {
  const [selected, setSelected] = useState<NodeKey>("BACKEND");
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const node = NODES.find((n) => n.key === selected)!;
  const evidence = activeSkill ? portfolio.skillEvidence[activeSkill] ?? [] : [];

  const getProjectName = (id: string) =>
    portfolio.projects.find((p) => p.id === id)?.name ?? id;

  return (
    <div className="mt-5 space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {NODES.map((n) => {
          const Icon = n.icon;
          const active = selected === n.key;
          return (
            <button
              key={n.key}
              onClick={() => { setSelected(n.key); setActiveSkill(null); }}
              className={`rounded-2xl border p-5 text-left transition focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                active
                  ? "border-[var(--accent)] bg-gradient-to-br from-[var(--accent-soft)] to-transparent"
                  : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]"
              }`}
              aria-pressed={active}
            >
              <Icon size={19} className={active ? "text-[var(--accent)]" : "text-[var(--muted)]"} />
              <div className="mt-3 text-sm font-semibold">{n.key}</div>
              <div className="mt-1 text-xs text-[var(--muted)]">{n.skills.length} skills</div>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5"
        >
          <div className="text-xs tracking-widest text-[var(--muted)]">CAPABILITIES — {selected}</div>
          <div className="mt-4 flex flex-wrap gap-2">
            {node.skills.map((skill) => {
              const hasEvidence = (portfolio.skillEvidence[skill]?.length ?? 0) > 0;
              const isActive = activeSkill === skill;
              return (
                <button
                  key={skill}
                  onClick={() => setActiveSkill(isActive ? null : skill)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    isActive
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : hasEvidence
                      ? "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)]"
                  }`}
                  aria-pressed={isActive}
                >
                  {skill}
                  {hasEvidence && <span className="ml-1.5 text-[var(--accent)]">→</span>}
                </button>
              );
            })}
          </div>

          <AnimatePresence>
            {activeSkill && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 overflow-hidden border-t border-[var(--border)] pt-4"
              >
                <div className="text-xs tracking-widest text-[var(--muted)]">EVIDENCE FOR {activeSkill.toUpperCase()}</div>
                {evidence.length > 0 ? (
                  <div className="mt-3 space-y-2">
                    {evidence.map((id) => (
                      <div key={id} className="flex items-center gap-2 text-sm">
                        <span className="text-[var(--accent)]">→</span>
                        <span>{getProjectName(id)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-[var(--muted)]">
                    No project evidence recorded for this skill yet.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
