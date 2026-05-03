import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { chatSession } from "../scripts";
import { toast } from "sonner";
import { ArrowLeft, Loader, Sparkles, BriefcaseIcon, FileText, Clock, Code2 } from "lucide-react";

const schema = z.object({
  position: z.string().min(1).max(100),
  description: z.string().min(10),
  experience: z.coerce.number().min(0).max(50),
  techStack: z.string().min(1),
});

function cleanAiResponse(text) {
  let clean = text.trim().replace(/(json|```|`)/g, "");
  const match = clean.match(/\[.*\]/s);
  if (!match) throw new Error("No JSON array found");
  return JSON.parse(match[0]);
}

export default function CreateInterviewPage() {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = async (data) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message);
      return;
    }

    setLoading(true);
    try {
      const prompt = `As an experienced technical interviewer, generate a JSON array containing exactly 5 technical interview questions with detailed answers based on:
- Job Position: ${data.position}
- Job Description: ${data.description}
- Years of Experience: ${data.experience}
- Tech Stack: ${data.techStack}

Format: [{"question": "...", "answer": "..."}, ...]
Return ONLY the JSON array, no explanation.`;

      const aiResult = await chatSession.sendMessage(prompt);
      const questions = cleanAiResponse(aiResult.response.text());

      await addDoc(collection(db, "interviews"), {
        ...data,
        userId,
        questions,
        createdAt: serverTimestamp(),
      });

      toast.success("Interview created!", { description: "Your 5 AI questions are ready." });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create interview. Check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/dashboard"
          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="text-xs text-white/30 mb-0.5">Dashboard / Create</div>
          <h1 className="font-display text-2xl font-bold text-white">New Mock Interview</h1>
        </div>
      </div>

      <div className="glass rounded-2xl p-8">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-jade-300/5 border border-jade-300/15 mb-8">
          <Sparkles className="w-5 h-5 text-jade-300 shrink-0" />
          <p className="text-sm text-white/60">
            Gemini AI will generate <strong className="text-white">5 tailored questions</strong> based on your role and tech stack.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
              <BriefcaseIcon className="w-3.5 h-3.5" /> Job Position / Role
            </label>
            <input
              {...register("position", { required: true })}
              placeholder="e.g. Senior Frontend Engineer"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl bg-ink-900 border border-white/8 text-white placeholder-white/20 text-sm focus:outline-none focus:border-jade-300/40 focus:ring-1 focus:ring-jade-300/20 transition-all disabled:opacity-50"
            />
            {errors.position && <p className="text-xs text-red-400 mt-1">Position is required</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
              <FileText className="w-3.5 h-3.5" /> Job Description
            </label>
            <textarea
              {...register("description", { required: true, minLength: 10 })}
              placeholder="Describe the role, responsibilities, and what you'd be working on..."
              disabled={loading}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-ink-900 border border-white/8 text-white placeholder-white/20 text-sm focus:outline-none focus:border-jade-300/40 focus:ring-1 focus:ring-jade-300/20 transition-all resize-none disabled:opacity-50"
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">Description must be at least 10 characters</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
              <Clock className="w-3.5 h-3.5" /> Years of Experience
            </label>
            <input
              type="number"
              min={0}
              max={50}
              {...register("experience", { required: true, min: 0 })}
              placeholder="e.g. 3"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl bg-ink-900 border border-white/8 text-white placeholder-white/20 text-sm focus:outline-none focus:border-jade-300/40 focus:ring-1 focus:ring-jade-300/20 transition-all disabled:opacity-50"
            />
            {errors.experience && <p className="text-xs text-red-400 mt-1">Experience is required</p>}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm text-white/60 mb-2">
              <Code2 className="w-3.5 h-3.5" /> Tech Stack
            </label>
            <textarea
              {...register("techStack", { required: true })}
              placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, AWS"
              disabled={loading}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-ink-900 border border-white/8 text-white placeholder-white/20 text-sm focus:outline-none focus:border-jade-300/40 focus:ring-1 focus:ring-jade-300/20 transition-all resize-none disabled:opacity-50"
            />
            {errors.techStack && <p className="text-xs text-red-400 mt-1">Tech stack is required</p>}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Link
              to="/dashboard"
              className="flex-1 h-12 flex items-center justify-center rounded-xl border border-white/8 text-white/50 text-sm hover:text-white hover:border-white/15 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl bg-jade-300 text-ink-950 font-semibold text-sm hover:bg-jade-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-jade-300/20"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Interview
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
