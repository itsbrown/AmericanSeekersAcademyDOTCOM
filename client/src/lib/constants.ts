export interface ProgramPricing {
  halfDay: number | null;
  fullDay: number | null;
  note?: string;
}

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
  pricing: ProgramPricing;
}

export const extracurriculars = [
  "Latin",
  "Baking",
  "Cake Decorating",
  "Music",
  "Band",
  "Lego Engineering",
  "Architecture",
  "Etiquette Class",
  "Shark Tank",
  "Entrepreneur Class",
  "Sculpture",
  "Drawing",
  "Sewing"
];

export const programs: Program[] = [
  {
    slug: "macaronis",
    name: "Macaronis",
    ageRange: "Ages 6 months - 3 years",
    grades: "Early Education",
    description: "Welcomes our youngest learners into a warm, nurturing academic setting designed to spark curiosity, encourage sensory exploration, and build foundational social skills through play, music, and movement.",
    keyFocus: [
      "Numbers, letters, and colors",
      "Sensory exploration and hands-on science",
      "Music, movement, and parachute play",
      "Basic manners and social skills",
      "Fine and gross motor development",
      "Story time and early literacy"
    ],
    teachingMethods: [
      "Interactive songs, rhymes, and group activities",
      "Project-based learning with art and crafts",
      "Circle time stories and manners discussions",
      "Sensory bins and hands-on experiments"
    ],
    ihipHours: "180-450 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "A deep, personal connection with a mentor is a priceless gift for any child. At ASA, we believe the guidance of dedicated teachers is a cornerstone of traditional education that homeschooling families can embrace to enrich their child's growth. Our Macaroni Class (ages 6 months to 3 years) welcomes our youngest learners into a warm, nurturing academic setting designed to spark curiosity, encourage sensory exploration, and build foundational social skills. Beyond engaging lessons on numbers, letters, colors, and syllables, your child will delight in a vibrant morning filled with play, music, movement, obstacle courses, tumbling, classic stories, and enriching arts and crafts—all in just three hours, three days a week. With a consistent, rhythmic schedule, your little one will thrive in a thoughtfully crafted routine at ASA, brimming with exceptional educational activities and high-quality creative projects. Our co-op is purposefully designed for homeschooling families, striking a perfect balance between learning and living, and instilling a lifelong passion for discovery.",
    pricing: { halfDay: null, fullDay: null, note: "Contact us for Macaroni pricing" }
  },
  {
    slug: "yankee-doodle",
    name: "Yankee Doodles",
    ageRange: "Ages 4-5",
    grades: "PreK-K",
    description: "Builds foundational skills through a classical education model, emphasizing literacy, counting, and responsibility. Hands-on, kinesthetic activities engage young learners, fostering a love for learning and civic virtue.",
    keyFocus: [
      "Short vowel sounds and CVC word decoding",
      "Counting to 10 and basic addition",
      "American symbols and founding figures",
      "Responsibility and manners",
      "Fine motor skills through art and handwriting",
      "Cooperative games and physical education"
    ],
    teachingMethods: [
      "Interactive kinesthetic learning (jumping for vowels, syllable drumming)",
      "Project-based activities (creating maps, snowman art)",
      "Discussion-based circle time on manners and history",
      "Hands-on experiments like cloud in a jar"
    ],
    ihipHours: "180-450 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "A meaningful, human connection with a teacher is an invaluable benefit to a child. We believe mentors are a necessary attribute of the traditional school model that homeschoolers can greatly benefit from. The Yankee Doodles class (ages 4–5, PreK–K) builds foundational skills through a classical education model, emphasizing literacy, counting, and responsibility. Hands-on, kinesthetic activities engage young learners, fostering a love for learning and civic virtue. The program supports homeschooling families by providing a structured yet flexible curriculum. Using Literacy Essentials, Primary Phonics, Dimensions Math, and resources like Tuttle Twins and Our America (Abeka), students master short vowel sounds, decode CVC words, count to 10, perform basic addition, and understand American symbols and figures.",
    pricing: { halfDay: 1050, fullDay: 1500 }
  },
  {
    slug: "tycoons",
    name: "Tycoons",
    ageRange: "Grades 1-2",
    grades: "Elementary",
    description: "Dives into Literacy Essentials building a strong foundation necessary for developing reading and writing skills, with structured curricula covering all common subjects and highlighting America's founding principles.",
    keyFocus: [
      "Phonograms, decoding, handwriting, and spelling",
      "Addition and subtraction within 100",
      "Plants, animals, and weather science",
      "Pilgrims, Founding Fathers, and American growth",
      "Continents, maps, and geography",
      "Financial literacy and entrepreneurship"
    ],
    teachingMethods: [
      "Structured literacy instruction with Literacy Essentials",
      "Singapore Math approach with number bonds and bar models",
      "Science experiments and activity books",
      "Art projects including Portrait Series sketches"
    ],
    ihipHours: "180-450 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1629196911514-cfd65aa4a048?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "A meaningful, human connection with a teacher is an invaluable benefit to a child. We believe mentors are a necessary attribute of the traditional school model that homeschoolers can greatly benefit from. The Tycoons class (grades 1–2) dives into Literacy Essentials building a strong foundation necessary for developing reading and writing skills. Throughout a 3 hour period, 3 days a week, students receive in person instruction using structured curricula that covers all common subjects and highlights America's founding principles. In a positive and social environment, the ASA model emphasizes self-governance, critical thinking and entrepreneurship. With day to day consistency and rhythm, your child will benefit from a well rounded routine created with exceptional educational activities and quality arts & crafts. Designed for homeschooling families, this program balances learning and living, inspiring children for a lifelong love of discovery.",
    pricing: { halfDay: 1050, fullDay: 1500 }
  },
  {
    slug: "seekers",
    name: "Seekers",
    ageRange: "Grades 3-5",
    grades: "Elementary",
    description: "Goes deeper into liberal arts, sharpening reading and writing skills while pushing students intellectually with structured curricula covering all common subjects and America's founding principles.",
    keyFocus: [
      "Spelling patterns and reading fluency",
      "Multi-digit operations and fractions",
      "Weather patterns and energy transfer",
      "American history and economic principles",
      "World geography and map skills",
      "Narrative and expository writing with IEW"
    ],
    teachingMethods: [
      "Hands-on experiments (cloud in a jar, energy transfer)",
      "Discussion-based history debates and entrepreneurship",
      "Project-based learning (store dioramas, continent maps)",
      "Structured writing with IEW techniques"
    ],
    ihipHours: "180-450 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1525373698358-041e3a460346?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "A meaningful, human connection with a teacher is an invaluable benefit to a child. We believe mentors are a necessary attribute of the traditional school model that homeschoolers can greatly benefit from. The Seekers class (grades 3–5) goes deeper into liberal arts, sharpening their reading and writing skills while pushing them intellectually throughout a 3 hour period, 3 days a week with structured curricula that covers all common subjects and highlights America's founding principles. In a positive and social environment, the ASA model emphasizes self-governance, critical thinking and entrepreneurship. With day to day consistency and rhythm, your child will benefit from a well rounded routine created with exceptional educational activities and quality arts & crafts. Designed for homeschooling families, this program balances learning and living, inspiring children for a lifelong love of discovery.",
    pricing: { halfDay: 1050, fullDay: 1500 }
  },
  {
    slug: "pioneers",
    name: "Pioneers",
    ageRange: "Grades 6-8",
    grades: "Middle School",
    description: "Challenges students intellectually and philosophically with structured curricula covering all common subjects and highlighting America's founding principles, emphasizing self-governance, critical thinking, and entrepreneurship.",
    keyFocus: [
      "Vocabulary, reading comprehension, and grammar",
      "Pre-algebra, fractions, and geometry",
      "Physical sciences and microbiology",
      "American history and key events",
      "Budgeting and entrepreneurship",
      "Persuasive speech writing with IEW"
    ],
    teachingMethods: [
      "Socratic seminars on history and economics",
      "Project-based learning with end-of-session projects",
      "Hands-on science experiments and robot design",
      "Collaborative storytelling and memorization"
    ],
    ihipHours: "180-450 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "A meaningful, human connection with a teacher is an invaluable benefit to a child. We believe mentors are a necessary attribute of the traditional school model that homeschoolers can greatly benefit from. The Pioneers class (grades 6–8) challenges students intellectually and philosophically throughout a 3 hour period, 3 days a week with structured curricula that covers all common subjects and highlights America's founding principles. In a positive and social environment, the ASA model emphasizes self-governance, critical thinking and entrepreneurship. With day to day consistency and rhythm, your child will benefit from a well rounded routine created with exceptional educational activities and quality arts & crafts. Designed for homeschooling families, this program balances learning and living, inspiring children for a lifelong love of discovery.",
    pricing: { halfDay: 1050, fullDay: 1500 }
  },
  {
    slug: "patriots",
    name: "Patriots",
    ageRange: "Grades 9-12",
    grades: "High School",
    description: "Prepares students for intellectual and civic leadership with structured curricula covering all common subjects and highlighting America's founding principles, including college readiness and advanced classical education.",
    keyFocus: [
      "Advanced vocabulary and grammar analysis",
      "Algebra, geometry, and advanced operations",
      "Physical sciences and microbiology",
      "Fact-based American history and civic principles",
      "Market economics and personal finance",
      "Ethical decision-making through Aristotle's Ethics"
    ],
    teachingMethods: [
      "Socratic seminars on ethics and economics",
      "Project-based marketing and map skills",
      "Hands-on penny science experiments and robot design",
      "Speech writing and Gettysburg Address recitation"
    ],
    ihipHours: "180-450 hours/year",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    longDescription: "A meaningful, human connection with a teacher is an invaluable benefit to a child. We believe mentors are a necessary attribute of the traditional school model that homeschoolers can greatly benefit from. The Patriots class (grades 9–12) prepares students for intellectual and civic leadership throughout a 3 hour period, 3 days a week with structured curricula that covers all common subjects and highlights America's founding principles. In a positive and social environment, the ASA model emphasizes self-governance, critical thinking and entrepreneurship. With day to day consistency and rhythm, your child will benefit from a well rounded routine created with exceptional educational activities and quality arts & crafts. Designed for homeschooling families, this program balances learning and living, inspiring children for a lifelong love of discovery.",
    pricing: { halfDay: 1050, fullDay: 1500 }
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
    answer: "No, American Seekers Academy is a drop-off homeschool co-op, not a public, government, or private school. We operate under a Private Membership Association, serving as a complementary resource for homeschooling families. The children are with us less than 51% of the time, well within the boundaries of state regulations."
  },
  {
    question: "How does ASA work with IHIP requirements?",
    answer: "All our programs are designed to be IHIP compliant, covering required subjects with appropriate instructional hours (180 - 450 hours annually). We provide curriculum guidelines that parents can use for quarterly reports, but parents maintain responsibility for their child's education and documentation."
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
    name: "Andréa Evans",
    role: "Parent of five children",
    content: "I am an actual parent who sends FIVE children to this school. Not only is the school and learning excellent but the teachers, other community members and families involved are wonderful. Our family is so grateful for this school and community. Our children have thrived here educationally and have felt supported. I cannot recommend ASA enough.",
    rating: 5
  },
  {
    name: "Amy Misso",
    role: "ASA member",
    content: "I'm so thankful for American Seekers Academy! My daughters absolutely love this school. The curriculum is top notch - my struggling reader flourished with their Literacy Essentials curriculum. I love that the first half of the day is core subjects including math and IEW. I'm so thankful my girls can attend this school and learn core subjects as well as interesting and unique extracurriculars.",
    rating: 5
  }
];

export const locations = [
  {
    name: "Brighton Campus",
    address: "",
    hours: "Monday, Wednesday, Friday 9am-3pm"
  },
  {
    name: "Greece Campus",
    address: "",
    hours: "Monday, Wednesday, Friday 9am-3pm"
  }
];
