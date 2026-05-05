import { redirect } from "next/navigation";

export default async function SchedulesPage() {
  redirect("/admin/schedules");
}
