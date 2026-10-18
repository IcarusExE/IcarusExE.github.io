export type PortfolioSkill = {
  id: string;
  label: string;
  shortDescription: string;
  color: string;
  icon: string;
  keyboardIcon?: string;
  keyboardColor?: string;
  shortcut?: string;
};

export type PortfolioExperience = {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  description: string[];
  skills: string[];
};

export type PortfolioProject = {
  id: string;
  category: string;
  title: string;
  image: string;
  summary: string;
  description: string[];
  technologies: string[];
  github: string;
  live: string;
  published: boolean;
};

export type PortfolioContent = {
  profile: {
    name: string;
    role: string;
    intro: string;
    email: string;
    site: string;
    resumeUrl: string;
    githubUsername: string;
    githubRepo: string;
  };
  social: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  sections: {
    skillsTitle: string;
    skillsDescription: string;
    experienceTitle: string;
    experienceDescription: string;
    projectsTitle: string;
    contactTitle: string;
    contactDescription: string;
  };
  skills: PortfolioSkill[];
  experience: PortfolioExperience[];
  projects: PortfolioProject[];
};

export const defaultPortfolioContent: PortfolioContent = {
  profile: {
    name: "Kenan Kuşçu",
    role: "Yazılım Geliştirici ve Bilgisayar Programcılığı Öğrencisi",
    intro: "Fikirleri anlaşılır, hızlı ve sağlam dijital ürünlere dönüştürüyorum.",
    email: "",
    site: "https://icarusexe.github.io",
    resumeUrl: "/resume",
    githubUsername: "IcarusExE",
    githubRepo: "IcarusExE.github.io",
  },
  social: {
    github: "https://github.com/IcarusExE",
    linkedin: "",
    twitter: "",
    instagram: "",
  },
  sections: {
    skillsTitle: "Teknoloji Yığını",
    skillsDescription: "Üretirken kullandığım araçlar",
    experienceTitle: "Deneyim",
    experienceDescription: "Eğitim ve üretim yolculuğum.",
    projectsTitle: "Projeler",
    contactTitle: "BİRLİKTE ÇALIŞALIM",
    contactDescription: "Projenizi konuşmak için formu kullanabilir veya doğrudan e-posta gönderebilirsiniz.",
  },
  skills: [
    { id: "js", label: "JavaScript", shortDescription: "Modern web uygulamaları", color: "#f0db4f", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", keyboardIcon: "/assets/keyboard/logos/js.svg", keyboardColor: "#ff9408" },
    { id: "ts", label: "TypeScript", shortDescription: "Tip güvenli uygulamalar", color: "#3178c6", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", keyboardIcon: "/assets/keyboard/logos/ts.svg", keyboardColor: "#008fd5" },
    { id: "html", label: "HTML", shortDescription: "Erişilebilir web yapıları", color: "#e34c26", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", keyboardIcon: "/assets/keyboard/logos/html.svg", keyboardColor: "#ff480a" },
    { id: "css", label: "CSS", shortDescription: "Duyarlı arayüzler", color: "#1572b6", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", keyboardIcon: "/assets/keyboard/logos/css.svg", keyboardColor: "#633595" },
    { id: "react", label: "React", shortDescription: "Bileşen tabanlı arayüzler", color: "#61dafb", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", keyboardIcon: "/assets/keyboard/logos/react.svg", keyboardColor: "#00cce8" },
    { id: "nextjs", label: "Next.js", shortDescription: "Üretim odaklı React uygulamaları", color: "#ffffff", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", keyboardIcon: "/assets/keyboard/logos/nextjs.svg", keyboardColor: "#333537" },
    { id: "tailwind", label: "Tailwind CSS", shortDescription: "Tutarlı arayüz sistemleri", color: "#38bdf8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", keyboardIcon: "/assets/keyboard/logos/tailwind.svg", keyboardColor: "#00bfd8" },
    { id: "cloudflare", label: "Cloudflare Workers", shortDescription: "Edge API ve dağıtım", color: "#f38020", icon: "/assets/logos/cloudflare-mono.svg", keyboardIcon: "/assets/logos/cloudflare-mono.svg", keyboardColor: "#f38020" },
    { id: "d1", label: "SQLite / D1", shortDescription: "Sunucusuz ilişkisel veri", color: "#4a74a8", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg", keyboardColor: "#4a74a8" },
    { id: "git", label: "Git & GitHub", shortDescription: "Sürüm kontrolü ve iş birliği", color: "#f05032", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", keyboardIcon: "/assets/keyboard/logos/git.svg", keyboardColor: "#ff4622" },
  ],
  experience: [
    {
      id: "ankara-universitesi",
      startDate: "Devam ediyor",
      endDate: "",
      title: "Bilgisayar Programcılığı Öğrencisi",
      company: "Ankara Üniversitesi",
      description: [
        "Yazılım geliştirme temelleri, web teknolojileri ve veritabanları üzerine çalışıyorum.",
        "Öğrendiklerimi gerçek projelere dönüştürerek uygulamalı deneyim kazanıyorum.",
      ],
      skills: ["js", "html", "css", "git", "d1"],
    },
  ],
  projects: [
    {
      id: "d1-portfolio",
      category: "Full-stack web uygulaması",
      title: "D1 Portföy Platformu",
      image: "/assets/projects-screenshots/portfolio/landing.png",
      summary: "Ziyaretçi deneyimi, güvenli admin paneli ve anlık içerik yönetimini tek yapıda birleştiren portföy platformu.",
      description: [
        "Cloudflare Workers ve D1 üzerinde çalışan içerik API'si ile portföy verileri kod değişikliği gerektirmeden yönetilebilir.",
        "Güvenli oturum, hız sınırlama, doğrulama ve parametrik veritabanı sorguları içerir.",
      ],
      technologies: ["JavaScript", "Cloudflare Workers", "D1", "GitHub Pages"],
      github: "https://github.com/IcarusExE/d1-portfolio-website",
      live: "https://d1-portfolio-website.kenankuscu.workers.dev",
      published: true,
    },
    {
      id: "ders-pusulasi",
      category: "Web uygulaması",
      title: "Ders Pusulası",
      image: "/assets/projects-screenshots/portfolio/projects.png",
      summary: "Ders programını ve bildirim akışını erişilebilir biçimde yöneten web uygulaması.",
      description: [
        "Duyarlı arayüz, tarayıcı bildirimleri ve Cloudflare Workers tabanlı servislerle geliştirildi.",
      ],
      technologies: ["JavaScript", "Responsive UI", "Cloudflare Workers"],
      github: "https://github.com/IcarusExE",
      live: "",
      published: true,
    },
  ],
};
