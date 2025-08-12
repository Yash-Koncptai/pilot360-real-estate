import { Link, NavLink } from "react-router-dom";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `story-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`;

const Layout = ({ children }: { children: ReactNode }) => {
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
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
