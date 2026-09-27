"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowRight, ChevronRight } from "lucide-react";
import { runAgentQuery } from "@/lib/agent/tools";
import type { AgentResult, View } from "@/types";

async function fetchAgentResult(query: string): Promise<AgentResult> {
  const res = await fetch("/api/agent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Agent API error: ${res.status}`);
  const data = await res.json() as { result: AgentResult };
  return data.result;
}

const SUGGESTIONS = [
  "Show me your strongest AI project",
  "What have you built at scale?",
  "What is your .NET experience?",
  "Why should I hire you?",
];

const PLACEHOLDERS = [
  "Show me your strongest AI project…",
  "What have you built at scale?",
  "Would you fit an AI Engineer role?",
  "Explain your .NET experience…",
  "What backend skills do you have?",
  "Why should I hire you?",
];

interface AgentChatProps {
  onNavigate?: (view: View, projectId?: string) => void;
}

export default function AgentChat({ onNavigate }: AgentChatProps) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<AgentResult | null>(null);
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [running, setRunning] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);

  // Cycle placeholder text every 3 seconds when input is empty
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (q: string) => {
    if (!q.trim() || fetching) return;
    setQuery(q);
    setResult(null);
    setVisibleSteps(0);
    setRunning(false);
    setError(null);
    setFetching(true);

    try {
      const r = await fetchAgentResult(q);
      setResult(r);
      setRunning(true);
    } catch {
      const r = runAgentQuery(q);
      setResult(r);
      setRunning(true);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!running || !result) return;
    if (visibleSteps >= result.steps.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setVisibleSteps((n) => n + 1), 280);
    return () => clearTimeout(t);
  }, [running, result, visibleSteps]);

  const showAnswer = !running && result && visibleSteps >= result.steps.length;

  // suppress unused error state lint
  void error;

  return (
    <div className="w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(query);
        }}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--panel)] px-4 transition-colors focus-within:border-[var(--accent)]">
          <Bot size={18} className="shrink-0 text-[var(--muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Ask the portfolio agent"
            placeholder={query === "" ? PLACEHOLDERS[placeholderIdx] : ""}
            className="min-w-0 flex-1 bg-transparent py-4 text-sm outline-none placeholder:transition-opacity placeholder:duration-500"
          />
        </div>
        <button
          type="submit"
          disabled={fetching}
          className="shrink-0 flex items-center gap-2 rounded-lg border border-[var(--accent)] px-5 py-4 text-sm font-semibold text-[var(--accent)] whitespace-nowrap transition hover:bg-[var(--accent-soft)] focus-visible:ring-2 focus-visible:ring-[var(--accent)] disabled:opacity-40"
        >
          {fetching ? (
            <>
              <span className="pulse h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              THINKING
            </>
          ) : (
            <>ASK AGENT <ArrowRight size={14} /></>
          )}
        </button>
      </form>

      {/* Suggestion chips */}
      <div className="mt-4">
        <div className="mb-2 text-[10px] uppercase tracking-[.2em] text-[var(--muted)]">Try asking →</div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSubmit(s)}
              className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Fetching skeleton */}
      {fetching && (
        <div className="mt-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel)] p-5">
          <div className="flex items-center gap-2 text-xs text-[var(--accent)]">
            <Bot size={13} />
            <span className="tracking-widest">AGENT EXECUTION</span>
            <span className="pulse ml-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          </div>
          <div className="mt-4 space-y-2">
            {["Parsing intent", "Searching portfolio knowledge", "Composing response"].map((s) => (
              <div key={s} className="flex items-center gap-3 text-xs text-[var(--muted)]">
                <span className="pulse h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result panel */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--panel)]"
            aria-live="polite"
            aria-label="Agent result"
          >
            <div className="border-b border-[var(--border)] px-5 py-3">
              <div className="flex items-center gap-2 text-xs text-[var(--accent)]">
                <Bot size={13} />
                <span className="tracking-widest">AGENT EXECUTION</span>
                {running && <span className="pulse ml-1 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />}
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2">
                {result.steps.slice(0, visibleSteps).map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 text-xs"
                  >
                    <span className="mt-0.5 shrink-0 text-[var(--accent)]">✓</span>
                    <span className="text-[var(--text)]">{step.label}</span>
                    {step.tool && (
                      <span className="ml-auto shrink-0 font-mono text-[var(--muted)]">[{step.tool}]</span>
                    )}
                    {step.detail && !step.tool && (
                      <span className="ml-auto shrink-0 text-[var(--muted)]">[{step.detail}]</span>
                    )}
                  </motion.div>
                ))}
              </div>

              <AnimatePresence>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="mt-5 border-t border-[var(--border)] pt-5"
                  >
                    <div className="mb-2 text-xs tracking-widest text-[var(--muted)]">RESULT</div>
                    <p className="whitespace-pre-line text-sm leading-7 text-[var(--text)]">
                      {result.answer}
                    </p>
                    {result.action && onNavigate && (
                      <button
                        onClick={() =>
                          onNavigate(result.action!.target, result.action!.projectId)
                        }
                        className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2.5 text-xs hover:border-[var(--accent)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                      >
                        EXPLORE <ChevronRight size={13} />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
