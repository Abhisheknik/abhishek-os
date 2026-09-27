"use client";
import { portfolio } from "@/data/portfolio";
import { FadeUp, Stagger, StaggerItem } from "@/components/ui/ScrollReveal";

type Cert = { name: string; issuer: string; code?: string; issued?: string; expires?: string; credential_id?: string; skills?: readonly string[] };

export default function CertificationsSection({ certifications }: { certifications?: readonly Cert[] }) {
  const items = certifications ?? portfolio.certifications;
  return (
    <section className="mt-10">
      <FadeUp>
        <div className="mb-4 text-xs tracking-[.25em] text-[var(--muted)] uppercase">Certifications</div>
      </FadeUp>
      <Stagger className="space-y-2.5">
        {items.map((cert) => (
          <StaggerItem key={cert.name}>
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-0.5">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-[var(--success)] shrink-0">✓</span>
                <span className="font-medium">{cert.name}</span>
                <span className="text-[var(--muted)]">· {cert.issuer}</span>
                {"code" in cert && cert.code && (
                  <span className="rounded border border-[var(--border)] px-1.5 py-px text-[10px] text-[var(--muted)]">{cert.code}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)] ml-5">
                {"issued" in cert && cert.issued && <span>{cert.issued}</span>}
                {"expires" in cert && cert.expires && <span>· expires {cert.expires}</span>}
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
