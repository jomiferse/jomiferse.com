import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware((context, next) => {
	const { url, cookies, redirect } = context;

	if (url.pathname === "/") {
		const cookieLang = cookies.get("lang")?.value;
		const locale = cookieLang || "en";

		return redirect(`/${locale}`, 302);
	}

	return next();
});
