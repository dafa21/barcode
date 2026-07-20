import React from "react";
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from 'recharts';
import { Calendar as CalendarIcon, Download, Search, Activity, Users, CheckCircle } from 'lucide-react';
import { Event } from '../types.ts';

interface AnalyticsData {
  totalRegistered: number;
  totalAttended: number;
  attendanceRate: number;
  eventsData: {
    id: string;
    name: string;
    date: string;
    registered: number;
    attended: number;
    rate: number;
  }[];
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [events, setEvents] = useState<Event[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate, selectedEventId]);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (selectedEventId) params.append('eventId', selectedEventId);

      const res = await fetch(`/api/reports/analytics?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setData(await res.json());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (selectedEventId) params.append('eventId', selectedEventId);

      const res = await fetch(`/api/reports/export/csv?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportPDF = async () => {
    if (!data) return;
    try {
      const { jsPDF } = await import('jspdf');
      const autoTable = (await import('jspdf-autotable')).default;
      
      const doc = new jsPDF();
      doc.text("Attendance Report", 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Total Registered: ${data.totalRegistered}`, 14, 25);
      doc.text(`Total Attended: ${data.totalAttended}`, 14, 30);
      doc.text(`Overall Attendance Rate: ${data.attendanceRate.toFixed(1)}%`, 14, 35);

      const tableData = data.eventsData.map(e => [
        e.name,
        new Date(e.date).toLocaleDateString(),
        e.registered,
        e.attended,
        `${e.rate.toFixed(1)}%`
      ]);

      autoTable(doc, {
        startY: 45,
        head: [['Event', 'Date', 'Registered', 'Attended', 'Rate']],
        body: tableData,
      });

      doc.save(`attendance_report_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Filters */}
      <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-wrap items-end gap-5 transition-all duration-300">
        <div className="w-full md:w-auto">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3 [color-scheme:light]"
          />
        </div>
        <div className="w-full md:w-auto">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3 [color-scheme:light]"
          />
        </div>
        <div className="w-full md:w-auto">
          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event Filter</label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2 px-3 appearance-none"
          >
            <option value="">All Events</option>
            {events.map(e => (
              <option key={e.id} value={e.id}>{e.eventName}</option>
            ))}
          </select>
        </div>
        <div className="w-full md:flex-1 flex justify-start md:justify-end gap-3 mt-2 md:mt-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md text-gray-700 hover:text-indigo-600 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" /> CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:from-indigo-500 hover:to-purple-500 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">Loading analytics...</div>
      ) : data ? (
        <div className="grid grid-cols-12 gap-6 flex-1">
          {/* Metrics */}
          <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-indigo-900">
                <Users className="w-32 h-32 transform translate-x-4 -translate-y-4" />
              </div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 relative z-10">Total Registered</h3>
              <p className="text-5xl font-serif text-gray-900 relative z-10">{data.totalRegistered}</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-emerald-600">
                <CheckCircle className="w-32 h-32 transform translate-x-4 -translate-y-4" />
              </div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 relative z-10">Total Attended</h3>
              <p className="text-5xl font-serif text-gray-900 relative z-10">{data.totalAttended}</p>
            </div>

            <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-purple-600">
                <Activity className="w-32 h-32 transform translate-x-4 -translate-y-4" />
              </div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2 relative z-10">Attendance Rate</h3>
              <p className="text-5xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 relative z-10">{data.attendanceRate.toFixed(1)}%</p>
            </div>
          </div>

          {/* Charts */}
          <div className="col-span-12 md:col-span-8 bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 h-[450px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-8">Attendance By Event</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.eventsData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="rgba(0,0,0,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    stroke="rgba(0,0,0,0.4)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{fill: 'rgba(0,0,0,0.05)'}}
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '8px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="registered" name="Registered" fill="#312E81" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attended" name="Attended" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="col-span-12 md:col-span-4 bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 h-[450px] flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-8">Overall Attendance</h3>
            <div className="flex-1 min-h-0 flex items-center justify-center relative">
              {data.totalRegistered === 0 ? (
                <p className="text-sm text-gray-500">No data available</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Attended', value: data.totalAttended, color: '#4F46E5' },
                          { name: 'Not Attended', value: data.totalRegistered - data.totalAttended, color: '#E5E7EB' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {
                          [
                            { name: 'Attended', value: data.totalAttended, color: '#4F46E5' },
                            { name: 'Not Attended', value: data.totalRegistered - data.totalAttended, color: '#E5E7EB' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))
                        }
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderColor: 'rgba(0,0,0,0.1)', borderRadius: '8px', padding: '8px 12px' }}
                        itemStyle={{ color: '#111827', fontSize: '14px', fontWeight: '500' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
                    <span className="text-3xl font-serif text-gray-900 leading-none">{data.attendanceRate.toFixed(0)}%</span>
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">Rate</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
