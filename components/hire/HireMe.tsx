"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound } from "lucide-react";
import { evaluateRoleFit } from "@/lib/agent/tools";
import type { RoleFitResult } from "@/types";

const ROLES = ["AI Engineer", "Backend Engineer", ".NET Developer", "Software Engineer"];
const PRIORITIES = [".NET", "AI", "Backend", "Cloud", "APIs", "RAG", "Automation"];

export default function HireMe() {
  const [role, setRole] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<RoleFitResult | null>(null);

  const togglePriority = (p: string) => {
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
  };

  const handleAnalyze = () => {
    if (!role) return;
    setResult(evaluateRoleFit(role, selected));
  };

  const handleReset = () => {
    setRole(null);
    setSelected([]);
    setResult(null);
  };

  const dotScore = (score: number) =>
    "●".repeat(score) + "○".repeat(5 - score);

  return (
    <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center gap-2 text-xs tracking-widest text-[var(--accent)]">
        <UserRound size={13} /> ROLE FIT ANALYZER
      </div>

      {!result ? (
        <div className="mt-4 space-y-5">
          <div>
            <div className="mb-3 text-xs text-[var(--muted)]">WHAT ROLE ARE YOU HIRING FOR?</div>
            <div className="flex flex-wrap gap-2">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-xl border px-4 py-2.5 text-sm focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    role === r
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]"
                  }`}
                  aria-pressed={role === r}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs text-[var(--muted)]">PRIORITIES (OPTIONAL)</div>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={`rounded-full border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    selected.includes(p)
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
                  }`}
                  aria-pressed={selected.includes(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!role}
            className="rounded-xl bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold hover:opacity-80 disabled:opacity-40 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            ANALYZE FIT
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5"
          >
            <div className="mb-1 text-xs tracking-widest text-[var(--muted)]">ROLE MATCH</div>
            <div className="text-2xl font-semibold">{result.role.toUpperCase()}</div>
            <div className="mt-1 text-sm text-[var(--accent)]">{result.overall}</div>

            <div className="mt-5 space-y-3">
              {result.scores.map((s, i) => (
                <motion.div
                  key={s.dimension}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.25 }}
                  className="flex items-center gap-3 text-sm"
                >
                  <span className="w-20 shrink-0 text-xs text-[var(--muted)]">{s.dimension}</span>
                  <span className="font-mono text-xs tracking-widest text-[var(--accent)]">
                    {dotScore(s.score)}
                  </span>
                  <span className="text-xs text-[var(--text)]">{s.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <div className="mb-3 text-xs tracking-widest text-[var(--muted)]">EVIDENCE</div>
              <ul className="space-y-2 text-xs">
                {result.evidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 text-[var(--accent)]">→</span>
                    <span className="text-[var(--text)]">{e}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 text-[10px] leading-5 text-[var(--muted)]">
              ⚠ HEURISTIC ESTIMATE — Scores are based on portfolio evidence, not a validated assessment methodology.
            </p>

            <button
              onClick={handleReset}
              className="mt-4 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              ANALYZE ANOTHER ROLE
            </button>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
