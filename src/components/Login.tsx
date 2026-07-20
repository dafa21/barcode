import React from "react";
import { useState } from 'react';
import { User } from '../types.ts';
import { Lock, User as UserIcon } from 'lucide-react';

export function Login({ onLogin }: { onLogin: (user: User, token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      onLogin(data.user, data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-indigo-700 to-purple-900 px-4 font-sans text-gray-900 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-500/30 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-purple-500/30 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl p-10 rounded-3xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.2)] relative z-10 transition-all duration-300">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/30 transform hover:scale-105 transition-transform duration-300">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">System <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Login</span></h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-500 mt-3">Attendance Architecture</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 text-red-600 text-sm rounded-xl flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-indigo-600">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 shadow-sm focus:shadow-md focus:bg-white"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 transition-colors group-focus-within:text-indigo-600">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 shadow-sm focus:shadow-md focus:bg-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/25 text-xs font-bold uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-8"
          >
            {loading ? 'Authenticating...' : 'Sign in to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
