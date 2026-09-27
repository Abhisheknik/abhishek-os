"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/portfolio";
import Badge from "@/components/ui/Badge";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const hasArch = project.architecture.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-5"
    >
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        <ArrowLeft size={13} /> BACK TO PROJECTS
      </button>

      {project.featured && (
        <div className="mb-3 text-xs tracking-widest text-[var(--accent)]">FLAGSHIP PROJECT</div>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-2xl font-semibold sm:text-3xl">{project.name}</h2>
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {"live" in project && project.live && (
            <a
              href={project.live as string}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors shrink-0"
              style={{ color: "#4ade80", borderColor: "rgba(74,222,128,0.35)", backgroundColor: "rgba(74,222,128,0.08)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] pulse" />
              LIVE DEMO
            </a>
          )}
          {"github" in project && project.github && (
            <a
              href={project.github as string}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors shrink-0"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
              VIEW ON GITHUB
            </a>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <Badge key={t} variant="accent">{t}</Badge>
        ))}
      </div>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)]">{project.description}</p>

      {hasArch && (
        <div className="mt-8">
          <div className="mb-4 text-xs tracking-widest text-[var(--muted)]">ARCHITECTURE</div>
          <div className="flex flex-wrap items-center gap-2">
            {project.architecture.map((a, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3 text-center">
                  <div className="text-[10px] font-semibold tracking-widest text-[var(--accent)]">{a.step}</div>
                  <div className="mt-1 text-[10px] text-[var(--muted)]">{a.desc}</div>
                </div>
                {i < project.architecture.length - 1 && (
                  <span className="text-[var(--muted)]">→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <div className="mb-4 text-xs tracking-widest text-[var(--muted)]">DETAILS</div>
          <ul className="space-y-2 text-sm">
            {project.details.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-0.5 shrink-0 text-[var(--accent)]">→</span>
                <span className="text-[var(--text)]">{d}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs tracking-widest text-[var(--muted)]">TECHNOLOGY</div>
          <div className="space-y-3">
            {Object.entries(project.tech).map(([category, items]) => (
              <div key={category}>
                <div className="mb-1.5 text-[10px] uppercase tracking-widest text-[var(--muted)]">{category}</div>
                <div className="flex flex-wrap gap-1.5">
                  {(items as readonly string[]).map((item) => (
                    <Badge key={item} variant="muted">{item}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
