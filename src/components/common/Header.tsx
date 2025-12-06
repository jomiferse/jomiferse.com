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

export default function Header({ currentPath }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-300/40 dark:border-zinc-700/40 bg-slate-100/80 dark:bg-zinc-900/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <nav
          className="
            flex items-center gap-4
            text-[11px] md:text-xs uppercase tracking-[0.25em]
            overflow-x-auto whitespace-nowrap no-scrollbar
            md:flex-wrap
          "
        >
          {links.map((link) => {
            const active = currentPath === link.href;

            return (
              <a
                key={link.href}
                href={link.href}
                className={`transition-colors shrink-0 ${
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
