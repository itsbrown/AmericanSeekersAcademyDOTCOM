import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
}

export default function SEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title.includes("American Seekers Academy")
      ? title
      : `${title} | American Seekers Academy`;

    // Update title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const updateMeta = (selector: string, attr: string, content: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (element) {
        element.setAttribute("content", content);
      } else {
        element = document.createElement("meta");
        if (attr === "property") {
          element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        } else {
          element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
        }
        element.setAttribute("content", content);
        document.head.appendChild(element);
      }
    };

    // Basic meta
    if (description) {
      updateMeta('meta[name="description"]', "content", description);
    }

    // Open Graph
    updateMeta('meta[property="og:title"]', "property", fullTitle);
    if (description) {
      updateMeta('meta[property="og:description"]', "property", description);
    }
    updateMeta('meta[property="og:type"]', "property", type);
    if (url) {
      updateMeta('meta[property="og:url"]', "property", url);
    }
    if (image) {
      updateMeta('meta[property="og:image"]', "property", image);
    }

    // Twitter
    updateMeta('meta[name="twitter:title"]', "content", fullTitle);
    if (description) {
      updateMeta('meta[name="twitter:description"]', "content", description);
    }
    if (image) {
      updateMeta('meta[name="twitter:image"]', "content", image);
      updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (url) {
      if (canonical) {
        canonical.href = url;
      } else {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        canonical.href = url;
        document.head.appendChild(canonical);
      }
    }
  }, [title, description, image, url, type]);

  return null;
}
