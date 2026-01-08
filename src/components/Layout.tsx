

import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/AuthModal";
import ConfirmationModal from "@/components/ConfirmationModal";
import { toast } from "sonner";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `story-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "text-primary" : "text-foreground/80 hover:text-primary"
  }`;

const Layout = ({ children }: { children: ReactNode }) => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialStep, setAuthInitialStep] = useState<"signup" | "signin">("signin");
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"Regular User" | "Broker" | null>(null);
  const location = useLocation();

  // Check auth status and user role
  useEffect(() => {
    const checkAuthStatus = () => {
      const auth = localStorage.getItem("userAuth") === "true";
      setIsUserLoggedIn(auth);

      if (auth) {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        console.log("User Data:", userData); // Debug log
        console.log("User Role:", userData.role); // Debug log
        setUserRole(userData.role || null);
      } else {
        setUserRole(null);
      }
    };

    checkAuthStatus();
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // Optional: Auto-open modal on ?ref= or ?login=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    const login = params.get("login");

    if (ref || login) {
      setAuthInitialStep(ref ? "signup" : "signin");
      setAuthModalOpen(true);
    }
  }, [location.search]);

  const handleOpenRegister = () => {
    setAuthInitialStep("signup");
    setAuthModalOpen(true);
  };

  const handleOpenSignIn = () => {
    setAuthInitialStep("signin");
    setAuthModalOpen(true);
  };

  const handleLogout = () => {
    setConfirmationModalOpen(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("userAuth");
    localStorage.removeItem("userData");
    localStorage.removeItem("userToken");
    setIsUserLoggedIn(false);
    setUserRole(null);
    setConfirmationModalOpen(false);
    toast.success("Signed out successfully.");
  };

  // Callback to handle auth state changes from AuthModal
  const handleAuthChange = (isLoggedIn: boolean) => {
    setIsUserLoggedIn(isLoggedIn);
    if (isLoggedIn) {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      console.log("Auth Change - User Role:", userData.role); // Debug log
      setUserRole(userData.role || null);
    } else {
      setUserRole(null);
    }
  };

  // Show "List your property" button if not logged in or if user is Broker
  const showListPropertyButton = !isUserLoggedIn || (userRole && userRole.toLowerCase() === "broker");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-lg">Chokhizameen</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/listings" className={navLinkClass}>
              Listings
            </NavLink>
            <NavLink to="/map" className={navLinkClass}>
              Map
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* Auth Buttons + Conditional List Property Button */}
          <div className="flex items-center gap-2">
            {isUserLoggedIn ? (
              <Button onClick={handleLogout} variant="outline">
                Sign Out
              </Button>
            ) : (
              <>
                <Button onClick={handleOpenRegister} variant="outline">
                  Register
                </Button>
                <Button onClick={handleOpenSignIn} variant="ghost">
                  Sign In
                </Button>
              </>
            )}

            {/* Show "List your property" for non-logged-in users or Brokers */}
            {showListPropertyButton && (
              <Button asChild variant="default" className="hover-scale">
                <Link to="/list-property">List your property</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-6 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Chokhizameen. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">
              About
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact
            </Link>
            <Link to="/admin" className="hover:underline text-xs opacity-70">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        initialStep={authInitialStep}
        onAuthChange={handleAuthChange}
      />

      <ConfirmationModal
        isOpen={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out?"
        confirmText="Sign Out"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Layout;