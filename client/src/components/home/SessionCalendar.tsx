import { CalendarDays } from "lucide-react";

const sessions = [
  { season: "Spring 2026", dates: "April 6 – June 12", icon: "🌷" },
  { season: "Fall 2026", dates: "September 14 – November 20", icon: "🍂" },
  { season: "Winter 2027", dates: "January 4 – March 12", icon: "❄️" },
  { season: "Spring 2027", dates: "April 5 – June 11", icon: "🌷" },
  { season: "Fall 2027", dates: "September 13 – November 19", icon: "🍂" },
];

const SessionCalendar = () => {
  return (
    <section id="calendar" className="py-20 bg-[#1e3a5f]" aria-labelledby="calendar-heading">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#c4a052] bg-white/10 rounded-full mb-6">
            <CalendarDays className="w-4 h-4" />
            Upcoming Sessions
          </span>
          <h2 id="calendar-heading" className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Session Calendar
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Each session runs for 10 weeks with classes 3 days per week. American holidays are observed.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {sessions.map((session) => (
            <div
              key={session.season}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="text-3xl mb-3 block">{session.icon}</span>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {session.season}
              </h3>
              <p className="text-[#c4a052] font-semibold text-lg">{session.dates}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#registration-waitlist"
            className="inline-block bg-[#c4a052] hover:bg-[#b3903f] text-white px-8 py-3 text-sm font-semibold tracking-wide uppercase rounded transition-colors duration-200"
          >
            Register Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default SessionCalendar;
