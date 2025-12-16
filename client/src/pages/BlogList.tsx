import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { BlogPost } from "@shared/schema";

export default function BlogList() {
  const { data, isLoading } = useQuery<{ success: boolean; posts: BlogPost[] }>({
    queryKey: ["/api/blog"],
  });

  const posts = data?.posts || [];

  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)]">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-center">
            Our Blog
          </h1>
          <p className="text-center mt-4 text-lg opacity-90 max-w-2xl mx-auto">
            Insights, tips, and stories about classical education, homeschooling, and raising children with civic virtue.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="card-elegant">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-1/3 mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-2xl font-serif text-[#1e3a5f] mb-4">
              No Blog Posts Yet
            </h2>
            <p className="text-gray-600">
              Check back soon for articles about classical education and homeschooling.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card 
                  className="card-elegant cursor-pointer h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  data-testid={`blog-card-${post.id}`}
                >
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={post.featuredImage} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="font-serif text-xl text-[#1e3a5f] line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      {post.publishedAt && (
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                      <span className="text-[#c4a052] font-medium flex items-center">
                        Read More <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
