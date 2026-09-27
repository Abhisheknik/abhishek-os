"use client";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { id: "section-hero",     label: "Home"      },
  { id: "section-projects", label: "Projects"  },
  { id: "section-exp",      label: "Experience"},
  { id: "section-certs",    label: "Certs"     },
  { id: "section-edu",      label: "Education" },
  { id: "section-hobbies",  label: "Hobbies"   },
];

export default function SectionNav() {
  const [active, setActive] = useState("section-hero");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show nav only after scrolling past the hero
    const onScroll = () => setVisible(window.scrollY > 120);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <nav
      className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease", pointerEvents: visible ? "auto" : "none" }}
      aria-label="Section navigation"
    >
      {NAV_ITEMS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group flex items-center gap-2 cursor-pointer"
            aria-label={`Go to ${label}`}
          >
            {/* Label — appears on hover */}
            <span
              className="text-[9px] font-bold tracking-[.18em] uppercase transition-all duration-200 opacity-0 group-hover:opacity-100"
              style={{ color: isActive ? "var(--accent)" : "var(--muted)" }}
            >
              {label}
            </span>
            {/* Dot */}
            <span
              className="rounded-full transition-all duration-200"
              style={{
                width:  isActive ? "10px" : "6px",
                height: isActive ? "10px" : "6px",
                backgroundColor: isActive ? "var(--accent)" : "var(--dim)",
                boxShadow: isActive ? "0 0 8px var(--accent)" : "none",
              }}
            />
          </button>
        );
      })}
    </nav>
  );
}
