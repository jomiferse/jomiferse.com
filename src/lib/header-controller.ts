const FOCUSABLE_SELECTOR = [
	'a[href]:not([tabindex="-1"])',
	'button:not([disabled]):not([tabindex="-1"])',
	'[tabindex]:not([tabindex="-1"])',
].join(",");

interface MenuInertTarget {
	inert: boolean;
	dataset: {
		mobileMenuInert?: string;
	};
}

export const toggleMenuBackgroundInert = (
	targets: MenuInertTarget[],
	menu: MenuInertTarget,
	active: boolean,
): void => {
	for (const target of targets) {
		if (target === menu) continue;

		if (active) {
			if (target.inert) continue;
			target.inert = true;
			target.dataset.mobileMenuInert = "true";
			continue;
		}

		if (target.dataset.mobileMenuInert !== "true") continue;
		target.inert = false;
		delete target.dataset.mobileMenuInert;
	}
};

const isDark = () => document.documentElement.classList.contains("dark");

const setStoredPreference = (key: string, value: string) => {
	try {
		localStorage.setItem(key, value);
	} catch {
		// The interface still works when browser storage is unavailable.
	}
};

const syncThemeButtons = () => {
	document
		.querySelectorAll<HTMLButtonElement>("button.theme-toggle")
		.forEach((button) => {
			const sun = button.querySelector<HTMLElement>('[data-theme-icon="sun"]');
			const moon = button.querySelector<HTMLElement>(
				'[data-theme-icon="moon"]',
			);
			const dark = isDark();

			sun?.classList.toggle("hidden", !dark);
			moon?.classList.toggle("hidden", dark);
			button.setAttribute(
				"aria-label",
				dark
					? (button.dataset.labelLight ?? "Switch to light mode")
					: (button.dataset.labelDark ?? "Switch to dark mode"),
			);
		});
};

export const initSiteHeader = (): void => {
	const header = document.querySelector<HTMLElement>("[data-site-header]");
	const trigger = document.querySelector<HTMLButtonElement>("[data-menu-open]");
	const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
	const panel = document.querySelector<HTMLElement>("[data-menu-panel]");
	const closeButton =
		document.querySelector<HTMLButtonElement>("[data-menu-close]");

	if (!header || header.dataset.initialized === "true") return;
	header.dataset.initialized = "true";

	let previousFocus: HTMLElement | null = null;
	let closeTimer: number | undefined;
	const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
	const desktop = window.matchMedia("(min-width: 68rem)");

	const setCompactState = () => {
		header.dataset.compact = String(window.scrollY > 24);
	};

	const getFocusable = () =>
		panel
			? Array.from(
					panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
				).filter((element) => element.getClientRects().length > 0)
			: [];

	const finishClose = (restoreFocus: boolean) => {
		if (!menu) return;
		menu.hidden = true;
		if (restoreFocus) previousFocus?.focus();
		previousFocus = null;
	};

	const closeMenu = (restoreFocus = true) => {
		if (!menu || menu.hidden) return;
		window.clearTimeout(closeTimer);
		menu.dataset.open = "false";
		menu.setAttribute("aria-hidden", "true");
		trigger?.setAttribute("aria-expanded", "false");
		document.body.classList.remove("mobile-menu-open");
		toggleMenuBackgroundInert(
			Array.from(document.body.children).filter(
				(element): element is HTMLElement => element instanceof HTMLElement,
			),
			menu,
			false,
		);
		closeTimer = window.setTimeout(
			() => finishClose(restoreFocus),
			reducedMotion.matches ? 0 : 220,
		);
	};

	const openMenu = () => {
		if (!menu || !panel || !trigger) return;
		window.clearTimeout(closeTimer);
		previousFocus = document.activeElement as HTMLElement | null;
		menu.hidden = false;
		menu.setAttribute("aria-hidden", "false");
		trigger.setAttribute("aria-expanded", "true");
		document.body.classList.add("mobile-menu-open");
		toggleMenuBackgroundInert(
			Array.from(document.body.children).filter(
				(element): element is HTMLElement => element instanceof HTMLElement,
			),
			menu,
			true,
		);
		requestAnimationFrame(() => {
			menu.dataset.open = "true";
			closeButton?.focus();
		});
	};

	const containFocus = (e: KeyboardEvent) => {
		if (e.key === "Escape" && menu && !menu.hidden) {
			e.preventDefault();
			closeMenu();
			return;
		}

		if (e.key !== "Tab" || !menu || menu.hidden) return;
		const focusable = getFocusable();
		const first = focusable[0];
		const last = focusable.at(-1);
		if (!first || !last) return;

		if (e.shiftKey && document.activeElement === first) {
			e.preventDefault();
			last.focus();
		} else if (!e.shiftKey && document.activeElement === last) {
			e.preventDefault();
			first.focus();
		}
	};

	document.querySelectorAll<HTMLElement>("a[data-lang]").forEach((link) => {
		link.addEventListener("click", () => {
			const language = link.dataset.lang;
			if (language === "en" || language === "es") {
				setStoredPreference("lang", language);
			}
		});
	});

	syncThemeButtons();
	document
		.querySelectorAll<HTMLButtonElement>("button.theme-toggle")
		.forEach((button) => {
			button.addEventListener("click", () => {
				const nextDark = !isDark();
				document.documentElement.classList.toggle("dark", nextDark);
				setStoredPreference("theme", nextDark ? "dark" : "light");
				syncThemeButtons();
			});
		});

	setCompactState();
	window.addEventListener("scroll", setCompactState, { passive: true });
	trigger?.addEventListener("click", openMenu);
	closeButton?.addEventListener("click", () => closeMenu());
	menu
		?.querySelectorAll<HTMLElement>("[data-close-menu]")
		.forEach((element) => {
			element.addEventListener("click", () => closeMenu(false));
		});
	document.addEventListener("keydown", containFocus);
	desktop.addEventListener("change", (event) => {
		if (event.matches) closeMenu(false);
	});
};
