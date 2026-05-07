export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  longDescription?: string;
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
}

export const partners: Partner[] = [
  {
    id: "1",
    name: "Modal",
    logo: "https://modal.com/logo.svg",
    description: "Powering our high-performance AI experiments and serverless infrastructure for community projects.",
    longDescription: "Modal is building the cloud for the future of AI. Their serverless platform allows us to run complex machine learning workloads, media processing, and high-performance computing without the overhead of managing infrastructure. For Vibes & Highs, Modal provides the compute backbone for our most ambitious technical experiments.",
    tier: "TITAN",
    category: "AI Infrastructure",
    link: "https://modal.com",
    features: ["Serverless GPU Computing", "Auto-scaling Infrastructure", "Instant Deployments", "Python-native UX"],
    socials: {
      twitter: "https://x.com/modal_labs",
      github: "https://github.com/modal-labs"
    },
    location: "San Francisco, CA"
  },
  {
    id: "2",
    name: "NousResearch",
    logo: "https://nousresearch.com/logo.png",
    description: "Advancing open-source intelligence and providing the models that fuel our latent space explorations.",
    longDescription: "Nous Research is at the forefront of open-source AI development. They focus on fine-tuning and developing state-of-the-art models that rival proprietary systems. Their commitment to open intelligence aligns perfectly with our ethos of creative experimentation and shared knowledge.",
    tier: "TITAN",
    category: "Intelligence & Research",
    link: "https://nousresearch.com",
    features: ["Model Fine-tuning", "Dataset Curation", "Open Source LLMs", "Architectural Innovation"],
    socials: {
      twitter: "https://x.com/NousResearch",
      github: "https://github.com/NousResearch"
    }
  },
  {
    id: "3",
    name: "Cloudflare",
    logo: "https://www.cloudflare.com/img/logo-cloudflare-dark.svg",
    description: "Securing our digital perimeter and ensuring low-latency delivery of weird internet things.",
    longDescription: "Cloudflare is more than just a CDN. It's the security and performance layer of the modern internet. By utilizing Cloudflare Workers and their global edge network, we ensure that Vibes & Highs projects are fast, secure, and always accessible, no matter where our community is located.",
    tier: "PLATINUM",
    category: "Security & Network",
    link: "https://cloudflare.com",
    features: ["Edge Computing", "DDoS Protection", "Zero Trust Security", "Global Content Delivery"],
    socials: {
      twitter: "https://x.com/cloudflare",
      github: "https://github.com/cloudflare"
    },
    location: "Global / San Francisco"
  },
  {
    id: "4",
    name: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
    description: "Providing the compute and cloud primitives that allow us to scale our creative output.",
    longDescription: "Google Cloud Platform provides the fundamental building blocks for our digital infrastructure. From scalable storage to global networking, Google's technical primitives allow us to focus on the creative side of our projects while knowing the foundation is solid.",
    tier: "PLATINUM",
    category: "Cloud Computing",
    link: "https://google.com",
    features: ["Scalable Compute", "Global Fiber Network", "Big Data Analytics", "Kubernetes Leadership"],
    socials: {
      twitter: "https://x.com/googlecloud"
    }
  },
  {
    id: "5",
    name: "Silicon Slopes",
    logo: "https://www.siliconslopes.com/content/images/2023/04/Silicon-Slopes-Logo-Vertical-Black.png",
    description: "Vibes & Highs emerged from the Silicon Slopes Start School community. We are proud to spotlight the network that helped spark our origin.",
    longDescription: "Silicon Slopes is the heart of Utah's technology ecosystem. Vibes & Highs was born out of the 'Start School' initiative, where builders and creators gather to learn and grow. We owe our foundational momentum to this incredible community of entrepreneurs and technical talent.",
    tier: "SPOTLIGHT",
    category: "Community & Origins",
    link: "https://www.siliconslopes.com/",
    features: ["Community Building", "Entrepreneurial Education", "Regional Networking", "Tech Advocacy"],
    socials: {
      twitter: "https://x.com/siliconslopes",
      linkedin: "https://www.linkedin.com/company/silicon-slopes/"
    },
    location: "Lehi, UT"
  }
];

