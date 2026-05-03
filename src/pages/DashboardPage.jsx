import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { Plus, Sparkles, Calendar, Layers, Trash2, Eye, PlayCircle, MessageSquare, Loader } from "lucide-react";
import { toast } from "sonner";

function InterviewCard({ interview, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "interviews", interview.id));
      onDelete(interview.id);
      toast.success("Interview deleted");
    } catch {
      toast.error("Failed to delete interview");
    } finally {
      setDeleting(false);
    }
  };

  const techList = interview.techStack?.split(",").map(t => t.trim()).filter(Boolean) || [];
  const dateStr = interview.createdAt?.toDate
    ? interview.createdAt.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div className="glass rounded-2xl p-6 hover:border-white/12 transition-all group relative">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-lg truncate mb-1">{interview.position}</h3>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <Calendar className="w-3 h-3" />
            {dateStr}
            <span>·</span>
            <span>{interview.experience}y exp</span>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-500/10 text-red-400/50 hover:text-red-400"
        >
          {deleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      <p className="text-sm text-white/40 mb-4 line-clamp-2">{interview.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {techList.slice(0, 4).map(tech => (
          <span key={tech} className="px-2 py-0.5 rounded-md bg-ink-900 border border-white/5 text-xs text-white/50">{tech}</span>
        ))}
        {techList.length > 4 && (
          <span className="px-2 py-0.5 rounded-md bg-ink-900 border border-white/5 text-xs text-white/30">+{techList.length - 4}</span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-white/5">
        <Link
          to={`/dashboard/${interview.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-ink-900 border border-white/5 text-xs text-white/50 hover:text-white hover:border-white/15 transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> View
        </Link>
        <Link
          to={`/dashboard/interview/${interview.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-jade-300/10 border border-jade-300/20 text-xs text-jade-300 hover:bg-jade-300/20 transition-all"
        >
          <PlayCircle className="w-3.5 h-3.5" /> Start
        </Link>
        <Link
          to={`/dashboard/feedback/${interview.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gold-300/10 border border-gold-300/20 text-xs text-gold-300 hover:bg-gold-300/20 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Feedback
        </Link>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { userId } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchInterviews = async () => {
      try {
        const q = query(
          collection(db, "interviews"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc")
        );
        const snap = await getDocs(q);
        setInterviews(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
        toast.error("Failed to load interviews");
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, [userId]);

  const handleDelete = (id) => setInterviews(prev => prev.filter(i => i.id !== id));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">My Interviews</h1>
          <p className="text-sm text-white/40">{interviews.length} interview{interviews.length !== 1 ? "s" : ""} saved</p>
        </div>
        <Link
          to="/dashboard/create"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-jade-300 text-ink-950 font-semibold text-sm hover:bg-jade-400 transition-all hover:scale-105 shadow-lg shadow-jade-300/20"
        >
          <Plus className="w-4 h-4" /> New Interview
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-jade-300 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-white/30">Loading your interviews...</p>
          </div>
        </div>
      ) : interviews.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-2xl bg-ink-800 border border-white/5 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-white/20" />
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-2">No interviews yet</h2>
          <p className="text-sm text-white/40 mb-8 max-w-sm mx-auto">
            Create your first AI-powered mock interview and start practicing for your dream role.
          </p>
          <Link
            to="/dashboard/create"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-jade-300 text-ink-950 font-semibold hover:bg-jade-400 transition-all"
          >
            <Plus className="w-4 h-4" /> Create Your First Interview
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interviews.map(interview => (
            <InterviewCard key={interview.id} interview={interview} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
