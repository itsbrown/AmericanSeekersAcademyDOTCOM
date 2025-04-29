export interface Program {
  slug: string;
  name: string;
  ageRange: string;
  grades: string;
  description: string;
  keyFocus: string[];
  teachingMethods: string[];
  ihipHours: string;
  imageUrl: string;
  longDescription: string;
}

export const programs: Program[] = [
  {
    slug: "macaronis",
    name: "Macaronis",
    ageRange: "Ages 0-3",
    grades: "Early Education",
    description: "Introduces our youngest learners to a nurturing, Montessori-inspired environment that fosters curiosity, sensory exploration, and early social skills.",
    keyFocus: ["Sensory exploration", "Early social skills", "Basic literacy"],
    teachingMethods: ["Montessori-inspired", "Play-based activities"],
    ihipHours: "900 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "The Macaroni class (ages 0–3) introduces our youngest learners to a nurturing, Montessori-inspired environment that fosters curiosity, sensory exploration, and early social skills. Designed for homeschooling families, this program balances learning and living, preparing children for a lifelong love of discovery. The curriculum emphasizes hands-on, play-based activities aligned with ASA's classical education model, promoting civic virtue and parental choice."
  },
  {
    slug: "yankee-doodle",
    name: "Yankee Doodle",
    ageRange: "Ages 4-5",
    grades: "PreK-K",
    description: "Builds foundational skills through a classical model, emphasizing literacy, counting, and responsibility with hands-on activities.",
    keyFocus: ["Literacy foundations", "Counting", "Responsibility"],
    teachingMethods: ["Hands-on", "Kinesthetic activities"],
    ihipHours: "900 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "The Yankee Doodle class (ages 4–5, PreK–K) builds foundational skills through a classical education model, emphasizing literacy, counting, and responsibility. Hands-on, kinesthetic activities engage young learners, fostering a love for learning and civic virtue. The program supports homeschooling families by providing a structured yet flexible curriculum."
  },
  {
    slug: "tycoons",
    name: "Tycoons",
    ageRange: "Grades 1-2",
    grades: "Elementary",
    description: "Introduces classical education through structured curriculum focusing on literacy, math, and financial literacy.",
    keyFocus: ["Literacy", "Math", "Financial literacy"],
    teachingMethods: ["Discussion-based", "Project-based", "Hands-on"],
    ihipHours: "900 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1629196911514-cfd65aa4a048?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "The Tycoons class (grades 1–2) introduces classical education through a structured curriculum focusing on literacy, math, and financial literacy. Emphasizing self-governance and American values, this program prepares students for intellectual and civic growth, supporting homeschooling families with a rigorous yet engaging approach."
  },
  {
    slug: "seekers",
    name: "Seekers",
    ageRange: "Grades 3-5",
    grades: "Elementary",
    description: "Deepens classical education with a focus on spelling, history, and financial literacy through Montessori-inspired activities.",
    keyFocus: ["Spelling", "History", "Financial literacy"],
    teachingMethods: ["Montessori-inspired", "Hands-on activities"],
    ihipHours: "900 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1525373698358-041e3a460346?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "The Seekers class (grades 3–5) deepens classical education with a focus on spelling, history, and financial literacy. Montessori-inspired, hands-on activities develop critical thinking and civic responsibility, preparing students for a life of freedom and intellectual growth in a parent-driven educational model."
  },
  {
    slug: "pioneers",
    name: "Pioneers",
    ageRange: "Grades 6-8",
    grades: "Middle School",
    description: "Advances classical education with rigorous academics, focusing on virtue, economics, and history through discussion-based learning.",
    keyFocus: ["Virtue", "Economics", "History"],
    teachingMethods: ["Discussion-based", "Project-based"],
    ihipHours: "990 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "The Pioneers class (grades 6–8) advances classical education with rigorous academics, focusing on virtue, economics, and history. Discussion-based learning develops critical thinking and leadership skills, preparing students for civic engagement in a parent-driven educational model."
  },
  {
    slug: "patriots",
    name: "Patriots",
    ageRange: "Grades 9-12",
    grades: "High School",
    description: "Prepares students for intellectual and civic leadership through advanced classical education focused on economics, grammar, and history.",
    keyFocus: ["Economics", "Grammar", "History"],
    teachingMethods: ["Discussion-based", "Project-based"],
    ihipHours: "990 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "The Patriots class (grades 9–12) prepares students for intellectual and civic leadership through advanced classical education. Focusing on economics, grammar, and history, this program fosters independent thinking and virtue, empowering homeschooling families to guide their teens toward a life of freedom."
  }
];

export const curriculumSubjects = [
  { name: "Literacy & Language Arts", icon: "fa-check-circle" },
  { name: "Mathematics", icon: "fa-check-circle" },
  { name: "Science & Technology", icon: "fa-check-circle" },
  { name: "History & Geography", icon: "fa-check-circle" },
  { name: "Financial Literacy", icon: "fa-check-circle" },
  { name: "Art & Music", icon: "fa-check-circle" },
  { name: "Physical Education", icon: "fa-check-circle" },
  { name: "Self-Governance", icon: "fa-check-circle" }
];

export const trustedSources = [
  { name: "Hillsdale College", icon: "fa-book" },
  { name: "Institute for Excellence in Writing (IEW)", icon: "fa-book" },
  { name: "Robert Woodson Institute", icon: "fa-book" },
  { name: "PragerU Kids", icon: "fa-book" },
  { name: "Tuttle Twins", icon: "fa-book" },
  { name: "Logic of English", icon: "fa-book" },
  { name: "Singapore Math", icon: "fa-book" }
];

export const curriculumTabs = [
  {
    id: "literacy",
    name: "Literacy",
    title: "Structured Literacy Approach",
    description: "Our literacy program follows a phonograms-based approach similar to the Orton-Gillingham method, providing comprehensive instruction on:",
    features: [
      {
        title: "Phonograms Mastery",
        description: "Students learn 72 phonograms, their corresponding sounds, and example words, developing strong decoding skills from the beginning."
      },
      {
        title: "Spelling Rules",
        description: "Our curriculum covers vowel rules, consonant rules, and suffix/prefix rules, giving students a systematic approach to spelling."
      },
      {
        title: "Syllable Division",
        description: "Students learn to identify and divide words into syllables, understanding patterns like closed, open, and VCe syllables."
      },
      {
        title: "Multisensory Techniques",
        description: "We use visual, auditory, and kinesthetic methods including flashcards, pronunciation guides, and tactile activities."
      }
    ]
  },
  {
    id: "mathematics",
    name: "Mathematics",
    title: "Comprehensive Math Curriculum",
    description: "Our mathematics program follows the Singapore Math approach, emphasizing conceptual understanding, procedural fluency, and problem-solving skills:",
    features: [
      {
        title: "Concrete-Pictorial-Abstract",
        description: "Students progress from hands-on manipulatives to pictorial representations before working with abstract symbols and algorithms."
      },
      {
        title: "Number Sense",
        description: "Our curriculum develops strong number sense through mental math strategies, place value understanding, and number relationships."
      },
      {
        title: "Problem Solving",
        description: "Students learn bar modeling and other visual techniques to solve complex word problems and develop analytical thinking skills."
      },
      {
        title: "Mathematical Fluency",
        description: "Regular practice with number facts, operations, and mathematical concepts builds computational fluency and confidence."
      }
    ]
  },
  {
    id: "history",
    name: "History",
    title: "American History & Civic Education",
    description: "Our history curriculum provides a comprehensive understanding of American history, focusing on the principles that shaped our nation:",
    features: [
      {
        title: "Founding Documents",
        description: "Students study the Declaration of Independence, Constitution, and other primary sources to understand America's founding principles."
      },
      {
        title: "Key Historical Figures",
        description: "We explore the lives and contributions of important historical figures, emphasizing their character, virtues, and impact."
      },
      {
        title: "American Development",
        description: "Our curriculum traces America's growth from the colonial era through industrialization to modern times, highlighting key events."
      },
      {
        title: "Civic Responsibility",
        description: "Students learn about the rights and responsibilities of citizenship, preparing them for active civic engagement."
      }
    ]
  }
];

export const faqs = [
  {
    question: "Is American Seekers Academy a school?",
    answer: "No, American Seekers Academy is a drop-off homeschool co-op, not a public, government, or private school. We operate under a privately operated homeschool cooperative association, serving as a complementary resource for homeschooling families. The children are with us less than 51% of the time, well within the boundaries of NYS Homeschool Instruction Regulations."
  },
  {
    question: "How does ASA work with IHIP requirements?",
    answer: "All our programs are designed to be IHIP compliant, covering required subjects with appropriate instructional hours (900-990 hours annually). We provide curriculum guidelines that parents can use for quarterly reports, but parents maintain responsibility for their child's education and documentation."
  },
  {
    question: "What is the classical model of education?",
    answer: "The classical model is a time-tested approach to education based on the Trivium (grammar, logic, rhetoric) and Quadrivium (arithmetic, geometry, music, astronomy). This model focuses on teaching students how to learn and think critically rather than just memorizing facts. At ASA, we adapt this model to provide a well-rounded education that emphasizes both knowledge acquisition and critical thinking skills."
  },
  {
    question: "What days does the program run?",
    answer: "Our program runs three days per week: Monday, Wednesday, and Friday. Classes begin at 9 AM and conclude by 12 PM, with extended class periods ending no later than 2 PM. Special events may have varying times."
  },
  {
    question: "Is ASA only for certain religious or political backgrounds?",
    answer: "We welcome anyone to study here regardless of their faith tradition, political affiliation, or personal ideologies. We do not teach religious doctrine, though we do examine the role of the Creator in our founding documents and as contained within the design of our government. Our curriculum emphasizes civic virtue, responsible citizenship, and American values."
  },
  {
    question: "How does the drop-off program work?",
    answer: "Parents drop off their children at our facility during scheduled class times. Our mentors guide students through age-appropriate lessons aligned with our classical education curriculum. Parents remain the primary educators but can use our program to complement their homeschooling approach."
  },
  {
    question: "What qualifications do your mentors have?",
    answer: "Our mentors are experienced educators who are passionate about classical education and helping homeschool families. They receive training in our curriculum and teaching methods, and many are homeschool parents themselves who understand the unique needs and benefits of homeschool education."
  }
];

export const testimonials = [
  {
    name: "The Brown Family",
    role: "Homeschooling since 2020",
    content: "Homeschooling our children gave us more time to spend together and an opportunity to shape their education according to our standards. American Seekers Academy has given us the structure and support we needed to make homeschooling truly successful.",
    rating: 5
  },
  {
    name: "Jessica W.",
    role: "Parent of three",
    content: "We switched to homeschooling during the pandemic and were looking for a program that aligned with our educational philosophy. ASA's classical approach provides the perfect balance of structure and flexibility for our family.",
    rating: 5
  },
  {
    name: "The Andersons",
    role: "New to homeschooling",
    content: "As first-time homeschoolers, we were overwhelmed until we found American Seekers Academy. The curriculum is comprehensive, the mentors are supportive, and our children are thriving in ways we never expected.",
    rating: 5
  }
];

export const locations = [
  {
    name: "Brighton Campus",
    address: "123 Education Way, Brighton, NY 14610",
    hours: "Monday, Wednesday, Friday 9am-12pm"
  },
  {
    name: "Pittsford Campus",
    address: "456 Learning Lane, Pittsford, NY 14534",
    hours: "Monday, Wednesday, Friday 9am-12pm"
  }
];
