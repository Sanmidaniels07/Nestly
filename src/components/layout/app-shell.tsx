import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-[#F5F7FA]
        via-[#F0F4FF]
        to-[#F5F0FF]
      "
    >
      <Sidebar />

      <main
        className="
          lg:ml-[280px]
          min-h-screen
          px-6
          py-8
          pb-28
          mt-10
        "
      >
        {children}
      </main>

      <MobileNav />
    </div>
  );
}