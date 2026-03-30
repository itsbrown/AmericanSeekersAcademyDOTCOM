import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { X, Mail, User, MessageSquare, Loader2, CheckCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  phoneOptOut: z.boolean().optional().default(false),
});

type ContactForm = z.infer<typeof contactSchema>;

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      phoneOptOut: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactForm) => {
      const response = await apiRequest("POST", "/api/contact-inquiry", data);
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactForm) => {
    mutation.mutate(data);
  };

  const handleClose = () => {
    form.reset();
    setSubmitted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
          data-testid="contact-modal-close-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out! We'll get back to you as soon as possible.
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              Have a question or want to learn more about American Seekers Academy? We'd love to hear from you!
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="contact-name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Your Name
                </Label>
                <Input
                  id="contact-name"
                  placeholder="Enter your name"
                  {...form.register("name")}
                  data-testid="contact-input-name"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact-email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  data-testid="contact-input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="contact-phone" className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  {...form.register("phone")}
                  data-testid="contact-input-phone"
                />
                {form.formState.errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  By submitting, you agree to receive marketing messages; reply STOP to opt out.
                </p>
              </div>

              <div>
                <Label htmlFor="contact-message" className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  Message
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="How can we help you?"
                  rows={4}
                  {...form.register("message")}
                  data-testid="contact-input-message"
                />
                {form.formState.errors.message && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="contact-submit-btn"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500 text-center mb-2">Or reach us directly:</p>
              <div className="flex flex-col items-center gap-1 text-sm">
                <a href="tel:+15852102021" className="text-[#1e3a5f] hover:text-accent transition-colors">
                  (585) 210-2021
                </a>
                <a href="mailto:contact@americanseekersacademy.com" className="text-[#1e3a5f] hover:text-accent transition-colors">
                  contact@americanseekersacademy.com
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
