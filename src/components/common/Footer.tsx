export default function Footer() {
	const year = new Date().getFullYear();

	return (
		<footer className="border-t border-slate-300/40 bg-slate-100/60 backdrop-blur-sm dark:border-zinc-700/40 dark:bg-zinc-900/60">
			<div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-4 py-8 text-xs text-slate-600 sm:flex-row dark:text-zinc-400">
				<p>&copy; {year} José Miguel Fernández. All rights reserved.</p>

				<div className="flex gap-5">
					<a
						href="https://github.com/jomiferse"
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-purple-400 dark:hover:text-purple-300"
					>
						GitHub
					</a>

					<a
						href="https://linkedin.com/in/jomiferse"
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-purple-400 dark:hover:text-purple-300"
					>
						LinkedIn
					</a>

					<a
						href="mailto:jomiferse@gmail.com"
						className="transition-colors hover:text-purple-400 dark:hover:text-purple-300"
					>
						Contact
					</a>
				</div>
			</div>
		</footer>
	);
}
