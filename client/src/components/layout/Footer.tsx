import { Link } from "wouter";
import { programs } from "@/lib/constants";
import { Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import logoImage from "@assets/ASA_Logos-transparent-white&red_1765765829361.png";

const Footer = () => {
  return (
    <footer id="contact" className="bg-foreground text-white pt-16 pb-8" role="contentinfo">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="inline-block mb-4" aria-label="American Seekers Academy Home">
              <img src={logoImage} alt="American Seekers Academy" className="h-12 w-auto" />
            </Link>
            <p className="text-white/70 mb-6 leading-relaxed">
              Created by a homeschool family for other parents who want more for their children's education.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/AmericanSeekersAcademy" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-accent hover:text-white transition-colors duration-200"
                aria-label="Facebook"
                data-testid="footer-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/americanseekersacademy/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-accent hover:text-white transition-colors duration-200"
                aria-label="Instagram"
                data-testid="footer-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com/1776Seekers" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white/70 hover:bg-accent hover:text-white transition-colors duration-200"
                aria-label="Twitter"
                data-testid="footer-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Programs</h3>
            <ul className="space-y-3" role="list">
              {programs.map(program => (
                <li key={program.slug}>
                  <Link 
                    href={`/programs/${program.slug}`} 
                    className="text-white/70 hover:text-accent transition-colors duration-200"
                    data-testid={`footer-program-${program.slug}`}
                  >
                    {program.name} ({program.ageRange})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3" role="list">
              <li><Link href="/#home" className="text-white/70 hover:text-accent transition-colors duration-200">Home</Link></li>
              <li><Link href="/#about" className="text-white/70 hover:text-accent transition-colors duration-200">About Us</Link></li>
              <li><Link href="/#curriculum" className="text-white/70 hover:text-accent transition-colors duration-200">Curriculum</Link></li>
              <li><Link href="/#locations" className="text-white/70 hover:text-accent transition-colors duration-200">Locations</Link></li>
              <li><Link href="/#faq" className="text-white/70 hover:text-accent transition-colors duration-200">FAQ</Link></li>
              <li><a href="#" className="text-white/70 hover:text-accent transition-colors duration-200">Become a Mentor</a></li>
              <li><a href="https://givebutter.com/american-seekers-academy" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-accent transition-colors duration-200">Donate</a></li>
              <li><Link href="/sms-policy" className="text-white/70 hover:text-accent transition-colors duration-200">SMS Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact Us</h3>
            <ul className="space-y-4" role="list">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-accent flex-shrink-0" aria-hidden="true" />
                <a href="tel:+15852102021" className="text-white/70 hover:text-accent transition-colors duration-200">
                  (585) 210-2021
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-accent flex-shrink-0" aria-hidden="true" />
                <a href="mailto:contact@americanseekersacademy.com" className="text-white/70 hover:text-accent transition-colors duration-200">
                  contact@americanseekersacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} American Seekers Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
