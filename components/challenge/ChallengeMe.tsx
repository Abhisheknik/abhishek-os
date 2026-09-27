"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

const CHALLENGES = [
  {
    id: "api-rate-limit",
    question:
      "Design a rate-limited REST API endpoint in ASP.NET Core. What middleware would you use and why?",
    keywords: {
      architecture: ["middleware", "pipeline", "attribute", "filter", "decorator", "design"],
      depth: ["rate limit", "throttle", "asp.net", ".net", "memory cache", "distributed cache", "redis", "token bucket", "sliding window"],
      scalability: ["distributed", "redis", "horizontal", "cluster", "scale", "load"],
      communication: ["because", "would", "should", "approach", "implement", "explain"],
    },
  },
  {
    id: "sql-optimize",
    question:
      "You have a SQL query running slowly on a 20,000-row table. Walk through your optimization approach.",
    keywords: {
      architecture: ["index", "execution plan", "query plan", "schema", "denormalize", "partition"],
      depth: ["covering index", "seek", "scan", "statistics", "join", "where clause", "select *", "n+1"],
      scalability: ["pagination", "cache", "archive", "partition", "sharding", "read replica"],
      communication: ["first", "then", "finally", "approach", "would", "check", "analyze"],
    },
  },
  {
    id: "rag-design",
    question: "Design a simple RAG (Retrieval-Augmented Generation) system. What are the key components?",
    keywords: {
      architecture: ["vector", "embedding", "retriever", "generator", "pipeline", "chunk", "index"],
      depth: ["semantic search", "cosine similarity", "llm", "context window", "prompt", "knowledge base", "rerank"],
      scalability: ["batch", "cache", "approximate", "hnsw", "faiss", "pgvector", "scale"],
      communication: ["components", "flow", "step", "first", "then", "involves", "requires"],
    },
  },
  {
    id: "multi-agent",
    question: "How would you architect a multi-agent system for customer support?",
    keywords: {
      architecture: ["orchestrat", "agent", "router", "classifier", "handoff", "tool", "workflow"],
      depth: ["intent", "rag", "llm", "tool call", "function", "state", "memory", "context"],
      scalability: ["queue", "async", "parallel", "retry", "fallback", "timeout", "rate limit"],
      communication: ["agents", "route", "coordinate", "handle", "process", "decide", "respond"],
    },
  },
];

type Scores = { label: string; score: number }[];

function scoreAnswer(answer: string, challenge: (typeof CHALLENGES)[number]): Scores {
  const a = answer.toLowerCase();
  const score = (words: string[]) => {
    const hits = words.filter((w) => a.includes(w.toLowerCase())).length;
    const raw = Math.min((hits / Math.max(words.length * 0.4, 1)) * 10, 10);
    const lengthBonus = Math.min(answer.split(" ").length / 20, 1);
    return Math.round(Math.min(raw + lengthBonus * 2, 10));
  };
  return [
    { label: "Architecture thinking", score: score(challenge.keywords.architecture) },
    { label: "Technical depth", score: score(challenge.keywords.depth) },
    { label: "Scalability", score: score(challenge.keywords.scalability) },
    { label: "Communication", score: score(challenge.keywords.communication) },
  ];
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const filled = Math.round(score);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-40 shrink-0 text-[var(--muted)]">{label}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="font-mono text-[var(--accent)]"
      >
        {bar}
      </motion.span>
    </div>
  );
}

export default function ChallengeMe() {
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [scores, setScores] = useState<Scores | null>(null);

  const challenge = CHALLENGES[challengeIdx];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || answer.trim().split(" ").length < 5) return;
    setScores(scoreAnswer(answer, challenge));
  };

  const nextChallenge = () => {
    setChallengeIdx((i) => (i + 1) % CHALLENGES.length);
    setAnswer("");
    setScores(null);
  };

  return (
    <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs tracking-widest text-[var(--accent)]">
          <Zap size={13} /> CHALLENGE MODE
        </div>
        <button
          onClick={nextChallenge}
          className="text-xs text-[var(--muted)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          NEXT QUESTION →
        </button>
      </div>

      <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4">
        <div className="text-xs text-[var(--muted)]">QUESTION {challengeIdx + 1} / {CHALLENGES.length}</div>
        <p className="mt-2 text-sm leading-7">{challenge.question}</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          className="min-h-36 w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--panel)] p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          placeholder="Type your answer here..."
          aria-label="Challenge answer"
          disabled={!!scores}
        />
        {!scores && (
          <button
            type="submit"
            className="mt-3 rounded-xl bg-[var(--accent-soft)] px-5 py-3 text-sm font-semibold hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            SUBMIT ANSWER
          </button>
        )}
      </form>

      <AnimatePresence>
        {scores && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5"
          >
            <div className="mb-4 text-xs tracking-widest text-[var(--accent)]">EVALUATION</div>
            <div className="space-y-3">
              {scores.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.25 }}
                >
                  <ScoreBar label={s.label} score={s.score} />
                </motion.div>
              ))}
            </div>
            <p className="mt-5 text-[10px] leading-5 text-[var(--muted)]">
              ⚠ HEURISTIC DEMO — This evaluation is keyword-based and not a scientific assessment. It demonstrates the Challenge Me feature concept.
            </p>
            <button
              onClick={nextChallenge}
              className="mt-4 rounded-xl border border-[var(--border)] px-4 py-2.5 text-xs hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              TRY ANOTHER CHALLENGE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
