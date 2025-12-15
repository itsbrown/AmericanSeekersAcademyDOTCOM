import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { X, Mail, User, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const requestInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type RequestInfoForm = z.infer<typeof requestInfoSchema>;

interface RequestInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  programSlug: string;
  programName: string;
}

export default function RequestInfoModal({ isOpen, onClose, programSlug, programName }: RequestInfoModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<RequestInfoForm>({
    resolver: zodResolver(requestInfoSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: RequestInfoForm) => {
      const response = await apiRequest("POST", "/api/program-info-request", {
        ...data,
        programSlug,
        programName,
      });
      return response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestInfoForm) => {
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 z-10">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
          data-testid="modal-close-btn"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              We've sent program information for <strong>{programName}</strong> to your email. 
              Check your inbox for details and a downloadable PDF!
            </p>
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-[#1e3a5f] mb-2">Request Information</h2>
            <p className="text-gray-600 mb-6">
              Get detailed information about our <strong>{programName}</strong> program sent directly to your email.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  {...form.register("name")}
                  data-testid="input-name"
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  data-testid="input-email"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="submit-request-btn"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Me Information"
                )}
              </Button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              We'll send you program details and a downloadable PDF. No spam, ever.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
