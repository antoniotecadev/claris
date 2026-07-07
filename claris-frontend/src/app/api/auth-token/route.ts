import { getAuthToken } from "@/lib/auth-cookies";

export async function GET() {
	const token = await getAuthToken();

	if (!token) {
		return Response.json({ token: null }, { status: 401 });
	}

	return Response.json({ token });
}
