import { Link } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user: authUser, logout } = useAuth();
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const { data: userBusiness, isLoading: businessLoading } = useQuery({
    queryKey: ["userBusiness", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const businesses = await base44.entities.Business.filter({ submitted_by_email: user.email });
      return businesses.length > 0 ? businesses[0] : null;
    },
    enabled: !!user?.email,
    retry: false
  });

  const currentUser = user || authUser;
  const isAdmin = currentUser && currentUser.role === "admin";
  const isBusiness = currentUser && currentUser.role === "business";
  const canEditBusiness = (isBusiness || isAdmin) && !businessLoading && userBusiness;
  const submitPath = canEditBusiness ? `/edit-business/${userBusiness.id}` : "/submit";
  const submitLabel = canEditBusiness ? "Edit HBB" : "Submit HBB";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="https://i.ibb.co/mC8w4ghP/SGHBBD-Logo-V2-2b.png" alt="SGHBB Directory" className="w-8 h-8 object-contain" />
          <div>
            <span className="font-quicksand font-bold text-primary text-base">SGHBB.Directory</span>
            <span className="hidden sm:inline text-xs text-muted-foreground ml-1">• Find &amp; Be Found 🔍</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-inter">
          {(isBusiness || isAdmin) && currentUser && (
            <Link to={submitPath} className="text-muted-foreground hover:text-primary transition-colors">{submitLabel}</Link>
          )}
          <Link to="/my-lists" className="text-muted-foreground hover:text-primary transition-colors">My Lists</Link>
          <Link to="/my-reviews" className="text-muted-foreground hover:text-primary transition-colors">My Reviews</Link>
          {isAdmin && (
            <>
              <Link to="/admin" className="text-muted-foreground hover:text-primary transition-colors text-xs font-thin">Admin</Link>
              <Link to="/admin/blog" className="text-muted-foreground hover:text-primary transition-colors text-xs font-thin">Blog Manager</Link>
            </>
          )}
          {!currentUser && (
            <button onClick={() => base44.auth.redirectToLogin()} className="text-primary hover:opacity-80 transition-colors font-medium">Login / Register</button>
          )}
          {currentUser && (
            <div className="flex items-center gap-3 pl-6 border-l border-border">
              <span className="text-xs text-muted-foreground">{currentUser.email}</span>
              <button onClick={() => logout()} className="text-muted-foreground hover:text-primary transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open &&
      <div className="md:hidden bg-white border-t border-border px-4 py-3 flex flex-col gap-3 text-sm">
         {(isBusiness || isAdmin) && currentUser && (
            <Link to={submitPath} onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">{submitLabel}</Link>
          )}
          <Link to="/my-lists" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">My Lists</Link>
          <Link to="/my-reviews" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary">My Reviews</Link>
          {isAdmin && (
            <>
              <Link to="/admin" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary text-xs font-thin">Admin</Link>
              <Link to="/admin/blog" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-primary text-xs font-thin">Blog Manager</Link>
            </>
          )}
          {!currentUser && (
            <button onClick={() => { base44.auth.redirectToLogin(); setOpen(false); }} className="text-primary hover:opacity-80 transition-colors font-medium text-left">Login / Register</button>
          )}
          {currentUser && (
            <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{currentUser.email}</span>
              <button onClick={() => logout()} className="text-muted-foreground hover:text-primary transition-colors" title="Logout">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      }
    </nav>);

}