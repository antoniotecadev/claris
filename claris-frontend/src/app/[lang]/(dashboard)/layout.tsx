import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function LocalizedDashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
