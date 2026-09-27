import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ABHISHEK.OS — Backend Engineer · AI · Systems",
  description: "Interactive AI portfolio of Abhishek Nikam — Backend Engineer with expertise in .NET, ASP.NET Core, RAG, and multi-agent systems. Don't browse. Interact.",
  openGraph: {
    title: "ABHISHEK.OS — Backend Engineer · AI · Systems",
    description: "Interactive AI portfolio of Abhishek Nikam. Ask the agent about projects, experience, and skills.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
