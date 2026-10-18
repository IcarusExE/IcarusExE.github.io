"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactForm from "../ContactForm";
import { usePortfolioContent } from "@/contexts/portfolio-content";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";

const ContactSection = () => {
  const { profile, sections } = usePortfolioContent();
  return (
    <SectionWrapper id="contact" className="min-h-screen max-w-7xl mx-auto ">
      <SectionHeader id='contact' className="relative mb-14" title={
        <>
          {sections.contactTitle}
        </>} />
      <div className="grid grid-cols-1 md:grid-cols-2 z-[9999] mx-4">
        <Card className="min-w-7xl bg-white/70 dark:bg-black/70 backdrop-blur-sm rounded-xl mt-10 md:mt-20">
          <CardHeader>
            <CardTitle className="text-4xl">Contact Form</CardTitle>
            <CardDescription>
              {sections.contactDescription}{" "}
              {profile.email && <>
              <a
                target="_blank"
                href={`mailto:${profile.email}`}
                className="text-gray-200 cursor-can-hover rounded-lg"
              >
                {profile.email.replace(/@/g, "(at)")}
              </a>
              </>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};
export default ContactSection;
