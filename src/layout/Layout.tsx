import { Header } from "@/components/Header";
import { Separator } from "@/components/ui/separator";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div>
      <Header />
      <Separator />
      <Outlet />
    </div>
  );
}
