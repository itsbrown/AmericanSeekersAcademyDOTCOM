import { useEffect } from "react";

interface Position {
  title: string;
  locations: string;
  schedule: string;
  compensation: string;
  about: string;
  opportunity: string;
  whatYoullDo: string[];
  whoWereLookingFor: string[];
  whyJoin: string;
  howToApply: string;
}

const positions: Position[] = [
  {
    title: "Upper Elementary Mentor (Grades 3–5)",
    locations: "Brighton & Greece",
    schedule: "Monday, Wednesday, Friday | 9:00 AM – 12:00 PM and/or 9:00 AM – 3:00 PM",
    compensation: "Up to $28 per hour",
    about: "American Seekers Academy is a classical homeschool co-op dedicated to forming wise, virtuous, and liberty-loving students. We partner with families to provide rich, in-person instruction rooted in truth, goodness, and beauty while supporting parents as the primary educators of their children.",
    opportunity: "We are seeking a mission-aligned Upper Elementary Mentor who is passionate about classical education and excited to guide students in developing strong academic foundations alongside character and wonder.",
    whatYoullDo: [
      "Lead engaging, age-appropriate lessons in literature, history, science, and the humanities",
      "Foster a classroom culture of curiosity, respect, and self-governance",
      "Integrate ideas of liberty, responsibility, and American heritage into daily learning",
      "Collaborate with fellow mentors and support families in their homeschool journey",
      "Help students develop strong habits of attention, memory, and clear expression"
    ],
    whoWereLookingFor: [
      "A warm, relational mentor who loves working with children ages 8–11",
      "Someone who resonates with classical education and the principles of liberty and self-reliance",
      "Strong classroom presence and the ability to manage a group with both kindness and clarity",
      "Excellent communication skills and a collaborative spirit",
      "Previous experience in education, homeschooling, or mentoring is valued but not required"
    ],
    whyJoin: "You’ll be part of a growing community that values truth, character, and the formation of the whole child. We offer meaningful work, a supportive team, and the opportunity to shape young hearts and minds in a classical, liberty-centered environment.",
    howToApply: "https://accounts.americanseekersacademy.com/forms/mentor-application"
  },
  {
    title: "Middle School Mentor (Grades 6–8)",
    locations: "Brighton & Greece",
    schedule: "Monday, Wednesday, Friday | 9:00 AM – 12:00 PM and/or 9:00 AM – 3:00 PM",
    compensation: "Up to $28 per hour",
    about: "American Seekers Academy partners with homeschool families to provide classical, in-person instruction that forms students in wisdom, virtue, and a love of liberty.",
    opportunity: "We are looking for a thoughtful and engaging Middle School Mentor who can inspire students navigating the important years of early adolescence with both academic excellence and character formation.",
    whatYoullDo: [
      "Teach literature, history, science, and logic with clarity and depth",
      "Guide students in developing strong reasoning, writing, and discussion skills",
      "Cultivate a classroom culture rooted in respect, responsibility, and self-governance",
      "Connect ideas of American heritage, liberty, and personal responsibility to students’ learning",
      "Support students as they grow in independence and intellectual confidence"
    ],
    whoWereLookingFor: [
      "A mentor who enjoys working with students ages 11–14 and understands their unique developmental stage",
      "Someone aligned with classical education and the formation of virtuous, liberty-minded young people",
      "Strong ability to lead meaningful discussions and foster critical thinking",
      "Warm, firm, and relationally wise classroom presence",
      "Experience in education, mentoring, or homeschooling is a plus"
    ],
    whyJoin: "Join a mission-driven team that believes education should form the heart as well as the mind. You’ll have the opportunity to make a lasting impact during a pivotal stage in students’ lives.",
    howToApply: "https://accounts.americanseekersacademy.com/forms/mentor-application"
  },
  {
    title: "High School Mentor (Grades 9–12)",
    locations: "Brighton & Greece",
    schedule: "Monday, Wednesday, Friday | 9:00 AM – 12:00 PM and/or 9:00 AM – 3:00 PM",
    compensation: "Up to $28 per hour",
    about: "American Seekers Academy is a classical homeschool co-op committed to forming students who are wise, virtuous, and grounded in the principles of liberty.",
    opportunity: "We are seeking a High School Mentor who can challenge and inspire older students through rich discussion, rigorous thinking, and meaningful mentorship.",
    whatYoullDo: [
      "Lead high school-level classes in literature, history, government, philosophy, or related subjects",
      "Facilitate deep, Socratic-style discussions that develop wisdom and discernment",
      "Mentor students in developing strong writing, reasoning, and leadership skills",
      "Integrate themes of liberty, self-governance, and American heritage into the curriculum",
      "Serve as a steady, trusted adult presence during these formative high school years"
    ],
    whoWereLookingFor: [
      "A mentor who is passionate about working with high school students and helping them think deeply",
      "Strong alignment with classical education and the principles of liberty and personal responsibility",
      "Excellent discussion facilitation and writing/analytical skills",
      "Mature, wise, and relationally strong presence",
      "Background in education, mentoring, or a related field is highly valued"
    ],
    whyJoin: "This is an opportunity to pour into students during one of the most important seasons of their lives — helping shape not just what they know, but who they become.",
    howToApply: "https://accounts.americanseekersacademy.com/forms/mentor-application"
  },
  {
    title: "Littles Mentor (Ages 6 months – 3 years)",
    locations: "Brighton & Greece",
    schedule: "Monday, Wednesday, Friday | 9:00 AM – 12:00 PM and/or 9:00 AM – 3:00 PM",
    compensation: "Up to $28 per hour",
    about: "American Seekers Academy supports homeschool families by providing warm, developmentally rich environments where even our youngest students can begin forming habits of attention, wonder, and virtue.",
    opportunity: "We are seeking a nurturing and attentive Littles Mentor who loves caring for infants and toddlers and understands the importance of these early years in a child’s development.",
    whatYoullDo: [
      "Provide loving, attentive care for children ages 6 months to 3 years",
      "Create a calm, safe, and engaging environment that supports early development",
      "Establish gentle rhythms and routines that foster security and wonder",
      "Support early social, emotional, and language development through play and interaction",
      "Partner with families by maintaining clear, warm communication"
    ],
    whoWereLookingFor: [
      "A patient, warm, and highly responsible caregiver who genuinely enjoys this age group",
      "Someone who values creating a peaceful, nurturing atmosphere for young children",
      "Experience working with infants and/or toddlers (in a home, daycare, or co-op setting)",
      "Reliable, attentive, and mission-aligned with supporting homeschool families",
      "CPR/First Aid certified (or willing to obtain)"
    ],
    whyJoin: "You’ll play a foundational role in the lives of our youngest students and their families, helping lay the groundwork for a love of learning and healthy development from the very beginning.",
    howToApply: "https://accounts.americanseekersacademy.com/forms/mentor-application"
  }
];

export default function Employment() {
  useEffect(() => {
    document.title = "Employment Opportunities | American Seekers Academy";
  }, []);

  // TODO: Replace email instructions with application link once available


  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Employment Opportunities</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join our mission to form wise, virtuous, and liberty-loving students through classical education.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-lg text-gray-700">
            American Seekers Academy is growing, and we’re looking for mission-aligned mentors who are passionate about classical education and the formation of the whole child.
          </p>
        </div>

        {/* Positions */}
        <div className="space-y-16">
          {positions.map((position, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 md:p-10">
              <div className="mb-8">
                <h2 className="font-serif text-3xl font-bold text-[#1e3a5f] mb-3">{position.title}</h2>
                
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-gray-600 mb-4">
                  <div><span className="font-medium text-[#1e3a5f]">Locations:</span> {position.locations}</div>
                  <div><span className="font-medium text-[#1e3a5f]">Schedule:</span> {position.schedule}</div>
                  <div><span className="font-medium text-[#1e3a5f]">Compensation:</span> {position.compensation}</div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                <div>
                  <h3 className="font-semibold text-xl text-[#1e3a5f] mb-3">About American Seekers Academy</h3>
                  <p>{position.about}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-[#1e3a5f] mb-3">The Opportunity</h3>
                  <p>{position.opportunity}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-[#1e3a5f] mb-3">What You’ll Do</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {position.whatYoullDo.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-[#1e3a5f] mb-3">Who We’re Looking For</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {position.whoWereLookingFor.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-xl text-[#1e3a5f] mb-3">Why Join American Seekers Academy?</h3>
                  <p>{position.whyJoin}</p>
                </div>

                <div className="bg-[#f5f0e8] border-l-4 border-[#c4a052] p-6 rounded-r-lg">
                  <h3 className="font-semibold text-xl text-[#1e3a5f] mb-4">How to Apply</h3>
                  <a
                    href={position.howToApply}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-8 py-3 text-base font-semibold rounded-lg transition-colors duration-200"
                  >
                    Apply Now →
                  </a>
                  <p className="text-sm text-gray-600 mt-3">
                    You will be redirected to our online mentor application form.
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-gray-600 text-sm">
          American Seekers Academy is an equal opportunity employer committed to building a diverse and inclusive community.
        </div>
      </div>
    </div>
  );
}
