import { Link, NavLink } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `story-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`;

const Layout = ({ children }: { children: ReactNode }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsUserLoggedIn(localStorage.getItem("userAuth") === "true");
    };
    
    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("userData");
    setIsUserLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">EstateHub</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <NavLink to="/" className={navLinkClass} end>Home</NavLink>
            <NavLink to="/listings" className={navLinkClass}>Listings</NavLink>
            <NavLink to="/map" className={navLinkClass}>Map</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {isUserLoggedIn ? (
              <Button onClick={handleLogout} variant="outline">
                Sign Out
              </Button>
            ) : (
              <Button onClick={() => setAuthModalOpen(true)} variant="outline">
                Sign In
              </Button>
            )}
            <Button asChild variant="default" className="hover-scale">
              <Link to="/contact">List your property</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
            <Link to="/admin" className="hover:underline text-xs opacity-70">Admin</Link>
          </div>
        </div>
      </footer>
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Layout;
