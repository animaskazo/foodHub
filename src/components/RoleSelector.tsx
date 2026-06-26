import React from "react";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types";
import { Users, MapPin, RotateCcw, ShieldCheck, ShoppingBag, Terminal, Sparkles, Rocket } from "lucide-react";

export const RoleSelector: React.FC = () => {
  const { currentUser, changeUserRole, branches, changeUserBranch, activeShift, resetAllData } = useApp();

  return (
    <div id="role-selector-bar" className="bg-neutral-950 text-white py-2 px-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 text-xs font-medium sticky top-0 z-50 shadow-md">
      {/* Brand & Mode Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono tracking-wider uppercase text-[10px]">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
          Demo Activa
        </div>
        <span className="text-neutral-400">|</span>
        <div className="text-neutral-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold tracking-tight text-white font-sans text-sm">FoodHub Enterprise</span>
        </div>
      </div>

      {/* Selector de Roles (Simulador Multi-Persona) */}
      <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800">
        <span className="text-neutral-500 px-2 text-[10px] uppercase font-mono tracking-wider hidden sm:inline">Modo:</span>
        <button
          id="btn-role-admin"
          onClick={() => changeUserRole("admin")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            currentUser.role === "admin"
              ? "bg-white text-neutral-950 font-semibold shadow"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin</span>
        </button>
        <button
          id="btn-role-cajero"
          onClick={() => changeUserRole("cajero")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            currentUser.role === "cajero"
              ? "bg-white text-neutral-950 font-semibold shadow"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>POS (Caja)</span>
        </button>
        <button
          id="btn-role-customer"
          onClick={() => changeUserRole("customer")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            currentUser.role === "customer"
              ? "bg-white text-neutral-950 font-semibold shadow"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cliente Online</span>
        </button>
        <button
          id="btn-role-landing"
          onClick={() => changeUserRole("landing")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
            currentUser.role === "landing"
              ? "bg-white text-neutral-950 font-semibold shadow"
              : "text-neutral-400 hover:text-white hover:bg-neutral-800"
          }`}
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>SaaS Landing</span>
        </button>
      </div>

      {/* Configuración de Sucursal Activa */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
          <select
            id="select-branch"
            value={currentUser.sucursalId}
            onChange={(e) => changeUserBranch(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          >
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status de Turno de POS en tiempo real */}
        {currentUser.role === "cajero" && (
          <div className="hidden md:flex items-center gap-2">
            {activeShift ? (
              <span className="bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-500/20">
                Turno Abierto (${activeShift.expectedCash.toLocaleString("es-CL")})
              </span>
            ) : (
              <span className="bg-rose-500/15 text-rose-400 px-2 py-0.5 rounded text-[10px] font-mono border border-rose-500/20">
                Turno Cerrado
              </span>
            )}
          </div>
        )}

        <button
          id="btn-reset-demo"
          onClick={resetAllData}
          title="Reiniciar base de datos a valores por defecto"
          className="p-1.5 text-neutral-400 hover:text-rose-400 rounded-md hover:bg-neutral-900 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
