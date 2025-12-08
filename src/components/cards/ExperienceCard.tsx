import { useState, useRef, useEffect } from "react";
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
	const [expanded, setExpanded] = useState(false);
	const [shouldShowToggle, setShouldShowToggle] = useState(false);
	const textRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!textRef.current) return;

		const el = textRef.current;
		const isOverflowing = el.scrollHeight > el.clientHeight;
		setShouldShowToggle(isOverflowing);
	}, []);

	return (
		<article className="relative overflow-hidden rounded-3xl border border-zinc-700/70 bg-zinc-900/95 px-4 py-4 shadow-sm transition-shadow hover:shadow-md md:px-5 md:py-5">
			<div className="relative z-10">
				<header className="mb-2">
					<h2 className="text-lg font-semibold text-slate-50">
						{experience.role} ·{" "}
						<span className="text-purple-300">{experience.company}</span>
					</h2>

					<p className="text-xs text-slate-400">
						{experience.location} · {experience.startDate} – {experience.endDate}
					</p>
				</header>

				<div className="mb-3 space-y-2 text-sm text-slate-200">
					<div
						ref={textRef}
						className={`transition-all duration-300 ${
							expanded ? "line-clamp-none" : "line-clamp-4"
						}`}
					>
						{experience.description.split("\n\n").map((para, i) => (
							<p key={i} className="mb-2">
								{para}
							</p>
						))}
					</div>

					{shouldShowToggle && (
						<button
							onClick={() => setExpanded(!expanded)}
							className="text-xs text-purple-300 hover:text-purple-200 transition-colors underline underline-offset-2 cursor-pointer"
						>
							{expanded ? "Show less" : "Read more"}
						</button>
					)}
				</div>

				{experience.skills.length > 0 && (
					<div className="mt-1 flex flex-wrap gap-2">
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
