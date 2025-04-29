import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { insertLocationSuggestionSchema } from '@shared/schema';

const validationSchema = insertLocationSuggestionSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  location: z.string().min(3, "Location must be at least 3 characters"),
});

type FormValues = z.infer<typeof validationSchema>;

const LocationForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      email: '',
      location: '',
      comments: ''
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      const response = await apiRequest('POST', '/api/location-suggestions', data);
      
      if (response.ok) {
        toast({
          title: "Suggestion Received!",
          description: "Thank you for your location suggestion. We'll review it and get back to you soon.",
        });
        reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit suggestion');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="name">
          Your Name
        </label>
        <input 
          className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.name ? 'border-red-500' : ''}`}
          id="name"
          type="text"
          placeholder="John Smith"
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="email">
          Email Address
        </label>
        <input 
          className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.email ? 'border-red-500' : ''}`}
          id="email"
          type="email"
          placeholder="john@example.com"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      
      <div className="mb-4">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="location">
          Suggested Location
        </label>
        <input 
          className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.location ? 'border-red-500' : ''}`}
          id="location"
          type="text"
          placeholder="City, State"
          {...register('location')}
          disabled={isSubmitting}
        />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
        )}
      </div>
      
      <div className="mb-6">
        <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="comments">
          Additional Comments
        </label>
        <textarea 
          className={`shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-neutral-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${errors.comments ? 'border-red-500' : ''}`}
          id="comments"
          rows={3}
          placeholder="Tell us about your community or potential venue..."
          {...register('comments')}
          disabled={isSubmitting}
        />
        {errors.comments && (
          <p className="text-red-500 text-xs mt-1">{errors.comments.message}</p>
        )}
      </div>
      
      <div className="flex items-center justify-end">
        <button 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
        </button>
      </div>
    </form>
  );
};

export default LocationForm;
