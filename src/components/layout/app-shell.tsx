import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#F0F4FF] to-[#F5F0FF]">
      <Sidebar />

      <main className="min-h-screen px-4 pb-24 pt-20 sm:px-6 lg:ml-[264px] lg:px-8 lg:pb-8">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}