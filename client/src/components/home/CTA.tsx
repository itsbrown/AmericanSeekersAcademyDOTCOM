import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

const CTA = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await apiRequest('POST', '/api/newsletter', { email });
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter!",
        });
        setEmail('');
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-primary">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Child's Education?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our homeschool community and give your child the gift of classical education.
          </p>
          <div className="sm:flex sm:justify-center">
            <div className="sm:flex-1 sm:max-w-md">
              <form className="sm:flex" onSubmit={handleSubmit}>
                <div className="flex-1">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 px-4 rounded-l-md focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                    disabled={isSubmitting}
                  />
                </div>
                <button 
                  type="submit" 
                  className="mt-3 sm:mt-0 w-full sm:w-auto py-3 px-6 bg-accent hover:bg-accent/90 text-white font-medium rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-accent disabled:opacity-70"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
            </div>
          </div>
          <p className="mt-4 text-sm text-primary-200">
            We'll send you updates about our programs, events, and homeschooling resources.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
