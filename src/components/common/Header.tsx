interface NavLink {
	href: string;
	label: string;
}

const links: NavLink[] = [
	{ href: "/", label: "home" },
	{ href: "/projects", label: "projects" },
	{ href: "/experience", label: "experience" },
	{ href: "/education", label: "education" },
	{ href: "/certifications", label: "certifications" },
];

interface HeaderProps {
	currentPath: string;
}

const normalizePath = (path: string) => {
	if (path === "/") return "/";
	return path.endsWith("/") ? path.slice(0, -1) : path;
};

export default function Header({ currentPath }: HeaderProps) {
	const normalizedCurrent = normalizePath(currentPath);
	return (
		<header className="sticky top-0 z-50 border-b border-slate-300/40 bg-slate-100/80 backdrop-blur-md dark:border-zinc-700/40 dark:bg-zinc-900/80">
			<div className="mx-auto max-w-4xl px-4 py-3">
				<nav className="no-scrollbar flex items-center gap-4 overflow-x-auto text-[11px] tracking-[0.25em] whitespace-nowrap uppercase md:flex-wrap md:text-xs">
					{links.map((link) => {
						const active = normalizedCurrent === link.href;

						return (
							<a
								key={link.href}
								href={link.href}
								className={`shrink-0 transition-colors ${
									active
										? "text-purple-500 dark:text-purple-300"
										: "text-zinc-400 hover:text-purple-400"
								}`}
								aria-current={active ? "page" : undefined}
							>
								/ {link.label} /
							</a>
						);
					})}
				</nav>
			</div>
		</header>
	);
}
