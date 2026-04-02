import {
  Users,
  ClipboardList,
  MessageSquareWarning,
  UserCircle,
} from "lucide-react";
import { SidebarNavItem } from "./sidebar-nav-item";

const NAV_ITEMS = [
  { to: "/groups", label: "Guruhlar", icon: Users },
  { to: "/tasks", label: "Topshiriqlar", icon: ClipboardList },
  { to: "/complaints", label: "Shikoyatlar", icon: MessageSquareWarning },
  { to: "/profile", label: "Profil", icon: UserCircle },
];

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 border-r bg-sidebar lg:block">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-bold text-primary">GradeAI</span>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  );
}
