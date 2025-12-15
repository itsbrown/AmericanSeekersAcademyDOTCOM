import { Quote } from "lucide-react";
import classroomKids from "@assets/96CA5F6D-E59D-4895-9B53-169540E63F4A_1765753011078.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 bg-card" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:gap-16">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl"></div>
              <img 
                src={classroomKids}
                alt="Smiling students at American Seekers Academy classroom" 
                className="relative rounded-xl shadow-2xl w-full h-auto border-4 border-white/50 object-cover"
                style={{ maxHeight: '450px' }}
                loading="lazy"
              />
            </div>
          </div>
          <div className="md:w-1/2">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6" data-testid="about-badge">
              About Us
            </span>
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Exceptional Classical Education
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At American Seekers Academy, we strive to provide an exceptional Classical homeschool program that goes beyond traditional co-ops using trained professionals and vetted curricula from highly acclaimed sources.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Our members are proud of their American heritage and hope to instill in children a love of country, methods to self govern and a desire to preserve the illuminated entrepreneurial spirit for generations to come.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              While we place a strong focus on Literacy excellence and accurate History, students will also be given a well-rounded education with a rotation of subjects including: Civics, Math, Science, Creative Writing and Art.
            </p>
            <blockquote className="relative pl-6 border-l-4 border-accent" data-testid="about-quote">
              <Quote className="absolute -left-3 -top-2 h-6 w-6 text-accent/30" aria-hidden="true" />
              <p className="text-lg font-medium text-foreground italic leading-relaxed">
                "Created by a homeschool family for other parents who want more for their children's education."
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
