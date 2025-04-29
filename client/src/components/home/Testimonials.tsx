import { useState } from 'react';
import { testimonials } from '@/lib/constants';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 bg-primary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">What Families Say</h2>
          <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
            Hear from parents who have discovered the balance of learning and living with American Seekers Academy.
          </p>
        </div>
        
        <div className="testimonial-slider">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="h-16 w-16 rounded-full bg-neutral-200 flex items-center justify-center mr-4">
                <i className="fas fa-user text-xl text-neutral-400"></i>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-neutral-800">{testimonials[activeIndex].name}</h4>
                <p className="text-neutral-500">{testimonials[activeIndex].role}</p>
              </div>
            </div>
            <blockquote className="text-lg italic text-neutral-600 mb-6">
              "{testimonials[activeIndex].content}"
            </blockquote>
            <div className="flex text-accent">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <i key={i} className="fas fa-star"></i>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          {testimonials.map((_, index) => (
            <button 
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-3 w-3 rounded-full mx-1 ${index === activeIndex ? 'bg-primary' : 'bg-primary/30'}`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
