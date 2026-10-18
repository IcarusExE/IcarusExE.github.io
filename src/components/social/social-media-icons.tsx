"use client";

import { useInView } from "motion/react";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { SiGithub, SiInstagram, SiLinkedin, SiX } from "react-icons/si";
import { usePortfolioContent } from "@/contexts/portfolio-content";
import Link from "next/link";

const SocialMediaButtons = () => {
  const { social } = usePortfolioContent();
  const ref = useRef<HTMLDivElement>(null);
  const show = useInView(ref, { once: true });
  const buttons = [
    { name: "Github", href: social.github, icon: <SiGithub size={"24"} color={"#fff"} /> },
    { name: "LinkedIn", href: social.linkedin, icon: <SiLinkedin size={"24"} color={"#fff"} /> },
    { name: "Twitter", href: social.twitter, icon: <SiX size={"24"} color={"#fff"} /> },
    { name: "Instagram", href: social.instagram, icon: <SiInstagram size={"24"} color={"#fff"} /> },
  ].filter((button) => button.href);
  return (
    <div ref={ref} className="z-10">
      {show &&
        buttons.map((button) => (
          <Link href={button.href} key={button.name} target="_blank">
            <Button variant={"ghost"}>{button.icon}</Button>
          </Link>
        ))}
    </div>
  );
};

export default SocialMediaButtons;
