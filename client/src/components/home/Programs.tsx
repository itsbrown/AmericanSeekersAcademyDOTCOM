import { Link } from "wouter";
import { programs } from "@/lib/constants";
import { ArrowRight, CheckCircle } from "lucide-react";

const Programs = () => {
  return (
    <section id="programs" className="py-20 bg-card" aria-labelledby="programs-heading">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 id="programs-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Programs</h2>
          <div className="section-divider mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our age-appropriate classical education programs designed specifically for homeschooling families at every stage of their journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <article 
              key={program.slug} 
              className="program-card group"
              data-testid={`program-card-${program.slug}`}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={program.imageUrl} 
                  alt={`${program.name} program for ${program.ageRange}`} 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-3 py-1.5 text-xs font-semibold text-white bg-primary/90 backdrop-blur-sm rounded-full shadow-lg">
                    {program.ageRange}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3">{program.name}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {program.description}
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-border/50">
                  <Link 
                    href={`/programs/${program.slug}`} 
                    className="inline-flex items-center text-primary hover:text-primary/80 font-medium text-sm transition-colors duration-200"
                    data-testid={`program-learn-more-${program.slug}`}
                  >
                    Learn More
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                  <span className="inline-flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-1 text-accent" />
                    IHIP Compliant
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link 
            href="#contact" 
            className="btn-primary text-base"
            data-testid="programs-enroll-btn"
          >
            Enroll Your Child Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Programs;
