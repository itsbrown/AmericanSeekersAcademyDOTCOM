import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

// Generate sitemap during build
function sitemapPlugin() {
  return {
    name: 'generate-sitemap',
    writeBundle() {
      const baseUrl = 'https://americanseekersacademy.com';
      const staticPages = [
        '',
        '/blog',
        '/privacy-policy',
        '/terms-of-use',
        '/sms-policy',
      ];

      const programSlugs = ['macaronis', 'yankee-doodle', 'tycoons', 'seekers', 'pioneers', 'patriots'];

      const urls = [
        ...staticPages.map(p => `${baseUrl}${p}`),
        ...programSlugs.map(slug => `${baseUrl}/programs/${slug}`),
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === baseUrl ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;

      const outDir = path.resolve(import.meta.dirname, "dist/public");
      fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
      console.log('✓ Generated sitemap.xml');
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    sitemapPlugin(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
