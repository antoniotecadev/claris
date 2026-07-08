import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function AuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
