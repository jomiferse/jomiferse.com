/// <reference types="astro/client" />

interface Window {
	dataLayer: unknown[];
	gtag?: (...args: unknown[]) => void;
	GTM_CONTAINER_ID?: string;
}
