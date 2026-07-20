import React, { Component, ReactNode } from "react";
import { User } from '../types.ts';
import { SuperAdminDashboard } from './SuperAdminDashboard.tsx';
import { OfficeAdminDashboard } from './OfficeAdminDashboard.tsx';
import { LogOut } from 'lucide-react';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600">
          <h2 className="text-xl font-bold">Something went wrong.</h2>
          <pre className="mt-4 p-4 bg-red-50 rounded overflow-auto text-xs">{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

export function Dashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      <header className="h-16 md:h-20 border-b border-slate-200/60 px-4 md:px-8 flex items-center justify-between gap-4 bg-white/70 backdrop-blur-xl z-50 sticky top-0 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-3 md:gap-4 group cursor-default">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20 transform group-hover:scale-105 transition-all duration-300">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-slate-800">Barcode <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Sistem Undangan Digital</span></h1>
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-0.5">Multi-Tenant Attendance Architecture</p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-800">{user.username}</span>
            <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> {user.role === 'super_admin' ? 'Super Admin' : 'Office Admin'}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="w-9 h-9 md:w-10 md:h-10 rounded-xl border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 hover:shadow-md transition-all duration-300 group"
            title="Logout"
          >
            <LogOut className="h-4 w-4 transform group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <ErrorBoundary>
          {user.role === 'super_admin' ? (
            <div className="flex-1 overflow-auto p-4 md:p-8 max-w-[1400px] w-full mx-auto">
              <SuperAdminDashboard />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <OfficeAdminDashboard user={user} />
            </div>
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}
