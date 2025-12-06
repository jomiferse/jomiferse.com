interface Project {
  title: string;
  role: string;
  timeframe?: string;
  technologies: string[];
  summary: string;
  highlights?: string[];
  link?: string;
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="relative overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/95 px-4 py-4 md:px-5 md:py-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Content */}
      <div className="relative z-10">
        <header className="mb-2">
          <h2 className="text-lg font-semibold text-slate-50">
            {project.title}
          </h2>
          <p className="text-xs text-slate-300">
            {project.role}
            {project.timeframe && <> · {project.timeframe}</>}
          </p>
        </header>

        <p className="text-sm text-slate-200 mb-3">{project.summary}</p>

        {project.highlights && project.highlights.length > 0 && (
          <ul className="list-disc list-inside text-xs text-slate-300 mb-3 space-y-1">
            {project.highlights.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-full bg-zinc-950/70 px-2.5 py-1 text-[11px] font-medium text-slate-200 border border-zinc-700/70"
            >
              {tech}
            </span>
          ))}
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-purple-300 underline underline-offset-2 hover:text-purple-200 transition-colors"
          >
            View more →
          </a>
        )}
      </div>
    </article>
  );
}
