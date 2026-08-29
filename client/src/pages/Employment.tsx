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

const APPLY = "https://accounts.americanseekersacademy.com/forms/mentor-application";
const MWF = "Monday, Wednesday, Friday | 9:00 AM – 12:00 PM and/or 9:00 AM – 3:00 PM";
const HALF = "Monday, Wednesday, Friday | 9:00 AM – 12:00 PM";
const PAY = "Up to $28 per hour";
const ABOUT = "American Seekers Academy is a classical homeschool co-op dedicated to forming wise, virtuous, and liberty-loving students. We partner with families to provide rich, in-person instruction rooted in truth, goodness, and beauty while supporting parents as the primary educators of their children.";

const positions: Position[] = [
  {
    title: "Yankee Doodles Mentor (Ages 4–5, PreK-K) — Brighton, needed ASAP",
    locations: "Brighton",
    schedule: MWF,
    compensation: PAY,
    about: ABOUT,
    opportunity: "We need a Yankee Doodles mentor ASAP for ages 4–5 (PreK-K) at our Brighton campus. This role builds foundational skills through a classical education approach, play, and character formation.",
    whatYoullDo: [
      "Lead engaging, age-appropriate lessons and activities for PreK-K students",
      "Foster a warm classroom culture of curiosity, respect, and wonder",
      "Build early literacy, number sense, attention, and good habits",
      "Partner with families and fellow mentors",
      "Integrate classical formation and ideas of liberty at a developmentally appropriate level"
    ],
    whoWereLookingFor: [
      "Someone who loves working with children ages 4–5",
      "Alignment with classical education",
      "Warm, firm, relational classroom presence",
      "Education, homeschooling, or mentoring experience is a plus, not required",
      "New York State teaching certification is not required"
    ],
    whyJoin: "You will join a mission-driven team at Brighton this fall. This role is needed ASAP.",
    howToApply: APPLY
  },
  {
    title: "Upper Elementary Mentor (Grades 3–5)",
    locations: "Brighton",
    schedule: MWF,
    compensation: PAY,
    about: ABOUT,
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
    howToApply: APPLY
  },
  {
    title: "Middle School Mentor (Grades 6–8)",
    locations: "Brighton",
    schedule: MWF,
    compensation: PAY,
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
    howToApply: APPLY
  },
  {
    title: "High School Mentor (Grades 9–12)",
    locations: "Brighton",
    schedule: MWF,
    compensation: PAY,
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
    howToApply: APPLY
  },
  {
    title: "Littles Mentor (Ages 6 months – 3 years)",
    locations: "Brighton",
    schedule: MWF,
    compensation: PAY,
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
    howToApply: APPLY
  },
  {
    title: "Macaronis Mentor (Ages 6 months–3 years) — Victor, Winter 2027",
    locations: "Victor (looking to open Winter 2027)",
    schedule: HALF,
    compensation: PAY,
    about: ABOUT,
    opportunity: "We are looking to open Victor in Winter 2027 and need a Macaronis mentor for ages 6 months to 3 years. This is a half-day role. Victor is not open yet.",
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
    whyJoin: "Help launch Victor in Winter 2027 with our youngest learners.",
    howToApply: APPLY
  },
  {
    title: "Yankee Doodles Mentor (Ages 4–5, PreK-K) — Victor, Winter 2027",
    locations: "Victor (looking to open Winter 2027)",
    schedule: MWF,
    compensation: PAY,
    about: ABOUT,
    opportunity: "We are looking to open Victor in Winter 2027 and need a Yankee Doodles mentor for ages 4–5 (PreK-K). Victor is not open yet.",
    whatYoullDo: [
      "Lead engaging, age-appropriate lessons and activities for PreK-K students",
      "Foster a warm classroom culture of curiosity, respect, and wonder",
      "Build early literacy, number sense, attention, and good habits",
      "Partner with families and fellow mentors",
      "Integrate classical formation and ideas of liberty at a developmentally appropriate level"
    ],
    whoWereLookingFor: [
      "Someone who loves working with children ages 4–5",
      "Alignment with classical education",
      "Warm, firm, relational classroom presence",
      "Education, homeschooling, or mentoring experience is a plus, not required",
      "New York State teaching certification is not required"
    ],
    whyJoin: "Help launch Victor in Winter 2027 with PreK-K students.",
    howToApply: APPLY
  },
  {
    title: "Tycoons Mentor (Grades 1–2) — Victor, Winter 2027",
    locations: "Victor (looking to open Winter 2027)",
    schedule: MWF,
    compensation: PAY,
    about: ABOUT,
    opportunity: "We are looking to open Victor in Winter 2027 and need a Tycoons mentor for grades 1–2. Victor is not open yet.",
    whatYoullDo: [
      "Lead engaging, age-appropriate lessons in literature, history, science, and the humanities",
      "Foster a classroom culture of curiosity, respect, and self-governance",
      "Help students develop strong habits of attention, memory, and clear expression",
      "Collaborate with fellow mentors and support families in their homeschool journey",
      "Integrate ideas of liberty, responsibility, and American heritage into daily learning"
    ],
    whoWereLookingFor: [
      "A warm, relational mentor who loves working with children in grades 1–2",
      "Someone who resonates with classical education and the principles of liberty and self-reliance",
      "Strong classroom presence and the ability to manage a group with both kindness and clarity",
      "Excellent communication skills and a collaborative spirit",
      "Previous experience in education, homeschooling, or mentoring is valued but not required"
    ],
    whyJoin: "Help launch Victor in Winter 2027 with early elementary students.",
    howToApply: APPLY
  }
];

function scanTitle(title: string) {
  return title.split(" — ")[0];
}

function isUrgent(title: string) {
  return /asap/i.test(title);
}

function PositionDetails({ position }: { position: Position }) {
  return (
    <div className="prose prose-lg max-w-none text-gray-700 space-y-6 pt-4 border-t border-gray-200">
      <p>{position.opportunity}</p>
      <div>
        <h3 className="font-semibold text-lg text-[#1e3a5f] mb-2">What you’ll do</h3>
        <ul className="list-disc pl-5 space-y-1">
          {position.whatYoullDo.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-lg text-[#1e3a5f] mb-2">Who we’re looking for</h3>
        <ul className="list-disc pl-5 space-y-1">
          {position.whoWereLookingFor.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
      <p className="text-sm text-gray-600">{position.schedule}</p>
    </div>
  );
}

function RoleRow({ position }: { position: Position }) {
  const urgent = isUrgent(position.title);
  return (
    <details className="group bg-white rounded-xl border border-gray-200 shadow-sm open:shadow-md open:border-[#1e3a5f]/30">
      <summary className="cursor-pointer list-none px-4 py-3 md:px-5 md:py-3.5 flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[12rem]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-serif font-bold text-[#1e3a5f] text-lg leading-tight">
              {scanTitle(position.title)}
            </span>
            {urgent && (
              <span className="text-xs font-semibold uppercase tracking-wide bg-[#c4a052] text-white px-2 py-0.5 rounded">
                Needed ASAP
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 mt-0.5">
            {position.locations} · {position.compensation}
          </div>
        </div>
        <a
          href={position.howToApply}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center justify-center bg-[#1e3a5f] hover:bg-[#2a4a73] text-white px-4 py-2 text-sm font-semibold rounded-lg"
        >
          Apply
        </a>
        <span className="text-sm text-[#1e3a5f] font-medium group-open:hidden">Details</span>
        <span className="text-sm text-[#1e3a5f] font-medium hidden group-open:inline">Hide</span>
      </summary>
      <div className="px-4 pb-5 md:px-5">
        <PositionDetails position={position} />
      </div>
    </details>
  );
}

function RoleGroup({ heading, note, roles }: { heading: string; note: string; roles: Position[] }) {
  return (
    <section className="mb-10">
      <h2 className="font-serif text-2xl font-bold text-[#1e3a5f] mb-1">{heading}</h2>
      <p className="text-sm text-gray-600 mb-3">{note}</p>
      <div className="space-y-2">
        {roles.map((position) => (
          <RoleRow key={position.title} position={position} />
        ))}
      </div>
    </section>
  );
}

export default function Employment() {
  useEffect(() => {
    document.title = "Employment Opportunities | American Seekers Academy";
  }, []);

  const brighton = positions.filter((p) => p.locations.startsWith("Brighton"));
  const victor = positions.filter((p) => p.locations.startsWith("Victor"));

  return (
    <div className="min-h-screen bg-[hsl(40,33%,98%)] pt-20">
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a73] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">Employment Opportunities</h1>
          <p className="text-base md:text-lg text-white/90 max-w-3xl mx-auto">
            Brighton is hiring now. We are looking to open Victor in Winter 2027. Up to $28/hr. NYS certification not required.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <RoleGroup
          heading="Brighton — hiring now"
          note="MWF. Apply from any row. Open a role for the full description."
          roles={brighton}
        />
        <RoleGroup
          heading="Victor — looking to open Winter 2027"
          note="Not open yet. We are hiring mentors now so this campus can launch."
          roles={victor}
        />

        <div className="mt-8 text-center text-gray-600 text-sm">
          American Seekers Academy is an equal opportunity employer committed to building a diverse and inclusive community.
        </div>
      </div>
    </div>
  );
}
