import React from "react";
import { Analytics } from "@vercel/analytics/react";
import { AppProvider, useApp } from "./context/AppContext";
import { AdminDashboard } from "./components/AdminDashboard";
import { PosTerminal } from "./components/PosTerminal";
import { OnlineStore } from "./components/OnlineStore";
import { LandingPage } from "./components/LandingPage";
import { ArrowLeft, Sparkles } from "lucide-react";

const AppContent: React.FC = () => {
  const { currentUser, changeUserRole } = useApp();

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans antialiased text-neutral-900">
      {/* Mini clean return bar, ONLY shown if we are NOT on the landing page */}
      {currentUser.role !== "landing" && (
        <div className="bg-neutral-950 text-white py-2 px-4 flex items-center justify-between text-xs border-b border-neutral-800 sticky top-0 z-50">
          <button
            onClick={() => changeUserRole("landing")}
            className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Landing Page</span>
          </button>
          <div className="flex items-center gap-2 text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Vista Demo: <strong className="text-white capitalize">{currentUser.role}</strong></span>
          </div>
        </div>
      )}

      {/* Main App Canvas */}
      <main className="flex-1 w-full">
        {currentUser.role === "admin" && <AdminDashboard />}
        {currentUser.role === "cajero" && <PosTerminal />}
        {currentUser.role === "customer" && <OnlineStore />}
        {currentUser.role === "landing" && <LandingPage />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
      <Analytics />
    </AppProvider>
  );
}
