import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, LayoutDashboard, Users, MapPin, GraduationCap, Mail, BarChart3, LogOut, Eye, FileText, Megaphone, Pin, Trash2, Globe, EyeOff, Pencil, X, Check, ShieldCheck, AlertTriangle, Send, CheckCircle2, XCircle, ClipboardList, Download } from "lucide-react";
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
import type { ContactInquiry, LocationSuggestion, ProgramInfoRequest, Newsletter, PageView, RegistrationWaitlistEntry } from "@shared/schema";

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

  const waitlistQuery = useQuery<{ success: boolean; entries: RegistrationWaitlistEntry[] }>({
    queryKey: ["/api/admin/registration-waitlist"],
    queryFn: async () => {
      const res = await fetch("/api/admin/registration-waitlist", { headers: getAuthHeaders() });
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
            <TabsTrigger value="email-health" className="flex items-center gap-2" data-testid="tab-email-health">
              <ShieldCheck className="w-4 h-4" />
              Email Health
            </TabsTrigger>
            <TabsTrigger value="waitlist" className="flex items-center gap-2" data-testid="tab-waitlist">
              <ClipboardList className="w-4 h-4" />
              Waitlist
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

          <TabsContent value="email-health">
            <EmailHealthTab getAuthHeaders={getAuthHeaders} />
          </TabsContent>

          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="font-serif text-xl text-[#1e3a5f] flex items-center gap-2">
                    <ClipboardList className="w-5 h-5" />
                    Fall 2026 Registration Waitlist
                  </CardTitle>
                  <a
                    href={`/api/admin/registration-waitlist/export.csv?token=${localStorage.getItem("admin_token")}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const token = localStorage.getItem("admin_token");
                      fetch("/api/admin/registration-waitlist/export.csv", {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                        .then(r => r.blob())
                        .then(blob => {
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "registration-waitlist.csv";
                          a.click();
                          URL.revokeObjectURL(url);
                        });
                    }}
                  >
                    <Button variant="outline" className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export CSV
                    </Button>
                  </a>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {waitlistQuery.data?.entries.length ?? 0} families on the waitlist
                </p>
              </CardHeader>
              <CardContent>
                {waitlistQuery.isLoading ? (
                  <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : !waitlistQuery.data?.entries.length ? (
                  <p className="text-gray-500 text-sm py-4 text-center">No waitlist entries yet.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Program Interest</TableHead>
                        <TableHead>Signed Up</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitlistQuery.data.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.name}</TableCell>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>{entry.phone || "—"}</TableCell>
                          <TableCell>
                            {entry.programInterest
                              ? entry.programInterest.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
                              : "—"}
                          </TableCell>
                          <TableCell className="text-gray-500 text-sm">
                            {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

type EmailTestRun = {
  id: number;
  flow: string;
  sentTo: string;
  hubspotStatusId: string | null;
  hubspotSendId: string | null;
  apiAccepted: boolean;
  errorMessage: string | null;
  sentAt: string;
  inboxConfirmedAt: string | null;
  confirmedBy: string | null;
};

type FlowTestResult = {
  success: boolean;
  message: string;
  sentTo?: string;
  run?: EmailTestRun;
  hubspotResponse?: Record<string, unknown>;
};

function EmailHealthTab({ getAuthHeaders }: { getAuthHeaders: () => HeadersInit }) {
  const { toast } = useToast();
  const [programRecipient, setProgramRecipient] = useState("contact@americanseekersacademy.com");
  const [results, setResults] = useState<Record<string, FlowTestResult>>({});

  const testRunsQuery = useQuery<{ success: boolean; runs: EmailTestRun[] }>({
    queryKey: ["/api/admin/email-test-runs"],
    queryFn: async () => {
      const res = await fetch("/api/admin/email-test-runs", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    refetchInterval: false,
  });

  const statusQuery = useQuery<{ success: boolean; hubspotApiConfigured: boolean; hubspotEmailIdConfigured: boolean }>({
    queryKey: ["/api/admin/email-status"],
    queryFn: async () => {
      const res = await fetch("/api/admin/email-status", { headers: getAuthHeaders() });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  const contactMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/test-email/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Request failed");
      return res.json() as Promise<FlowTestResult>;
    },
    onSuccess: (data) => {
      setResults((prev) => ({ ...prev, contact: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-test-runs"] });
      if (data.success) {
        toast({ title: "Contact flow email sent", description: `Check inbox at ${data.sentTo}` });
      } else {
        toast({ title: "Email send failed", description: data.message, variant: "destructive" });
      }
    },
    onError: () => toast({ title: "Request failed", description: "Could not reach the server.", variant: "destructive" }),
  });

  const locationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/test-email/location", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error("Request failed");
      return res.json() as Promise<FlowTestResult>;
    },
    onSuccess: (data) => {
      setResults((prev) => ({ ...prev, location: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-test-runs"] });
      if (data.success) {
        toast({ title: "Location flow email sent", description: `Check inbox at ${data.sentTo}` });
      } else {
        toast({ title: "Email send failed", description: data.message, variant: "destructive" });
      }
    },
    onError: () => toast({ title: "Request failed", description: "Could not reach the server.", variant: "destructive" }),
  });

  const programMutation = useMutation({
    mutationFn: async (recipient: string) => {
      const res = await fetch("/api/admin/test-email/program", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ recipientEmail: recipient }),
      });
      if (!res.ok) throw new Error("Request failed");
      return res.json() as Promise<FlowTestResult>;
    },
    onSuccess: (data) => {
      setResults((prev) => ({ ...prev, program: data }));
      queryClient.invalidateQueries({ queryKey: ["/api/admin/email-test-runs"] });
      if (data.success) {
        toast({ title: "Program flow email sent", description: `Check inbox at ${data.sentTo}` });
      } else {
        toast({ title: "Email send failed", description: data.message, variant: "destructive" });
      }
    },
    onError: () => toast({ title: "Request failed", description: "Could not reach the server.", variant: "destructive" }),
  });

  const status = statusQuery.data;
  const allConfigured = status?.hubspotApiConfigured && status?.hubspotEmailIdConfigured;

  const ConfigRow = ({ label, value }: { label: string; value: boolean | undefined }) => (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {value === undefined ? (
        <span className="text-gray-400 text-sm">Checking…</span>
      ) : value ? (
        <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" /> Configured
        </span>
      ) : (
        <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
          <XCircle className="w-4 h-4" /> Missing
        </span>
      )}
    </div>
  );

  const FlowResultBox = ({ flow }: { flow: string }) => {
    const r = results[flow];
    if (!r) return null;
    return (
      <div className={`rounded-md border p-3 mt-3 ${r.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
        <div className="flex items-start gap-2">
          {r.success
            ? <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            : <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />}
          <div className="flex-1 min-w-0 space-y-1">
            <p className={`text-sm font-medium ${r.success ? "text-green-700" : "text-red-700"}`}>
              {r.success ? "HubSpot API accepted the request" : "API call failed — email was not sent"}
            </p>
            <p className={`text-sm ${r.success ? "text-green-600" : "text-red-600"}`}>{r.message}</p>
            {r.success && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 mt-1">
                API acceptance does not guarantee inbox delivery. Open the inbox at{" "}
                <strong>{r.sentTo}</strong> and confirm the email arrived to complete verification.
              </p>
            )}
            {r.hubspotResponse && (
              <details className="mt-1">
                <summary className="text-xs text-gray-500 cursor-pointer select-none">HubSpot API response</summary>
                <pre className="mt-1 text-xs bg-white border rounded p-2 overflow-auto max-h-32 whitespace-pre-wrap">
                  {JSON.stringify(r.hubspotResponse, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            HubSpot Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConfigRow label="HUBSPOT_API secret" value={status?.hubspotApiConfigured} />
          <ConfigRow label="HUBSPOT_TRANSACTIONAL_EMAIL_ID secret" value={status?.hubspotEmailIdConfigured} />
          {status && !allConfigured && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 p-3">
              <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <p className="text-sm text-amber-700">
                One or more secrets are missing. Add them in the Replit Secrets panel, then restart the server.
                The HubSpot template must include <code className="bg-amber-100 px-1 rounded">{"{{ custom.subject }}"}</code> and{" "}
                <code className="bg-amber-100 px-1 rounded">{"{{{ custom.html_content }}}"}</code> (triple braces) tokens, and the sender domain{" "}
                <strong>americanseekersacademy.com</strong> must be verified in HubSpot (Settings → Domain Management).
              </p>
            </div>
          )}
          {status && allConfigured && (
            <div className="mt-4 flex items-start gap-2 rounded-md bg-green-50 border border-green-200 p-3">
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-sm text-green-700">
                Both secrets are set. Use the per-flow tests below to confirm live delivery for each email path.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Per-Flow Live Delivery Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-gray-600">
            Each button calls the <strong>real production email function</strong> with sample data so the exact same code path runs as when a visitor submits a form. Check the indicated inbox after each test to confirm receipt.
          </p>

          {/* Flow 1: Contact inquiry */}
          <div className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[#1e3a5f]">Contact Form Notification</p>
                <p className="text-xs text-gray-500 mt-0.5">Sends to: contact@americanseekersacademy.com</p>
                <p className="text-xs text-gray-400 font-mono">POST /api/contact-inquiry → sendContactInquiryNotification()</p>
              </div>
              <Button
                onClick={() => contactMutation.mutate()}
                disabled={contactMutation.isPending || !allConfigured}
                className="btn-primary whitespace-nowrap shrink-0"
                size="sm"
              >
                {contactMutation.isPending ? "Sending…" : "Test Contact Flow"}
              </Button>
            </div>
            <FlowResultBox flow="contact" />
          </div>

          {/* Flow 2: Location suggestion */}
          <div className="rounded-md border p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[#1e3a5f]">Location Suggestion Notification</p>
                <p className="text-xs text-gray-500 mt-0.5">Sends to: contact@americanseekersacademy.com</p>
                <p className="text-xs text-gray-400 font-mono">POST /api/location-suggestions → sendLocationSuggestionNotification()</p>
              </div>
              <Button
                onClick={() => locationMutation.mutate()}
                disabled={locationMutation.isPending || !allConfigured}
                className="btn-primary whitespace-nowrap shrink-0"
                size="sm"
              >
                {locationMutation.isPending ? "Sending…" : "Test Location Flow"}
              </Button>
            </div>
            <FlowResultBox flow="location" />
          </div>

          {/* Flow 3: Program info request welcome email */}
          <div className="rounded-md border p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-[#1e3a5f]">Program Info Welcome Email</p>
                <p className="text-xs text-gray-500 mt-0.5">Sends to: the parent's email (enter below)</p>
                <p className="text-xs text-gray-400 font-mono">POST /api/program-info-request → sendProgramInfoEmail()</p>
              </div>
              <Button
                onClick={() => programMutation.mutate(programRecipient)}
                disabled={programMutation.isPending || !allConfigured || !programRecipient}
                className="btn-primary whitespace-nowrap shrink-0"
                size="sm"
              >
                {programMutation.isPending ? "Sending…" : "Test Program Flow"}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">Test recipient:</span>
              <Input
                value={programRecipient}
                onChange={(e) => setProgramRecipient(e.target.value)}
                placeholder="your@email.com"
                className="text-sm h-8"
              />
            </div>
            <FlowResultBox flow="program" />
          </div>

          {!allConfigured && status && (
            <p className="text-xs text-amber-600">Fix the missing secrets shown above before running tests.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Check className="w-4 h-4 text-[#1e3a5f]" />
            Inbox Delivery Verification Log
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-500">
            After each test above, check the inbox and click "Confirm Delivery" to record server-side proof that the email was received.
          </p>
          <ServerVerificationLog
            runs={testRunsQuery.data?.runs ?? []}
            isLoading={testRunsQuery.isLoading}
            getAuthHeaders={getAuthHeaders}
            onConfirmed={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/email-test-runs"] })}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            HubSpot Portal Setup Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-gray-500 mb-3">
            Check off each item as you confirm it in the HubSpot portal. Saved in your browser.
          </p>
          <HubSpotSetupChecklist />
        </CardContent>
      </Card>
    </div>
  );
}

const CHECKLIST_KEY = "asa_hubspot_checklist";

const FLOW_LABELS: Record<string, string> = {
  contact: "Contact Form Notification",
  location: "Location Suggestion Notification",
  program: "Program Info Welcome Email",
};

function ServerVerificationLog({
  runs,
  isLoading,
  getAuthHeaders,
  onConfirmed,
}: {
  runs: EmailTestRun[];
  isLoading: boolean;
  getAuthHeaders: () => HeadersInit;
  onConfirmed: () => void;
}) {
  const { toast } = useToast();

  const confirmMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/email-test-runs/${id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ confirmedBy: "admin" }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      onConfirmed();
      toast({ title: "Inbox delivery confirmed", description: "Record saved to database." });
    },
    onError: () => toast({ title: "Failed to confirm", variant: "destructive" }),
  });

  if (isLoading) return <Skeleton className="h-20 w-full" />;
  if (runs.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-4">No test runs yet. Use the flow tests above to send the first one.</p>;
  }

  return (
    <div className="space-y-2">
      {runs.slice(0, 20).map((run) => (
        <div
          key={run.id}
          className={`rounded-md border p-3 ${
            run.inboxConfirmedAt ? "bg-green-50 border-green-200" : run.apiAccepted ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {run.inboxConfirmedAt
                ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                : run.apiAccepted
                ? <AlertTriangle className="w-4 h-4 text-amber-500" />
                : <XCircle className="w-4 h-4 text-red-500" />}
            </div>
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-gray-800">{FLOW_LABELS[run.flow] ?? run.flow}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                  run.inboxConfirmedAt ? "bg-green-100 text-green-700" : run.apiAccepted ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"
                }`}>
                  {run.inboxConfirmedAt ? "Inbox confirmed" : run.apiAccepted ? "API accepted, inbox pending" : "API failed"}
                </span>
              </div>
              <p className="text-xs text-gray-500">Sent to: {run.sentTo}</p>
              {run.hubspotStatusId && <p className="text-xs text-gray-400 font-mono">statusId: {run.hubspotStatusId}</p>}
              {run.hubspotSendId && <p className="text-xs text-gray-400 font-mono">sendId: {run.hubspotSendId}</p>}
              {run.errorMessage && <p className="text-xs text-red-600">Error: {run.errorMessage}</p>}
              <p className="text-xs text-gray-400">Sent: {new Date(run.sentAt).toLocaleString()}</p>
              {run.inboxConfirmedAt && (
                <p className="text-xs text-green-600">
                  Inbox confirmed: {new Date(run.inboxConfirmedAt).toLocaleString()} by {run.confirmedBy}
                </p>
              )}
            </div>
            {run.apiAccepted && !run.inboxConfirmedAt && (
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 text-xs border-green-500 text-green-700 hover:bg-green-50"
                onClick={() => confirmMutation.mutate(run.id)}
                disabled={confirmMutation.isPending}
              >
                <Check className="w-3 h-3 mr-1" />
                Confirm Delivery
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function HubSpotSetupChecklist() {
  const items = [
    { key: "api_secret", label: "HUBSPOT_API secret is set (starts with pat-)" },
    { key: "email_id", label: "HUBSPOT_TRANSACTIONAL_EMAIL_ID is set to the template ID from HubSpot Marketing → Email → Transactional" },
    { key: "template_subject", label: "HubSpot template subject line contains: {{ custom.subject }}" },
    { key: "template_body", label: "HubSpot template body contains: {{{ custom.html_content }}} (triple braces = raw HTML)" },
    { key: "domain_verified", label: "Sender domain americanseekersacademy.com is verified in HubSpot (Settings → Website → Domains)" },
    { key: "app_scope", label: "HubSpot Private App has the 'transactional-email' scope enabled" },
  ];

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(CHECKLIST_KEY) ?? "{}"); } catch { return {}; }
  });

  const toggle = (key: string) => {
    const updated = { ...checked, [key]: !checked[key] };
    setChecked(updated);
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
  };

  const allDone = items.every((i) => checked[i.key]);

  return (
    <div className="space-y-2">
      {allDone && (
        <div className="flex items-center gap-2 rounded-md bg-green-50 border border-green-200 p-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <p className="text-xs text-green-700 font-medium">All setup items confirmed. HubSpot portal configuration is complete.</p>
        </div>
      )}
      {items.map((item) => (
        <label key={item.key} className="flex items-start gap-3 p-3 rounded-md border cursor-pointer hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-[#1e3a5f] shrink-0"
            checked={!!checked[item.key]}
            onChange={() => toggle(item.key)}
          />
          <span className={`text-sm ${checked[item.key] ? "line-through text-gray-400" : "text-gray-700"}`}>{item.label}</span>
        </label>
      ))}
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
      createForm.reset({ title: "", content: "", type: "general", published: false, pinned: false, url: "" });
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
    onMutate: async ({ id, field, value }) => {
      await queryClient.cancelQueries({ queryKey: ["/api/admin/announcements"] });
      const previous = queryClient.getQueryData<{ success: boolean; announcements: Announcement[] }>(["/api/admin/announcements"]);
      queryClient.setQueryData<{ success: boolean; announcements: Announcement[] }>(
        ["/api/admin/announcements"],
        (old) => old ? { ...old, announcements: old.announcements.map((a) => a.id === id ? { ...a, [field]: value } : a) } : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(["/api/admin/announcements"], context.previous);
      toast({ title: "Failed to update announcement", variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
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
      url: a.url ?? "",
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
              <FormField
                control={createForm.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL <span className="text-gray-400 font-normal">(optional — makes card clickable)</span></FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} value={field.value ?? ""} />
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
                          <FormField
                            control={editForm.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Link URL <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                                <FormControl>
                                  <Input placeholder="https://..." {...field} value={field.value ?? ""} />
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
