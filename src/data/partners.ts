export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  longDescription?: string;
  eli5?: string; // "Explain Like I'm Five" - non-technical summary
  systemRole?: string; // Role in the ecosystem (e.g., "The Brain", "The Engine", "The Shield")
  tier: 'TITAN' | 'PLATINUM' | 'GOLD' | 'SPOTLIGHT';
  category: string;
  link: string;
  features?: string[];
  socials?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  founded?: string;
  location?: string;
  impactMetrics?: {
    label: string;
    value: string;
    trend: 'up' | 'stable' | 'down';
  }[];
  integrationNotes?: string;
}

export const partners: Partner[] = [
  {
    id: "modal",
    name: "Modal",
    logo: "https://modal.com/logo.svg",
    description: "Powering our high-performance AI experiments and serverless infrastructure for community projects.",
    longDescription: "Modal is building the cloud for the future of AI. Their serverless platform allows us to run complex machine learning workloads, media processing, and high-performance computing without the overhead of managing infrastructure.",
    eli5: "A super-fast computer in the cloud that we can rent by the second to run smart AI programs without having to build our own servers.",
    systemRole: "THE ENGINE",
    tier: "TITAN",
    category: "AI Infrastructure",
    link: "https://modal.com",
    features: ["Serverless GPU Computing", "Auto-scaling Infrastructure", "Instant Deployments", "Python-native UX"],
    socials: {
      twitter: "https://x.com/modal_labs",
      github: "https://github.com/modal-labs"
    },
    location: "San Francisco, CA",
    impactMetrics: [
      { label: "Cold Start Time", value: "< 2.0s", trend: "up" },
      { label: "GPU Availability", value: "On-Demand", trend: "stable" },
      { label: "Developer NPS", value: "98/100", trend: "up" }
    ],
    integrationNotes: "Primary provider for all heavy-duty AI workloads. Native Python integration makes it a favorite among our researcher cohort."
  },
  {
    id: "nousresearch",
    name: "NousResearch",
    logo: "https://nousresearch.com/logo.png",
    description: "Advancing open-source intelligence and providing the models that fuel our latent space explorations.",
    longDescription: "Nous Research is at the forefront of open-source AI development. They focus on fine-tuning and developing state-of-the-art models that rival proprietary systems.",
    eli5: "A group of researchers making open-source 'brains' for AI that anyone can use and learn from, making sure smart technology isn't just owned by big companies.",
    systemRole: "THE INTELLIGENCE",
    tier: "TITAN",
    category: "Intelligence & Research",
    link: "https://nousresearch.com",
    features: ["Model Fine-tuning", "Dataset Curation", "Open Source LLMs", "Architectural Innovation"],
    socials: {
      twitter: "https://x.com/NousResearch",
      github: "https://github.com/NousResearch"
    },
    impactMetrics: [
      { label: "Model Downloads", value: "1M+", trend: "up" },
      { label: "Research Citations", value: "Exponential", trend: "up" },
      { label: "Community Devs", value: "2.5K+", trend: "up" }
    ],
    integrationNotes: "Knowledge partner. We frequently use Nous-tuned models as the baseline for our custom fine-tuning experiments."
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    logo: "https://www.cloudflare.com/img/logo-cloudflare-dark.svg",
    description: "Securing our digital perimeter and ensuring low-latency delivery of weird internet things.",
    longDescription: "Cloudflare is more than just a CDN. It's the security and performance layer of the modern internet. By utilizing Cloudflare Workers and their global edge network.",
    eli5: "A digital security guard and delivery service that makes sure our website is safe from hackers and loads incredibly fast for everyone around the world.",
    systemRole: "THE SHIELD",
    tier: "PLATINUM",
    category: "Security & Network",
    link: "https://cloudflare.com",
    features: ["Edge Computing", "DDoS Protection", "Zero Trust Security", "Global Content Delivery"],
    socials: {
      twitter: "https://x.com/cloudflare",
      github: "https://github.com/cloudflare"
    },
    location: "Global / San Francisco",
    impactMetrics: [
      { label: "Network Coverage", value: "310+ Cities", trend: "up" },
      { label: "Request Velocity", value: "50M/sec", trend: "up" },
      { label: "Community Trust", value: "High", trend: "stable" }
    ],
    integrationNotes: "Fully integrated into the SLC AI Town Hall backbone. Currently exploring Cloudflare AI at the edge for low-latency inference experiments."
  },
  {
    id: "google",
    name: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
    description: "Providing the compute and cloud primitives that allow us to scale our creative output.",
    longDescription: "Google Cloud Platform provides the fundamental building blocks for our digital infrastructure. From scalable storage to global networking.",
    eli5: "The giant toolkit we use to store our data and connect our projects to the rest of the world using some of the most powerful technology on Earth.",
    systemRole: "THE FOUNDATION",
    tier: "PLATINUM",
    category: "Cloud Computing",
    link: "https://google.com",
    features: ["Scalable Compute", "Global Fiber Network", "Big Data Analytics", "Kubernetes Leadership"],
    socials: {
      twitter: "https://x.com/googlecloud"
    }
  },
  {
    id: "silicon-slopes",
    name: "Silicon Slopes",
    logo: "https://www.siliconslopes.com/content/images/2023/04/Silicon-Slopes-Logo-Vertical-Black.png",
    description: "SLC AI Town Hall emerged from the Silicon Slopes Start School community.",
    longDescription: "Silicon Slopes is the heart of Utah's technology ecosystem. SLC AI Town Hall was born out of the 'Start School' initiative, where builders and creators gather to learn and grow.",
    eli5: "The community of creators in Utah where SLC AI Town Hall first started, helping us find our feet and grow as a group of builders.",
    systemRole: "THE ROOTS",
    tier: "SPOTLIGHT",
    category: "Community & Origins",
    link: "https://www.siliconslopes.com/",
    features: ["Community Building", "Entrepreneurial Education", "Regional Networking", "Tech Advocacy"],
    socials: {
      twitter: "https://x.com/siliconslopes",
      linkedin: "https://www.linkedin.com/company/silicon-slopes/"
    },
    location: "Lehi, UT"
  },
  {
    id: "forge-utah",
    name: "Forge Utah",
    logo: "https://forgeutah.tech/logo.png",
    description: "Building a high-density, non-profit community specifically for technologists, creators, and developers in Utah.",
    longDescription: "Forge Utah is a dedicated 501(c)(3) non-profit organization focused entirely on building and empowering a thriving community for technologists, developers, and engineers in Utah. Through hands-on meetups, professional networking, and deep technical resource curation, they champion high-density collaboration and support for the builders of tomorrow.",
    eli5: "A friendly not-for-profit group in Utah that brings programmers, developers, and engineers together to share ideas, learn new skills, and support each other.",
    systemRole: "THE COHORT",
    tier: "SPOTLIGHT",
    category: "Community & Origins",
    link: "https://forgeutah.tech/",
    features: ["Community Infrastructure", "Technologist Networking", "Developer Workshops", "Collaborative Growth"],
    socials: {
      linkedin: "https://www.linkedin.com/company/forge-utah/"
    },
    location: "Utah, USA"
  }
];
