import SkillTag from "../SkillTag";

interface Certification {
  name: string;
  provider: string;
  year: string;
  credentialId?: string;
  url?: string;
  skills?: string[];
}

interface CertificationCardProps {
  certification: Certification;
}

export default function CertificationCard({
  certification,
}: CertificationCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/95 px-4 py-4 md:px-5 md:py-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Content */}
      <div className="relative z-10">
        <header className="mb-2">
          <h2 className="text-lg font-semibold text-slate-50">
            {certification.name}
          </h2>
          <p className="text-xs text-slate-400">
            {certification.provider} · {certification.year}
          </p>

          {certification.credentialId && (
            <p className="text-xs text-slate-500">
              Credential ID: {certification.credentialId}
            </p>
          )}
        </header>

        {certification.url && (
          <p className="text-xs mb-2">
            <a
              href={certification.url}
              target="_blank"
              rel="noreferrer"
              className="text-purple-300 underline underline-offset-2 hover:text-purple-200 transition-colors"
            >
              View credential →
            </a>
          </p>
        )}

        {certification.skills && certification.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {certification.skills.map((skill) => (
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
