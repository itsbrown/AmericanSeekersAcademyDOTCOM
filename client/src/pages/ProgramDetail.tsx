import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { programs, extracurriculars } from "@/lib/constants";
import { ChevronLeft, Clock, DollarSign, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import RequestInfoModal from "@/components/common/RequestInfoModal";
import SEO from "@/components/SEO";
import ProgramJsonLd from "@/components/ProgramJsonLd";

import cupcakeKids from "@assets/IMG_7597_1765752960405.jpeg";
import classroomKids from "@assets/96CA5F6D-E59D-4895-9B53-169540E63F4A_1765753011078.jpg";
import writingKid from "@assets/20251027_105131_1765752909793.jpg";
import learningKids from "@assets/IMG_0906_1765752944366.jpeg";
import pioneersImage from "@assets/IMG_7156_1765776150637.jpeg";
import patriotsImage from "@assets/PXL_20250908_143504765.MP_1765774245494.jpg";

const programImages: Record<string, string> = {
  "macaronis": learningKids,
  "yankee-doodle": writingKid,
  "tycoons": cupcakeKids,
  "seekers": classroomKids,
  "pioneers": pioneersImage,
  "patriots": patriotsImage,
};

const ProgramDetail = () => {
  const [, params] = useRoute("/programs/:slug");
  const [program, setProgram] = useState(programs[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Find the program that matches the slug in the URL
    if (params?.slug) {
      const foundProgram = programs.find(p => p.slug === params.slug);
      if (foundProgram) {
        setProgram(foundProgram);
        // Scroll to top when program changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [params?.slug]);

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Program Not Found</h2>
            <p className="mb-6">We couldn't find the program you're looking for.</p>
            <Link href="/#programs">
              <Button>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Programs
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16">
      <SEO 
        title={`${program.name} Program`}
        description={program.description}
        url={`https://americanseekersacademy.com/programs/${program.slug}`}
      />
      <ProgramJsonLd program={program} />
      
      <div className="container-custom">
        <div className="mb-8">
          <Link href="/#programs">
            <Button variant="ghost" className="pl-0 hover:bg-transparent">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Programs
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{program.name}</h1>
            <p className="text-lg text-neutral-600 mb-6">{program.ageRange} | {program.grades}</p>
            
            <img 
              src={programImages[program.slug] || program.imageUrl} 
              alt={program.name} 
              className="w-full h-auto object-cover rounded-lg shadow-md mb-8"
              style={{ maxHeight: '400px' }} 
            />
            
            <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
            <p className="text-lg mb-6">{program.longDescription}</p>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-6">Key Focus Areas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {program.keyFocus.map((focus, index) => (
                <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary mr-3">
                      <i className="fas fa-check"></i>
                    </span>
                    <span className="font-medium">{focus}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-semibold mb-6">Teaching Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {program.teachingMethods.map((method, index) => (
                <div key={index} className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary mr-3">
                      <i className="fas fa-graduation-cap"></i>
                    </span>
                    <span className="font-medium">{method}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {program.pricing.fullDay !== null && (
              <>
                <Separator className="my-8" />
                
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-accent" />
                  Extracurriculars
                </h2>
                <p className="text-muted-foreground mb-6">
                  Full-day students (9:00 AM - 3:00 PM) enjoy a variety of enriching extracurricular activities during the afternoon session.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {extracurriculars.map((activity, index) => (
                    <div key={index} className="bg-accent/5 p-4 rounded-lg border border-accent/20">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-accent/10 text-accent mr-3">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <span className="font-medium">{activity}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic bg-neutral-50 p-3 rounded-lg">
                  Note: Extracurricular offerings are subject to change each session based on availability and student interest.
                </p>
              </>
            )}
          </div>
          
          <div>
            <Card className="sticky top-24">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Program Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-500 mb-1">Age Group</h4>
                    <p>{program.ageRange}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-500 mb-1">Grade Level</h4>
                    <p>{program.grades}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-500 mb-1">IHIP Compliance</h4>
                    <p>{program.ihipHours}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-500 mb-1">Program Days</h4>
                    <p>Monday, Wednesday, Friday</p>
                  </div>
                  
                  {program.slug === "macaronis" && (
                    <div>
                      <h4 className="font-semibold text-sm text-neutral-500 mb-1">Hours</h4>
                      <p>9:00 AM - 12:00 PM</p>
                    </div>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                {/* Pricing Section */}
                <div className="mb-6">
                  <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    Pricing Options
                  </h4>
                  
                  {program.pricing.halfDay !== null || program.pricing.fullDay !== null ? (
                    <div className="space-y-3">
                      {program.pricing.halfDay !== null && (
                        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-primary" />
                            <span className="font-semibold">Half Day</span>
                          </div>
                          <p className="text-sm text-neutral-600 mb-2">9:00 AM - 12:00 PM</p>
                          <p className="text-2xl font-bold text-primary">${program.pricing.halfDay.toLocaleString()}</p>
                          <p className="text-xs text-neutral-500">per 10-week session</p>
                        </div>
                      )}
                      
                      {program.pricing.fullDay !== null && (
                        <div className="bg-accent/10 p-4 rounded-lg border-2 border-accent">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-accent" />
                            <span className="font-semibold">Full Day</span>
                            <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">Popular</span>
                          </div>
                          <p className="text-sm text-neutral-600 mb-2">9:00 AM - 3:00 PM</p>
                          <p className="text-2xl font-bold text-accent">${program.pricing.fullDay.toLocaleString()}</p>
                          <p className="text-xs text-neutral-500">per 10-week session</p>
                          <p className="text-xs text-accent mt-2 font-medium flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Includes extracurriculars
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-600 italic">{program.pricing.note || "Contact us for pricing"}</p>
                  )}
                </div>
                
                <Separator className="my-6" />
                
                <a 
                  href="https://accounts.americanseekersacademy.com/register/2OSQEAY3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mb-4 inline-flex items-center justify-center bg-[hsl(38,75%,45%)] hover:bg-[hsl(38,75%,40%)] text-white px-6 py-4 text-base font-bold rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
                  data-testid="program-register-btn"
                >
                  Register Now
                </a>
                
                <button 
                  className="w-full text-[#1e3a5f] hover:text-[#1e3a5f]/80 px-4 py-2 text-sm font-medium underline underline-offset-2 transition-colors duration-200"
                  onClick={() => setIsModalOpen(true)}
                  data-testid="request-info-btn"
                >
                  Request More Information
                </button>
                
                <div className="mt-4 text-center">
                  <Link href="/#locations" className="text-primary hover:text-primary/90 text-sm">
                    View our locations
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <RequestInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        programSlug={program.slug}
        programName={program.name}
      />
    </div>
  );
};

export default ProgramDetail;
