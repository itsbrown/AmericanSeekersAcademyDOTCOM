import Hero from "@/components/home/Hero";
import VideoSection from "@/components/home/VideoSection";
import Philosophy from "@/components/home/Philosophy";
import Programs from "@/components/home/Programs";
import Testimonials from "@/components/home/Testimonials";
import Curriculum from "@/components/home/Curriculum";
import Comparison from "@/components/home/Comparison";
import About from "@/components/home/About";
import Locations from "@/components/home/Locations";
import FAQ from "@/components/home/FAQ";
import CTA from "@/components/home/CTA";
import { useEffect } from "react";
import { useLocation } from "wouter";

const Home = () => {
  const [location] = useLocation();

  useEffect(() => {
    // Extract hash from URL and scroll to the element if it exists
    const hash = location.split('#')[1];
    if (hash) {
      const element = document.getElementById(hash);
      if (element) {
        // Add a slight delay to ensure DOM is fully loaded
        setTimeout(() => {
          window.scrollTo({
            top: element.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      // If no hash, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <VideoSection />
      <Philosophy />
      <Programs />
      <Testimonials />
      <Curriculum />
      <Comparison />
      <About />
      <Locations />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;
