import { useState } from 'react';
import { testimonials } from '@/lib/constants';
import { Quote, Star, User } from 'lucide-react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 bg-muted/50" aria-labelledby="testimonials-heading">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">What Families Say</h2>
          <div className="section-divider mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Hear from parents who have discovered the balance of learning and living with American Seekers Academy.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <Quote className="absolute -top-4 -left-4 h-16 w-16 text-primary/10" aria-hidden="true" />
          <div className="card-elegant p-8 md:p-10" data-testid="testimonial-card">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                <User className="h-8 w-8 text-primary" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">{testimonials[activeIndex].name}</h4>
                <p className="text-muted-foreground">{testimonials[activeIndex].role}</p>
              </div>
            </div>
            <blockquote className="text-lg italic text-muted-foreground mb-6 leading-relaxed">
              "{testimonials[activeIndex].content}"
            </blockquote>
            <div className="flex text-accent" aria-label={`Rating: ${testimonials[activeIndex].rating} out of 5 stars`}>
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8 gap-2" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              onClick={() => setActiveIndex(index)}
              role="tab"
              aria-selected={index === activeIndex}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-primary/30 hover:bg-primary/50'
              }`}
              aria-label={`View testimonial ${index + 1}`}
              data-testid={`testimonial-dot-${index}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
