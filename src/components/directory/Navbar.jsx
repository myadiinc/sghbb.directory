import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl">🏠</span>
          <div>
            <span className="font-playfair font-bold text-primary text-base">SGHBB.Directory</span>
            <span className="hidden sm:inline text-xs text-muted-foreground ml-1">• Find &amp; Be Found 🔍</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-inter">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Directory</Link>
          <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">Submit HBB</Link>
          {user && <Link to="/my-lists" className="text-muted-foreground hover:text-primary transition-colors">My Lists</Link>}
          {user?.role === "admin" &&
          <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors font-medium">Admin</Link>
          }
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open &&
      <div className="md:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-3 text-sm">
          <Link to="/" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">Directory</Link>
          <Link to="/submit" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">Submit HBB</Link>
          {user && <Link to="/my-lists" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">My Lists</Link>}
          {user?.role === "admin" &&
        <Link to="/admin" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary font-medium">Admin</Link>
        }
        </div>
      }
    </nav>);

}