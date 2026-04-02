import { Menu } from "lucide-react";
import {
  Users,
  ClipboardList,
  MessageSquareWarning,
  UserCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarNavItem } from "./sidebar-nav-item";
import { useState } from "react";

const NAV_ITEMS = [
  { to: "/groups", label: "Guruhlar", icon: Users },
  { to: "/tasks", label: "Topshiriqlar", icon: ClipboardList },
  { to: "/complaints", label: "Shikoyatlar", icon: MessageSquareWarning },
  { to: "/profile", label: "Profil", icon: UserCircle },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <SheetHeader className="flex h-14 items-center border-b px-4">
          <SheetTitle className="text-lg font-bold text-primary">
            GradeAI
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-3" onClick={() => setOpen(false)}>
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.to} {...item} />
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
