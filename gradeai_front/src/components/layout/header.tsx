import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <MobileNav />
        <span className="text-sm text-muted-foreground">
          Salom, <span className="font-medium text-foreground">{user?.name}</span>
        </span>
      </div>
      <Button variant="ghost" size="sm" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Chiqish
      </Button>
    </header>
  );
}
