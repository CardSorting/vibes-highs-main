export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
}

export const editorialPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Rise of Latent Space Explorers",
    excerpt: "Why the next generation of creative output isn't written, but prompted and steered through multi-dimensional matrices.",
    content: `
      <p>We are entering an era where the boundary between human intent and machine execution has dissolved into a fluid, multi-dimensional space. At Vibes & Highs, we call this the "Latent Age."</p>
      
      <h3>The Architecture of Emergence</h3>
      <p>Traditional coding is deterministic. You write X, you get Y. But working with modern AI models is more like gardening or alchemy. You're not building a structure; you're steering a probability distribution. This shift requires a new kind of "technical intuition"—the ability to sense the edges of what a model can do and pushing it just beyond those limits.</p>
      
      <blockquote>
        "The keyboard is no longer just an input device; it's a steering wheel for a superintelligence."
      </blockquote>
      
      <h3>Weird Projects Only</h3>
      <p>The most interesting things happening in AI right now aren't corporate chatbots or productivity tools. They're the weird experiments: the 2am lofi generators, the sentient terminal prompts, the procedurally generated mythologies. These are the "highs" we're chasing.</p>
      
      <p>When you stop trying to make something "useful" and start trying to make something "interesting," the latent space opens up in ways you never expected.</p>
    `,
    date: "2024-05-01",
    author: "SYSTEM_ALPHA",
    category: "AI_THEORY",
    readTime: "4 MIN",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    tags: ["LATENT_SPACE", "CREATIVE_AI", "THEORY"]
  },
  {
    id: "2",
    title: "Cursed Demos and Divine Failures",
    excerpt: "In praise of the broken, the buggy, and the projects that crash five seconds into the presentation.",
    content: `
      <p>There's a specific magic in a project that is currently on fire. At our Friday sessions, we've seen everything from memory leaks that accidentally create beautiful visual glitches to neural networks that have gone completely "off-script" in the middle of a live demo.</p>
      
      <h3>The Aesthetics of Entropy</h3>
      <p>Most tech culture is obsessed with "production-ready." At Vibes & Highs, we're obsessed with "interesting-ready." A bug isn't just a failure of logic; it's a glimpse into the underlying system's personality. When your code crashes, it's telling you something about the world it lives in.</p>
      
      <p>We encourage people to bring their most "cursed" demos. The ones that only work on your machine, under specific atmospheric conditions, when the moon is in a certain phase. That's where the real innovation happens.</p>
      
      <h3>Case Study: The Ghost in the Terminal</h3>
      <p>Last week, one of our members brought a script that was supposed to summarize local weather data. Instead, due to a misconfigured API hook and a hallucinating LLM, it started writing existential poetry about the "concept of rain." It was useless for checking the weather, but it was the highlight of the night.</p>
    `,
    date: "2024-04-25",
    author: "GHOST_OPERATOR",
    category: "CULTURE",
    readTime: "3 MIN",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200",
    tags: ["GLITCH_ART", "CHAOS", "COMMUNITY"]
  },
  {
    id: "3",
    title: "Post-SaaS: The Return of the Personal Web",
    excerpt: "Breaking free from the platform-industrial complex to build things that don't need to scale, pivot, or monetize.",
    content: `
      <p>The internet used to be a collection of weird, hand-crafted digital houses. Then it became a series of identical white boxes owned by four companies. We're witnessing a quiet rebellion against this homogeneity.</p>
      
      <h3>Small, Beautiful, and Useless</h3>
      <p>The "Vibes" part of Vibes & Highs is about the feeling of building for its own sake. When you don't have a roadmap, a pitch deck, or a KPI, you're free to build things that are "unscalable." You can spend three days perfecting a single hover animation or building an entire operating system for a fictional planet.</p>
      
      <p>This is the personal web. It's not about traffic; it's about expression. It's about making sure the digital world still has texture.</p>
      
      <h3>The No-Monetization Manifesto</h3>
      <p>If you build something to sell it, you've already compromised. If you build something to see it exist, you've already won. The most powerful thing you can do in 2024 is create something that has no value to a venture capitalist, but immense value to a human being.</p>
    `,
    date: "2024-04-18",
    author: "ZERO_ZERO",
    category: "WEB_ART",
    readTime: "5 MIN",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200",
    tags: ["PERSONAL_WEB", "NON_TRANSACTIONAL", "DESIGN"]
  }
];
