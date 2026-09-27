"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Bot, Terminal, Network, Zap, LockKeyhole, UserRound } from "lucide-react";
import PhotoCard from "@/components/portfolio/PhotoCard";
import ProjectCards from "@/components/portfolio/ProjectCards";
import { FadeUp, FadeIn, Stagger, StaggerItem } from "@/components/ui/ScrollReveal";
import SectionNav from "@/components/ui/SectionNav";

const TECH_STACK = [
  {
    name: "C# / .NET",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M12 0L1.608 6v12L12 24l10.392-6V6zm0 2.19l8.392 4.845v9.69L12 21.81l-8.392-4.845v-9.69zm-.585 9.415h1.17v1.17h-1.17zm0-2.34h1.17v1.17h-1.17zm2.34 2.34h1.17v1.17h-1.17zm0-2.34h1.17v1.17h-1.17zm-4.68 2.34h1.17v1.17H9.075zm0-2.34h1.17v1.17H9.075zm2.34 0h1.17v1.17h-1.17z"/></svg>`,
  },
  {
    name: "Python",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.032v-2.867s-.109-3.402 3.35-3.402h5.764s3.24.052 3.24-3.13V3.19S18.28 0 11.914 0zm-3.2 1.848a1.046 1.046 0 0 1 1.047 1.046 1.046 1.046 0 0 1-1.047 1.047A1.046 1.046 0 0 1 7.668 2.894 1.046 1.046 0 0 1 8.714 1.848zM12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.032v2.867s.109 3.402-3.35 3.402h-5.764s-3.24-.052-3.24 3.13v5.343S5.72 24 12.086 24zm3.2-1.848a1.046 1.046 0 0 1-1.047-1.046 1.046 1.046 0 0 1 1.047-1.047 1.046 1.046 0 0 1 1.046 1.047 1.046 1.046 0 0 1-1.046 1.046z"/></svg>`,
  },
  {
    name: "Azure",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M13.05 4.24L6.56 18.05l-3.91.07L8.97 8.96l4.08-4.72zm.7.09L22.35 18.1l-4.1.07-1.65-3.01-5.28-.01 5.97-10.81zM2.65 19.38h18.7l1 1.38H1.65l1-1.38z"/></svg>`,
  },
  {
    name: "AWS",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.15 0 .25.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .25.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687a.49.49 0 0 1-.32-.08c-.063-.056-.12-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32a.5.5 0 0 1-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.778.778 0 0 0-.215-.559c-.144-.151-.415-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/><path d="M20.16 17.484c-2.163 1.6-5.306 2.45-8.016 2.45-3.79 0-7.208-1.4-9.79-3.726-.2-.184-.024-.43.224-.288 2.79 1.623 6.234 2.602 9.794 2.602 2.399 0 5.038-.496 7.465-1.527.367-.16.67.24.323.49zm.91-1.038c-.28-.36-1.85-.167-2.55-.088-.215.024-.247-.16-.056-.296 1.245-.878 3.294-.623 3.533-.327.24.303-.064 2.351-1.23 3.33-.18.151-.351.072-.271-.128.263-.655.846-2.127.574-2.491z"/></svg>`,
  },
  {
    name: "Docker",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186m-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186m5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.186.186v1.887c0 .102.084.185.186.185m-2.92 0h2.12a.186.186 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.082.185.185.185M23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288Z"/></svg>`,
  },
  {
    name: "SQL Server",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M0 9.386v5.23C0 17.108 5.373 18.77 12 18.77s12-1.663 12-4.154v-5.23c0 2.491-5.373 4.154-12 4.154S0 11.877 0 9.386zm0 0C0 6.894 5.373 5.23 12 5.23s12 1.663 12 4.155c0 2.491-5.373 4.154-12 4.154S0 11.877 0 9.385zm12-9.155c-6.627 0-12 1.664-12 4.155v15.23C0 22.106 5.373 24 12 24s12-1.664 12-4.154V4.386C24 1.895 18.627.23 12 .23zm0 2.27c5.514 0 9.946 1.214 9.946 2.77 0 1.557-4.432 2.77-9.946 2.77-5.515 0-9.947-1.213-9.947-2.77 0-1.556 4.432-2.77 9.947-2.77z"/></svg>`,
  },
  {
    name: "Angular",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M9.931 12.645h4.138l-2.07-4.908m0-7.737L.68 3.982l1.726 14.771L12 24l9.594-5.247 1.726-14.771L12 0zm7.064 18.31h-2.638l-1.422-3.503H8.996L7.574 18.31H4.936L12 3.094z"/></svg>`,
  },
  {
    name: "TypeScript",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M0 12v12h24V0H0zm19.341-.956c.61.152 1.074.423 1.501.865.221.236.549.666.575.77.008.03-1.036.73-1.668 1.123-.023.015-.115-.084-.217-.236-.31-.45-.633-.644-1.128-.678-.728-.05-1.196.331-1.192.967a.88.88 0 0 0 .102.45c.16.331.458.53 1.39.933 1.719.74 2.454 1.227 2.911 1.92.51.773.625 2.008.278 2.926-.38.998-1.325 1.676-2.655 1.9-.411.073-1.386.062-1.828-.018-.964-.172-1.878-.648-2.442-1.273-.221-.243-.652-.88-.625-.925.011-.016.11-.077.22-.141.108-.061.511-.294.892-.515l.69-.4.145.214c.202.308.643.731.91.872.766.404 1.817.347 2.335-.118a.883.883 0 0 0 .313-.72c0-.278-.035-.4-.18-.61-.186-.266-.567-.49-1.649-.96-1.238-.533-1.771-.864-2.259-1.39a3.165 3.165 0 0 1-.659-1.2c-.091-.339-.114-1.189-.042-1.531.255-1.197 1.158-2.03 2.461-2.278.423-.08 1.406-.05 1.821.053zm-5.634 1.002l.008.983H10.59v8.876H8.38v-8.876H5.258v-.964c0-.534.011-.98.026-.99.012-.016 1.913-.024 4.217-.02l4.195.012z"/></svg>`,
  },
  {
    name: "Git",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/></svg>`,
  },
  {
    name: "RAG / LLM",
    svg: `<svg viewBox="0 0 24 24" fill="#a78bfa" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>`,
  },
];
import Hero from "@/components/portfolio/Hero";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import CertificationsSection from "@/components/portfolio/CertificationsSection";
import AgentLab from "@/components/agent/AgentLab";
import TerminalView from "@/components/terminal/TerminalView";
import AgentNetwork from "@/components/network/AgentNetwork";
import ProjectsView from "@/components/projects/ProjectsView";
import ChallengeMe from "@/components/challenge/ChallengeMe";
import HireMe from "@/components/hire/HireMe";
import OwnerProtocol from "@/components/owner/OwnerProtocol";
import { portfolio } from "@/data/portfolio";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import type { View } from "@/types";

const MODULE_TABS: {
  id: View;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  desc: string;
}[] = [
  { id: "lab",       label: "AGENT LAB",     icon: Bot,      desc: "Watch the AI agent reason through a task step by step" },
  { id: "terminal",  label: "TERMINAL",       icon: Terminal, desc: "Command-line interface — type projects, skills, experience" },
  { id: "network",   label: "AGENT NETWORK",  icon: Network,  desc: "Explore capabilities and see the evidence behind each skill" },
  { id: "projects",  label: "PROJECTS",       icon: Zap,      desc: "Deep-dive into featured projects with architecture details" },
  { id: "challenge", label: "CHALLENGE ME",   icon: Zap,      desc: "Answer a technical question and see a structured evaluation" },
  { id: "hire",      label: "HIRE ME",        icon: UserRound,desc: "Select a role — get an evidence-based fit analysis" },
];

export default function Home() {
  const [view, setView] = useState<View>("lab");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [showExplore, setShowExplore] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const { data: liveData } = usePortfolioData();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (doc.scrollTop / total) * 100 : 0;
      if (progressRef.current) progressRef.current.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavigate = useCallback((target: View, projectId?: string) => {
    setView(target);
    setShowExplore(true);
    if (projectId) setActiveProjectId(projectId);
    setTimeout(() => {
      const el = document.getElementById("explore");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOwnerOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const openProject = (id: string) => {
    setView("projects");
    setActiveProjectId(id);
    setShowExplore(true);
    setTimeout(() => {
      const el = document.getElementById("explore");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-7">

      <SectionNav />

      {/* ── Scroll progress bar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[var(--border)]">
        <div ref={progressRef} className="h-full bg-[var(--accent)]" style={{ width: "0%" }} />
      </div>

      {/* ── Header ── */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
        <div className="text-sm font-bold tracking-[.2em]">
          ABHISHEK<span className="text-[var(--accent)]">.OS</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <span className="flex items-center gap-1.5">
            <span className="pulse h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
            AGENT ONLINE
          </span>
          <span className="hidden sm:block">· {liveData.profile.location}</span>
        </div>
      </header>

      {/* ── 1. WHO + ASK ── */}
      <div id="section-hero">
        <Hero onNavigate={handleNavigate} />
      </div>

      {/* ── Stats ── */}
      <FadeUp delay={0.05}>
        <div className="flex flex-wrap gap-x-8 gap-y-3 border-b border-[var(--border)] pb-8 mb-8 text-sm">
          {[
            ["2+", "years experience"],
            ["20K+", "candidates handled"],
            ["6", "certifications"],
            [".NET 8", "primary stack"],
          ].map(([val, label]) => (
            <div key={label}>
              <span className="font-bold text-[var(--text)]">{val}</span>
              <span className="ml-1.5 text-xs text-[var(--muted)]">{label}</span>
            </div>
          ))}
        </div>
      </FadeUp>

      {/* ── Currently ── */}
      <FadeUp delay={0.1}>
        <div className="mb-8 rounded-lg border border-[var(--border)] bg-[var(--card)] p-4">
          <div className="mb-3 text-[10px] tracking-[.25em] text-[var(--muted)] uppercase">Currently</div>
          <div className="space-y-1.5 text-xs">
            {[
              ["Building", ".NET 8 migration + Angular frontend at iMocha"],
              ["Exploring", "Advanced RAG patterns & multi-agent orchestration"],
              ["Open to", "AI Engineer · Backend Engineer · .NET Developer roles"],
              ["Location", "Pune, Maharashtra · Remote friendly"],
            ].map(([key, val]) => (
              <div key={key} className="flex gap-3">
                <span className="shrink-0 text-[var(--accent)] w-16">{key}</span>
                <span className="text-[var(--muted)]">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── 2. WHAT — project cards ── */}
      <div id="section-projects">
        <ProjectCards onOpen={openProject} projects={liveData.projects} />
      </div>

      {/* ── Tech stack ── */}
      <FadeUp>
        <div className="mt-8 mb-4">
          <div className="mb-3 text-[10px] tracking-[.25em] text-[var(--muted)] uppercase">Stack</div>
          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map(({ name, svg }) => (
              <div
                key={name}
                title={name}
                className="flex items-center gap-2 rounded border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition cursor-default"
              >
                <span
                  className="shrink-0 opacity-80"
                  style={{ width: "14px", height: "14px", display: "inline-flex", alignItems: "center" }}
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
                {name}
              </div>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* ── 3. EXPLORE — collapsible modules ── */}
      <section id="explore" className="mt-12">
        <button
          onClick={() => setShowExplore((v) => !v)}
          className="flex items-center gap-3 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
          aria-expanded={showExplore}
        >
          <span className="text-[var(--accent)]">{showExplore ? "▾" : "▸"}</span>
          <span className="tracking-[.2em] uppercase">Explore</span>
          <span className="text-[var(--dim)] hidden sm:inline">— Terminal · Agent Lab · Skills · Challenge Me · Hire Me</span>
        </button>

        {showExplore && (
          <div className="mt-4">
            {/* Tab nav */}
            <div className="flex overflow-x-auto border-b border-[var(--border)]">
              {MODULE_TABS.map(({ id, label, icon: Icon, desc }) => (
                <button
                  key={id}
                  onClick={() => { setView(id); if (id !== "projects") setActiveProjectId(null); }}
                  title={desc}
                  className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium whitespace-nowrap transition focus-visible:outline-none ${
                    view === id
                      ? "border-[var(--accent)] text-[var(--accent)]"
                      : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                  aria-pressed={view === id}
                >
                  <Icon size={12} />
                  {label}
                </button>
              ))}
            </div>

            {/* Active module description */}
            <div className="mt-2 mb-3 text-xs text-[var(--muted)]">
              {MODULE_TABS.find((t) => t.id === view)?.desc}
            </div>

            {/* Module content */}
            <div className="rounded-xl border border-[var(--border)] bg-[var(--panel)] p-5 sm:p-7">
              {view === "lab"       && <AgentLab onNavigate={handleNavigate} />}
              {view === "terminal"  && <TerminalView />}
              {view === "network"   && <AgentNetwork />}
              {view === "projects"  && <ProjectsView initialProjectId={activeProjectId} />}
              {view === "challenge" && <ChallengeMe />}
              {view === "hire"      && <HireMe />}
            </div>
          </div>
        )}
      </section>

      {/* ── Experience ── */}
      <div id="section-exp">
        <ExperienceSection experience={liveData.experience} />
      </div>

      {/* ── Certifications ── */}
      <div id="section-certs">
        <CertificationsSection certifications={liveData.certifications} />
      </div>

      {/* ── Education — minimal ── */}
      <div id="section-edu">
      <FadeUp>
        <section className="mt-10 border-t border-[var(--border)] pt-8">
          <div className="mb-3 text-xs tracking-[.25em] text-[var(--muted)] uppercase">Education</div>
          {portfolio.education.map((edu) => (
            <div key={edu.degree} className="flex flex-wrap items-baseline justify-between gap-2 text-sm mb-1.5">
              <span>
                <span className="font-semibold">{edu.degree}</span>
                <span className="text-[var(--muted)]"> · {edu.institution}</span>
              </span>
              <span className="text-xs text-[var(--muted)]">{edu.period} · CGPA {edu.cgpa}</span>
            </div>
          ))}
        </section>
      </FadeUp>
      </div>

      {/* ── Hobbies / Human side ── */}
      <section id="section-hobbies" className="mt-10 border-t border-[var(--border)] pt-8">
        <FadeUp>
          <div className="mb-5 text-xs tracking-[.25em] text-[var(--muted)] uppercase">Beyond the code</div>
        </FadeUp>

        {/* Japanese — full width hero card */}
        <FadeUp delay={0.05}>
          <div className="relative mb-3 rounded-xl overflow-hidden border border-[#3a1a1a] bg-[#110a0a] p-6 flex items-center gap-6 group hover:border-[#e85d5d] transition-colors">
            {/* Big watermark kanji */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[120px] font-bold leading-none select-none pointer-events-none opacity-[0.06] text-[#e85d5d]" aria-hidden>日</div>
            {/* Red circle flag stand-in */}
            <div className="shrink-0 w-14 h-14 rounded-full bg-[#1a0808] border border-[#3a1a1a] flex items-center justify-center group-hover:border-[#e85d5d] transition-colors">
              <div className="w-6 h-6 rounded-full bg-[#e85d5d] opacity-90" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] tracking-[.25em] text-[#e85d5d] uppercase mb-1">Language Learning · N4</div>
              <div className="text-base font-bold text-[var(--text)]">日本語を勉強しています</div>
              <div className="text-xs text-[var(--muted)] mt-1">Nihongo wo benkyou shite imasu — studying grammar, kanji &amp; vocabulary</div>
            </div>
            <div className="ml-auto shrink-0 hidden sm:flex flex-col items-end gap-1 text-right">
              <span className="text-[10px] tracking-widest text-[#e85d5d]">JLPT N4</span>
              <span className="text-[10px] text-[var(--muted)]">in progress</span>
            </div>
          </div>
        </FadeUp>

        {/* Photo + Video row */}
        <Stagger className="grid gap-3 sm:grid-cols-2 mb-3" staggerDelay={0.08}>
          <StaggerItem>
            <PhotoCard icon="📷" label="Photography" detail="Captures everyday moments, street scenes, and travel. Enjoys finding composition in ordinary places." type="photo" pinterestUrl="#" />
          </StaggerItem>
          <StaggerItem>
            <PhotoCard icon="🎬" label="Videography" detail="Shoots and edits short videos. Interested in visual storytelling and cinematic framing." type="video" pinterestUrl="#" />
          </StaggerItem>
        </Stagger>

        {/* Side projects + Tech reading row */}
        <Stagger className="grid gap-3 sm:grid-cols-2" staggerDelay={0.08}>
          <StaggerItem>
            <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 overflow-hidden group hover:border-[var(--accent)] transition-colors h-full">
              <div className="absolute right-4 top-4 text-[56px] font-bold leading-none select-none pointer-events-none opacity-[0.06] text-[var(--accent)]" aria-hidden>&lt;/&gt;</div>
              <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] border border-[var(--accent)] border-opacity-30 flex items-center justify-center mb-3 text-base">⚡</div>
              <div className="text-sm font-bold text-[var(--text)] mb-1">Building side projects</div>
              <div className="text-xs leading-5 text-[var(--muted)]">Turns weekend curiosity into working prototypes. This portfolio is one of them.</div>
              <div className="mt-3 text-[10px] tracking-widest text-[var(--accent)] opacity-60">CURRENT → ABHISHEK.OS</div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="relative rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 overflow-hidden group hover:border-[#4ade80] transition-colors h-full">
              <div className="absolute right-4 top-4 text-[56px] font-bold leading-none select-none pointer-events-none opacity-[0.06] text-[#4ade80]" aria-hidden>∞</div>
              <div className="w-9 h-9 rounded-lg bg-[rgba(74,222,128,0.08)] border border-[rgba(74,222,128,0.2)] flex items-center justify-center mb-3 text-base">📖</div>
              <div className="text-sm font-bold text-[var(--text)] mb-1">Tech reading</div>
              <div className="text-xs leading-5 text-[var(--muted)]">Follows .NET ecosystem, AI research papers, and distributed systems architecture.</div>
              <div className="mt-3 text-[10px] tracking-widest text-[#4ade80] opacity-60">NOW READING → AI ENGINEERING</div>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] py-6 text-xs text-[var(--muted)]">
        <span>ABHISHEK<span className="text-[var(--accent)]">.OS</span> · Agentic portfolio.</span>
        <button
          onClick={() => setOwnerOpen(true)}
          className="flex items-center gap-2 transition hover:text-[var(--text)] focus-visible:outline-none"
          aria-label="Open owner protocol"
        >
          <LockKeyhole size={11} /> OWNER PROTOCOL
        </button>
      </footer>

      {/* ── Owner Protocol Modal ── */}
      <OwnerProtocol open={ownerOpen} onClose={() => setOwnerOpen(false)} />
    </main>
  );
}
