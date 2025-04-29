import { Link } from "wouter";
import { programs } from "@/lib/constants";

const Footer = () => {
  return (
    <footer id="contact" className="bg-neutral-800 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">American Seekers Academy</h3>
            <p className="text-neutral-300 mb-4">
              A drop-off homeschool co-op created by homeschool parents for all parents who want more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-facebook-f text-xl"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-neutral-300 hover:text-white">
                <i className="fab fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Programs</h3>
            <ul className="space-y-2">
              {programs.map(program => (
                <li key={program.slug}>
                  <Link href={`/programs/${program.slug}`} className="text-neutral-300 hover:text-white">
                    {program.name} ({program.ageRange})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/#home" className="text-neutral-300 hover:text-white">Home</Link></li>
              <li><Link href="/#about" className="text-neutral-300 hover:text-white">About Us</Link></li>
              <li><Link href="/#curriculum" className="text-neutral-300 hover:text-white">Curriculum</Link></li>
              <li><Link href="/#locations" className="text-neutral-300 hover:text-white">Locations</Link></li>
              <li><Link href="/#faq" className="text-neutral-300 hover:text-white">FAQ</Link></li>
              <li><a href="#" className="text-neutral-300 hover:text-white">Become a Mentor</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-neutral-400"></i>
                <span className="text-neutral-300">
                  123 Education Way<br />
                  Brighton, NY 14610
                </span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-3 text-neutral-400"></i>
                <span className="text-neutral-300">(585) 555-1234</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-3 text-neutral-400"></i>
                <span className="text-neutral-300">info@americanseekersacademy.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-12 pt-8 text-center text-neutral-400 text-sm">
          <p>© {new Date().getFullYear()} American Seekers Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
