import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-white/40 text-sm">Sign in to continue your interview prep</p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          afterSignInUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "bg-ink-800 border border-white/8 shadow-2xl rounded-2xl",
              headerTitle: "text-white font-display",
              headerSubtitle: "text-white/50",
              socialButtonsBlockButton: "bg-ink-900 border border-white/8 text-white hover:bg-ink-700 transition-colors",
              dividerLine: "bg-white/10",
              dividerText: "text-white/30",
              formFieldLabel: "text-white/60 text-sm",
              formFieldInput: "bg-ink-900 border-white/10 text-white rounded-lg focus:border-jade-300 focus:ring-jade-300/20",
              formButtonPrimary: "bg-jade-300 text-ink-950 font-semibold hover:bg-jade-400 transition-colors",
              footerActionLink: "text-jade-300 hover:text-jade-400",
              identityPreviewText: "text-white/70",
              identityPreviewEditButton: "text-jade-300",
            },
          }}
        />
      </div>
    </div>
  );
}
