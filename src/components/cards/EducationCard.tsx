import SkillTag from "../SkillTag";

interface Education {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  notes?: string;
  skills?: string[];
}

interface EducationCardProps {
  education: Education;
}

export default function EducationCard({ education }: EducationCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/95 px-4 py-4 md:px-5 md:py-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Content */}
      <div className="relative z-10">
        <header className="mb-2">
          <h2 className="text-lg font-semibold text-slate-50">
            {education.degree}
          </h2>

          <p className="text-xs text-slate-400">
            {education.institution} · {education.location}
          </p>

          <p className="text-xs text-slate-500">
            {education.startDate} – {education.endDate}
          </p>
        </header>

        <div className="text-sm text-slate-200 space-y-2 mb-3">
          <p>{education.description}</p>

          {education.notes && (
            <p className="text-xs text-slate-400">
              <strong>Notes:</strong> {education.notes}
            </p>
          )}
        </div>

        {education.skills && education.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {education.skills.map((skill) => (
              <SkillTag key={skill} className="text-[11px]">
                {skill}
              </SkillTag>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
