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
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="Laznas Dewan Dakwah Logo" 
              className="h-10 md:h-12 object-contain" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.nextElementSibling) {
                  (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }} 
            />
            <div style={{ display: 'none' }}>
              <h1 className="text-lg md:text-xl font-serif font-bold tracking-tight text-slate-800">
                Laznas <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Dewan Dakwah</span>
              </h1>
            </div>
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
