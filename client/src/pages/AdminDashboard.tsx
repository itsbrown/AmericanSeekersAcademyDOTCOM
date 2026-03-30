import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LayoutDashboard, Users, MapPin, GraduationCap, Mail, BarChart3, LogOut, Eye, FileText, Megaphone, Pin, Trash2, Globe, EyeOff, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertAnnouncementSchema, type InsertAnnouncement, type Announcement } from "@shared/schema";
import type { ContactInquiry, LocationSuggestion, ProgramInfoRequest, Newsletter, PageView } from "@shared/schema";

const AUTH_TOKEN_KEY = "admin_token";

function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

function setStoredToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function clearStoredToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getStoredToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Admin Dashboard | American Seekers Academy";
    
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      const token = getStoredToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
        } else {
          clearStoredToken();
        }
      } catch {
        clearStoredToken();
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (pwd: string) => {
      const res = await apiRequest("POST", "/api/admin/login", { password: pwd });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.success && data.token) {
        setStoredToken(data.token);
        setIsAuthenticated(true);
        toast({ title: "Logged in successfully" });
      }
    },
    onError: () => {
      toast({ title: "Invalid password", variant: "destructive" });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(password);
  };

  const handleLogout = async () => {
    const token = getStoredToken();
    if (token) {
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {}
    }
    clearStoredToken();
    setIsAuthenticated(false);
    setPassword("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-24 flex items-center justify-center">
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-24 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="font-serif text-2xl text-[#1e3a5f]">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-admin-password"
              />
              <Button
                type="submit"
                className="w-full btn-primary"
                disabled={loginMutation.isPending}
                data-testid="button-admin-login"
              >
                {loginMutation.isPending ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AuthenticatedDashboard onLogout={handleLogout} />;
}

function AuthenticatedDashboard({ onLogout }: { onLogout: () => void }) {
  const handleUnauthorized = (res: Response) => {
    if (res.status === 401) {
      clearStoredToken();
      onLogout();
      throw new Error("Session expired");
    }
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  const statsQuery = useQuery<{ success: boolean; stats: { totalContacts: number; totalLocations: number; totalPrograms: number; totalNewsletters: number; totalPageViews: number } }>({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const contactsQuery = useQuery<{ success: boolean; inquiries: ContactInquiry[] }>({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const locationsQuery = useQuery<{ success: boolean; suggestions: LocationSuggestion[] }>({
    queryKey: ["/api/admin/locations"],
    queryFn: async () => {
      const res = await fetch("/api/admin/locations", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const programsQuery = useQuery<{ success: boolean; requests: ProgramInfoRequest[] }>({
    queryKey: ["/api/admin/programs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/programs", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const newslettersQuery = useQuery<{ success: boolean; subscriptions: Newsletter[] }>({
    queryKey: ["/api/admin/newsletters"],
    queryFn: async () => {
      const res = await fetch("/api/admin/newsletters", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const analyticsQuery = useQuery<{ success: boolean; pageStats: { path: string; count: number }[]; referrerStats: { referrer: string; count: number }[]; recentViews: PageView[] }>({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const res = await fetch("/api/admin/analytics", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const stats = statsQuery.data?.stats;

  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-[#1e3a5f]" />
            <h1 className="font-serif text-3xl font-bold text-[#1e3a5f]">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog/admin">
              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Blog Admin
              </Button>
            </Link>
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2" data-testid="button-logout">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white border">
            <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2" data-testid="tab-contacts">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2" data-testid="tab-locations">
              <MapPin className="w-4 h-4" />
              Locations
            </TabsTrigger>
            <TabsTrigger value="programs" className="flex items-center gap-2" data-testid="tab-programs">
              <GraduationCap className="w-4 h-4" />
              Program Requests
            </TabsTrigger>
            <TabsTrigger value="newsletters" className="flex items-center gap-2" data-testid="tab-newsletters">
              <Mail className="w-4 h-4" />
              Newsletters
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex items-center gap-2" data-testid="tab-announcements">
              <Megaphone className="w-4 h-4" />
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Contact Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#1e3a5f]">{stats?.totalContacts ?? "..."}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Location Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#1e3a5f]">{stats?.totalLocations ?? "..."}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Program Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#1e3a5f]">{stats?.totalPrograms ?? "..."}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Newsletter Signups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#1e3a5f]">{stats?.totalNewsletters ?? "..."}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[#1e3a5f]">{stats?.totalPageViews ?? "..."}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Contact Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {contactsQuery.isLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (contactsQuery.data?.inquiries?.length ?? 0) === 0 ? (
                  <p className="text-gray-500 text-center py-8">No contact inquiries yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>No Phone Contact</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contactsQuery.data?.inquiries?.map((inquiry) => (
                        <TableRow key={inquiry.id} data-testid={`contact-row-${inquiry.id}`}>
                          <TableCell className="font-medium">{inquiry.name}</TableCell>
                          <TableCell>{inquiry.email}</TableCell>
                          <TableCell>{inquiry.phone}</TableCell>
                          <TableCell>{inquiry.phoneOptOut ? <Badge variant="secondary">Opted Out</Badge> : <span className="text-gray-400">—</span>}</TableCell>
                          <TableCell className="max-w-xs truncate">{inquiry.message}</TableCell>
                          <TableCell>{new Date(inquiry.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Location Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {locationsQuery.isLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (locationsQuery.data?.suggestions?.length ?? 0) === 0 ? (
                  <p className="text-gray-500 text-center py-8">No location suggestions yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Suggested Location</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {locationsQuery.data?.suggestions?.map((suggestion) => (
                        <TableRow key={suggestion.id} data-testid={`location-row-${suggestion.id}`}>
                          <TableCell className="font-medium">{suggestion.name}</TableCell>
                          <TableCell>{suggestion.email}</TableCell>
                          <TableCell>{suggestion.location}</TableCell>
                          <TableCell className="max-w-xs truncate">{suggestion.comments || "-"}</TableCell>
                          <TableCell>{new Date(suggestion.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Program Info Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {programsQuery.isLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (programsQuery.data?.requests?.length ?? 0) === 0 ? (
                  <p className="text-gray-500 text-center py-8">No program info requests yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Program</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programsQuery.data?.requests?.map((request) => (
                        <TableRow key={request.id} data-testid={`program-row-${request.id}`}>
                          <TableCell className="font-medium">{request.name}</TableCell>
                          <TableCell>{request.email}</TableCell>
                          <TableCell>{request.phone}</TableCell>
                          <TableCell>{request.programName}</TableCell>
                          <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="newsletters">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Newsletter Subscriptions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {newslettersQuery.isLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : (newslettersQuery.data?.subscriptions?.length ?? 0) === 0 ? (
                  <p className="text-gray-500 text-center py-8">No newsletter subscriptions yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {newslettersQuery.data?.subscriptions?.map((sub) => (
                        <TableRow key={sub.id} data-testid={`newsletter-row-${sub.id}`}>
                          <TableCell className="font-medium">{sub.email}</TableCell>
                          <TableCell>{new Date(sub.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Top Pages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsQuery.isLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : (analyticsQuery.data?.pageStats?.length ?? 0) === 0 ? (
                    <p className="text-gray-500 text-center py-8">No page views recorded yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Page</TableHead>
                          <TableHead className="text-right">Views</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsQuery.data?.pageStats?.slice(0, 10).map((stat, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{stat.path}</TableCell>
                            <TableCell className="text-right">{stat.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Traffic Sources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsQuery.isLoading ? (
                    <Skeleton className="h-32 w-full" />
                  ) : (analyticsQuery.data?.referrerStats?.length ?? 0) === 0 ? (
                    <p className="text-gray-500 text-center py-8">No referrer data yet.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Referrer</TableHead>
                          <TableHead className="text-right">Visits</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {analyticsQuery.data?.referrerStats?.slice(0, 10).map((stat, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium truncate max-w-xs">{stat.referrer}</TableCell>
                            <TableCell className="text-right">{stat.count}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab getAuthHeaders={getAuthHeaders} onLogout={onLogout} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function AnnouncementsTab({ getAuthHeaders, onLogout }: { getAuthHeaders: () => HeadersInit; onLogout: () => void }) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleUnauthorized = (res: Response) => {
    if (res.status === 401) {
      clearStoredToken();
      onLogout();
      throw new Error("Session expired");
    }
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  const announcementsQuery = useQuery<{ success: boolean; announcements: Announcement[] }>({
    queryKey: ["/api/admin/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/admin/announcements", { headers: getAuthHeaders() });
      return handleUnauthorized(res);
    },
    retry: false,
  });

  const createForm = useForm<InsertAnnouncement>({
    resolver: zodResolver(insertAnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general",
      published: false,
      pinned: false,
    },
  });

  const editForm = useForm<InsertAnnouncement>({
    resolver: zodResolver(insertAnnouncementSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "general",
      published: false,
      pinned: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertAnnouncement) => {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      createForm.reset({ title: "", content: "", type: "general", published: false, pinned: false });
      toast({ title: "Announcement created" });
    },
    onError: () => {
      toast({ title: "Failed to create announcement", variant: "destructive" });
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: InsertAnnouncement }) => {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      setEditingId(null);
      toast({ title: "Announcement updated" });
    },
    onError: () => {
      toast({ title: "Failed to update announcement", variant: "destructive" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: number; field: "published" | "pinned"; value: boolean }) => {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
    },
    onError: () => {
      toast({ title: "Failed to update announcement", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({ title: "Announcement deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete announcement", variant: "destructive" });
    },
  });

  const startEdit = (a: Announcement) => {
    setEditingId(a.id);
    editForm.reset({
      title: a.title,
      content: a.content,
      type: a.type as InsertAnnouncement["type"],
      published: a.published,
      pinned: a.pinned,
    });
  };

  const typeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
    switch (type) {
      case "new-class": return "default";
      case "update": return "secondary";
      default: return "outline";
    }
  };

  const typeLabel = (type: string) => {
    switch (type) {
      case "new-class": return "New Class";
      case "update": return "Update";
      default: return "General";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            New Announcement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <FormField
                control={createForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Announcement content" rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={createForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="new-class">New Class</SelectItem>
                          <SelectItem value="update">Update</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Published</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => field.onChange(v === "true")}
                          defaultValue={String(field.value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={createForm.control}
                  name="pinned"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Pinned</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(v) => field.onChange(v === "true")}
                          defaultValue={String(field.value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="btn-primary" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Announcement"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="w-5 h-5" />
            All Announcements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {announcementsQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (announcementsQuery.data?.announcements?.length ?? 0) === 0 ? (
            <p className="text-gray-500 text-center py-8">No announcements yet.</p>
          ) : (
            <div className="space-y-4">
              {announcementsQuery.data?.announcements?.map((a) =>
                editingId === a.id ? (
                  <Card key={a.id} className="border-[#1e3a5f]">
                    <CardContent className="pt-4">
                      <Form {...editForm}>
                        <form
                          onSubmit={editForm.handleSubmit((data) => editMutation.mutate({ id: a.id, data }))}
                          className="space-y-3"
                        >
                          <FormField
                            control={editForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={editForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                  <Textarea rows={3} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-3 gap-3">
                            <FormField
                              control={editForm.control}
                              name="type"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Type</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="general">General</SelectItem>
                                      <SelectItem value="new-class">New Class</SelectItem>
                                      <SelectItem value="update">Update</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editForm.control}
                              name="published"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Published</FormLabel>
                                  <Select
                                    onValueChange={(v) => field.onChange(v === "true")}
                                    value={String(field.value)}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="true">Yes</SelectItem>
                                      <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={editForm.control}
                              name="pinned"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pinned</FormLabel>
                                  <Select
                                    onValueChange={(v) => field.onChange(v === "true")}
                                    value={String(field.value)}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="true">Yes</SelectItem>
                                      <SelectItem value="false">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm" className="btn-primary" disabled={editMutation.isPending}>
                              <Check className="w-4 h-4 mr-1" />
                              {editMutation.isPending ? "Saving..." : "Save"}
                            </Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              <X className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                ) : (
                  <Card key={a.id} className={`border ${a.pinned ? "border-[#c4a052]" : "border-gray-200"}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant={typeBadgeVariant(a.type)}>{typeLabel(a.type)}</Badge>
                            {a.pinned && <span className="text-xs text-[#c4a052] font-medium flex items-center gap-1"><Pin className="w-3 h-3" />Pinned</span>}
                            {a.published
                              ? <span className="text-xs text-green-600 flex items-center gap-1"><Globe className="w-3 h-3" />Published</span>
                              : <span className="text-xs text-gray-400 flex items-center gap-1"><EyeOff className="w-3 h-3" />Draft</span>
                            }
                          </div>
                          <div className="font-semibold text-[#1e3a5f]">{a.title}</div>
                          <div className="text-sm text-gray-500 mt-1">{a.content}</div>
                          <div className="text-xs text-gray-400 mt-2">{new Date(a.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMutation.mutate({ id: a.id, field: "published", value: !a.published })}
                            disabled={toggleMutation.isPending}
                            className={a.published ? "text-green-600" : "text-gray-400"}
                            title={a.published ? "Unpublish" : "Publish"}
                          >
                            {a.published ? <Globe className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMutation.mutate({ id: a.id, field: "pinned", value: !a.pinned })}
                            disabled={toggleMutation.isPending}
                            className={a.pinned ? "text-[#c4a052]" : "text-gray-400"}
                            title={a.pinned ? "Unpin" : "Pin"}
                          >
                            <Pin className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEdit(a)}
                            className="text-[#1e3a5f]"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteMutation.mutate(a.id)}
                            disabled={deleteMutation.isPending}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
