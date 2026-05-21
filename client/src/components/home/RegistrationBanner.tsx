import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarClock, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const waitlistSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  programInterest: z.string().optional(),
});

type WaitlistForm = z.infer<typeof waitlistSchema>;

const PROGRAMS = [
  { value: "macaronis", label: "Macaronis (Ages 6 months – 3 years)" },
  { value: "yankee-doodle", label: "Yankee Doodles (Ages 4–5, PreK–K)" },
  { value: "tycoons", label: "Tycoons (Grades 1–2)" },
  { value: "seekers", label: "Seekers (Grades 3–5)" },
  { value: "pioneers", label: "Pioneers (Grades 6–8)" },
  { value: "patriots", label: "Patriots (Grades 9–12)" },
];

export default function RegistrationBanner() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { name: "", email: "", phone: "", programInterest: "" },
  });

  const onSubmit = async (data: WaitlistForm) => {
    try {
      await apiRequest("POST", "/api/registration-waitlist", data);
      setSubmitted(true);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
    }
  };

  return (
    <section id="registration-waitlist" className="py-16 bg-[#1e3a5f]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Announcement */}
          <div className="text-white">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[#c4a052] fill-[#c4a052]" />
              <span className="text-[#c4a052] font-semibold uppercase tracking-widest text-sm">Coming Soon</span>
            </div>
            <h2 className="font-serif text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Fall 2026 Registration Opens
            </h2>
            <div className="flex items-center gap-3 mb-6">
              <CalendarClock className="w-7 h-7 text-[#c4a052] shrink-0" />
              <span className="text-2xl font-bold text-[#c4a052]">May 27, 2026</span>
            </div>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              Spots fill fast. Be first in line — join the waitlist now and we'll reach out the moment registration opens so your family doesn't miss out.
            </p>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#c4a052]" /> Priority notification when registration opens</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#c4a052]" /> First access to available spots</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#c4a052]" /> No commitment required to join the list</li>
            </ul>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1e3a5f] mb-2">You're on the list!</h3>
                <p className="text-gray-600">We'll contact you as soon as Fall 2026 registration opens on May 27th.</p>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-[#1e3a5f] mb-1">Join the Waitlist</h3>
                <p className="text-gray-500 text-sm mb-6">Be first in line for Fall 2026 enrollment</p>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="(555) 000-0000" {...field} />
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
                          <FormLabel>Program Interest <span className="text-gray-400 font-normal">(optional)</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a program" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PROGRAMS.map((p) => (
                                <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="w-full bg-[#c4a052] hover:bg-[#b3903f] text-white font-bold py-3 text-base"
                    >
                      {form.formState.isSubmitting ? "Submitting..." : (
                        <span className="flex items-center justify-center gap-2">
                          Reserve My Spot <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
