export interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  tier: 'TITAN' | 'PLATINUM' | 'GOLD' | 'SPOTLIGHT';
  category: string;
  link: string;
}

export const partners: Partner[] = [
  {
    id: "1",
    name: "Modal",
    logo: "https://modal.com/logo.svg",
    description: "Powering our high-performance AI experiments and serverless infrastructure for community projects.",
    tier: "TITAN",
    category: "AI Infrastructure",
    link: "https://modal.com"
  },
  {
    id: "2",
    name: "NousResearch",
    logo: "https://nousresearch.com/logo.png",
    description: "Advancing open-source intelligence and providing the models that fuel our latent space explorations.",
    tier: "TITAN",
    category: "Intelligence & Research",
    link: "https://nousresearch.com"
  },
  {
    id: "3",
    name: "Cloudflare",
    logo: "https://www.cloudflare.com/img/logo-cloudflare-dark.svg",
    description: "Securing our digital perimeter and ensuring low-latency delivery of weird internet things.",
    tier: "PLATINUM",
    category: "Security & Network",
    link: "https://cloudflare.com"
  },
  {
    id: "4",
    name: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png",
    description: "Providing the compute and cloud primitives that allow us to scale our creative output.",
    tier: "PLATINUM",
    category: "Cloud Computing",
    link: "https://google.com"
  },
  {
    id: "5",
    name: "Silicon Slopes",
    logo: "https://www.siliconslopes.com/content/images/2023/04/Silicon-Slopes-Logo-Vertical-Black.png",
    description: "Vibes & Highs emerged from the Silicon Slopes Start School community. We are proud to spotlight the network that helped spark our origin and continues to champion Utah's builder scene.",
    tier: "SPOTLIGHT",
    category: "Community & Origins",
    link: "https://www.siliconslopes.com/"
  }
];
