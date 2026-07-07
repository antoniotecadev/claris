"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/auth-cookies";
import { addLocaleToPathname } from "@/i18n/routing";
import { useMessages } from "@/i18n/messages";

export default function GoogleCallbackPage() {
	const { locale, t } = useMessages();
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function authenticate() {
			try {
				const hash = window.location.hash;

				const params = new URLSearchParams(hash.replace("#", ""));

				const token = params.get("token");

				if (!token) {
					router.push(addLocaleToPathname("/login", locale));
					return;
				}

				await setAuthToken(token);

				router.push(addLocaleToPathname("/mainDash", locale));
			} catch (error) {
				console.error(error);
				router.push(addLocaleToPathname("/login", locale));
			} finally {
				setLoading(false);
			}
		}

		authenticate();
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p>{t("auth.callback.authenticating")}</p>
			</div>
		);
	}

	return null;
}