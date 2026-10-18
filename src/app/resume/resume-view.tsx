"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft, Mail, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePortfolioContent } from "@/contexts/portfolio-content";

export default function ResumeView() {
  const { profile, social, skills, experience } = usePortfolioContent();
  const skillMap = new Map(skills.map((skill) => [skill.id, skill.label]));

  return (
    <div className="min-h-screen font-sans print:bg-white print:text-black">
      <style dangerouslySetInnerHTML={{ __html: "@media print{header,footer,.resume-actions{display:none!important}.resume-sheet{box-shadow:none!important;border:0!important;margin:0!important}}" }} />
      <div className="resume-actions mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 pt-20 md:pt-24">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Portföye dön</Link>
        <Button onClick={() => window.print()} className="gap-2"><Printer className="h-4 w-4" />Yazdır / PDF</Button>
      </div>
      <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="resume-sheet mx-auto my-6 w-[calc(100%-2rem)] max-w-4xl border border-border bg-background p-7 shadow-xl md:p-12">
        <header className="border-b border-border pb-8">
          <h1 className="font-display text-4xl md:text-6xl">{profile.name}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{profile.role}</p>
          <p className="mt-5 max-w-2xl leading-relaxed">{profile.intro}</p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {profile.email && <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{profile.email}</a>}
            {social.github && <a href={social.github} target="_blank">GitHub</a>}
            {social.linkedin && <a href={social.linkedin} target="_blank">LinkedIn</a>}
          </div>
        </header>
        <section className="py-8">
          <h2 className="font-display text-xl">Deneyim ve eğitim</h2>
          <div className="mt-6 grid gap-8">
            {experience.map((item) => <div key={item.id} className="grid gap-2 md:grid-cols-[180px_1fr]">
              <div className="text-sm text-muted-foreground">{[item.startDate, item.endDate].filter(Boolean).join(" - ")}</div>
              <div><h3 className="text-lg font-semibold">{item.title}</h3><p className="text-muted-foreground">{item.company}</p><ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-relaxed">{item.description.map((line, index) => <li key={index}>{line}</li>)}</ul></div>
            </div>)}
          </div>
        </section>
        <section className="border-t border-border pt-8">
          <h2 className="font-display text-xl">Beceriler</h2>
          <div className="mt-5 flex flex-wrap gap-2">{skills.map((skill) => <span key={skill.id} className="border border-border px-3 py-1.5 text-sm">{skillMap.get(skill.id)}</span>)}</div>
        </section>
      </motion.article>
    </div>
  );
}
