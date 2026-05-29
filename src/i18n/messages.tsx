"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { Locale } from "./routing";

export type Messages = Record<string, string | Messages>;

type MessageParams = Record<string, string | number>;

type MessagesContextValue = {
	locale: Locale;
	messages: Messages;
	t: (key: string, params?: MessageParams) => string;
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

const resolveMessage = (messages: Messages, key: string): string | null => {
	const parts = key.split(".");
	let current: Messages | string | undefined = messages;
	for (const part of parts) {
		if (!current || typeof current !== "object") return null;
		current = (current as Messages)[part];
	}
	return typeof current === "string" ? current : null;
};

const formatMessage = (template: string, params?: MessageParams): string => {
	if (!params) return template;
	return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
		const value = params[key];
		return value === undefined || value === null ? "" : String(value);
	});
};

export function MessagesProvider({
	locale,
	messages,
	children,
}: {
	locale: Locale;
	messages: Messages;
	children: React.ReactNode;
}) {
	const t = useMemo(() => {
		return (key: string, params?: MessageParams) => {
			const message = resolveMessage(messages, key) ?? key;
			return formatMessage(message, params);
		};
	}, [messages]);

	const value = useMemo(() => ({ locale, messages, t }), [locale, messages, t]);

	return (
		<MessagesContext.Provider value={value}>
			{children}
		</MessagesContext.Provider>
	);
}

export const useMessages = () => {
	const ctx = useContext(MessagesContext);
	if (!ctx) {
		throw new Error("useMessages must be used within MessagesProvider");
	}
	return ctx;
};
