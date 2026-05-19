import Sidebar from "@/components/layout/sideBar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-white">
        {children}
      </main>
    </div>
  );
}