import HeaderWithDialog from "@/components/layout/headerWithDialog";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50  dark:bg-neutral-800">
      {/* Top Navigation Bar */}
      <HeaderWithDialog />

      <main className="max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}