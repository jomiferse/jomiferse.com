import type { ReactNode } from "react";

interface SkillTagProps {
	children: ReactNode;
	className?: string;
}

export default function SkillTag({ children, className = "" }: SkillTagProps) {
	return (
		<span
			className={`inline-flex items-center rounded-full border border-zinc-700/70 bg-zinc-950/70 px-2.5 py-1 text-slate-200 ${className}`}
		>
			{children}
		</span>
	);
}
