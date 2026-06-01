"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken } from "@/lib/auth-cookies";

export default function GoogleCallbackPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function authenticate() {
			try {
				const hash = window.location.hash;

				const params = new URLSearchParams(hash.replace("#", ""));

				const token = params.get("token");

				if (!token) {
					router.push("/login");
					return;
				}

				await setAuthToken(token);

				router.push("/mainDash");
			} catch (error) {
				console.error(error);
				router.push("/login");
			} finally {
				setLoading(false);
			}
		}

		authenticate();
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<p>Autenticando...</p>
			</div>
		);
	}

	return null;
}