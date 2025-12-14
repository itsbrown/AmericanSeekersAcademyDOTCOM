import { Link } from "wouter";
import { ChevronRight, BookOpen, Users, Flag } from "lucide-react";

const Philosophy = () => {
  const cards = [
    {
      icon: BookOpen,
      title: "Classical Model",
      description: "The Trivium and Quadrivium provide a basis for core subjects taught throughout the week, creating a well-rounded educational foundation.",
      testId: "philosophy-classical"
    },
    {
      icon: Users,
      title: "Parent-Driven",
      description: "Created by homeschool parents for homeschool parents who want more for their children's education while maintaining educational freedom.",
      testId: "philosophy-parent"
    },
    {
      icon: Flag,
      title: "American Values",
      description: "Our curriculum emphasizes civic virtue, responsible citizenship, and a deep understanding of American history and values.",
      testId: "philosophy-values"
    }
  ];

  return (
    <section className="py-20 bg-muted/50" aria-labelledby="philosophy-heading">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 id="philosophy-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Educational Philosophy
          </h2>
          <div className="section-divider mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            American Seekers Academy uses inspiration from the Classical model of education, offering a time-tested and complete schooling experience that complements your homeschooling journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div 
              key={index}
              className="card-elegant p-8 text-center group"
              data-testid={card.testId}
            >
              <div className="mb-6">
                <span className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <card.icon className="h-8 w-8" aria-hidden="true" />
                </span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link 
            href="#about" 
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-200"
            data-testid="philosophy-learn-more"
          >
            Learn more about our approach
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
