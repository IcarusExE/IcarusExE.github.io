const config = {
  title: "Kenan Kuşçu | Yazılım Geliştirici",
  description: {
    long: "Kenan Kuşçu'nun yazılım geliştirme projelerini, kullandığı teknolojileri ve deneyimlerini keşfedin.",
    short:
      "Kenan Kuşçu'nun yazılım geliştirme portföyü.",
  },
  keywords: [
    "Kenan Kuşçu",
    "portfolio",
    "full-stack developer",
    "creative technologist",
    "web development",
    "3D animations",
    "interactive websites",
    "Kenan Kuşçu projeleri",
    "Cloudflare Workers",
    "Cloudflare D1",
    "web design",
    "GSAP",
    "React",
    "Next.js",
    "Framer Motion",
  ],
  author: "Kenan Kuşçu",
  email: "",
  site: "https://icarusexe.github.io",

  // for github stars button
  githubUsername: "IcarusExE",
  githubRepo: "IcarusExE.github.io",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    github: "https://github.com/IcarusExE",
  },
};
export { config };
