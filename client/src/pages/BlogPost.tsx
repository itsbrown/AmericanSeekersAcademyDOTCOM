import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Calendar, ArrowLeft, Share2 } from "lucide-react";
import { SiFacebook, SiX, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost as BlogPostType } from "@shared/schema";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery<{ success: boolean; post: BlogPostType }>({
    queryKey: ["/api/blog", slug],
  });

  const post = data?.post;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[hsl(40,33%,98%)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-[#1e3a5f] mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button variant="outline" data-testid="back-to-blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)]">
      {isLoading ? (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : post ? (
        <>
          <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-12">
            <div className="container mx-auto px-4 max-w-4xl">
              <Link href="/blog">
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-[#c4a052] hover:bg-white/10 mb-6"
                  data-testid="back-to-blog"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold">
                {post.title}
              </h1>
              {post.publishedAt && (
                <div className="flex items-center mt-4 text-white/80">
                  <Calendar className="w-5 h-5 mr-2" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              )}
            </div>
          </div>

          <article className="container mx-auto px-4 py-12 max-w-4xl">
            {post.featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-[#1e3a5f] prose-a:text-[#c4a052]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <span className="flex items-center text-gray-600 font-medium">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share this article:
                </span>
                <div className="flex gap-3">
                  <a
                    href={shareLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#1e3a5f] text-white hover:bg-[#c4a052] transition-colors"
                    data-testid="share-facebook"
                  >
                    <SiFacebook className="w-5 h-5" />
                  </a>
                  <a
                    href={shareLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#1e3a5f] text-white hover:bg-[#c4a052] transition-colors"
                    data-testid="share-twitter"
                  >
                    <SiX className="w-5 h-5" />
                  </a>
                  <a
                    href={shareLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-[#1e3a5f] text-white hover:bg-[#c4a052] transition-colors"
                    data-testid="share-linkedin"
                  >
                    <SiLinkedin className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        </>
      ) : null}
    </div>
  );
}
