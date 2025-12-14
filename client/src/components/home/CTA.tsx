import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Send, Mail } from 'lucide-react';

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
    <section className="py-20 navy-gradient" aria-labelledby="cta-heading">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-white/10 mb-6">
            <Mail className="h-8 w-8 text-white" aria-hidden="true" />
          </div>
          <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Child's Education?
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Join our homeschool community and give your child the gift of classical education.
          </p>
          <div className="sm:flex sm:justify-center">
            <div className="sm:flex-1 sm:max-w-lg">
              <form className="sm:flex gap-0" onSubmit={handleSubmit}>
                <div className="flex-1">
                  <label htmlFor="cta-email" className="sr-only">Email address</label>
                  <input 
                    id="cta-email"
                    type="email" 
                    placeholder="Your email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-4 px-5 rounded-l-lg sm:rounded-r-none rounded-r-lg text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-primary transition-shadow duration-200"
                    disabled={isSubmitting}
                    data-testid="cta-email-input"
                  />
                </div>
                <button 
                  type="submit" 
                  className="mt-3 sm:mt-0 w-full sm:w-auto py-4 px-8 btn-accent rounded-r-lg sm:rounded-l-none rounded-l-lg disabled:opacity-70 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                  data-testid="cta-submit-btn"
                >
                  {isSubmitting ? (
                    'Subscribing...'
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          <p className="mt-6 text-sm text-white/60">
            We'll send you updates about our programs, events, and homeschooling resources. No spam, ever.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
