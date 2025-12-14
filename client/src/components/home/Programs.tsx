import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";

import cupcakeKids from "@assets/IMG_7597_1765752960405.jpeg";
import classroomKids from "@assets/96CA5F6D-E59D-4895-9B53-169540E63F4A_1765753011078.jpg";
import writingKid from "@assets/20251027_105131_1765752909793.jpg";
import learningKids from "@assets/IMG_0906_1765752944366.jpeg";
import stockImage1 from "@assets/stock_images/happy_smiling_childr_7dbcac43.jpg";
import stockImage2 from "@assets/stock_images/happy_smiling_childr_ce8b9110.jpg";

const programsData = [
  {
    slug: "macaronis",
    name: "Macaronis",
    ageRange: "Ages 6 months - 3 years",
    description: "Welcomes our youngest learners into a warm, nurturing academic setting designed to spark curiosity, encourage sensory exploration, and build foundational social skills through play, music, and movement.",
    imageUrl: learningKids,
  },
  {
    slug: "yankee-doodle",
    name: "Yankee Doodle",
    ageRange: "Ages 4-5 (PreK-K)",
    description: "Builds foundational skills through a classical education model, emphasizing literacy, counting, and responsibility. Hands-on, kinesthetic activities engage young learners, fostering a love for learning.",
    imageUrl: writingKid,
  },
  {
    slug: "tycoons",
    name: "Tycoons",
    ageRange: "Grades 1-2",
    description: "Dives into Literacy Essentials building a strong foundation necessary for developing reading and writing skills, with structured curricula covering all common subjects.",
    imageUrl: cupcakeKids,
  },
  {
    slug: "seekers",
    name: "Seekers",
    ageRange: "Grades 3-5",
    description: "Goes deeper into liberal arts, sharpening reading and writing skills while pushing students intellectually with structured curricula covering all common subjects.",
    imageUrl: classroomKids,
  },
  {
    slug: "pioneers",
    name: "Pioneers",
    ageRange: "Grades 6-8",
    description: "Challenges students intellectually and philosophically with structured curricula highlighting America's founding principles, emphasizing self-governance and critical thinking.",
    imageUrl: stockImage1,
  },
  {
    slug: "patriots",
    name: "Patriots",
    ageRange: "Grades 9-12",
    description: "Prepares students for intellectual and civic leadership with structured curricula covering all common subjects and highlighting America's founding principles.",
    imageUrl: stockImage2,
  }
];

const Programs = () => {
  return (
    <section id="programs" className="py-20 bg-card" aria-labelledby="programs-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 id="programs-heading" className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Programs</h2>
          <div className="section-divider mb-6"></div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our age-appropriate classical education programs designed specifically for homeschooling families at every stage of their journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programsData.map((program) => (
            <article 
              key={program.slug} 
              className="program-card group"
              data-testid={`program-card-${program.slug}`}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={program.imageUrl} 
                  alt={`${program.name} program - ${program.ageRange}`} 
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
          <a 
            href="#contact" 
            className="btn-primary text-base"
            data-testid="programs-enroll-btn"
          >
            Enroll Your Child Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Programs;
