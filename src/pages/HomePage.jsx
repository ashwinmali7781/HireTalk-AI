import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { ArrowRight, Brain, Mic, BarChart3, Sparkles, CheckCircle2, Zap, Target, Shield } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Question Generation", desc: "Gemini AI crafts tailored technical questions based on your specific role, tech stack, and experience level.", color: "text-gold-300" },
  { icon: Mic, title: "Voice Recording & Analysis", desc: "Speak your answers naturally. Our speech-to-text captures every word and AI provides detailed feedback.", color: "text-jade-300" },
  { icon: BarChart3, title: "Detailed Feedback", desc: "Get rated 1–10 with actionable improvement tips for each answer. Track your progress over time.", color: "text-gold-300" },
  { icon: Zap, title: "Instant Results", desc: "No waiting. AI evaluates your responses in seconds and benchmarks them against ideal answers.", color: "text-jade-300" },
  { icon: Target, title: "Role-Specific Prep", desc: "From junior to senior, frontend to DevOps — every interview is customized to your target role.", color: "text-gold-300" },
  { icon: Shield, title: "Save & Revisit", desc: "All your mock interviews are saved. Review past answers and track your improvement over weeks.", color: "text-jade-300" },
];

const stats = [
  { value: "50K+", label: "Interviews Conducted" },
  { value: "94%", label: "User Satisfaction" },
  { value: "200+", label: "Tech Stacks Supported" },
  { value: "3×", label: "Better Offer Rate" },
];

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #FFD54F, transparent 70%)" }} />
        <div className="absolute bottom-[10%] left-[-15%] w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #00E5A0, transparent 70%)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-jade-300/20 bg-jade-300/5 mb-8 animate-fade-up">
          <Sparkles className="w-3.5 h-3.5 text-jade-300" />
          <span className="text-xs text-jade-300 font-medium tracking-wide">Powered by Google Gemini AI</span>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
          Ace Every
          <br />
          <span className="text-shimmer">Technical Interview</span>
          <br />
          with AI
        </h1>

        <p className="text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
          Generate custom mock interviews, practice with voice recording, and get instant AI feedback — all tailored to your exact role and stack.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <SignedOut>
            <Link
              to="/sign-up"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-jade-300 text-ink-950 font-semibold text-base hover:bg-jade-400 transition-all hover:scale-105 shadow-lg shadow-jade-300/20"
            >
              Start Practicing Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/sign-in"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-white/70 font-medium text-base hover:border-white/20 hover:text-white transition-all"
            >
              Sign In
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-jade-300 text-ink-950 font-semibold text-base hover:bg-jade-400 transition-all hover:scale-105 shadow-lg shadow-jade-300/20"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </SignedIn>
        </div>

        {/* Mock UI preview */}
        <div className="mt-20 relative animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent z-10 pointer-events-none" style={{ top: "60%" }} />
          <div className="glass rounded-2xl border border-white/8 p-1 max-w-3xl mx-auto shadow-2xl shadow-black/50">
            <div className="bg-ink-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-gold-400/60" />
                <div className="w-3 h-3 rounded-full bg-jade-400/60" />
                <div className="ml-4 px-4 py-1 rounded-md bg-ink-900 text-xs text-white/30 font-mono flex-1 text-left">prepwise.ai/dashboard/interview/abc123</div>
              </div>
              <div className="grid grid-cols-5 gap-2 mb-4">
                {[1,2,3,4,5].map(i => (
                  <button key={i} className={`py-2 rounded-lg text-xs font-medium transition-all ${i === 2 ? "bg-jade-300/20 text-jade-300 border border-jade-300/30" : "bg-ink-900 text-white/30 border border-white/5"}`}>
                    Q{i}
                  </button>
                ))}
              </div>
              <div className="bg-ink-900 rounded-xl p-4 mb-4 text-left">
                <p className="text-sm text-white/70 leading-relaxed">
                  Explain the difference between <code className="text-gold-300 bg-gold-300/10 px-1 rounded text-xs">useEffect</code> and <code className="text-gold-300 bg-gold-300/10 px-1 rounded text-xs">useLayoutEffect</code> in React. When would you choose one over the other?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-10 bg-ink-900 rounded-lg border border-white/5 flex items-center px-3 gap-2">
                  <div className="w-2 h-2 rounded-full bg-jade-300 recording-ring" />
                  <span className="text-xs text-white/30 font-mono">Recording... 0:23</span>
                </div>
                <div className="w-10 h-10 rounded-lg bg-jade-300/10 border border-jade-300/20 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-jade-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative border-y border-white/5 bg-ink-900/30">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-gold-300 mb-1">{value}</div>
              <div className="text-sm text-white/40">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to
            <span className="text-shimmer"> get hired</span>
          </h2>
          <p className="text-white/40 max-w-md mx-auto">
            A complete interview practice system — from question generation to feedback analysis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 hover:border-white/12 transition-all group"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-10 h-10 rounded-xl bg-current/10 flex items-center justify-center mb-4 ${color}`}
                style={{ background: "rgba(255,255,255,0.05)" }}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-t border-white/5 bg-ink-900/20">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-white/40">Three steps to interview confidence</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-jade-300/30 via-gold-300/30 to-jade-300/30" />
            {[
              { step: "01", title: "Configure Your Role", desc: "Enter your target position, years of experience, job description, and tech stack.", color: "bg-jade-300 text-ink-950" },
              { step: "02", title: "Practice with AI", desc: "Get 5 tailored questions. Record voice answers. The AI transcribes and evaluates in real-time.", color: "bg-gold-300 text-ink-950" },
              { step: "03", title: "Review & Improve", desc: "See detailed ratings and feedback per question. Identify weak areas and retry at any time.", color: "bg-jade-300 text-ink-950" },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="text-center relative">
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mx-auto mb-6 font-display text-2xl font-bold shadow-lg`}>
                  {step}
                </div>
                <h3 className="font-semibold text-white mb-3">{title}</h3>
                <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 text-center">
        <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-jade-300/50 to-transparent" />
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
            Ready to ace your next interview?
          </h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">
            Join thousands of developers who land better offers with PrepWise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedOut>
              <Link
                to="/sign-up"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-jade-300 text-ink-950 font-bold text-base hover:bg-jade-400 transition-all hover:scale-105 shadow-xl shadow-jade-300/25"
              >
                Start Free Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard/create"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-jade-300 text-ink-950 font-bold text-base hover:bg-jade-400 transition-all hover:scale-105"
              >
                Create Interview
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </SignedIn>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8">
            {["No credit card required", "Free to start", "Cancel anytime"].map(item => (
              <div key={item} className="flex items-center gap-1.5 text-xs text-white/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-jade-300/60" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
