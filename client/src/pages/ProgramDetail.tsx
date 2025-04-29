import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { programs } from "@/lib/constants";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const ProgramDetail = () => {
  const [, params] = useRoute("/programs/:slug");
  const [program, setProgram] = useState(programs[0]);

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
              src={program.imageUrl} 
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
                  
                  <div>
                    <h4 className="font-semibold text-sm text-neutral-500 mb-1">Hours</h4>
                    <p>9:00 AM - 12:00 PM</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <Link href="/#contact">
                  <Button className="w-full">Request More Information</Button>
                </Link>
                
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
    </div>
  );
};

export default ProgramDetail;
