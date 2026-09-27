"use client";
import { useEffect, useState } from "react";
import { portfolio as staticData } from "@/data/portfolio";

type PortfolioData = typeof staticData;

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(staticData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((r) => r.json())
      .then((json: { empty?: boolean; profile?: Partial<PortfolioData["profile"]>; projects?: PortfolioData["projects"]; experience?: PortfolioData["experience"]; certifications?: PortfolioData["certifications"] }) => {
        if (!json.empty) {
          setData((prev) => ({
            ...prev,
            ...(json.profile ? { profile: { ...prev.profile, ...json.profile } } : {}),
            ...(json.projects?.length ? { projects: json.projects } : {}),
            ...(json.experience?.length ? { experience: json.experience } : {}),
            ...(json.certifications?.length ? { certifications: json.certifications } : {}),
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
