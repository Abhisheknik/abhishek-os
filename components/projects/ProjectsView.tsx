"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { portfolio, type Project } from "@/data/portfolio";
import Badge from "@/components/ui/Badge";
import ProjectDetail from "./ProjectDetail";

interface ProjectsViewProps {
  initialProjectId?: string | null;
}

const ALL_TAGS = Array.from(new Set(portfolio.projects.flatMap((p) => [...p.tags])));

export default function ProjectsView({ initialProjectId }: ProjectsViewProps) {
  const [selected, setSelected] = useState<Project | null>(
    initialProjectId ? (portfolio.projects.find((p) => p.id === initialProjectId) ?? null) as Project | null : null
  );
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? portfolio.projects.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase())
      )
    : portfolio.projects;

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="mt-5">
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTag(null)}
          className={`rounded-full border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
            !activeTag ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
          }`}
        >
          ALL
        </button>
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`rounded-full border px-3 py-1.5 text-xs focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
              activeTag === tag
                ? "border-[var(--accent)] text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(filtered as unknown as Project[]).map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            whileHover={{ y: -2 }}
            onClick={() => setSelected(p)}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 text-left hover:border-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            {p.featured && (
              <div className="mb-2 text-[10px] tracking-widest text-[var(--accent)]">FLAGSHIP</div>
            )}
            <div className="text-lg font-semibold">{p.name}</div>
            <p className="mt-2 text-xs leading-6 text-[var(--muted)]">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <Badge key={t} variant="muted">{t}</Badge>
              ))}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
