import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2 } from "lucide-react";

const waitlistSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  programInterest: z.string().optional(),
  locationInterest: z.string().optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

const PROGRAMS = [
  { value: "macaronis", label: "Macaronis (Ages 6 months – 3 years)" },
  { value: "yankee-doodle", label: "Yankee Doodles (Ages 4–5, PreK–K)" },
  { value: "tycoons", label: "Tycoons (Grades 1–2)" },
  { value: "seekers", label: "Seekers (Grades 3–5)" },
  { value: "pioneers", label: "Pioneers (Grades 6–8)" },
  { value: "patriots", label: "Patriots (Grades 9–12)" },
];

interface WaitlistFormProps {
  defaultLocation?: string;
  compact?: boolean; // For embedding in location hubs
}

export default function WaitlistForm({ defaultLocation, compact = false }: WaitlistFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      programInterest: "",
      locationInterest: defaultLocation || "",
    },
  });

  const onSubmit = async (data: WaitlistFormData) => {
    try {
      await apiRequest("POST", "/api/registration-waitlist", data);
      setSubmitted(true);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="font-semibold text-lg mb-1">You're on the list!</h4>
        <p className="text-sm text-gray-600">We'll contact you when registration opens for this location.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Parent / Guardian Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="(585) 555-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="programInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program Interest</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PROGRAMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {defaultLocation && (
          <input type="hidden" {...form.register("locationInterest")} value={defaultLocation} />
        )}

        {!defaultLocation && (
          <FormField
            control={form.control}
            name="locationInterest"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Interest</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="brighton">Brighton</SelectItem>
                    <SelectItem value="greece">Greece</SelectItem>
                    <SelectItem value="victor">Victor (Coming Soon)</SelectItem>
                    <SelectItem value="batavia">Batavia (Coming Soon)</SelectItem>
                    <SelectItem value="angelica">Angelica (Coming Soon)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Joining..." : "Join the Waitlist"}
        </Button>

        <p className="text-xs text-center text-gray-500">
          No commitment required. We'll notify you when registration opens.
        </p>
      </form>
    </Form>
  );
}
