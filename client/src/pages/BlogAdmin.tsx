import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft, Lock, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { BlogPost, InsertBlogPost } from "@shared/schema";
import { useAdminAuth, getAuthHeaders } from "@/hooks/use-admin-auth";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function BlogAdmin() {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const {
    isAuthenticated,
    isLoading: authLoading,
    login,
    logout,
    loginPending,
  } = useAdminAuth();

  // Add robots meta + title (defense in depth + consistency with AdminDashboard)
  useEffect(() => {
    document.title = "Blog Admin | American Seekers Academy";

    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [pendingDeletes, setPendingDeletes] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    published: false,
  });

  const handleUnauthorized = (res: Response) => {
    if (res.status === 401) {
      logout();
      throw new Error("Session expired");
    }
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  const { data, isLoading: postsLoading } = useQuery<{ success: boolean; posts: BlogPost[] }>({
    queryKey: ["/api/blog/all"],
    queryFn: async () => {
      const res = await fetch("/api/blog/all", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    enabled: isAuthenticated,
    retry: false,
  });

  const allPosts = data?.posts || [];
  const posts = allPosts.filter((p) => !pendingDeletes.has(p.id));

  const createMutation = useMutation({
    mutationFn: async (post: Partial<InsertBlogPost>) => {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(post),
      });
      return handleUnauthorized(res);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/blog/all"] });
      await queryClient.refetchQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post created successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create blog post", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBlogPost> }) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      return handleUnauthorized(res);
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["/api/blog/all"] });
      await queryClient.refetchQueries({ queryKey: ["/api/blog"] });
      toast({ title: "Success", description: "Blog post updated successfully" });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update blog post", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      return handleUnauthorized(res);
    },
    onMutate: (id: number) => {
      setPendingDeletes((prev) => new Set(prev).add(id));
    },
    onSuccess: async (_data, id: number) => {
      await queryClient.refetchQueries({ queryKey: ["/api/blog/all"] });
      await queryClient.refetchQueries({ queryKey: ["/api/blog"] });
      setPendingDeletes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({ title: "Success", description: "Blog post deleted successfully" });
    },
    onError: (_err, id: number) => {
      setPendingDeletes((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featuredImage: "",
      published: false,
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage || "",
      published: post.published,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.slug || generateSlug(formData.title);

    if (editingPost) {
      const updateData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage || null,
        published: formData.published,
        publishedAt: formData.published && !editingPost.published ? new Date().toISOString() : (formData.published ? editingPost.publishedAt : null),
      };
      updateMutation.mutate({ id: editingPost.id, data: updateData });
    } else {
      const createData = {
        title: formData.title,
        slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featuredImage: formData.featuredImage || null,
        published: formData.published,
        publishedAt: formData.published ? new Date().toISOString() : null,
      };
      createMutation.mutate(createData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const togglePublish = (post: BlogPost) => {
    const newPublished = !post.published;
    updateMutation.mutate({
      id: post.id,
      data: {
        published: newPublished,
        publishedAt: newPublished ? new Date().toISOString() : null,
      },
    });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(password);
  };

  const handleLogout = async () => {
    await logout();
    setPassword("");
    setIsDialogOpen(false);
    setEditingPost(null);
    setPendingDeletes(new Set());
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-24 flex items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  // Login gate (styled to match AdminDashboard)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="font-serif text-2xl text-[#1e3a5f]">Blog Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-blog-admin-password"
              />
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loginPending}
                data-testid="button-blog-admin-login"
              >
                {loginPending ? "Logging in..." : "Login"}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Link href="/admin">
                <Button variant="ghost" size="sm" className="text-[#1e3a5f]">
                  ← Back to Admin Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated blog admin UI
  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)]">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/blog">
              <Button 
                variant="ghost" 
                className="text-white hover:text-[#c4a052] hover:bg-white/10 mb-4"
                data-testid="back-to-blog"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                View Blog
              </Button>
            </Link>
            <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 text-white border-white/30 hover:bg-white/10" data-testid="button-blog-admin-logout">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold">
            Blog Administration
          </h1>
          <p className="mt-2 text-white/80">
            Manage your blog posts
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif text-[#1e3a5f]">All Posts</h2>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Admin Dashboard
              </Button>
            </Link>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="bg-[#1e3a5f] hover:bg-[#2a4a73]" data-testid="new-post-button">
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-[#1e3a5f]">
                  {editingPost ? "Edit Post" : "Create New Post"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    required
                    data-testid="input-title"
                  />
                </div>
                <div>
                  <Label htmlFor="slug">URL Slug (auto-generated if empty)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="my-blog-post"
                    data-testid="input-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief summary of the post"
                    rows={2}
                    required
                    data-testid="input-excerpt"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Content (HTML supported)</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Full post content..."
                    rows={10}
                    required
                    data-testid="input-content"
                  />
                </div>
                <div>
                  <Label htmlFor="featuredImage">Featured Image URL (optional)</Label>
                  <Input
                    id="featuredImage"
                    value={formData.featuredImage}
                    onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    data-testid="input-featured-image"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                    data-testid="switch-published"
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#1e3a5f] hover:bg-[#2a4a73]"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="submit-post"
                  >
                    {editingPost ? "Update Post" : "Create Post"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {postsLoading ? (
          <div className="text-center py-12">Loading posts...</div>
        ) : posts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-gray-500 mb-4">No blog posts yet.</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-[#1e3a5f] hover:bg-[#2a4a73]">
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id} className="card-elegant" data-testid={`admin-post-${post.id}`}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0">
                  <div className="flex-1">
                    <CardTitle className="font-serif text-lg text-[#1e3a5f] flex items-center gap-2">
                      {post.title}
                      {post.published ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          Draft
                        </span>
                      )}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">/{post.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => togglePublish(post)}
                      title={post.published ? "Unpublish" : "Publish"}
                      data-testid={`toggle-publish-${post.id}`}
                    >
                      {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(post)}
                      data-testid={`edit-post-${post.id}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(post.id)}
                      data-testid={`delete-post-${post.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-2">{post.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
