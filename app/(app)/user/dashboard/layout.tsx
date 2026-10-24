import DashboardLayoutShell from "./layoutShell";

export default function DashboardLayout({children}: {children: React.ReactNode}) {
  return <div>
    <DashboardLayoutShell>{children}</DashboardLayoutShell>
  </div>;
}