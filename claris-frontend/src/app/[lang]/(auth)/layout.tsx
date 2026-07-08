import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function LocalizedAuthLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
