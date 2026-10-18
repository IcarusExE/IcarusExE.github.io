"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { ResponsiveDialog, ResponsiveDialogContent, ResponsiveDialogTrigger } from "../ui/responsive-dialog";
import { ScrollArea } from "../ui/scroll-area";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import ScrollingPreview from "../scrolling-preview";
import { usePortfolioContent } from "@/contexts/portfolio-content";
import type { PortfolioProject } from "@/data/portfolio-content";

const ProjectsSection = () => {
  const { projects, sections } = usePortfolioContent();
  return (
    <SectionWrapper id="projects" className="max-w-7xl mx-auto md:min-h-[130vh] px-4">
      <SectionHeader id="projects" title={sections.projectsTitle} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.filter((project) => project.published).map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </SectionWrapper>
  );
};

const ProjectCard = ({ project }: { project: PortfolioProject }) => {
  const [isHovered, setIsHovered] = useState(false);
  const image = project.image || "/assets/projects-screenshots/portfolio/landing.png";
  return (
    <div className="flex items-center justify-center">
      <ResponsiveDialog>
        <ResponsiveDialogTrigger className="bg-transparent flex justify-center w-full">
          <div className="group relative w-full max-w-[400px] h-auto rounded-lg overflow-hidden ring-1 ring-white/5" style={{ aspectRatio: "3/2" }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onFocus={() => setIsHovered(true)} onBlur={() => setIsHovered(false)}>
            <ScrollingPreview src={image} alt={project.title} isHovered={isHovered} />
            <div className="absolute w-full h-24 bottom-0 left-0 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10">
              <div className="flex flex-col h-full items-start justify-end p-4">
                <div className="text-lg text-left [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{project.title}</div>
                <div className="text-xs bg-primary text-primary-foreground rounded-lg w-fit px-2">{project.category}</div>
              </div>
            </div>
          </div>
        </ResponsiveDialogTrigger>
        <ResponsiveDialogContent className="md:max-w-4xl md:h-[85vh] md:!flex md:flex-col md:overflow-hidden md:p-0 md:gap-0">
          <div className="shrink-0 border-b border-border bg-background/80 backdrop-blur-sm px-8 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <h4 className="font-display text-xl md:text-2xl font-bold text-foreground tracking-tight truncate">{project.title}</h4>
                <span className="shrink-0 text-[11px] uppercase tracking-widest text-muted-foreground border border-border rounded-full px-3 py-0.5">{project.category}</span>
              </div>
              <div className="shrink-0 flex items-center gap-4">
                {project.github && <Link href={project.github} target="_blank" className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2">Kaynak</Link>}
                {project.live && <Link href={project.live} target="_blank"><button className="group flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-1.5 rounded-full hover:bg-primary/80 transition-colors">Ziyaret et<ArrowUpRight className="w-3.5 h-3.5" /></button></Link>}
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1" type="always" data-lenis-prevent>
            <div className="px-8 py-8">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="mb-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Teknolojiler</span>
                <div className="mt-3 flex flex-wrap gap-2">{project.technologies.map((technology) => <span key={technology} className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs">{technology}</span>)}</div>
              </motion.div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-10" />
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="font-mono text-muted-foreground leading-relaxed">
                <p className="text-2xl text-center text-foreground mb-8">{project.summary}</p>
                {project.description.map((paragraph, index) => <p key={index} className="mb-5">{paragraph}</p>)}
              </motion.div>
            </div>
          </ScrollArea>
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </div>
  );
};

export default ProjectsSection;
