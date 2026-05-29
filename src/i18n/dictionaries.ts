import "server-only";
import type { Locale } from "./routing";

const dictionaries = {
	pt: () => import("../messages/pt.json").then((module) => module.default),
	en: () => import("../messages/en.json").then((module) => module.default),
	fr: () => import("../messages/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
