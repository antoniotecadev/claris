import { privateMetadata } from "@/lib/seo";

export const metadata = privateMetadata;

export default function LocalizedDesignSystemLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return children;
}
