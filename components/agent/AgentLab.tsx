"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Zap, ChevronRight } from "lucide-react";
import { runAgentQuery, getProject } from "@/lib/agent/tools";
import type { AgentResult, View } from "@/types";
import Badge from "@/components/ui/Badge";

interface AgentLabProps {
  onNavigate?: (view: View, projectId?: string) => void;
}

const PRESETS = [
  { label: "Find project for AI Engineer", query: "Show me your strongest AI project" },
  { label: "Evaluate backend skills", query: "What is your backend stack?" },
  { label: "Surprise me", query: "surprise me" },
];

export default function AgentLab({ onNavigate }: AgentLabProps) {
  const [task, setTask] = useState("");
  const [result, setResult] = useState<AgentResult | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [running, setRunning] = useState(false);

  const handleRun = (query?: string) => {
    const q = query ?? task;
    setResult(null);
    setVisibleSteps(0);
    setRunning(true);
    const r = runAgentQuery(q || "surprise me");
    setResult(r);
  };

  useEffect(() => {
    if (!running || !result) return;
    if (visibleSteps >= result.steps.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setVisibleSteps((n) => n + 1), 300);
    return () => clearTimeout(t);
  }, [running, result, visibleSteps]);

  const showAnswer = !running && result && visibleSteps >= result.steps.length;
  const project = result?.projectId ? getProject(result.projectId) : null;

  return (
    <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setTask(p.query);
              handleRun(p.query);
            }}
            className="rounded-xl border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {p.label}
          </button>
        ))}
      </div>

      <textarea
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="min-h-28 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        placeholder="Find my strongest project for an AI Engineer role..."
        aria-label="Agent task input"
      />

      <button
        onClick={() => handleRun()}
        disabled={running}
        className="mt-3 flex items-center gap-2 rounded-xl bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold hover:opacity-80 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <Play size={14} /> {running ? "RUNNING..." : "RUN AGENT"}
      </button>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5"
          >
            <div className="mb-4 flex items-center gap-2 text-xs tracking-widest text-[var(--accent)]">
              <Zap size={12} />
              AGENT EXECUTION
              {running && <span className="pulse ml-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
            </div>

            <div className="space-y-2">
              {result.steps.slice(0, visibleSteps).map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs"
                >
                  <span className="shrink-0 text-[var(--accent)]">✓</span>
                  <span className="text-[var(--text)]">{step.label}</span>
                  {step.tool && (
                    <span className="ml-auto font-mono text-[10px] text-[var(--muted)]">[{step.tool}]</span>
                  )}
                  {step.detail && !step.tool && (
                    <span className="ml-auto text-[10px] text-[var(--muted)]">[{step.detail}]</span>
                  )}
                </motion.div>
              ))}
            </div>

            <AnimatePresence>
              {showAnswer && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.15 }}
                  className="mt-5 border-t border-[var(--border)] pt-5"
                >
                  <div className="mb-2 text-xs tracking-widest text-[var(--muted)]">RESULT</div>

                  {project ? (
                    <div>
                      <div className="text-base font-semibold">{project.name}</div>
                      <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                        {project.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((t) => (
                          <Badge key={t} variant="muted">{t}</Badge>
                        ))}
                      </div>
                      {onNavigate && (
                        <button
                          onClick={() => onNavigate("projects", project.id)}
                          className="mt-4 flex items-center gap-2 text-xs text-[var(--accent)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                        >
                          VIEW PROJECT <ChevronRight size={13} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <p className="whitespace-pre-line text-sm leading-7 text-[var(--text)]">
                      {result.answer}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
