import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { ArrowLeft, Trophy, TrendingUp, AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { toast } from "sonner";

function RatingBadge({ rating }) {
  const color = rating >= 7 ? "text-jade-300 bg-jade-300/10 border-jade-300/20"
    : rating >= 4 ? "text-gold-300 bg-gold-300/10 border-gold-300/20"
    : "text-red-400 bg-red-400/10 border-red-400/20";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg border text-xs font-bold font-mono ${color}`}>
      {rating}/10
    </span>
  );
}

function ProgressCircle({ value, max = 10, size = 80 }) {
  const pct = value / max;
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const color = value >= 7 ? "#00E5A0" : value >= 4 ? "#FFD54F" : "#FF6B6B";
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={8}
        strokeDasharray={circ}
        strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

export default function FeedbackPage() {
  const { interviewId } = useParams();
  const { userId } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(
          collection(db, "userAnswers"),
          where("mockIdRef", "==", interviewId),
          where("userId", "==", userId)
        );
        const snap = await getDocs(q);
        setAnswers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch { toast.error("Failed to load feedback"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [interviewId, userId]);

  const avgRating = answers.length
    ? (answers.reduce((sum, a) => sum + (a.rating || 0), 0) / answers.length).toFixed(1)
    : 0;

  const strong = answers.filter(a => a.rating >= 7).length;
  const weak = answers.filter(a => a.rating < 4).length;

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-jade-300 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs text-white/30 mb-0.5">Dashboard / Feedback</div>
          <h1 className="font-display text-2xl font-bold text-white">Interview Feedback</h1>
        </div>
      </div>

      {answers.length === 0 ? (
        <div className="text-center py-24 glass rounded-2xl">
          <AlertCircle className="w-10 h-10 text-white/20 mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold text-white mb-2">No answers yet</h2>
          <p className="text-sm text-white/40 mb-6">Complete the mock interview first to see your feedback here.</p>
          <Link
            to={`/dashboard/interview/${interviewId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-jade-300 text-ink-950 font-semibold text-sm hover:bg-jade-400 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Start Interview
          </Link>
        </div>
      ) : (
        <>
          {/* Score overview */}
          <div className="glass rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-8">
              <div className="relative">
                <ProgressCircle value={parseFloat(avgRating)} size={100} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-display text-2xl font-bold text-white">{avgRating}</div>
                    <div className="text-xs text-white/30">/10</div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-bold text-white mb-1">Overall Score</h2>
                <p className="text-sm text-white/40 mb-4">
                  {parseFloat(avgRating) >= 7 ? "Excellent performance! You're interview-ready." :
                   parseFloat(avgRating) >= 5 ? "Good effort. A bit more practice will get you there." :
                   "Keep practicing — focus on the weak areas below."}
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-jade-300" />
                    <span className="text-white/60">{strong} strong</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-white/60">{weak} need work</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Trophy className="w-4 h-4 text-gold-300" />
                    <span className="text-white/60">{answers.length} answered</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-8">
            <Link
              to={`/dashboard/interview/${interviewId}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-jade-300/10 border border-jade-300/20 text-jade-300 text-sm font-semibold hover:bg-jade-300/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Retry Interview
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/8 text-white/50 text-sm hover:text-white hover:border-white/15 transition-all"
            >
              ← Dashboard
            </Link>
          </div>

          {/* Per-question feedback */}
          <div>
            <h2 className="font-display text-lg font-bold text-white mb-4">Question-by-Question Breakdown</h2>
            <div className="space-y-4">
              {answers.map((answer, i) => (
                <div key={answer.id} className="glass rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-ink-900 border border-white/5 text-xs font-mono text-white/40 flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm font-medium text-white/80 leading-relaxed">{answer.question}</p>
                    </div>
                    <RatingBadge rating={answer.rating} />
                  </div>

                  <div className="space-y-3 ml-10">
                    <div>
                      <p className="text-xs text-white/25 font-semibold uppercase tracking-wider mb-1.5">Your Answer</p>
                      <p className="text-sm text-white/50 leading-relaxed">{answer.user_ans || "—"}</p>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-jade-300" />
                        <p className="text-xs text-jade-300 font-semibold uppercase tracking-wider">AI Feedback</p>
                      </div>
                      <p className="text-sm text-white/55 leading-relaxed">{answer.feedback}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
