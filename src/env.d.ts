/// <reference types="astro/client" />

interface Window {
	dataLayer: unknown[];
	gtag?: (...args: unknown[]) => void;
	GA_MEASUREMENT_ID?: string;
}
