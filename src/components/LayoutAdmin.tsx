import { Link, NavLink } from "react-router-dom";
import { ReactNode } from "react";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `story-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
  }`;

const LayoutAdmin = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">EstateHub</span>
          </Link>
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {/* <NavLink to="/admin" className={navLinkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/admin/listings" className={navLinkClass}>
              Listings
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              Users
            </NavLink> */}
          </nav>
          <div className="flex items-center gap-2">
            {/* Removed Sign In, Sign Out, and List your property buttons */}
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/about" className="hover:underline">
              About
            </Link>
            <Link to="/admin/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LayoutAdmin;
