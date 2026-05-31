import { Link } from "wouter";
import { locationPages, type LocationPageData } from "@/lib/constants";
import { MapPin, Clock, Users } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

interface LocationHubProps {
  citySlug: string;
}

export default function LocationHub({ citySlug }: LocationHubProps) {
  const location = locationPages[citySlug];
  const isComingSoon = ["victor", "batavia", "angelica"].includes(citySlug);

  if (!location) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Location Not Found</h1>
          <Link href="/#locations" className="text-accent hover:underline">
            View all locations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-6 w-6" />
            <span className="uppercase tracking-[3px] text-sm text-[#c4a052]">Our Campuses</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            Classical Education in {location.city}, NY
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {location.heroSubtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-700 leading-relaxed">
            {location.intro}
          </p>
        </div>

        {/* Key Details */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="card-elegant p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Location</h3>
            <p className="text-muted-foreground">{location.fullName}</p>
            {location.address && <p className="text-sm mt-1">{location.address}</p>}
          </div>

          <div className="card-elegant p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Schedule</h3>
            <p className="text-muted-foreground">{location.schedule}</p>
          </div>

          <div className="card-elegant p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-semibold mb-2">Ages Served</h3>
            <p className="text-muted-foreground">6 months – 12th Grade</p>
          </div>
        </div>

        {/* Local Highlights */}
        {location.localHighlights && location.localHighlights.length > 0 && (
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] mb-6 text-center">
              Why Families in {location.city} Choose Us
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {location.localHighlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border">
                  <div className="text-accent mt-1">•</div>
                  <p className="text-gray-700">{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isComingSoon ? (
          /* Coming Soon + Waitlist */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-1 rounded-full bg-[#c4a052]/10 text-[#c4a052] text-sm font-semibold mb-4">
                Coming Soon
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#1e3a5f] mb-3">
                Be First in Line for {location.city}
              </h2>
              <p className="text-gray-600">
                We're excited to bring American Seekers Academy to {location.city}. 
                Join the waitlist to be notified as soon as registration opens.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border">
              <h3 className="font-semibold text-xl mb-6 text-center">Join the {location.city} Waitlist</h3>
              <WaitlistForm defaultLocation={citySlug} />
            </div>
          </div>
        ) : (
          <>
            {/* Programs Teaser */}
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] mb-4">
                Programs at Our {location.city} Campus
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                We offer the same classical programs across all campuses. 
                Find the right fit for your child.
              </p>
              <Link 
                href="/#programs" 
                className="inline-flex items-center text-accent hover:underline font-medium"
              >
                Explore All Programs →
              </Link>
            </div>

            {/* CTA */}
            <div className="bg-[#1e3a5f] text-white rounded-xl p-8 md:p-10 text-center">
              <h3 className="font-serif text-2xl mb-3">Ready to Learn More?</h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto">
                Join other {location.city}-area families who are giving their children a classical education with flexibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="https://accounts.americanseekersacademy.com/register/2OSQEAY3" 
                  className="btn-primary inline-flex items-center justify-center"
                >
                  Apply Now
                </Link>
                <Link 
                  href="/#contact" 
                  className="inline-flex items-center justify-center border border-white/40 hover:bg-white/10 text-white px-6 py-3 rounded font-semibold transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
