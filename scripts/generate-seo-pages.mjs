import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const site = {
  name: 'MarieCoder',
  origin: 'https://mariecoder.com',
  description: 'MarieCoder is a Salt Lake City creative coding meetup for AI experiments, internet projects, and unfinished side quests.',
  image: 'https://mariecoder.com/social-preview.png',
  imageAlt: 'MarieCoder creative coding meetup preview card',
  imageWidth: 1200,
  imageHeight: 630,
  icon: 'https://mariecoder.com/favicon.png',
  twitterHandle: '@goldeneggie',
  modified: '2026-06-26',
};

const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

const routes = [
  {
    path: '/',
    title: 'MarieCoder | Build Weird Things in Salt Lake City',
    description: site.description,
    keywords: ['MarieCoder', 'Salt Lake City', 'creative coding', 'AI meetup', 'internet projects', 'tech community', 'builders', 'artists'],
    priority: '1.0',
    changefreq: 'weekly',
    schemaType: 'WebPage',
    breadcrumbs: [{ name: 'Home', path: '/' }],
    extraSchemas: [
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is MarieCoder?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'MarieCoder is a casual meetup for builders, artists, designers, developers, and researchers in Salt Lake City.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is MarieCoder free to attend?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'MarieCoder meetups are community-driven and free to attend.',
            },
          },
        ],
      },
    ],
  },
  {
    path: '/editorial',
    title: 'Journal | Latent & Logic | MarieCoder',
    description: 'Field notes and essays on AI exploration, creative coding, internet projects, and the culture of building unusual things.',
    keywords: ['MarieCoder journal', 'creative coding essays', 'AI exploration', 'latent space', 'internet projects'],
    priority: '0.8',
    changefreq: 'weekly',
    schemaType: 'CollectionPage',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Journal', path: '/editorial' },
    ],
  },
  {
    path: '/partners',
    title: 'Community Ecosystem | MarieCoder',
    description: 'A directory of friends, tools, and infrastructure supporting the MarieCoder creative coding community.',
    keywords: ['MarieCoder partners', 'Salt Lake City tech community', 'AI infrastructure', 'creative coding community'],
    priority: '0.7',
    changefreq: 'weekly',
    schemaType: 'CollectionPage',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Community', path: '/partners' },
    ],
  },
  {
    path: '/lumi',
    title: 'LUMI Coding Companion | MarieCoder',
    description: 'A comfort-first agentic coding companion for VS Code with human-in-the-loop approvals, typed tools, and checkpointed workflows.',
    keywords: ['LUMI', 'coding companion', 'VS Code extension', 'agentic coding', 'human in the loop', 'developer tools'],
    priority: '0.6',
    changefreq: 'monthly',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'LUMI', path: '/lumi' },
    ],
    extraSchemas: [
      {
        '@type': 'SoftwareApplication',
        name: 'LUMI',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Visual Studio Code',
        description: 'A comfort-first agentic coding companion for VS Code.',
        url: 'https://mariecoder.com/lumi',
        publisher: { '@id': 'https://mariecoder.com/#organization' },
      },
    ],
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | MarieCoder',
    description: 'Privacy policy and data handling information for the MarieCoder community site.',
    keywords: ['MarieCoder privacy', 'privacy policy'],
    priority: '0.1',
    changefreq: 'yearly',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
  },
  {
    path: '/terms',
    title: 'Terms of Service | MarieCoder',
    description: 'Terms of service and community rules for the MarieCoder community site.',
    keywords: ['MarieCoder terms', 'terms of service'],
    priority: '0.1',
    changefreq: 'yearly',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Terms of Service', path: '/terms' },
    ],
  },
  {
    path: '/conduct',
    title: 'Code of Conduct | MarieCoder',
    description: 'Community standards and expectations for participation in MarieCoder spaces.',
    keywords: ['MarieCoder code of conduct', 'community standards'],
    priority: '0.1',
    changefreq: 'yearly',
    schemaType: 'WebPage',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Code of Conduct', path: '/conduct' },
    ],
  },
];

const absoluteUrl = (routePath) => routePath === '/' ? `${site.origin}/` : `${site.origin}${routePath}`;

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const escapeAttr = (value) => escapeHtml(value).replaceAll('"', '&quot;');

const renderMeta = (route) => {
  const url = absoluteUrl(route.path);
  const keywords = route.keywords.join(', ');
  const structuredData = buildStructuredData(route);

  return `    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeAttr(route.description)}" />
    <meta name="keywords" content="${escapeAttr(keywords)}" />
    <meta name="author" content="${site.name}" />
    <meta name="application-name" content="${site.name}" />
    <meta name="robots" content="${robots}" />
    <meta name="googlebot" content="${robots}" />
    <meta name="bingbot" content="${robots}" />
    <meta name="rating" content="general" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta name="format-detection" content="telephone=no, address=no, email=no" />
    <meta name="color-scheme" content="dark light" />
    <meta name="theme-color" content="#0A0A0B" />
    <link rel="canonical" href="${url}" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:title" content="${escapeAttr(route.title)}" />
    <meta property="og:description" content="${escapeAttr(route.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:image" content="${site.image}" />
    <meta property="og:image:url" content="${site.image}" />
    <meta property="og:image:secure_url" content="${site.image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="${site.imageWidth}" />
    <meta property="og:image:height" content="${site.imageHeight}" />
    <meta property="og:image:alt" content="${escapeAttr(site.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="${site.twitterHandle}" />
    <meta name="twitter:creator" content="${site.twitterHandle}" />
    <meta name="twitter:domain" content="mariecoder.com" />
    <meta name="twitter:url" content="${url}" />
    <meta name="twitter:title" content="${escapeAttr(route.title)}" />
    <meta name="twitter:description" content="${escapeAttr(route.description)}" />
    <meta name="twitter:image" content="${site.image}" />
    <meta name="twitter:image:alt" content="${escapeAttr(site.imageAlt)}" />
    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>
    <title>${escapeHtml(route.title)}</title>`;
};

const buildStructuredData = (route) => {
  const url = absoluteUrl(route.path);
  const graph = [
    {
      '@type': 'Organization',
      '@id': `${site.origin}/#organization`,
      name: site.name,
      url: `${site.origin}/`,
      logo: {
        '@type': 'ImageObject',
        url: site.icon,
        width: 1024,
        height: 1024,
      },
      image: {
        '@type': 'ImageObject',
        url: site.image,
        width: site.imageWidth,
        height: site.imageHeight,
      },
      sameAs: [
        'https://x.com/goldeneggie',
        'https://discord.gg/ua5UUXZTyz',
        'https://github.com/cardsorting',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${site.origin}/#website`,
      name: site.name,
      url: `${site.origin}/`,
      description: site.description,
      publisher: { '@id': `${site.origin}/#organization` },
    },
    {
      '@type': route.schemaType,
      '@id': `${url}#webpage`,
      url,
      name: route.title,
      description: route.description,
      dateModified: site.modified,
      isPartOf: { '@id': `${site.origin}/#website` },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: site.image,
        width: site.imageWidth,
        height: site.imageHeight,
      },
    },
  ];

  if (route.breadcrumbs?.length > 1) {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: route.breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: absoluteUrl(item.path),
      })),
    });
  }

  if (route.extraSchemas) {
    graph.push(...route.extraSchemas);
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
};

const extractBuildAssets = (html) => {
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
  return [
    ...head.matchAll(/<(?:script|link)\b(?=[^>]*(?:\/assets\/|rel="modulepreload"))[\s\S]*?(?:<\/script>|>)/gi),
  ].map((match) => `    ${match[0].trim()}`).join('\n');
};

const renderHtml = (route, body, buildAssets) => `<!doctype html>
<html lang="en" prefix="og: https://ogp.me/ns#">
  <head>
${renderMeta(route)}
${buildAssets}
  </head>
${body}
</html>
`;

const routeFiles = (route) => {
  if (route.path === '/') return [path.join(distDir, 'index.html')];
  const cleanPath = route.path.replace(/^\//, '');
  return [
    path.join(distDir, `${cleanPath}.html`),
    path.join(distDir, cleanPath, 'index.html'),
  ];
};

const writeRouteHtml = async (route, html) => {
  for (const file of routeFiles(route)) {
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, html);
  }
};

const renderSitemap = () => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${routes.map((route) => `  <url>
    <loc>${absoluteUrl(route.path)}</loc>
    <lastmod>${site.modified}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <image:image>
      <image:loc>${site.image}</image:loc>
      <image:title>${escapeHtml(site.imageAlt)}</image:title>
    </image:image>
  </url>`).join('\n')}
</urlset>
`;

const main = async () => {
  const baseHtml = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const body = baseHtml.match(/<body[\s\S]*?<\/body>/i)?.[0];
  if (!body) throw new Error('Could not find body in dist/index.html');

  const buildAssets = extractBuildAssets(baseHtml);
  if (!buildAssets) throw new Error('Could not find built asset tags in dist/index.html');

  for (const route of routes) {
    await writeRouteHtml(route, renderHtml(route, body, buildAssets));
  }

  await writeFile(path.join(distDir, 'sitemap.xml'), renderSitemap());
  console.log(`Generated SEO HTML for ${routes.length} routes.`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
