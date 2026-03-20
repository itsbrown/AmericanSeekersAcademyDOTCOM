import { useQuery } from "@tanstack/react-query";
import { Megaphone, Pin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Announcement } from "@shared/schema";

const typeBadgeVariant = (type: string): "default" | "secondary" | "outline" => {
  switch (type) {
    case "new-class": return "default";
    case "update": return "secondary";
    default: return "outline";
  }
};

const typeLabel = (type: string): string => {
  switch (type) {
    case "new-class": return "New Class";
    case "update": return "Update";
    default: return "General";
  }
};

const Announcements = () => {
  const { data } = useQuery<{ success: boolean; announcements: Announcement[] }>({
    queryKey: ["/api/announcements"],
  });

  const announcements = data?.announcements ?? [];

  if (announcements.length === 0) return null;

  return (
    <section className="py-16 bg-[hsl(40,33%,96%)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1e3a5f]">Announcements</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className={`border bg-white ${announcement.pinned ? "border-[#c4a052] shadow-md" : "border-gray-200"}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={typeBadgeVariant(announcement.type)}>
                      {typeLabel(announcement.type)}
                    </Badge>
                    {announcement.pinned && (
                      <span className="flex items-center gap-1 text-xs text-[#c4a052] font-medium">
                        <Pin className="w-3 h-3" />
                        Pinned
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(announcement.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-[#1e3a5f] text-lg mb-2">{announcement.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{announcement.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Announcements;
