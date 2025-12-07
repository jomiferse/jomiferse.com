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
		<article className="relative overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/95 px-4 py-4 shadow-sm transition-shadow hover:shadow-md md:px-5 md:py-5">
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

				<p className="mb-3 text-sm text-slate-200">{project.summary}</p>

				{project.highlights && project.highlights.length > 0 && (
					<ul className="mb-3 list-inside list-disc space-y-1 text-xs text-slate-300">
						{project.highlights.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
				)}

				<div className="mb-3 flex flex-wrap gap-2">
					{project.technologies.map((tech) => (
						<span
							key={tech}
							className="inline-flex items-center rounded-full border border-zinc-700/70 bg-zinc-950/70 px-2.5 py-1 text-[11px] font-medium text-slate-200"
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
						className="text-xs font-medium text-purple-300 underline underline-offset-2 transition-colors hover:text-purple-200"
					>
						View more →
					</a>
				)}
			</div>
		</article>
	);
}
