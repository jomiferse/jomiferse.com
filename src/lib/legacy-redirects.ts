import { serviceAliasRedirects } from "./service-aliases.ts";

export const legacyRedirects = {
	...serviceAliasRedirects,
	"/en/blog/cuando-deberia-una-empresa-migrar-un-backend-legacy-a-java-spring-boot/":
		"/en/blog/when-should-a-company-migrate-a-legacy-backend-to-java-spring-boot/",
	"/es/blog/building-cv-studio/": "/es/blog/creando-cv-studio/",
	"/es/desarrollador-freelance-espana/": "/es/diseno-web-granada/",
	"/en/freelance-developer-spain/": "/en/web-design-granada/",
} as const;

const normalizeLegacyPath = (pathname: string) => {
	const trimmed = pathname.replace(/^\/+|\/+$/g, "");
	return trimmed ? `/${trimmed}/` : "/";
};

export const getLegacyRedirect = (pathname: string) =>
	legacyRedirects[
		normalizeLegacyPath(pathname) as keyof typeof legacyRedirects
	];
