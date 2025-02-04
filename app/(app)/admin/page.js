// app/auth/page.js
import { redirect } from "next/navigation";

export default function AdminPage() {
  redirect("/admin/verification");
}
