import { portfolio, type Project } from "@/data/portfolio";
import type { AgentResult, RoleFitResult } from "@/types";

export function searchProjects(opts: { query?: string; tags?: string[] }): Project[] {
  const { query, tags } = opts;
  return portfolio.projects.filter((p) => {
    if (tags && tags.length > 0) {
      const hit = tags.some((t) =>
        p.tags.some((pt) => pt.toLowerCase() === t.toLowerCase())
      );
      if (!hit) return false;
    }
    if (query) {
      const q = query.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      const inTags = p.tags.some((t) => t.toLowerCase().includes(q));
      if (!inName && !inDesc && !inTags) return false;
    }
    return true;
  }) as unknown as Project[];
}

export function getProject(id: string): Project | null {
  return (portfolio.projects.find((p) => p.id === id) ?? null) as Project | null;
}

export function getExperience() {
  return portfolio.experience;
}

export function getSkills(category?: string) {
  if (!category) return portfolio.skills;
  const key = Object.keys(portfolio.skills).find(
    (k) => k.toLowerCase() === category.toLowerCase()
  );
  if (!key) return null;
  return { [key]: portfolio.skills[key as keyof typeof portfolio.skills] };
}

export function getCertifications() {
  return portfolio.certifications;
}

export function getEducation() {
  return portfolio.education;
}

export function getHobbies() {
  return portfolio.hobbies;
}

export function evaluateRoleFit(role: string, priorities: string[]): RoleFitResult {
  const r = role.toLowerCase();

  const aiScore = r.includes("ai") || priorities.some((p) => ["ai", "rag", "llm"].includes(p.toLowerCase())) ? 5 : 3;
  const backendScore = r.includes("backend") || r.includes(".net") || priorities.includes("Backend") ? 5 : 4;
  const dotnetScore = r.includes(".net") || r.includes("net developer") || priorities.includes(".NET") ? 5 : 4;
  const cloudScore = priorities.includes("Cloud") ? 4 : 3;
  const projectScore = 5;

  const avg = (aiScore + backendScore + dotnetScore + cloudScore + projectScore) / 5;
  const overall: RoleFitResult["overall"] =
    avg >= 4.5 ? "Strong Match" : avg >= 3.5 ? "Good Match" : "Partial Match";

  const evidence = [
    "Multi-Agent AI Customer Support Pipeline (AI, RAG, LLM, .NET)",
    "RAG implementation with .NET 10 Minimal APIs",
    "Production SaaS at iMocha — 20,000+ candidates handled",
    "AWS Cloud Practitioner & Azure Fundamentals certified",
  ];

  return {
    role,
    overall,
    scores: [
      { dimension: "AI/LLM", score: aiScore, label: aiScore >= 5 ? "Strong" : aiScore >= 4 ? "Good" : "Fair" },
      { dimension: "Backend", score: backendScore, label: "Strong" },
      { dimension: ".NET", score: dotnetScore, label: "Strong" },
      { dimension: "Cloud", score: cloudScore, label: cloudScore >= 4 ? "Good" : "Fair" },
      { dimension: "Projects", score: projectScore, label: "Strong" },
    ],
    evidence,
  };
}

export function runAgentQuery(query: string): AgentResult {
  const q = query.toLowerCase().trim();

  // Surprise me
  if (!q || q.includes("surprise")) {
    return {
      steps: [
        { label: "No query specified — selecting for you", tool: "surprise()" },
        { label: "Scanning portfolio for most impactful project", tool: "searchProjects()" },
        { label: "Selected: flagship AI project", detail: "confidence: high" },
      ],
      answer:
        "You didn't specify what to explore. I'll choose.\n\nYou should see: Multi-Agent AI Customer Support Pipeline.\n\nWhy? It best represents the intersection of backend engineering and AI — real-time agents, RAG, multi-LLM abstraction, and production-grade .NET backend.",
      projectId: "multi-agent-support",
      action: { type: "navigate", target: "projects", projectId: "multi-agent-support" },
    };
  }

  // Scale / 20000 / iMocha
  if (q.includes("scale") || q.includes("20,000") || q.includes("20000") || q.includes("imocha")) {
    return {
      steps: [
        { label: "Parsing intent: large-scale engineering", tool: "getExperience()" },
        { label: "Retrieved experience at iMocha", detail: "20,000+ candidates" },
        { label: "Composing evidence", detail: "Report Function Engine" },
      ],
      answer:
        "At iMocha, I engineered a Report Function Engine handling 20,000+ candidates using C#, .NET, and SQL Server. I also optimized SQL queries for large-scale workloads and developed scalable REST APIs that power the SaaS platform.",
    };
  }

  // Hire / fit
  if (q.includes("hire") || q.includes("should i") || q.includes("fit")) {
    return {
      steps: [
        { label: "Analyzing role fit", tool: "evaluateRoleFit()" },
        { label: "Scanning portfolio evidence", detail: "projects, experience, certs" },
        { label: "Composing recommendation", detail: "strong match" },
      ],
      answer:
        "I combine production backend experience with hands-on AI work: scalable .NET services, SQL optimization, SaaS features at scale, RAG pipelines, multi-agent systems, and LLM integrations. AWS and Azure certified.",
      action: { type: "navigate", target: "hire" },
    };
  }

  // .NET / backend stack
  if (q.includes("backend") || q.includes("stack") || q.includes(".net") || q.includes("dotnet")) {
    return {
      steps: [
        { label: "Parsing intent: backend stack", tool: "getSkills('Backend')" },
        { label: "Retrieved backend skill set", detail: "C#, .NET 8, ASP.NET Core" },
        { label: "Composing overview", detail: "complete stack" },
      ],
      answer:
        "My core backend stack: C#, .NET 8, ASP.NET Core, REST APIs, LINQ, Entity Framework Core, SQL Server. Cloud: Azure, AWS, Docker, CI/CD. I'm currently contributing to a .NET Framework 4.5 → .NET 8 migration at iMocha.",
      action: { type: "navigate", target: "network" },
    };
  }

  // AI / RAG / LLM
  if (
    q.includes("ai") || q.includes("rag") || q.includes("llm") ||
    q.includes("agent") || q.includes("machine learning") || q.includes("ml")
  ) {
    const project = getProject("multi-agent-support");
    return {
      steps: [
        { label: "Parsing intent: AI experience", tool: "searchProjects()" },
        { label: "Searching portfolio: tags=['AI','RAG','LLM']", detail: "found 1 match" },
        { label: "Selected flagship AI project", tool: "getProject('multi-agent-support')" },
        { label: "Composing recommendation", detail: "confidence: high" },
      ],
      answer:
        "My strongest AI project is the Multi-Agent AI Customer Support Pipeline — it combines RAG, multi-agent tool-use loops, LLM integration (Gemini, Groq, Ollama), and a production .NET 10 backend. Achieved 75% token usage reduction.",
      projectId: project?.id,
      action: { type: "navigate", target: "projects", projectId: "multi-agent-support" },
    };
  }

  // Projects generic
  if (q.includes("project") || q.includes("built") || q.includes("work")) {
    const projects = searchProjects({});
    return {
      steps: [
        { label: "Parsing intent: projects", tool: "searchProjects()" },
        { label: `Found ${projects.length} projects`, detail: "all projects" },
      ],
      answer: `I have ${projects.length} featured projects: ${projects.map((p) => p.name).join("; ")}. The flagship is the Multi-Agent AI Customer Support Pipeline.`,
      action: { type: "navigate", target: "projects" },
    };
  }

  // Hobbies / personal / Japanese
  if (
    q.includes("hobb") || q.includes("personal") || q.includes("interest") ||
    q.includes("outside") || q.includes("beyond") || q.includes("life") ||
    q.includes("japan") || q.includes("japanese") || q.includes("language") ||
    q.includes("nihongo") || q.includes("n4") || q.includes("fun")
  ) {
    const hobbies = getHobbies();
    return {
      steps: [
        { label: "Parsing intent: personal interests", tool: "getHobbies()" },
        { label: `Retrieved ${hobbies.length} hobby entries`, detail: "Japanese, side projects, reading" },
        { label: "Composing response" },
      ],
      answer:
        "Beyond engineering, Abhishek is:\n\n" +
        "🇯🇵 Learning Japanese — currently at N4 level. Studying grammar, kanji, and vocabulary.\n\n" +
        "📷 Photography — captures street scenes, everyday moments, and travel. Finds composition in ordinary places.\n\n" +
        "🎬 Videography — shoots and edits short videos. Into visual storytelling and cinematic framing.\n\n" +
        "⚡ Building side projects — turns weekend curiosity into working prototypes. This portfolio is one.\n\n" +
        "📖 Tech reading — follows .NET ecosystem, AI research, and distributed systems.",
    };
  }

  // Certifications
  if (q.includes("cert") || q.includes("aws") || q.includes("azure")) {
    return {
      steps: [
        { label: "Parsing intent: certifications", tool: "getCertifications()" },
        { label: "Retrieved certifications", detail: "2 active" },
      ],
      answer:
        "I hold two cloud certifications: AWS Certified Cloud Practitioner and Microsoft Azure Fundamentals (AZ-900).",
    };
  }

  // Education
  if (q.includes("education") || q.includes("degree") || q.includes("university") || q.includes("college") || q.includes("mca")) {
    return {
      steps: [
        { label: "Parsing intent: education", tool: "getEducation()" },
        { label: "Retrieved education records", detail: "2 degrees" },
      ],
      answer:
        "MCA from Gokhale Education Society's R. H. Sapat College of Engineering (CGPA 8.24, 2022–2024). Bachelor of Computer Science from K T H M College (CGPA 7.53, 2019–2022).",
    };
  }

  // Default fallback
  const project = getProject("multi-agent-support");
  return {
    steps: [
      { label: "Parsing query", tool: "searchProjects()" },
      { label: "Scanning portfolio knowledge base", detail: `query: "${query}"` },
      { label: "No exact match — defaulting to strongest project" },
    ],
    answer:
      "I found the most relevant result from my portfolio: the Multi-Agent AI Customer Support Pipeline. It showcases AI, backend, and cloud engineering. You can also explore Skills, Experience, or ask me something more specific.",
    projectId: project?.id,
    action: { type: "navigate", target: "projects", projectId: "multi-agent-support" },
  };
}
