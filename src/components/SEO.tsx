import { useEffect } from 'react';

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  keywords?: string[];
  structuredData?: object;
  breadcrumbs?: BreadcrumbItem[];
  robots?: string;
  author?: string;
  themeColor?: string;
  twitterHandle?: string;
}

const DEFAULT_TITLE = "Vibes & Highs | Creative Collective & Meetup";
const DEFAULT_DESCRIPTION = "A casual meetup for people who make weird things. Code. Art. Music. Games. AI experiments. Internet projects. Half-finished ideas. Side quests.";
const DEFAULT_URL = "https://mariecoder.com";
const DEFAULT_KEYWORDS = ["creative meetup", "salt lake city", "tech community", "builders", "designers", "artists", "coding meetup", "AI research", "open source", "mariecoder"];
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop";
const DEFAULT_TWITTER_HANDLE = "@goldeneggie";

export default function SEO({ 
  title, 
  description, 
  canonical, 
  ogType = "website", 
  ogImage = DEFAULT_OG_IMAGE,
  keywords = DEFAULT_KEYWORDS,
  structuredData,
  breadcrumbs,
  robots = "index, follow",
  author = "Vibes & Highs Collective",
  themeColor = "#0A0A0B",
  twitterHandle = DEFAULT_TWITTER_HANDLE
}: SEOProps) {
  const fullTitle = title ? `${title} | Vibes & Highs` : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const currentUrl = canonical || window.location.href;

  useEffect(() => {
    // Normalize URL for canonical
    const normalizedUrl = currentUrl.replace(/\/$/, "");

    // Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (selector: string, attr: string, value: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    updateMetaTag('meta[name="description"]', 'name', 'description', fullDescription);
    updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    updateMetaTag('meta[name="author"]', 'name', 'author', author);
    updateMetaTag('meta[name="robots"]', 'name', 'robots', robots);
    updateMetaTag('meta[name="theme-color"]', 'name', 'theme-color', themeColor);
    
    // OpenGraph
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', fullDescription);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', normalizedUrl);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Vibes & Highs');
    
    // Twitter
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', twitterHandle);
    updateMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', twitterHandle);
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', fullDescription);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    // Canonical
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', normalizedUrl);

    // Performance: Preconnect
    const preconnects = ["https://images.unsplash.com", "https://fonts.googleapis.com", "https://fonts.gstatic.com"];
    preconnects.forEach(url => {
      if (!document.querySelector(`link[href="${url}"][rel="preconnect"]`)) {
        const pLink = document.createElement('link');
        pLink.rel = "preconnect";
        pLink.href = url;
        document.head.appendChild(pLink);
      }
    });

    // Structured Data
    const schemas: any[] = [];

    // Base WebSite Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Vibes & Highs",
      "url": DEFAULT_URL,
      "description": DEFAULT_DESCRIPTION,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${DEFAULT_URL}/partners?partner={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    });

    // Organization Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Vibes & Highs Collective",
      "url": DEFAULT_URL,
      "logo": DEFAULT_OG_IMAGE,
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "willcruzdesigner@gmail.com",
        "contactType": "Community Support"
      },
      "sameAs": [
        "https://x.com/goldeneggie",
        "https://discord.gg/ua5UUXZTyz",
        "https://github.com/cardsorting"
      ]
    });

    // Article Schema (if ogType is article)
    if (ogType === "article") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": fullTitle,
        "description": fullDescription,
        "image": ogImage,
        "author": {
          "@type": "Person",
          "name": author
        },
        "publisher": {
          "@type": "Organization",
          "name": "Vibes & Highs Collective",
          "logo": DEFAULT_OG_IMAGE
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": normalizedUrl
        }
      });
    }

    // Custom Structured Data
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        structuredData.forEach(sd => schemas.push({ "@context": "https://schema.org", ...sd }));
      } else {
        schemas.push({
          "@context": "https://schema.org",
          ...structuredData
        });
      }
    }

    // Breadcrumb Schema
    if (breadcrumbs) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": crumb.name,
          "item": crumb.item.startsWith('http') ? crumb.item : `${DEFAULT_URL}${crumb.item}`
        }))
      });
    }

    let script = document.getElementById('structured-data') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'structured-data';
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.text = JSON.stringify(schemas);

  }, [fullTitle, fullDescription, currentUrl, ogType, ogImage, keywords, structuredData, breadcrumbs, robots, author, themeColor, twitterHandle]);

  return null;
}



