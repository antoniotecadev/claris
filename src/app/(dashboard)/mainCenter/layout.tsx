
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50  dark:bg-neutral-800">

      <main className="w-full ">
        {children}
      </main>
    </div>
  );
}
