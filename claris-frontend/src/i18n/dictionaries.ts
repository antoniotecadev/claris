import "server-only";
import type { Locale } from "./routing";

type Dictionary = typeof import("../messages/pt.json");

const dictionaries = {
	pt: () => import("../messages/pt.json").then((module) => module.default),
	en: () => import("../messages/en.json").then((module) => module.default),
	fr: () => import("../messages/fr.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
	try {
		const loadDictionary = dictionaries[locale] || dictionaries["pt"];
		return await loadDictionary();
	} catch (error) {
		return await dictionaries["pt"]();
	}
};
