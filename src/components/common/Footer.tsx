export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-300/40 dark:border-zinc-700/40 bg-slate-100/60 dark:bg-zinc-900/60 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-zinc-400">
        <p>&copy; {year} José Miguel Fernández. All rights reserved.</p>

        <div className="flex gap-5">
          <a
            href="https://github.com/jomiferse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/jomiferse"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            LinkedIn
          </a>

          <a
            href="mailto:jomiferse@gmail.com"
            className="hover:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
