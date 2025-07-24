import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Menu, X, User, LogOut, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const { user, signOut, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsMobileMenuOpen(false);
      // Force page reload to ensure clean state
      window.location.reload();
    } catch (error) {
      console.error("Sign out error:", error);
      // Force sign out even if there's an error
      localStorage.removeItem("mockUser");
      window.location.reload();
    }
  };

  // Only show Apply and Download tabs for non-admin users
  const navItems = isAdmin
    ? [
        { href: "/", label: "Home" },
        { href: "/admin", label: "Admin Dashboard" }
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/apply", label: "Apply" },
        { href: "/download", label: "Download" },
      ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F6638b6e3f08849eb91b735b1c7b57266%2F6058fef7c7e349ea9850291fc20c0a96?format=webp&width=800"
              alt="EIL Scholar Logo"
              className="h-8 w-8 object-contain"
            />
          </div>
          <span className="text-xl font-bold">EIL Scholar</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActiveRoute(item.href)
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  {user.name || user.email.split("@")[0]}
                  {isAdmin && <ShieldAlert className="h-4 w-4 ml-1 text-purple-600" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                {!isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/apply">My Applications</Link>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSignInOpen(true)}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90"
                onClick={() => setIsSignUpOpen(true)}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                    isActiveRoute(item.href)
                      ? "text-primary"
                      : "text-muted-foreground",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t">
                {user ? (
                  <>
                    <div className="px-2 py-1 text-sm text-muted-foreground flex items-center">
                      {user.email}
                      {isAdmin && <ShieldAlert className="h-4 w-4 ml-2 text-purple-600" />}
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/admin";
                        }}
                        className="justify-start text-purple-600"
                      >
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </Button>
                    )}
                    {!isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.location.href = "/apply";
                        }}
                        className="justify-start"
                      >
                        My Applications
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSignOut}
                      className="justify-start"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSignInOpen(true);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsSignUpOpen(true);
                      }}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        onSwitchToSignUp={() => {
          setIsSignInOpen(false);
          setIsSignUpOpen(true);
        }}
      />
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onSwitchToSignIn={() => {
          setIsSignUpOpen(false);
          setIsSignInOpen(true);
        }}
      />
    </nav>
  );
};

export default Navigation;
