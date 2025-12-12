import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

interface NavLink {
	href: string;
	label: string;
}

const links: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/projects", label: "Projects" },
	{ href: "/experience", label: "Experience" },
	{ href: "/education", label: "Education" },
	{ href: "/certifications", label: "Certifications" },
];

interface HeaderProps {
	currentPath: string;
}

const normalizePath = (path: string) =>
	path === "/" ? "/" : path.replace(/\/$/, "");

export default function Header({ currentPath }: HeaderProps) {
	const normalizedCurrent = useMemo(
		() => normalizePath(currentPath),
		[currentPath]
	);

	const [menuOpen, setMenuOpen] = useState(false);

	// Para animar el cierre: mantenemos montado mientras hace transition
	const [menuMounted, setMenuMounted] = useState(false);

	const openMenu = () => {
		setMenuMounted(true);
		// siguiente tick para que la transición arranque
		requestAnimationFrame(() => setMenuOpen(true));
	};

	const closeMenu = () => {
		setMenuOpen(false);
		// espera a que termine la animación para desmontar
		window.setTimeout(() => setMenuMounted(false), 250);
	};

	return (
		<>
			<header className="sticky top-0 z-50 border-b border-slate-300/40 bg-slate-100/80 backdrop-blur-md dark:border-zinc-700/40 dark:bg-zinc-900/80">
				<div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
					<a
						href="/"
						className="text-sm font-semibold tracking-widest text-slate-900 dark:text-zinc-100"
					>
						JMF
					</a>

					<nav className="hidden items-center gap-6 text-sm md:flex">
						{links.map((link) => {
							const active = normalizedCurrent === link.href;
							return (
								<a
									key={link.href}
									href={link.href}
									className={`transition-colors ${
										active
											? "text-purple-500 dark:text-purple-300"
											: "text-zinc-400 hover:text-purple-400"
									}`}
								>
									{link.label}
								</a>
							);
						})}
					</nav>

					<button
						onClick={openMenu}
						aria-label="Open menu"
						className="text-zinc-500 hover:text-purple-400 md:hidden"
						type="button"
					>
						<Menu size={20} />
					</button>
				</div>
			</header>

			{menuMounted && (
				<div
					className={`fixed inset-0 z-50 md:hidden transition-opacity duration-200 ${
						menuOpen ? "opacity-100" : "opacity-0"
					}`}
					onClick={closeMenu}
				>
					<div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

					<aside
						className={`absolute right-0 top-0 h-full w-72 bg-slate-100 p-6 dark:bg-zinc-900
            transform transition-transform duration-250 ease-out
            ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
						onClick={(e) => e.stopPropagation()}
						aria-label="Mobile navigation"
					>
						<div className="mb-8 flex items-center justify-between">
              <span className="text-sm font-semibold tracking-widest text-slate-900 dark:text-zinc-100">
                JMF
              </span>

							<button
								onClick={closeMenu}
								aria-label="Close menu"
								className="text-zinc-500 hover:text-purple-400"
								type="button"
							>
								<X size={20} />
							</button>
						</div>

						<nav className="flex flex-col gap-3">
							{links.map((link) => {
								const active = normalizedCurrent === link.href;
								return (
									<a
										key={link.href}
										href={link.href}
										onClick={closeMenu}
										className={`rounded-xl border px-4 py-3 text-sm transition ${
											active
												? "text-purple-500 dark:text-purple-300"
												: "border-zinc-700/40 text-zinc-400 hover:border-purple-400 hover:text-purple-400"
										}`}
									>
										{link.label}
									</a>
								);
							})}
						</nav>
					</aside>
				</div>
			)}
		</>
	);
}
