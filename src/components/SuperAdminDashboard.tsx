import React from "react";
import { useState, useEffect } from 'react';
import { Office } from '../types.ts';
import { Building2, Plus, Users, ChevronRight } from 'lucide-react';

export function SuperAdminDashboard() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewOffice, setShowNewOffice] = useState(false);
  const [newOfficeName, setNewOfficeName] = useState('');
  const [newOfficeEmail, setNewOfficeEmail] = useState('');
  
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      const res = await fetch('/api/offices', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setOffices(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/offices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ officeName: newOfficeName, contactEmail: newOfficeEmail })
      });
      if (res.ok) {
        setShowNewOffice(false);
        setNewOfficeName('');
        setNewOfficeEmail('');
        fetchOffices();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffice) return;
    try {
      const res = await fetch(`/api/offices/${selectedOffice.id}/admins`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username: newAdminUsername, password: newAdminPassword })
      });
      if (res.ok) {
        setNewAdminUsername('');
        setNewAdminPassword('');
        alert('Admin created successfully');
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Loading offices...</div>;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Total Offices</p>
          <p className="text-3xl font-serif text-gray-900">{offices.length}</p>
        </div>
        <div className="bg-white/90 backdrop-blur-xl p-5 md:p-6 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
            <p className="text-xl font-serif text-emerald-600">Online</p>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-gray-500">Offices Directory</h2>
          <button 
            onClick={() => setShowNewOffice(!showNewOffice)}
            className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-sm shadow-indigo-500/25 transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {showNewOffice && (
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="text-[10px] uppercase tracking-widest text-indigo-700 mb-3">Provision New Tenant</h3>
            <form onSubmit={handleCreateOffice} className="space-y-3">
              <input
                type="text"
                placeholder="Office Name"
                required
                value={newOfficeName}
                onChange={e => setNewOfficeName(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3"
              />
              <input
                type="email"
                placeholder="Contact Email"
                value={newOfficeEmail}
                onChange={e => setNewOfficeEmail(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowNewOffice(false)} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900">Cancel</button>
                <button type="submit" className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Deploy</button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-2">
          {offices.map(office => (
            <button
              key={office.id}
              onClick={() => setSelectedOffice(office)}
              className={`w-full text-left flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${
                selectedOffice?.id === office.id 
                  ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-md ring-1 ring-indigo-500/20' 
                  : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedOffice?.id === office.id ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'bg-gray-50 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-600'}`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-sm mb-0.5 transition-colors ${selectedOffice?.id === office.id ? 'text-indigo-900 font-bold' : 'font-semibold text-gray-900 group-hover:text-indigo-600'}`}>{office.officeName}</div>
                  {office.contactEmail && <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">{office.contactEmail}</div>}
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${selectedOffice?.id === office.id ? 'text-indigo-600 translate-x-1' : 'text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1'}`} />
            </button>
          ))}
          {offices.length === 0 && <div className="text-gray-500 text-sm italic py-4">No offices provisioned.</div>}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {selectedOffice ? (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 p-6 md:p-8 flex flex-col flex-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-6 pb-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif text-gray-900">{selectedOffice.officeName}</h2>
                <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Tenant ID: <span className="font-mono text-indigo-600">{selectedOffice.id}</span></p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold tracking-widest uppercase border border-emerald-200">Active Tenant</span>
            </div>
            
            <div className="max-w-md">
              <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Provision Admin Access
              </h3>
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Username</label>
                  <input
                    type="text"
                    required
                    value={newAdminUsername}
                    onChange={e => setNewAdminUsername(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={e => setNewAdminPassword(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3"
                  />
                </div>
                <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest shadow-lg mt-2">
                  Generate Credentials
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 p-12 text-center">
            <div>
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-200" />
              <p className="text-sm">Select a tenant office to manage access and configuration.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
