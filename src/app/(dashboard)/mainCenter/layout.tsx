import Sidebar from "@/components/layout/sideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="w-full lg:pl-64">
        {children}
      </main>
    </div>
  );
}
