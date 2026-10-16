import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";
import MessageSocketListener from "./message-socket-listener";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-canvas via-canvas-via to-canvas-to">
      <MessageSocketListener />
      <Sidebar />

      <main className="min-h-screen px-4 pb-24 pt-20 sm:px-6 lg:ml-[264px] lg:px-8 lg:pb-8">
        {children}
      </main>

      <MobileNav />
    </div>
  );
}