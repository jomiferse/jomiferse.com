import SkillTag from "../SkillTag";

interface Experience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  skills: string[];
}

interface ExperienceCardProps {
  experience: Experience;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/95 px-4 py-4 md:px-5 md:py-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Content */}
      <div className="relative z-10">
        <header className="mb-2">
          <h2 className="text-lg font-semibold text-slate-50">
            {experience.role} ·{" "}
            <span className="text-purple-300">{experience.company}</span>
          </h2>
          <p className="text-xs text-slate-400">
            {experience.location} · {experience.startDate} –{" "}
            {experience.endDate}
          </p>
        </header>

        <div className="text-sm text-slate-200 space-y-2 mb-3">
          {experience.description.split("\n\n").map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {experience.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {experience.skills.map((skill) => (
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
