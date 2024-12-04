// app/dashboard/layout.js

// Components
import Navbar from "@/src/layouts/nav/Navbar";

export default function AuthLayout({ children }) {
  return (
    <div className="">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
