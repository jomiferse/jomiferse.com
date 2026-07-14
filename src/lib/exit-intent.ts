export const EXIT_INTENT_SESSION_KEY = "jomiferse.exit-intent.v2";

export type ExitIntentContext = "generic" | "service" | "project" | "article";

export type ExitIntentEligibility = {
	pointerCoarse: boolean;
	elapsedMs: number;
	scrollRatio: number;
	sessionShown: boolean;
	hasOpenDialog: boolean;
	cookieBannerVisible: boolean;
	documentHidden: boolean;
};

export const isExitIntentRouteExcluded = (pathname: string) =>
	/^\/(?:en|es)\/(?:contact|privacy)\/?$/.test(pathname);

export const getExitIntentContext = (pathname: string): ExitIntentContext => {
	if (/^\/(?:en|es)\/services\/[^/]+\/?$/.test(pathname)) return "service";
	if (/^\/(?:en|es)\/projects\/[^/]+\/?$/.test(pathname)) return "project";
	if (/^\/(?:en|es)\/blog\/[^/]+\/?$/.test(pathname)) return "article";
	return "generic";
};

export const canShowExitIntent = (input: ExitIntentEligibility) => {
	if (
		input.sessionShown ||
		input.hasOpenDialog ||
		input.cookieBannerVisible ||
		input.documentHidden
	) {
		return false;
	}

	if (input.pointerCoarse) {
		return input.elapsedMs >= 25_000 && input.scrollRatio >= 0.5;
	}

	return input.elapsedMs >= 15_000 || input.scrollRatio >= 0.25;
};
