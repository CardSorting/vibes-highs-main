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
  ogImageAlt?: string;
  keywords?: string[];
  structuredData?: object;
  breadcrumbs?: BreadcrumbItem[];
  robots?: string;
  author?: string;
  themeColor?: string;
  twitterHandle?: string;
}

const SITE_NAME = "MarieCoder";
const DEFAULT_TITLE = "MarieCoder | Build Weird Things in Salt Lake City";
const DEFAULT_DESCRIPTION = "MarieCoder is a Salt Lake City creative coding meetup for AI experiments, internet projects, and unfinished side quests.";
const DEFAULT_URL = "https://mariecoder.com";
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const DEFAULT_KEYWORDS = ["creative meetup", "salt lake city", "tech community", "builders", "designers", "artists", "coding meetup", "AI research", "open source", "mariecoder"];
const DEFAULT_OG_IMAGE = `${DEFAULT_URL}/social-preview.png`;
const DEFAULT_OG_IMAGE_ALT = "MarieCoder creative coding meetup preview card";
const DEFAULT_OG_IMAGE_WIDTH = "1200";
const DEFAULT_OG_IMAGE_HEIGHT = "630";
const DEFAULT_TWITTER_HANDLE = "@goldeneggie";

const toAbsoluteUrl = (url: string) => {
  try {
    return new URL(url, DEFAULT_URL).toString();
  } catch {
    return DEFAULT_OG_IMAGE;
  }
};

const normalizeUrl = (url: string) => {
  const cleanUrl = url.replace(/#.*$/, "");
  try {
    const parsed = new URL(cleanUrl);
    if (parsed.pathname !== "/") {
      parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return cleanUrl.replace(/\/$/, "");
  }
};

const getImageType = (url: string) => {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".svg")) return "image/svg+xml";
  } catch {
    return "image/png";
  }
  return url === DEFAULT_OG_IMAGE ? "image/png" : "image/jpeg";
};

export default function SEO({ 
  title, 
  description, 
  canonical, 
  ogType = "website", 
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt = DEFAULT_OG_IMAGE_ALT,
  keywords = DEFAULT_KEYWORDS,
  structuredData,
  breadcrumbs,
  robots = DEFAULT_ROBOTS,
  author = "MarieCoder",
  themeColor = "#0A0A0B",
  twitterHandle = DEFAULT_TWITTER_HANDLE
}: SEOProps) {
  const fullTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : DEFAULT_TITLE;
  const fullDescription = description || DEFAULT_DESCRIPTION;
  const currentUrl = canonical || (typeof window !== "undefined" ? window.location.href : DEFAULT_URL);
  const absoluteOgImage = toAbsoluteUrl(ogImage);
  const ogImageType = getImageType(absoluteOgImage);

  useEffect(() => {
    // Normalize URL for canonical
    const normalizedUrl = normalizeUrl(currentUrl);

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
    updateMetaTag('meta[name="googlebot"]', 'name', 'googlebot', robots);
    updateMetaTag('meta[name="bingbot"]', 'name', 'bingbot', robots);
    updateMetaTag('meta[name="application-name"]', 'name', 'application-name', SITE_NAME);
    updateMetaTag('meta[name="referrer"]', 'name', 'referrer', 'strict-origin-when-cross-origin');
    updateMetaTag('meta[name="rating"]', 'name', 'rating', 'general');
    updateMetaTag('meta[name="color-scheme"]', 'name', 'color-scheme', 'dark light');
    updateMetaTag('meta[name="theme-color"]', 'name', 'theme-color', themeColor);
    
    // OpenGraph
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', fullDescription);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', normalizedUrl);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', absoluteOgImage);
    updateMetaTag('meta[property="og:image:url"]', 'property', 'og:image:url', absoluteOgImage);
    updateMetaTag('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', absoluteOgImage);
    updateMetaTag('meta[property="og:image:type"]', 'property', 'og:image:type', ogImageType);
    updateMetaTag('meta[property="og:image:width"]', 'property', 'og:image:width', DEFAULT_OG_IMAGE_WIDTH);
    updateMetaTag('meta[property="og:image:height"]', 'property', 'og:image:height', DEFAULT_OG_IMAGE_HEIGHT);
    updateMetaTag('meta[property="og:image:alt"]', 'property', 'og:image:alt', ogImageAlt);
    updateMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'en_US');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_NAME);
    
    // Twitter
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:site"]', 'name', 'twitter:site', twitterHandle);
    updateMetaTag('meta[name="twitter:creator"]', 'name', 'twitter:creator', twitterHandle);
    updateMetaTag('meta[name="twitter:domain"]', 'name', 'twitter:domain', 'mariecoder.com');
    updateMetaTag('meta[name="twitter:url"]', 'name', 'twitter:url', normalizedUrl);
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', fullDescription);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', absoluteOgImage);
    updateMetaTag('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', ogImageAlt);

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
      "@id": `${DEFAULT_URL}/#website`,
      "name": SITE_NAME,
      "url": DEFAULT_URL,
      "description": DEFAULT_DESCRIPTION,
      "publisher": {
        "@id": `${DEFAULT_URL}/#organization`
      },
      "image": {
        "@type": "ImageObject",
        "url": absoluteOgImage,
        "width": Number(DEFAULT_OG_IMAGE_WIDTH),
        "height": Number(DEFAULT_OG_IMAGE_HEIGHT)
      },
    });

    // Organization Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${DEFAULT_URL}/#organization`,
      "name": SITE_NAME,
      "url": DEFAULT_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${DEFAULT_URL}/favicon.png`,
        "width": 1024,
        "height": 1024
      },
      "image": {
        "@type": "ImageObject",
        "url": DEFAULT_OG_IMAGE,
        "width": Number(DEFAULT_OG_IMAGE_WIDTH),
        "height": Number(DEFAULT_OG_IMAGE_HEIGHT)
      },
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

    // Current WebPage Schema
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": normalizedUrl,
      "url": normalizedUrl,
      "name": fullTitle,
      "description": fullDescription,
      "isPartOf": {
        "@id": `${DEFAULT_URL}/#website`
      },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": absoluteOgImage,
        "width": Number(DEFAULT_OG_IMAGE_WIDTH),
        "height": Number(DEFAULT_OG_IMAGE_HEIGHT)
      }
    });

    // Article Schema (if ogType is article)
    if (ogType === "article") {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": fullTitle,
        "description": fullDescription,
        "image": absoluteOgImage,
        "author": {
          "@type": "Person",
          "name": author
        },
        "publisher": {
          "@type": "Organization",
          "name": SITE_NAME,
          "logo": {
            "@type": "ImageObject",
            "url": DEFAULT_OG_IMAGE,
            "width": Number(DEFAULT_OG_IMAGE_WIDTH),
            "height": Number(DEFAULT_OG_IMAGE_HEIGHT)
          }
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

  }, [fullTitle, fullDescription, currentUrl, ogType, absoluteOgImage, ogImageType, ogImageAlt, keywords, structuredData, breadcrumbs, robots, author, themeColor, twitterHandle]);

  return null;
}
