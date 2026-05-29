import type { Program } from "@/lib/constants";

interface ProgramJsonLdProps {
  program: Program;
}

export default function ProgramJsonLd({ program }: ProgramJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": `American Seekers Academy - ${program.name}`,
    "description": program.description,
    "url": `https://americanseekersacademy.com/programs/${program.slug}`,
    "parentOrganization": {
      "@type": "EducationalOrganization",
      "name": "American Seekers Academy",
      "url": "https://americanseekersacademy.com"
    },
    "educationalLevel": program.grades,
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student",
      "audienceType": "Homeschool families"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
