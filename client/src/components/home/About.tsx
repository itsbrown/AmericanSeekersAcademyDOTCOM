import { Quote } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-card" aria-labelledby="about-heading">
      <div className="container-custom">
        <div className="md:flex md:items-center md:gap-16">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1588075592446-265bad1d8506?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="American Seekers Academy students engaged in classical learning" 
                className="relative rounded-xl shadow-2xl w-full h-auto border-4 border-white/50"
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6" data-testid="about-badge">
              Our Mission
            </span>
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Cultivating Civic Virtue
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              We aim to provide homeschool families access to a private, in-person classical education that guarantees parents' right to choose what is best for their child. Our drop-off program helps make homeschooling a success for the whole family and cultivates civic virtue while preparing students for a life of freedom and intellectual growth.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              American Seekers Academy was designed by homeschool parents who needed more than the average co-op could provide. We welcome anyone to study here regardless of their faith tradition, political affiliation, or personal ideologies.
            </p>
            <blockquote className="relative pl-6 border-l-4 border-accent" data-testid="about-quote">
              <Quote className="absolute -left-3 -top-2 h-6 w-6 text-accent/30" aria-hidden="true" />
              <p className="text-lg font-medium text-foreground italic leading-relaxed">
                "Helping others to find peace in the balance of learning and living, this co-op was created by homeschool parents for all parents who want more."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
