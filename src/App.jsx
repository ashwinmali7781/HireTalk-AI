import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import PublicLayout from "./layouts/PublicLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import CreateInterviewPage from "./pages/CreateInterviewPage";
import InterviewDetailPage from "./pages/InterviewDetailPage";
import MockInterviewPage from "./pages/MockInterviewPage";
import FeedbackPage from "./pages/FeedbackPage";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/create" element={<CreateInterviewPage />} />
            <Route path="/dashboard/:interviewId" element={<InterviewDetailPage />} />
            <Route path="/dashboard/interview/:interviewId" element={<MockInterviewPage />} />
            <Route path="/dashboard/feedback/:interviewId" element={<FeedbackPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ style: { background:"#1C1C28", border:"1px solid rgba(255,255,255,0.08)", color:"#E8E8E0" } }} />
    </ClerkProvider>
  );
}
