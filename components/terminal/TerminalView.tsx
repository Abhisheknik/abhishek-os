"use client";

import { useState, useEffect, useRef } from "react";
import { searchProjects, getSkills, getExperience, getEducation, getCertifications, evaluateRoleFit } from "@/lib/agent/tools";
import { portfolio } from "@/data/portfolio";

type Line = { type: "input" | "output" | "system"; text: string };

const HELP_TEXT = `Available commands:

  projects                   list all projects
  projects --tag=<tag>       filter by tag (e.g. --tag=ai)
  skills                     list all skills
  skills --category=<cat>    filter by category (e.g. --category=backend)
  experience                 career timeline
  education                  education history
  certifications             certifications
  about                      profile overview
  hire <role>                evaluate role fit
  surprise                   show something interesting
  clear                      clear terminal
  help                       show this help`;

function runCommand(raw: string): string {
  const cmd = raw.trim();
  const lower = cmd.toLowerCase();

  if (lower === "clear") return "__clear__";
  if (lower === "help" || lower === "") return HELP_TEXT;

  if (lower === "about") {
    const p = portfolio.profile;
    return `${p.name}
${p.title} — ${p.location}
${p.summary}`;
  }

  if (lower === "experience") {
    return getExperience()
      .map(
        (e) =>
          `${e.company} — ${e.role} (${e.period}, ${e.location})\n${e.highlights.map((h) => `  → ${h}`).join("\n")}`
      )
      .join("\n\n");
  }

  if (lower === "education") {
    return getEducation()
      .map((e) => `${e.degree} — ${e.institution} (${e.period}) — CGPA ${e.cgpa}`)
      .join("\n");
  }

  if (lower === "certifications") {
    return getCertifications()
      .map((c) => `✓ ${"name" in c ? c.name : ""} — ${"issuer" in c ? c.issuer : ""}`)
      .join("\n");
  }

  if (lower === "surprise") {
    return `You didn't specify what to explore. I'll choose.

Recommendation: Multi-Agent AI Customer Support Pipeline

Why? It best represents the intersection of backend engineering and AI:
  → Multi-agent architecture with Intent Classifier + RAG Retriever
  → 75% token usage reduction via smart retry
  → .NET 10 backend with SSE streaming
  → Dockerized with full CI/CD

Type "projects" to explore all projects.`;
  }

  if (lower.startsWith("projects")) {
    const tagMatch = lower.match(/--tag=([^\s]+)/);
    const tag = tagMatch?.[1];
    const results = searchProjects(tag ? { tags: [tag] } : {});
    if (results.length === 0) return `No projects found${tag ? ` with tag: ${tag}` : ""}.`;
    return results
      .map(
        (p) =>
          `[${p.id}] ${p.name}\n  Tags: ${p.tags.join(", ")}\n  ${p.description}`
      )
      .join("\n\n");
  }

  if (lower.startsWith("skills")) {
    const catMatch = lower.match(/--category=([^\s]+)/);
    const cat = catMatch?.[1];
    const skills = getSkills(cat);
    if (!skills) return `Category "${cat}" not found. Try: languages, backend, databases, cloud, frontend, testing, ai, integrations`;
    return Object.entries(skills)
      .map(([k, v]) => `${k}:\n  ${(v as readonly string[]).join(", ")}`)
      .join("\n\n");
  }

  if (lower.startsWith("hire")) {
    const role = cmd.slice(4).trim() || "Software Engineer";
    const fit = evaluateRoleFit(role, []);
    const bars = fit.scores
      .map((s) => {
        const filled = "●".repeat(s.score) + "○".repeat(5 - s.score);
        return `  ${s.dimension.padEnd(12)} ${filled}  ${s.label}`;
      })
      .join("\n");
    return `ROLE MATCH: ${fit.role.toUpperCase()}
Overall: ${fit.overall}

${bars}

Evidence:
${fit.evidence.map((e) => `  → ${e}`).join("\n")}`;
  }

  return `Command not found: "${cmd}". Type "help" for available commands.`;
}

export default function TerminalView() {
  const [lines, setLines] = useState<Line[]>([
    { type: "system", text: `abhishek@portfolio:~$ help` },
    { type: "output", text: HELP_TEXT },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const cmd = input.trim();
    setHistory((h) => [cmd, ...h]);
    setHistIdx(-1);

    const output = runCommand(cmd);
    if (output === "__clear__") {
      setLines([]);
    } else {
      setLines((l) => [
        ...l,
        { type: "input", text: `abhishek@portfolio:~$ ${cmd}` },
        { type: "output", text: output },
      ]);
    }
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const idx = Math.min(histIdx + 1, history.length - 1);
      setHistIdx(idx);
      setInput(history[idx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const idx = Math.max(histIdx - 1, -1);
      setHistIdx(idx);
      setInput(idx === -1 ? "" : history[idx] ?? "");
    }
  };

  return (
    <div
      className="mt-5 rounded-2xl border border-[var(--border)] bg-black/30 p-5 font-mono text-xs"
      onClick={() => inputRef.current?.focus()}
      role="region"
      aria-label="Portfolio terminal"
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-3 text-[var(--muted)]">portfolio — abhishek@portfolio</span>
      </div>

      <div className="max-h-80 min-h-40 overflow-y-auto">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap leading-6 ${
              line.type === "input"
                ? "text-[var(--accent)]"
                : line.type === "system"
                ? "text-[var(--accent)]"
                : "text-[var(--muted)]"
            }`}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-2 border-t border-[var(--border)] pt-3">
        <span className="shrink-0 text-[var(--accent)]">abhishek@portfolio:~$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Terminal command input"
          className="min-w-0 flex-1 bg-transparent outline-none"
          placeholder="type a command..."
          spellCheck={false}
          autoCapitalize="none"
          autoCorrect="off"
        />
      </form>
    </div>
  );
}
