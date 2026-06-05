import React, { useState } from "react";
import { UserAccount } from "../types";
import { 
  LogOut, 
  User as UserIcon, 
  Tags, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  LayoutDashboard
} from "lucide-react";
import AguacolLogo from "./AguacolLogo";

export interface SidebarModule {
  id: string;
  name: string;
  icon: React.ReactNode;
}

const MODULES: SidebarModule[] = [
  {
    id: "revision-etiquetas",
    name: "Revisión Etiquetas",
    icon: <Tags className="w-5 h-5" />,
  },
];

interface SidebarProps {
  currentUser: UserAccount;
  activeModule: string;
  onModuleChange: (moduleId: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentUser, activeModule, onModuleChange, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-700 cursor-pointer no-print"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 no-print"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50 lg:z-auto
          flex flex-col
          bg-slate-900 text-white border-r border-slate-800
          transition-all duration-300 ease-in-out no-print
          ${collapsed ? "w-[68px]" : "w-[260px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top: Brand */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800/80 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center font-extrabold text-slate-900 text-base shadow shadow-emerald-500/30 flex-shrink-0">
            AQ
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-extrabold uppercase tracking-tight text-white leading-tight">
                AGUACOL
              </h1>
              <p className="text-[10px] text-slate-500 font-medium leading-tight">
                Control de Calidad
              </p>
            </div>
          )}

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden ml-auto p-1 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {!collapsed && (
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
              Módulos
            </p>
          )}
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => {
                  onModuleChange(mod.id);
                  setMobileOpen(false);
                }}
                title={collapsed ? mod.name : undefined}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-150 cursor-pointer
                  ${isActive
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <span className={`flex-shrink-0 ${isActive ? "text-emerald-400" : ""}`}>
                  {mod.icon}
                </span>
                {!collapsed && <span className="truncate">{mod.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:block px-2 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg text-xs transition-colors cursor-pointer"
            title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Colapsar</span>}
          </button>
        </div>

        {/* Bottom: User info */}
        <div className={`border-t border-slate-800/80 px-3 py-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
          <div className={`flex items-center gap-2.5 ${collapsed ? "flex-col" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-900 font-bold text-xs flex-shrink-0">
              {currentUser.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate">Inspector</p>
              </div>
            )}
            <button
              onClick={onLogout}
              title="Cerrar Sesión"
              className={`p-1.5 text-slate-500 hover:text-red-400 active:text-red-500 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${collapsed ? "" : "ml-auto"}`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
