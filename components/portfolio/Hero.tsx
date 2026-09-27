"use client";
import { useState, useEffect } from "react";
import { Github, Linkedin, Mail, MapPin, FileText, Download, X } from "lucide-react";
import { portfolio } from "@/data/portfolio";
import AgentChat from "@/components/agent/AgentChat";
import type { View } from "@/types";

// ── Pixel Avatar ─────────────────────────────────────────────────────────────
const PIXEL_MAP = [
  [0,0,1,1,1,1,0,0],[0,1,1,1,1,1,1,0],[0,1,2,1,1,2,1,0],[0,1,1,1,1,1,1,0],
  [0,1,2,1,1,2,1,0],[0,1,1,2,2,1,1,0],[0,1,1,1,1,1,1,0],[0,0,1,1,1,1,0,0],
];
function dist(a: number, b: number) {
  return Math.sqrt((Math.floor(a/8)-Math.floor(b/8))**2+(a%8-b%8)**2);
}
function PixelAvatar() {
  const [active, setActive] = useState<number|null>(null);
  const [lit, setLit] = useState(new Set<number>());
  return (
    <div className="relative shrink-0">
      <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl border bg-[var(--card)] flex items-center justify-center select-none overflow-hidden p-2.5 cursor-crosshair"
        style={{ borderColor: active!==null?"var(--accent)":"var(--border)", transition:"border-color 0.15s" }}
        onMouseLeave={()=>setActive(null)}>
        <div className="grid w-full h-full" style={{gridTemplateColumns:"repeat(8,1fr)",gridTemplateRows:"repeat(8,1fr)",gap:"1.5px"}}>
          {PIXEL_MAP.map((row,r)=>row.map((base,c)=>{
            const idx=r*8+c, d=active!==null?dist(idx,active):Infinity, isLit=lit.has(idx);
            const glow=d===0?1:d<=1.1?0.7:d<=1.5?0.45:d<=2.2?0.2:d<=3?0.08:0;
            const isEmpty=base===0, isAccent=base===2;
            let bg="transparent",opacity=0;
            if(isLit){bg="var(--accent)";opacity=0.9;}
            else if(glow>0){bg="var(--accent)";opacity=isEmpty?glow*0.5:glow*0.9+(isAccent?0.1:0);}
            else if(!isEmpty){bg=isAccent?"var(--accent)":"var(--muted)";opacity=isAccent?1:0.35;}
            return <div key={idx} onMouseEnter={()=>setActive(idx)}
              onClick={()=>setLit(p=>{const n=new Set(p);n.has(idx)?n.delete(idx):n.add(idx);return n;})}
              style={{borderRadius:"2px",backgroundColor:bg,opacity,transition:"opacity 0.08s,background-color 0.08s",cursor:"crosshair"}}/>;
          }))}
        </div>
      </div>
      <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[var(--bg)]"
        style={{backgroundColor:active!==null?"var(--accent)":"var(--success)",transition:"background-color 0.15s"}}/>
      {active!==null&&<div className="absolute -bottom-6 left-0 text-[9px] text-[var(--muted)] whitespace-nowrap tracking-widest">CLICK TO PAINT</div>}
    </div>
  );
}

// ── Cycling role ─────────────────────────────────────────────────────────────
const ROLES = ["Backend Engineer","AI Engineer",".NET Developer","Systems Builder"];
function RoleCycler() {
  const [idx,setIdx]=useState(0);
  const [vis,setVis]=useState(true);
  useEffect(()=>{
    const t=setInterval(()=>{
      setVis(false);
      setTimeout(()=>{setIdx(i=>(i+1)%ROLES.length);setVis(true);},350);
    },2800);
    return ()=>clearInterval(t);
  },[]);
  return <span className="text-[var(--accent)] transition-opacity duration-300" style={{opacity:vis?1:0}}>{ROLES[idx]}</span>;
}

// ── Now Building widget ────────────────────────────────────────────────────────
const NOW_BUILDING = [
  { key:"AT",       value:"iMocha",                      color:"#a78bfa", badge: true },
  { key:"BUILDING", value:"PDF Engine → Playwright",     color:"#34d399", badge: false },
  { key:"SHIPPING", value:".NET 8 + Angular",            color:"#34d399", badge: false },
  { key:"LEARNING", value:"Multi-agent RAG",             color:"#38bdf8", badge: false },
  { key:"STACK",    value:"C# · .NET · Angular · SQL",   color:"var(--muted)", badge: false },
  { key:"STATUS",   value:"Open to work",                color:"#4ade80", badge: true },
];

function RandomWidget() {
  return (
    <div className="hidden lg:flex flex-col pl-8 min-w-[240px] max-w-[280px]" style={{alignSelf:"flex-start",paddingTop:"4px"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"16px"}}>
        <span className="w-1.5 h-1.5 rounded-full pulse" style={{backgroundColor:"#34d399",flexShrink:0}}/>
        <span style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.25em",color:"#34d399"}}>NOW BUILDING</span>
      </div>

      {/* Rows */}
      <div style={{display:"flex",flexDirection:"column",gap:"0",borderLeft:"1px solid var(--border)",paddingLeft:"14px"}}>
        {NOW_BUILDING.map(({ key, value, color, badge }, i) => (
          <div key={key} style={{
            display:"flex",flexDirection:"column",gap:"2px",
            padding:"8px 0",
            borderBottom: i < NOW_BUILDING.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <span style={{fontSize:"8px",fontWeight:700,letterSpacing:"0.18em",color:"var(--dim)"}}>{key}</span>
            {badge ? (
              <span style={{
                display:"inline-flex",alignItems:"center",alignSelf:"flex-start",
                fontSize:"10px",fontWeight:600,
                color,
                backgroundColor:`${color}15`,
                border:`1px solid ${color}40`,
                borderRadius:"4px",
                padding:"1px 6px",
                letterSpacing:"0.02em",
              }}>{value}</span>
            ) : (
              <span style={{fontSize:"11px",fontWeight:500,color,letterSpacing:"0.01em"}}>{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CV Modal ──────────────────────────────────────────────────────────────────
function CVModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative flex flex-col w-full max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-2xl overflow-hidden"
        style={{ height: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-[var(--accent)]">
            <FileText size={13} /> ABHISHEK_NIKAM_CV.PDF
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/cv.pdf"
              download="Abhishek_Nikam_CV.pdf"
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)] transition-colors"
            >
              <Download size={11} /> Download
            </a>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <X size={15} />
            </button>
          </div>
        </div>
        {/* PDF viewer */}
        <iframe
          src="/cv.pdf"
          className="flex-1 w-full"
          title="Abhishek Nikam CV"
        />
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
interface HeroProps { onNavigate:(view:View,projectId?:string)=>void; }

export default function Hero({ onNavigate }: HeroProps) {
  const [cvOpen, setCvOpen] = useState(false);
  return (
    <section className="py-14 sm:py-20">
      <div className="hero-fade-in">
        {/* Two-column: content left, skill matrix right */}
        <div className="flex gap-0 items-start">

          {/* ── Left column ── */}
          <div className="flex-1 min-w-0">
            {/* Avatar + identity */}
            <div className="flex items-center gap-5 mb-10">
              <PixelAvatar />
              <div>
                <div className="text-[10px] text-[var(--muted)] tracking-[.25em] uppercase mb-1.5">{portfolio.profile.tagline}</div>
                <div className="text-xl font-bold text-[var(--text)]">{portfolio.profile.name}</div>
                <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--muted)]">
                  <MapPin size={10}/>{portfolio.profile.location}
                </div>
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold tracking-widest"
                    style={{borderColor:"rgba(74,222,128,0.3)",backgroundColor:"rgba(74,222,128,0.08)",color:"#4ade80"}}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] pulse"/>OPEN TO WORK
                  </div>
                  <div className="w-px h-3 bg-[var(--border)]"/>
                  {[
                    {icon:Github,href:"https://github.com/Abhisheknik",label:"GitHub"},
                    {icon:Linkedin,href:"https://www.linkedin.com/in/abhisheknikamdev/",label:"LinkedIn"},
                    {icon:Mail,href:`mailto:${portfolio.profile.email}`,label:"Email"},
                  ].map(({icon:Icon,href,label})=>(
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                      className="text-[var(--muted)] transition hover:text-[var(--accent)]"><Icon size={14}/></a>
                  ))}
                  <div className="w-px h-3 bg-[var(--border)]"/>
                  <button
                    onClick={() => setCvOpen(true)}
                    className="flex items-center gap-0.5 rounded-full border px-1.5 py-px text-[7px] font-bold tracking-wider transition-colors"
                    style={{borderColor:"rgba(167,139,250,0.35)",backgroundColor:"rgba(167,139,250,0.08)",color:"var(--accent)"}}
                  >
                    <FileText size={7}/> CV
                  </button>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="mb-6">
              <div className="text-xs text-[var(--muted)] tracking-[.2em] uppercase mb-3">I&apos;m a <RoleCycler/></div>
              <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] sm:text-5xl lg:text-6xl">
                Don&apos;t browse.<br/>
                <span className="relative inline-block text-[var(--accent)]">
                  Interact.
                  <span className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full"
                    style={{background:"linear-gradient(90deg,var(--accent),transparent)"}}/>
                </span>
              </h1>
            </div>

            {/* Bio */}
            <p className="max-w-xl mb-5 text-[15px] leading-[1.85] text-[var(--muted)]"
              style={{fontFamily:"ui-sans-serif,system-ui,-apple-system,sans-serif", fontWeight:400}}>
              {portfolio.profile.summary}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-3 mb-6">
              {[["2+","yrs exp"],["20K+","users served"],["6","certs"]].map(([n,l],i)=>(
                <div key={l} className="flex items-center gap-3">
                  {i>0 && <div className="w-px h-6 bg-[var(--border)]"/>}
                  <div>
                    <div className="text-base font-bold text-[var(--text)]">{n}</div>
                    <div className="text-[10px] text-[var(--dim)] leading-tight">{l}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Agent hint */}
            <div className="flex items-center gap-3 text-xs text-[var(--muted)] mb-2">
              <span className="text-[var(--accent)]">→</span>
              <span>Ask the agent anything about Abhishek</span>
              <span className="hidden sm:block text-[var(--dim)]">— projects · experience · role fit · skills</span>
            </div>
          </div>

          {/* ── Right column: random widget ── */}
          <RandomWidget />
        </div>
      </div>

      {/* Agent chat — full width below */}
      <div className="hero-fade-in-delayed mt-6">
        <AgentChat onNavigate={onNavigate}/>
      </div>

      {/* CV Modal */}
      {cvOpen && <CVModal onClose={() => setCvOpen(false)} />}
    </section>
  );
}
