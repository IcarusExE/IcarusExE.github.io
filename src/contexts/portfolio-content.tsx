"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultPortfolioContent, type PortfolioContent } from "@/data/portfolio-content";

const API_URL = (process.env.NEXT_PUBLIC_PORTFOLIO_API_URL || "https://portfolio.kenankuscu.workers.dev").replace(/\/$/, "");
const PortfolioContentContext = createContext<PortfolioContent>(defaultPortfolioContent);

function isPortfolioContent(value: unknown): value is PortfolioContent {
  if (!value || typeof value !== "object") return false;
  const content = value as Partial<PortfolioContent>;
  return Boolean(content.profile?.name && Array.isArray(content.skills) && Array.isArray(content.experience) && Array.isArray(content.projects));
}

export function PortfolioContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState(defaultPortfolioContent);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/content`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`Content API returned ${response.status}`)))
      .then((payload) => {
        if (isPortfolioContent(payload.content)) setContent(payload.content);
      })
      .catch((error) => {
        if (error instanceof Error && error.name !== "AbortError") console.warn("Using built-in portfolio content", error);
      });
    return () => controller.abort();
  }, []);

  return <PortfolioContentContext.Provider value={content}>{children}</PortfolioContentContext.Provider>;
}

export function usePortfolioContent() {
  return useContext(PortfolioContentContext);
}
