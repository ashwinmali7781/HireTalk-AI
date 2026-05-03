import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { doc, getDoc, collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { chatSession } from "../scripts";
import useSpeechToText from "react-hook-speech-to-text";
import WebCam from "react-webcam";
import { toast } from "sonner";
import {
  ArrowLeft, Mic, MicOff, Video, VideoOff, RotateCcw, Save,
  Volume2, VolumeX, Loader, CheckCircle2, ChevronRight, AlertCircle
} from "lucide-react";

function RatingBar({ value }) {
  const pct = (value / 10) * 100;
  const color = value >= 7 ? "#00E5A0" : value >= 4 ? "#FFD54F" : "#FF6B6B";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-ink-900 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-sm font-bold w-8 text-right" style={{ color }}>{value}/10</span>
    </div>
  );
}

export default function MockInterviewPage() {
  const { interviewId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [isWebCam, setIsWebCam] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());

  const { isRecording, results, startSpeechToText, stopSpeechToText, interimResult } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

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

  useEffect(() => {
    const combined = results
      .filter(r => typeof r !== "string")
      .map(r => r.transcript)
      .join(" ");
    setUserAnswer(combined);
  }, [results]);

  // Reset state when switching questions
  useEffect(() => {
    setUserAnswer("");
    setAiResult(null);
    setSaved(false);
    if (isRecording) stopSpeechToText();
  }, [currentQ]);

  const handleRecord = async () => {
    if (isRecording) {
      stopSpeechToText();
      if (userAnswer.length < 20) {
        toast.error("Answer too short — keep talking!");
        return;
      }
      await generateFeedback();
    } else {
      startSpeechToText();
    }
  };

  const generateFeedback = async () => {
    const q = interview.questions[currentQ];
    setIsAiGenerating(true);
    const prompt = `Question: "${q.question}"
User Answer: "${userAnswer}"
Correct Answer: "${q.answer}"
Rate the user's answer from 1 to 10 and give improvement feedback.
Return ONLY JSON: {"ratings": <number>, "feedback": "<string>"}`;

    try {
      const res = await chatSession.sendMessage(prompt);
      let text = res.response.text().trim().replace(/(json|```|`)/g, "");
      setAiResult(JSON.parse(text));
    } catch {
      toast.error("Failed to generate AI feedback");
      setAiResult({ ratings: 0, feedback: "Unable to generate feedback at this time." });
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!aiResult || saved) return;
    setSaving(true);
    const q = interview.questions[currentQ];
    try {
      const existing = await getDocs(query(
        collection(db, "userAnswers"),
        where("userId", "==", userId),
        where("mockIdRef", "==", interviewId),
        where("question", "==", q.question)
      ));
      if (!existing.empty) {
        toast.info("Already saved this answer");
        return;
      }
      await addDoc(collection(db, "userAnswers"), {
        mockIdRef: interviewId,
        question: q.question,
        correct_ans: q.answer,
        user_ans: userAnswer,
        feedback: aiResult.feedback,
        rating: aiResult.ratings,
        userId,
        createdAt: serverTimestamp(),
      });
      setSaved(true);
      setAnsweredQuestions(prev => new Set([...prev, currentQ]));
      toast.success("Answer saved!");
    } catch {
      toast.error("Failed to save answer");
    } finally {
      setSaving(false);
    }
  };

  const handleSpeak = (text) => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-jade-300 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!interview) return (
    <div className="text-center py-24">
      <p className="text-white/40">Interview not found.</p>
      <Link to="/dashboard" className="text-jade-300 text-sm mt-4 inline-block">← Dashboard</Link>
    </div>
  );

  const questions = interview.questions || [];
  const currentQuestion = questions[currentQ];
  const progress = (answeredQuestions.size / questions.length) * 100;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/dashboard/${interviewId}`} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display text-xl font-bold text-white">{interview.position}</h1>
            <p className="text-xs text-white/30">Mock Interview · {questions.length} questions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-white/30 font-mono">{answeredQuestions.size}/{questions.length} answered</div>
          <Link
            to={`/dashboard/feedback/${interviewId}`}
            className="px-4 py-2 rounded-lg bg-gold-300/10 border border-gold-300/20 text-gold-300 text-xs font-semibold hover:bg-gold-300/20 transition-all"
          >
            View Feedback
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-ink-800 rounded-full mb-8 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-jade-300 to-jade-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Question tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentQ(i)}
            className={`shrink-0 px-4 py-2 rounded-lg text-xs font-medium transition-all border ${
              i === currentQ
                ? "bg-jade-300/10 border-jade-300/30 text-jade-300"
                : answeredQuestions.has(i)
                ? "bg-ink-800 border-white/5 text-white/50"
                : "bg-ink-900 border-white/5 text-white/30 hover:text-white/50"
            }`}
          >
            {answeredQuestions.has(i) && <CheckCircle2 className="w-3 h-3 inline mr-1 text-jade-300" />}
            Q{i + 1}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Webcam + Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass rounded-2xl overflow-hidden aspect-[4/3] relative">
            {isWebCam ? (
              <WebCam
                onUserMedia={() => setIsWebCam(true)}
                onUserMediaError={() => { setIsWebCam(false); toast.error("Camera access denied"); }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-white/5 flex items-center justify-center">
                  <VideoOff className="w-7 h-7 text-white/20" />
                </div>
                <p className="text-xs text-white/30">Camera off</p>
              </div>
            )}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
                <div className="w-2 h-2 rounded-full bg-red-400 recording-ring" />
                <span className="text-xs text-red-400 font-medium">REC</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setIsWebCam(!isWebCam)}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-all ${
                isWebCam ? "bg-jade-300/10 border-jade-300/30 text-jade-300" : "bg-ink-900 border-white/5 text-white/40 hover:text-white"
              }`}
            >
              {isWebCam ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              {isWebCam ? "On" : "Off"}
            </button>

            <button
              onClick={handleRecord}
              disabled={isAiGenerating}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-all ${
                isRecording ? "bg-red-500/10 border-red-500/30 text-red-400 recording-ring" : "bg-ink-900 border-white/5 text-white/40 hover:text-white"
              } disabled:opacity-40`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? "Stop" : "Record"}
            </button>

            <button
              onClick={() => { setUserAnswer(""); setAiResult(null); setSaved(false); if (isRecording) stopSpeechToText(); startSpeechToText(); }}
              className="flex flex-col items-center gap-1 py-3 rounded-xl border bg-ink-900 border-white/5 text-white/40 hover:text-white text-xs transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>

            <button
              onClick={handleSave}
              disabled={!aiResult || saving || saved}
              className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs transition-all ${
                saved ? "bg-jade-300/10 border-jade-300/30 text-jade-300" : "bg-ink-900 border-white/5 text-white/40 hover:text-white"
              } disabled:opacity-40`}
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Right: Question + Answer + Feedback */}
        <div className="lg:col-span-3 space-y-4">
          {/* Question */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-white/30 font-mono mb-2">Question {currentQ + 1} of {questions.length}</div>
                <p className="text-base text-white/85 leading-relaxed">{currentQuestion?.question}</p>
              </div>
              <button
                onClick={() => handleSpeak(currentQuestion?.question)}
                className={`shrink-0 p-2.5 rounded-lg border transition-all ${isPlaying ? "bg-jade-300/10 border-jade-300/30 text-jade-300" : "bg-ink-900 border-white/5 text-white/30 hover:text-white"}`}
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Your answer */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-400 recording-ring" : "bg-white/20"}`} />
              <h3 className="text-sm font-semibold text-white/60">Your Answer</h3>
            </div>
            <p className={`text-sm leading-relaxed min-h-[60px] ${userAnswer ? "text-white/80" : "text-white/25 italic"}`}>
              {userAnswer || "Press Record and start speaking your answer..."}
            </p>
            {interimResult && (
              <p className="text-xs text-white/30 mt-2 italic">{interimResult}</p>
            )}
          </div>

          {/* AI Feedback */}
          {isAiGenerating && (
            <div className="glass rounded-2xl p-6 flex items-center gap-3">
              <Loader className="w-5 h-5 text-jade-300 animate-spin shrink-0" />
              <p className="text-sm text-white/50">Gemini is analyzing your answer...</p>
            </div>
          )}

          {aiResult && !isAiGenerating && (
            <div className="glass rounded-2xl p-6 border border-jade-300/10">
              <h3 className="text-sm font-semibold text-white mb-4">AI Feedback</h3>
              <RatingBar value={aiResult.ratings} />
              <p className="text-sm text-white/55 leading-relaxed mt-4">{aiResult.feedback}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className="px-4 py-2 rounded-lg border border-white/5 text-white/40 text-sm hover:text-white hover:border-white/15 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQ(currentQ + 1)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-jade-300/10 border border-jade-300/20 text-jade-300 text-sm font-medium hover:bg-jade-300/20 transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                to={`/dashboard/feedback/${interviewId}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-300/10 border border-gold-300/20 text-gold-300 text-sm font-medium hover:bg-gold-300/20 transition-all"
              >
                Finish & Feedback <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
