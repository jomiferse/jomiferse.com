import en from "@/data/cv.en.json";
import es from "@/data/cv.es.json";
import type { Locale } from "@/i18n";

export type Cv = typeof en;

export function getCv(locale: Locale | string): Cv {
	if (locale === "es") return es as Cv;
	return en as Cv;
}
