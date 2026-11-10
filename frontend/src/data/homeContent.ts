export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  linkText: string;
  isStaffing?: boolean;
  featured?: boolean;
  image?: string;
}

export interface WhyChooseItem {
  id: string;
  title: string;
  description: string;
}

export interface HomeContent {
  hero: {
    heading: string;
    description: string;
    primaryCtaText?: string;
    secondaryLinkText?: string;
  };
  services: {
    eyebrow?: string;
    heading: string;
    intro: string;
    items: ServiceItem[];
  };
  about: {
    heading: string;
    subheading: string;
    highlight: string;
    paragraphs: string[];
    buttonText: string;
    statsConfig: {
      showStats: boolean;
      text: string;
    };
  };
  whyChoose: {
    eyebrow?: string;
    heading: string;
    intro: string;
    items: WhyChooseItem[];
  };
}

export const homeContent: HomeContent = {
  hero: {
    heading: "We build business software, manage cloud systems, and supply tech talent",
    description:
      "We support client technology and staffing needs from our offices in Dubai and Chennai. Work directly with our developers and systems engineers to deliver projects on your schedule.",
    primaryCtaText: "Talk to our team",
    secondaryLinkText: "About us",
  },
  services: {
    eyebrow: "Services",
    heading: "Services and capabilities",
    intro:
      "We write software, manage cloud deployments, review security, and place technical contractors.",
    items: [
      {
        id: "custom-software",
        title: "Custom Software",
        description:
          "We build web applications, internal tools, and APIs using React.js, Node, Python, Java etc., Our developers write clean code and hand over full repository ownership to your team.",
        linkText: "View our software process",
        isStaffing: false,
      },
      {
        id: "cloud-infrastructure",
        title: "Cloud Infrastructure",
        description:
          "Your servers and databases run on AWS or Azure with automated deployment pipelines set up by our team. We monitor uptime, resolve configuration issues, and review cloud spending monthly.",
        linkText: "Read about cloud setup",
        featured: true,
        image: "/cloud-infrastructure.jpg",
        isStaffing: false,
      },
      {
        id: "cybersecurity",
        title: "Cybersecurity",
        description:
          "Our security assessments check for unpatched software, exposed ports, and loose account permissions across your systems. You receive a prioritized list of vulnerabilities with exact steps to fix each one.",
        linkText: "See our security checklist",
        isStaffing: false,
      },
      {
        id: "data-ai",
        title: "Data Analytics & AI",
        description:
          "Company data often sits scattered across separate spreadsheets, databases, and third-party tools. We clean those sources, write automated SQL pipelines, and create shared operational dashboards.",
        linkText: "Learn about data pipelines",
        isStaffing: false,
      },
      {
        id: "enterprise-solutions",
        title: "Enterprise Systems",
        description:
          "We configure and connect CRM, ERP, and supply chain platforms like ERP, CRM and custom plugins. Inventory records, sales orders, and customer accounts stay synchronized across departments.",
        linkText: "See how we connect systems",
        isStaffing: false,
      },
      {
        id: "it-staffing",
        title: "IT Staffing & Technical Talent",
        description:
          "Finding reliable developers takes time that internal hiring teams rarely have. We match your open roles with pre-screened software engineers on contract or full-time terms.",
        linkText: "How we place engineers",
        isStaffing: true,
      },
    ],
  },
  about: {
    heading: "Who we are",
    subheading: "IT consulting and technical staffing from Dubai and Chennai",
    highlight:
      "The Jobsync is an IT consulting and services company with offices in Dubai and Chennai.",
    paragraphs: [
      "We build business software, configure cloud infrastructure, and audit security for companies in UAE and India.",
      "Our staffing group also supplies contract developers and technical leads directly to client engineering teams.",
      "We take on fixed-scope engineering contracts as well as monthly maintenance and staffing engagements.",
    ],
    buttonText: "Read more about us",
    statsConfig: {
      showStats: false, // Default: hidden per requirement
      text: "Offices in Dubai and Chennai",
    },
  },
  whyChoose: {
    eyebrow: "The Jobsync Advantage",
    heading: "Why Choose Us",
    intro:
      "Delivering enterprise technology solutions, strategic consulting, and reliable engineering capabilities tailored to your business needs.",
    items: [
      {
        id: "end-to-end",
        title: "End-to-End Solutions",
        description:
          "Comprehensive capabilities spanning strategic consulting, custom development, cloud deployment, enterprise applications, and ongoing managed IT services.",
      },
      {
        id: "efficiency",
        title: "Improved Operational Efficiency",
        description:
          "Optimizing enterprise workflows and technology infrastructure so your organization operates with maximum speed, agility, and precision.",
      },
      {
        id: "cost",
        title: "Reduced Costs",
        description:
          "Scalable software architectures and strategic resource planning that minimize infrastructure overhead and optimize total cost of ownership.",
      },
      {
        id: "security",
        title: "Enhanced Security",
        description:
          "Proactive cybersecurity practices, robust compliance standards, and continuous protection safeguarding critical organizational assets and data.",
      },
      {
        id: "scalability",
        title: "Business Scalability",
        description:
          "Flexible cloud-native architectures and on-demand tech staffing tailored to scale smoothly as your customer base and operations expand across markets.",
      },
    ],
  },
};
