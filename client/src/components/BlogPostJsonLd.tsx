import type { BlogPost } from "@shared/schema";

interface BlogPostJsonLdProps {
  post: BlogPost;
}

export default function BlogPostJsonLd({ post }: BlogPostJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "url": `https://americanseekersacademy.com/blog/${post.slug}`,
    "datePublished": post.publishedAt || post.createdAt,
    "author": {
      "@type": "Organization",
      "name": "American Seekers Academy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "American Seekers Academy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://americanseekersacademy.com/favicon.png"
      }
    },
    ...(post.featuredImage && {
      image: post.featuredImage
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
