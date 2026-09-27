"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, X, LogOut, Save, Plus, Trash2, Edit2, Database, ChevronRight, Check, AlertCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CmsProfile {
  name: string; title: string; tagline: string;
  location: string; email: string; summary: string;
}

interface CmsProject {
  id: string; name: string; featured: boolean;
  live: string; github: string; tags: string;
  description: string; details: string; sort_order: number;
}

interface CmsExperience {
  id: string; company: string; role: string;
  period: string; location: string; highlights: string; sort_order: number;
}

interface CmsCert {
  id: string; name: string; issuer: string;
  code: string; issued: string; expires: string; sort_order: number;
}

type Section = "profile" | "projects" | "experience" | "certifications";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function authHeaders(phrase: string) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${phrase}` };
}

// ─── Small UI atoms ───────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] tracking-widest text-[var(--muted)] uppercase">{label}</div>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--accent)] transition-colors"
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--dim)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
    />
  );
}

type SaveState = "idle" | "saving" | "saved" | "error";

function SaveBtn({ state, onClick }: { state: SaveState; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={state === "saving"}
      className="flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
      style={{
        backgroundColor: state === "saved" ? "rgba(74,222,128,0.15)" : state === "error" ? "rgba(248,113,113,0.15)" : "var(--accent-soft)",
        color: state === "saved" ? "#4ade80" : state === "error" ? "#f87171" : "var(--accent)",
        border: `1px solid ${state === "saved" ? "rgba(74,222,128,0.3)" : state === "error" ? "rgba(248,113,113,0.3)" : "var(--accent)"}`,
      }}
    >
      {state === "saving" ? <><span className="animate-spin">↻</span> Saving…</> :
       state === "saved"  ? <><Check size={12} /> Saved</> :
       state === "error"  ? <><AlertCircle size={12} /> Error</> :
                            <><Save size={12} /> Save</>}
    </button>
  );
}

// ─── Profile Editor ───────────────────────────────────────────────────────────

function ProfileEditor({ phrase }: { phrase: string }) {
  const [form, setForm] = useState<CmsProfile>({ name: "", title: "", tagline: "", location: "", email: "", summary: "" });
  const [state, setState] = useState<SaveState>("idle");

  useEffect(() => {
    fetch("/api/cms/profile")
      .then((r) => r.json())
      .then((d: Partial<CmsProfile>) => { if (d && d.name) setForm(d as CmsProfile); })
      .catch(() => {});
  }, []);

  const set = (key: keyof CmsProfile) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const save = async () => {
    setState("saving");
    try {
      const r = await fetch("/api/cms/profile", { method: "POST", headers: authHeaders(phrase), body: JSON.stringify(form) });
      setState(r.ok ? "saved" : "error");
      setTimeout(() => setState("idle"), 2500);
    } catch { setState("error"); setTimeout(() => setState("idle"), 2500); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--text)]">Profile</div>
        <SaveBtn state={state} onClick={save} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Name"><Input value={form.name} onChange={set("name")} placeholder="Abhishek Nikam" /></Field>
        <Field label="Title"><Input value={form.title} onChange={set("title")} placeholder="Backend Engineer" /></Field>
        <Field label="Tagline"><Input value={form.tagline} onChange={set("tagline")} placeholder="AI · Systems · Cloud" /></Field>
        <Field label="Location"><Input value={form.location} onChange={set("location")} placeholder="Pune, Maharashtra" /></Field>
        <Field label="Email"><Input value={form.email} onChange={set("email")} type="email" placeholder="you@example.com" /></Field>
      </div>
      <Field label="Summary">
        <Textarea value={form.summary} onChange={set("summary")} rows={4} placeholder="Short bio / summary…" />
      </Field>
    </div>
  );
}

// ─── Projects Editor ──────────────────────────────────────────────────────────

const BLANK_PROJECT: CmsProject = { id: "", name: "", featured: false, live: "", github: "", tags: "", description: "", details: "", sort_order: 0 };

function ProjectsEditor({ phrase }: { phrase: string }) {
  const [list, setList] = useState<CmsProject[]>([]);
  const [editing, setEditing] = useState<CmsProject | null>(null);
  const [state, setState] = useState<SaveState>("idle");

  const load = useCallback(() => {
    fetch("/api/cms/projects").then((r) => r.json()).then((d: unknown[]) => {
      if (Array.isArray(d)) {
        setList(d.map((raw) => {
          const p = raw as Record<string, unknown>;
          return {
            id: String(p.id ?? ""), name: String(p.name ?? ""), featured: Boolean(p.featured),
            live: String(p.live ?? ""), github: String(p.github ?? ""),
            tags: Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : String(p.tags ?? ""),
            description: String(p.description ?? ""),
            details: Array.isArray(p.details) ? (p.details as string[]).join("\n") : String(p.details ?? ""),
            sort_order: Number(p.sort_order ?? 0),
          };
        }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setState("saving");
    try {
      const payload = {
        ...editing,
        tags: editing.tags.split(",").map((t) => t.trim()).filter(Boolean),
        details: editing.details.split("\n").map((d) => d.trim()).filter(Boolean),
        architecture: [],
        tech: {},
      };
      const r = await fetch("/api/cms/projects", { method: "POST", headers: authHeaders(phrase), body: JSON.stringify(payload) });
      setState(r.ok ? "saved" : "error");
      if (r.ok) { load(); setTimeout(() => { setState("idle"); setEditing(null); }, 1200); }
      else setTimeout(() => setState("idle"), 2500);
    } catch { setState("error"); setTimeout(() => setState("idle"), 2500); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/cms/projects?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders(phrase) });
    load();
  };

  const setF = (key: keyof CmsProject) => (v: string | boolean) =>
    setEditing((e) => e ? { ...e, [key]: v } : e);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--text)]">Projects</div>
        <button
          onClick={() => setEditing({ ...BLANK_PROJECT })}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors"
        >
          <Plus size={11} /> Add Project
        </button>
      </div>

      {/* List */}
      {!editing && (
        <div className="space-y-2">
          {list.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
              <div>
                <div className="text-sm font-medium text-[var(--text)]">{p.name || "(untitled)"}</div>
                <div className="text-[10px] text-[var(--muted)]">{p.id}{p.featured ? " · Featured" : ""}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(p)} className="rounded p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => del(p.id)} className="rounded p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-xs text-[var(--muted)] py-4 text-center">No projects yet. Seed Supabase first or add manually.</div>}
        </div>
      )}

      {/* Edit form */}
      {editing && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ID (slug)"><Input value={editing.id} onChange={setF("id") as (v: string) => void} placeholder="my-project" /></Field>
            <Field label="Name"><Input value={editing.name} onChange={setF("name") as (v: string) => void} placeholder="My Project" /></Field>
            <Field label="Live URL"><Input value={editing.live} onChange={setF("live") as (v: string) => void} placeholder="https://…" /></Field>
            <Field label="GitHub URL"><Input value={editing.github} onChange={setF("github") as (v: string) => void} placeholder="https://github.com/…" /></Field>
            <Field label="Tags (comma-separated)"><Input value={editing.tags} onChange={setF("tags") as (v: string) => void} placeholder="React, TypeScript, …" /></Field>
            <Field label="Sort order"><Input value={String(editing.sort_order)} onChange={(v) => setEditing((e) => e ? { ...e, sort_order: parseInt(v) || 0 } : e)} placeholder="0" /></Field>
          </div>
          <Field label="Description"><Textarea value={editing.description} onChange={setF("description") as (v: string) => void} rows={2} placeholder="Short project description…" /></Field>
          <Field label="Details (one per line)"><Textarea value={editing.details} onChange={setF("details") as (v: string) => void} rows={4} placeholder={"Built with X\nAchieved Y\nUsed Z"} /></Field>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-[var(--muted)] cursor-pointer">
              <input type="checkbox" checked={editing.featured} onChange={(e) => setF("featured")(e.target.checked)} className="accent-[var(--accent)]" />
              Featured project
            </label>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <SaveBtn state={state} onClick={save} />
            <button onClick={() => setEditing(null)} className="text-xs text-[var(--muted)] hover:text-[var(--text)] px-3 py-2 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Experience Editor ────────────────────────────────────────────────────────

const BLANK_EXP: CmsExperience = { id: "", company: "", role: "", period: "", location: "", highlights: "", sort_order: 0 };

function ExperienceEditor({ phrase }: { phrase: string }) {
  const [list, setList] = useState<CmsExperience[]>([]);
  const [editing, setEditing] = useState<CmsExperience | null>(null);
  const [state, setState] = useState<SaveState>("idle");

  const load = useCallback(() => {
    fetch("/api/cms/experience").then((r) => r.json()).then((d: unknown[]) => {
      if (Array.isArray(d)) {
        setList(d.map((raw) => {
          const e = raw as Record<string, unknown>;
          return {
            id: String(e.id ?? ""), company: String(e.company ?? ""), role: String(e.role ?? ""),
            period: String(e.period ?? ""), location: String(e.location ?? ""),
            highlights: Array.isArray(e.highlights) ? (e.highlights as string[]).join("\n") : String(e.highlights ?? ""),
            sort_order: Number(e.sort_order ?? 0),
          };
        }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setState("saving");
    try {
      const payload: Record<string, unknown> = {
        ...editing,
        highlights: editing.highlights.split("\n").map((h) => h.trim()).filter(Boolean),
      };
      if (!payload.id) delete payload.id;
      const r = await fetch("/api/cms/experience", { method: "POST", headers: authHeaders(phrase), body: JSON.stringify(payload) });
      setState(r.ok ? "saved" : "error");
      if (r.ok) { load(); setTimeout(() => { setState("idle"); setEditing(null); }, 1200); }
      else setTimeout(() => setState("idle"), 2500);
    } catch { setState("error"); setTimeout(() => setState("idle"), 2500); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/cms/experience?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders(phrase) });
    load();
  };

  const setF = (key: keyof CmsExperience) => (v: string) => setEditing((e) => e ? { ...e, [key]: v } : e);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--text)]">Experience</div>
        <button onClick={() => setEditing({ ...BLANK_EXP })} className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors">
          <Plus size={11} /> Add Entry
        </button>
      </div>

      {!editing && (
        <div className="space-y-2">
          {list.map((e) => (
            <div key={e.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
              <div>
                <div className="text-sm font-medium text-[var(--text)]">{e.company}</div>
                <div className="text-[10px] text-[var(--muted)]">{e.role} · {e.period}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(e)} className="rounded p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => del(e.id)} className="rounded p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-xs text-[var(--muted)] py-4 text-center">No entries. Seed Supabase or add manually.</div>}
        </div>
      )}

      {editing && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Company"><Input value={editing.company} onChange={setF("company")} placeholder="Company Name" /></Field>
            <Field label="Role"><Input value={editing.role} onChange={setF("role")} placeholder="Software Engineer" /></Field>
            <Field label="Period"><Input value={editing.period} onChange={setF("period")} placeholder="Jan 2024 – Present" /></Field>
            <Field label="Location"><Input value={editing.location} onChange={setF("location")} placeholder="Remote / City" /></Field>
          </div>
          <Field label="Highlights (one per line)">
            <Textarea value={editing.highlights} onChange={setF("highlights")} rows={5} placeholder={"Built X achieving Y\nOwned Z component\nIncreased performance by N%"} />
          </Field>
          <div className="flex items-center gap-2 pt-1">
            <SaveBtn state={state} onClick={save} />
            <button onClick={() => setEditing(null)} className="text-xs text-[var(--muted)] hover:text-[var(--text)] px-3 py-2 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Certifications Editor ────────────────────────────────────────────────────

const BLANK_CERT: CmsCert = { id: "", name: "", issuer: "", code: "", issued: "", expires: "", sort_order: 0 };

function CertificationsEditor({ phrase }: { phrase: string }) {
  const [list, setList] = useState<CmsCert[]>([]);
  const [editing, setEditing] = useState<CmsCert | null>(null);
  const [state, setState] = useState<SaveState>("idle");

  const load = useCallback(() => {
    fetch("/api/cms/certifications").then((r) => r.json()).then((d: unknown[]) => {
      if (Array.isArray(d)) {
        setList(d.map((raw) => {
          const c = raw as Record<string, unknown>;
          return {
            id: String(c.id ?? ""), name: String(c.name ?? ""), issuer: String(c.issuer ?? ""),
            code: String(c.code ?? ""), issued: String(c.issued ?? ""),
            expires: String(c.expires ?? ""), sort_order: Number(c.sort_order ?? 0),
          };
        }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    setState("saving");
    try {
      const payload: Record<string, unknown> = { ...editing };
      if (!payload.id) delete payload.id;
      const r = await fetch("/api/cms/certifications", { method: "POST", headers: authHeaders(phrase), body: JSON.stringify(payload) });
      setState(r.ok ? "saved" : "error");
      if (r.ok) { load(); setTimeout(() => { setState("idle"); setEditing(null); }, 1200); }
      else setTimeout(() => setState("idle"), 2500);
    } catch { setState("error"); setTimeout(() => setState("idle"), 2500); }
  };

  const del = async (id: string) => {
    if (!confirm("Delete this certification?")) return;
    await fetch(`/api/cms/certifications?id=${encodeURIComponent(id)}`, { method: "DELETE", headers: authHeaders(phrase) });
    load();
  };

  const setF = (key: keyof CmsCert) => (v: string) => setEditing((e) => e ? { ...e, [key]: v } : e);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-[var(--text)]">Certifications</div>
        <button onClick={() => setEditing({ ...BLANK_CERT })} className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors">
          <Plus size={11} /> Add Cert
        </button>
      </div>

      {!editing && (
        <div className="space-y-2">
          {list.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3">
              <div>
                <div className="text-sm font-medium text-[var(--text)]">{c.name}</div>
                <div className="text-[10px] text-[var(--muted)]">{c.issuer}{c.code ? ` · ${c.code}` : ""}{c.issued ? ` · ${c.issued}` : ""}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditing(c)} className="rounded p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => del(c.id)} className="rounded p-1.5 text-[var(--muted)] hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
          {list.length === 0 && <div className="text-xs text-[var(--muted)] py-4 text-center">No certifications. Seed Supabase or add manually.</div>}
        </div>
      )}

      {editing && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><Input value={editing.name} onChange={setF("name")} placeholder="AWS Certified Developer" /></Field>
            <Field label="Issuer"><Input value={editing.issuer} onChange={setF("issuer")} placeholder="Amazon Web Services" /></Field>
            <Field label="Code"><Input value={editing.code} onChange={setF("code")} placeholder="DVA-C02" /></Field>
            <Field label="Issued"><Input value={editing.issued} onChange={setF("issued")} placeholder="Jan 2025" /></Field>
            <Field label="Expires"><Input value={editing.expires} onChange={setF("expires")} placeholder="Jan 2028" /></Field>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <SaveBtn state={state} onClick={save} />
            <button onClick={() => setEditing(null)} className="text-xs text-[var(--muted)] hover:text-[var(--text)] px-3 py-2 transition-colors">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const SECTIONS: { id: Section; label: string }[] = [
  { id: "profile",         label: "Profile" },
  { id: "projects",        label: "Projects" },
  { id: "experience",      label: "Experience" },
  { id: "certifications",  label: "Certifications" },
];

function Dashboard({ phrase, onSignOut }: { phrase: string; onSignOut: () => void }) {
  const [section, setSection] = useState<Section>("profile");
  const [seedState, setSeedState] = useState<"idle" | "seeding" | "done" | "error">("idle");

  const seed = async () => {
    if (!confirm("This will overwrite Supabase data with the static portfolio data. Continue?")) return;
    setSeedState("seeding");
    try {
      const r = await fetch("/api/cms/seed", { method: "POST", headers: authHeaders(phrase) });
      setSeedState(r.ok ? "done" : "error");
      setTimeout(() => setSeedState("idle"), 3000);
    } catch { setSeedState("error"); setTimeout(() => setSeedState("idle"), 3000); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs tracking-widest text-[var(--accent)]">
          <Command size={13} /> ABHISHEK.OS // OWNER PROTOCOL
        </div>
        <button onClick={onSignOut} className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors">
          <LogOut size={12} /> Sign out
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 flex-1 min-h-0">
        {/* Sidebar */}
        <div className="sm:w-40 shrink-0">
          <div className="space-y-0.5">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors text-left"
                style={{
                  backgroundColor: section === id ? "var(--accent-soft)" : "transparent",
                  color: section === id ? "var(--accent)" : "var(--muted)",
                }}
              >
                {label}
                {section === id && <ChevronRight size={10} />}
              </button>
            ))}
          </div>

          {/* Seed button */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <button
              onClick={seed}
              disabled={seedState === "seeding"}
              className="w-full flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 text-[10px] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors disabled:opacity-50"
            >
              <Database size={10} />
              {seedState === "seeding" ? "Seeding…" :
               seedState === "done"    ? "✓ Seeded!" :
               seedState === "error"   ? "Error" :
               "Seed Supabase"}
            </button>
            <div className="mt-1.5 text-[9px] text-[var(--dim)] leading-4">Populates DB with current static data</div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.15 }}
            >
              {section === "profile"        && <ProfileEditor phrase={phrase} />}
              {section === "projects"       && <ProjectsEditor phrase={phrase} />}
              {section === "experience"     && <ExperienceEditor phrase={phrase} />}
              {section === "certifications" && <CertificationsEditor phrase={phrase} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// ─── Root modal ───────────────────────────────────────────────────────────────

interface OwnerProtocolProps {
  open: boolean;
  onClose: () => void;
}

export default function OwnerProtocol({ open, onClose }: OwnerProtocolProps) {
  const [phrase, setPhrase] = useState("");
  const [authed, setAuthed]  = useState(false);
  const [checking, setChecking] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setPhrase("");
      setAuthed(false);
      setAuthError("");
    }, 300);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phrase.trim()) return;
    setChecking(true);
    setAuthError("");
    try {
      const r = await fetch("/api/cms/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phrase }),
      });
      if (r.ok) { setAuthed(true); }
      else { setAuthError("Invalid passphrase. Try again."); }
    } catch { setAuthError("Could not connect. Check your network."); }
    setChecking(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
          role="dialog"
          aria-modal="true"
          aria-label="Owner Protocol"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: authed ? "56rem" : "26rem", maxHeight: "90vh" }}
          >
            {/* Close button */}
            <div className="flex justify-end p-3 pb-0">
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 pb-6 flex-1 min-h-0 overflow-y-auto">
              {!authed ? (
                /* ── Login screen ── */
                <div>
                  <div className="flex items-center gap-2 text-xs tracking-widest text-[var(--accent)] mb-4">
                    <Command size={13} /> ABHISHEK.OS // OWNER PROTOCOL
                  </div>
                  <h2 className="text-xl font-semibold text-[var(--text)]">Owner access</h2>
                  <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                    Enter your passphrase to unlock the portfolio CMS. Changes are saved directly to Supabase.
                  </p>
                  <form onSubmit={handleAuth} className="mt-5 space-y-3">
                    <input
                      value={phrase}
                      onChange={(e) => setPhrase(e.target.value)}
                      type="password"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-sm outline-none focus:border-[var(--accent)] transition-colors"
                      placeholder="Enter passphrase…"
                      autoFocus
                    />
                    {authError && (
                      <div className="flex items-center gap-2 text-xs text-red-400">
                        <AlertCircle size={12} /> {authError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={checking}
                        className="rounded-xl bg-[var(--accent-soft)] border border-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent)] hover:opacity-80 disabled:opacity-50 transition-opacity"
                      >
                        {checking ? "Checking…" : "Unlock"}
                      </button>
                      <button type="button" onClick={handleClose} className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm text-[var(--muted)] hover:border-[var(--accent)] transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* ── CMS Dashboard ── */
                <Dashboard phrase={phrase} onSignOut={handleClose} />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
