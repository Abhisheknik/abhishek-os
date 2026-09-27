export const portfolio = {
  profile: {
    name: "Abhishek Nikam",
    title: "Backend Engineer",
    tagline: "AI · Systems · Cloud",
    location: "Pune, Maharashtra",
    email: "abhisheknikam2212@gmail.com",
    summary:
      "Backend Engineer with 2+ years of experience building scalable SaaS applications using C#, .NET, ASP.NET Core, REST APIs, and SQL Server. Hands-on experience with Azure, Docker, CI/CD, Angular, Playwright, and Generative AI/RAG applications.",
  },

  experience: [
    {
      company: "iMocha",
      role: "Associate Software Engineer",
      period: "Sept. 2024 – Present",
      location: "Pune",
      highlights: [
        "Engineered a Report Function Engine handling 20,000+ candidates using C#, .NET, and SQL Server.",
        "Revamped the PDF Engine by migrating to Playwright, modernizing document generation.",
        "Enhanced customer-facing features across the product lifecycle.",
        "Improved the payment portal with HubSpot CRM integration.",
        "Developed and maintained scalable REST APIs and backend services.",
        "Contributing to modernization from .NET Framework 4.5 to .NET 8.",
        "Contributing to frontend migration from ASP.NET MVC to Angular.",
        "Optimized SQL queries for large-scale workloads.",
      ],
    },
    {
      company: "Alphansol Pvt. Ltd.",
      role: "Software Developer Intern",
      period: "April 2022 – Sept. 2022",
      location: "Remote, Thane",
      highlights: [
        "Developed a core module of the 365 Care Web Application using PHP, CodeIgniter and MySQL.",
        "Implemented SEO strategies for clients including Imset, Bioxia and Cleanroom Company.",
      ],
    },
    {
      company: "Probity",
      role: "Flutter Developer",
      period: "Jan 2024 – Jun 2024",
      location: "Nashik, Maharashtra · On-site",
      highlights: [
        "Built cross-platform mobile features using Flutter as part of a 6-month internship.",
        "Worked on API integration, testing, and explored Generative Adversarial Networks (GANs).",
        "Gained hands-on experience with REST API testing and mobile UI development.",
      ],
    },
    {
      company: "Hacktoberfest",
      role: "Open Source Contributor",
      period: "Oct 2023 – Nov 2023",
      location: "Remote",
      highlights: [
        "Contributed to open-source projects during Hacktoberfest, strengthening version control and Git workflows.",
        "Practiced collaborative development — pull requests, code reviews, and issue resolution.",
        "Worked with Node.js projects and sharpened problem-solving in a community-driven environment.",
      ],
    },
    {
      company: "Microsoft",
      role: "Future Ready Talent Intern",
      period: "May 2022 – Dec 2022",
      location: "Remote",
      highlights: [
        "Completed the Microsoft Future Ready Talent Internship via Microsoft Learn.",
        "Covered Azure, Cybersecurity, Artificial Intelligence, Unity, and GitHub modules.",
        "Passed all associated learning assessments, building foundational cloud and AI skills.",
      ],
    },
  ],

  projects: [
    {
      id: "multi-agent-support",
      name: "Multi-Agent AI Customer Support Pipeline",
      featured: true,
      live: "https://super-ai-agent-i9zf.onrender.com/",
      tags: ["AI", "RAG", "Multi-Agent", "LLM", "Backend", "APIs"],
      description:
        "Real-time customer-support pipeline using an Intent Classifier + RAG Retriever agents and agentic tool-use loops. Achieved 75% token usage reduction through smart retry logic.",
      details: [
        "Real-time Intent Classifier agent routes queries to the correct handler",
        "RAG Retriever agent with SQLite knowledge base for context retrieval",
        "Agentic tool-use loops powered by Google Gemini 2.5 Flash",
        "Multi-LLM abstraction layer: Groq, Gemini, Ollama",
        "75% token usage reduction via smart retry logic",
        ".NET 10 Minimal APIs backend with clean architecture",
        "SSE streaming for real-time response delivery",
        "Dockerized with full CI/CD pipeline",
      ],
      architecture: [
        { step: "USER INPUT", desc: "Natural language query" },
        { step: "INTENT CLASSIFIER", desc: "Routes to correct agent" },
        { step: "RAG RETRIEVER", desc: "Fetches relevant knowledge" },
        { step: "AGENT TOOLS", desc: "Tool-use loop execution" },
        { step: "RESPONSE", desc: "Streamed via SSE" },
      ],
      tech: {
        AI: ["Google Gemini 2.5 Flash", "Groq", "Ollama"],
        Backend: [".NET 10 Minimal APIs", "C#"],
        Storage: ["SQLite"],
        Infrastructure: ["Docker", "CI/CD"],
        Streaming: ["SSE"],
      },
    },
    {
      id: "data-extraction",
      name: "Data Extraction Engine",
      featured: false,
      tags: ["Python", "OCR", "Pandas", "Streamlit"],
      description:
        "High-performance backend system automating document capture from medical records to improve extraction accuracy and operational efficiency.",
      details: [
        "Automated document capture from medical records",
        "pytesseract OCR for image-to-text extraction",
        "Regex-based structured data extraction pipeline",
        "Pandas for data transformation and analysis",
        "Streamlit dashboard for review and export",
      ],
      architecture: [] as { step: string; desc: string }[],
      tech: {
        Core: ["Python", "Streamlit", "Pandas"],
        Extraction: ["pytesseract", "Regex"],
      },
    },
    {
      id: "megan-ai-hub",
      name: "MEGAN: AI Portal",
      featured: false,
      github: "https://github.com/Abhisheknik/Megan_Ai_hub",
      tags: ["Flutter", "Dart", "Firebase", "ChatGPT", "Gemini", "AI", "Mobile"],
      description:
        "College final project — a cross-platform mobile app unifying 8+ AI tools (ChatGPT, Gemini, Text-to-Image, Background Remover, Essay/Letter Writer, E-commerce) into one Flutter interface for Android and iOS.",
      details: [
        "ChatGPT & Gemini integration for conversational AI",
        "Text-to-Image Generator converting prompts into visuals",
        "AI Background Remover for instant image processing",
        "Essay, Assignment, Letter & Job Application Writer",
        "E-commerce module for creating and purchasing custom t-shirt designs",
        "Firebase for secure auth, data storage, and GDPR/CCPA compliance",
        "Cross-platform — Android & iOS via Flutter/Dart",
        "Developed using Waterfall model: Communication → Planning → Modelling → Construction",
      ],
      architecture: [
        { step: "USER", desc: "Mobile app input" },
        { step: "AI ROUTER", desc: "Selects tool/model" },
        { step: "API LAYER", desc: "ChatGPT / Gemini / Vision" },
        { step: "FIREBASE", desc: "Auth + storage" },
        { step: "OUTPUT", desc: "Text / Image / E-comm" },
      ],
      tech: {
        Platform: ["Flutter", "Dart"],
        AI: ["ChatGPT API", "Google Gemini", "Text-to-Image API"],
        Backend: ["Firebase Auth", "Cloud Firestore"],
        "E-commerce": ["Custom T-Shirt Designer", "In-app Purchase"],
      },
    },
  ],

  skills: {
    Languages: ["C#", "Python", "SQL"],
    Backend: [".NET 8", "ASP.NET Core", "REST APIs", "LINQ", "Entity Framework Core"],
    Databases: ["SQL Server", "MySQL", "SQLite"],
    "Cloud & DevOps": ["Microsoft Azure", "AWS", "Docker", "CI/CD", "Azure DevOps"],
    Frontend: ["Angular", "TypeScript", "JavaScript", "HTML", "CSS"],
    "Testing & Tools": ["Unit Testing", "Postman", "Git", "GitHub", "Playwright"],
    AI: [
      "RAG",
      "Multi-Agent Systems",
      "LLM Integration",
      "Google Gemini",
      "Groq",
      "Ollama",
      "GitHub Copilot",
    ],
    Integrations: ["HubSpot CRM", "REST API Integration"],
  },

  skillEvidence: {
    RAG: ["multi-agent-support"],
    "Multi-Agent Systems": ["multi-agent-support"],
    "LLM Integration": ["multi-agent-support"],
    "Google Gemini": ["multi-agent-support"],
    Groq: ["multi-agent-support"],
    Ollama: ["multi-agent-support"],
    "C#": ["multi-agent-support"],
    ".NET 8": ["multi-agent-support"],
    "ASP.NET Core": ["multi-agent-support"],
    Docker: ["multi-agent-support"],
    "CI/CD": ["multi-agent-support"],
    SQLite: ["multi-agent-support"],
    Python: ["data-extraction"],
    Pandas: ["data-extraction"],
    Streamlit: ["data-extraction"],
  } as Record<string, string[]>,

  education: [
    {
      degree: "MCA",
      institution: "Gokhale Education Society's R. H. Sapat College of Engineering",
      period: "Aug. 2022 – Jun. 2024",
      cgpa: "8.24",
    },
    {
      degree: "Bachelor of Computer Science",
      institution: "K T H M College of Science And Commerce Arts",
      period: "Apr. 2019 – Jun. 2022",
      cgpa: "7.53",
    },
  ],

  certifications: [
    { name: "Microsoft Certified: Azure Fundamentals", issuer: "Microsoft", code: "AZ-900", issued: "May 2026", credentialId: "23F27FAE3CF8D968" },
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services (AWS)", code: "CLF-C02", issued: "Feb 2026", expires: "Feb 2029", credentialId: "c7f17b18854349908ed20cc3f2730709" },
    { name: "Claude Code in Action", issuer: "Anthropic", issued: "Mar 2026", credentialId: "68az8nongxvn", skills: ["Artificial Intelligence (AI)", "Prompt Engineering"] },
    { name: "Complete C# Masterclass", issuer: "Udemy", issued: "Mar 2026" },
    { name: "Foundational C# with Microsoft", issuer: "freeCodeCamp", issued: "Jul 2025", credentialId: "abhisheknikam-3240-fcswm" },
    { name: "Postman API Fundamentals Student Expert", issuer: "Postman", issued: "Nov 2024", skills: ["API Testing", "Postman API"] },
  ],

  hobbies: [
    { icon: "🇯🇵", label: "学習中 · Japanese N4", detail: "Studying Japanese — currently at N4 level. Fascinated by the language structure and culture." },
    { icon: "📷", label: "Photography", detail: "Captures everyday moments, street scenes, and travel. Enjoys finding composition in ordinary places." },
    { icon: "🎬", label: "Videography", detail: "Shoots and edits short videos. Interested in visual storytelling and cinematic framing." },
    { icon: "⚡", label: "Building side projects", detail: "Turns weekend curiosity into working prototypes. This portfolio is one of them." },
    { icon: "📖", label: "Tech reading", detail: "Keeps up with .NET ecosystem updates, AI research papers, and architecture patterns." },
  ],
} as const;

export type Project = (typeof portfolio.projects)[number];
export type Experience = (typeof portfolio.experience)[number];
export type Education = (typeof portfolio.education)[number];
export type Certification = (typeof portfolio.certifications)[number];
export type Hobby = (typeof portfolio.hobbies)[number];
