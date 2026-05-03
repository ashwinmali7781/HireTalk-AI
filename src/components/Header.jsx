import { Link, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-300 to-jade-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-ink-950" />
          </div>
          <span className="font-display font-bold text-lg text-white">
            Prep<span className="text-jade-300">Wise</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <SignedIn>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? "text-jade-300 font-medium" : "text-white/60 hover:text-white"}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/dashboard/create"
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? "text-jade-300 font-medium" : "text-white/60 hover:text-white"}`
              }
            >
              New Interview
            </NavLink>
          </SignedIn>
          <SignedOut>
            <NavLink to="/" className={({ isActive }) => `text-sm transition-colors ${isActive ? "text-jade-300" : "text-white/60 hover:text-white"}`}>
              Home
            </NavLink>
          </SignedOut>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              to="/sign-in"
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="px-4 py-2 rounded-lg bg-jade-300 text-ink-950 text-sm font-semibold hover:bg-jade-400 transition-colors"
            >
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 ring-2 ring-jade-300/30",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
