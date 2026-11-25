import { redirect } from "next/navigation";

// The old dashboard: its parts now live in Shop (home) and Me (your orders,
// checklist, birthdays, settings). Old links and reminders land on Me.
export default async function DashboardPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const v of [value].flat()) if (v !== undefined) query.append(key, v);
  }
  redirect(`/me${query.size ? `?${query}` : ""}`);
}
