import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { ArrowLeft, PlayCircle, MessageSquare, Clock, Code2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

function QuestionAccordion({ question, answer, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/6 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/2 transition-colors"
      >
        <span className="w-8 h-8 rounded-lg bg-jade-300/10 border border-jade-300/20 text-jade-300 text-xs font-bold font-mono flex items-center justify-center shrink-0">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="flex-1 text-sm text-white/80 font-medium leading-relaxed">{question}</span>
        {open ? <ChevronUp className="w-4 h-4 text-white/30 shrink-0" /> : <ChevronDown className="w-4 h-4 text-white/30 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-0">
          <div className="ml-12 p-4 rounded-xl bg-ink-900 border border-white/5">
            <p className="text-xs text-white/30 mb-2 font-semibold uppercase tracking-wider">Model Answer</p>
            <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InterviewDetailPage() {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, "interviews", interviewId));
        if (snap.exists()) setInterview({ id: snap.id, ...snap.data() });
        else toast.error("Interview not found");
      } catch { toast.error("Failed to load interview"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [interviewId]);

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-jade-300 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!interview) return (
    <div className="text-center py-24">
      <p className="text-white/40">Interview not found.</p>
      <Link to="/dashboard" className="text-jade-300 text-sm mt-4 inline-block">Back to Dashboard</Link>
    </div>
  );

  const techList = interview.techStack?.split(",").map(t => t.trim()).filter(Boolean) || [];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/dashboard" className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs text-white/30 mb-0.5">Dashboard / Detail</div>
          <h1 className="font-display text-2xl font-bold text-white">{interview.position}</h1>
        </div>
      </div>

      {/* Meta */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="grid grid-cols-2 gap-6 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ink-900 border border-white/5 flex items-center justify-center">
              <Clock className="w-4 h-4 text-gold-300" />
            </div>
            <div>
              <p className="text-xs text-white/30 mb-0.5">Experience</p>
              <p className="text-sm font-medium text-white">{interview.experience} years</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-ink-900 border border-white/5 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-jade-300" />
            </div>
            <div>
              <p className="text-xs text-white/30 mb-0.5">Questions</p>
              <p className="text-sm font-medium text-white">{interview.questions?.length || 0} AI-generated</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-white/40 mb-4 leading-relaxed">{interview.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {techList.map(tech => (
            <span key={tech} className="px-2.5 py-1 rounded-lg bg-ink-900 border border-white/5 text-xs text-white/50">{tech}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <Link
          to={`/dashboard/interview/${interview.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-jade-300 text-ink-950 font-semibold text-sm hover:bg-jade-400 transition-all shadow-lg shadow-jade-300/20"
        >
          <PlayCircle className="w-4 h-4" /> Start Mock Interview
        </Link>
        <Link
          to={`/dashboard/feedback/${interview.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold-300/10 border border-gold-300/20 text-gold-300 text-sm font-semibold hover:bg-gold-300/20 transition-all"
        >
          <MessageSquare className="w-4 h-4" /> View Feedback
        </Link>
      </div>

      {/* Questions */}
      <div>
        <h2 className="font-display text-lg font-bold text-white mb-4">Interview Questions</h2>
        <div className="space-y-3">
          {interview.questions?.map((q, i) => (
            <QuestionAccordion key={i} index={i} question={q.question} answer={q.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}
