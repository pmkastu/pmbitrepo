import { LayoutDashboard, BookOpen, Award, Menu, Crown, Swords } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Content Library", url: "/library", icon: BookOpen },
  { title: "Certificates", url: "/certificates", icon: Award },
  { title: "Subscription", url: "/subscription", icon: Crown },
  { title: "Peer Challenge", url: "/peer-challenge", icon: Swords },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-3 left-3 z-[60] md:hidden"
        onClick={() => setCollapsed((p) => !p)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {!collapsed && (
        <div
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen glass-strong border-r border-border/50 transition-all duration-300 flex flex-col",
          collapsed ? "-translate-x-full md:translate-x-0 md:w-16" : "w-60 translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-border/50">
          {!collapsed && (
            <span className="font-display font-bold gradient-text text-sm">Menu</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex h-8 w-8"
            onClick={() => setCollapsed((p) => !p)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              end={item.url === "/"}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-200"
              activeClassName="gradient-primary text-primary-foreground shadow-lg glow-primary"
              onClick={() => {
                if (window.innerWidth < 768) setCollapsed(true);
              }}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
