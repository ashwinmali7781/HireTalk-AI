import { Link } from "react-router-dom";
import { Sparkles, GitBranch, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900/50">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-gold-300 to-jade-300 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-ink-950" />
            </div>
            <span className="font-display font-bold text-white">
              Prep<span className="text-jade-300">Wise</span>
            </span>
          </Link>
          <p className="text-sm text-white/40 leading-relaxed">
            AI-powered mock interviews to help you land your dream role.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-white/30 hover:text-white/70 transition-colors">
              <GitBranch className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-white/30 hover:text-white/70 transition-colors text-xs">𝕏</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-white/30 hover:text-white/70 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Product</h4>
          <ul className="space-y-2">
            {[["Dashboard", "/dashboard"], ["New Interview", "/dashboard/create"]].map(([label, href]) => (
              <li key={href}>
                <Link to={href} className="text-sm text-white/50 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Company</h4>
          <ul className="space-y-2">
            {["About", "Blog", "Careers"].map((item) => (
              <li key={item}>
                <span className="text-sm text-white/50">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">Legal</h4>
          <ul className="space-y-2">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <li key={item}>
                <span className="text-sm text-white/50">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 max-w-6xl mx-auto px-6 py-4">
        <p className="text-xs text-white/20 text-center">
          © {new Date().getFullYear()} PrepWise. Built with Gemini AI & Firebase.
        </p>
      </div>
    </footer>
  );
}
