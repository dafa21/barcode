import React from "react";
import { useState, useRef, useEffect } from 'react';
import { User, Event } from '../types.ts';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, QrCode, Camera, Clock, RefreshCcw, Crown } from 'lucide-react';

interface RecentScan {
  id: string;
  name: string;
  time: string;
}
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner';

export function Scanner({ user, onLogout }: { user: User; onLogout: () => void }) {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [barcode, setBarcode] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [useCamera, setUseCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [isVip, setIsVip] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Warm up speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices(); // Trigger voice loading
      const warmup = new SpeechSynthesisUtterance('');
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
    }
    
    // Keep focus on input for barcode scanner guns if camera is not active
    const focusInput = () => {
      if (!useCamera && inputRef.current) inputRef.current.focus();
    };
    document.addEventListener('click', focusInput);
    focusInput();
    return () => document.removeEventListener('click', focusInput);
  }, [useCamera]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch('/api/events', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const events: Event[] = await res.json();
          const found = events.find(e => e.id === eventId);
          if (found) setEvent(found);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleScanValue = async (scannedUid: string) => {
    if (!scannedUid.trim() || status !== 'idle') return;
    
    setStatus('scanning');
    try {
      const res = await fetch('/api/scanner/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ barcodeUid: scannedUid, eventId })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setIsVip(!!data.guest?.isVip);
        setMessage(`Berhasil! Welcome, ${data.guest.guestName}`);
        
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
        }
        
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Cancel any ongoing speech to avoid delay
          
          // Mempersingkat teks agar lebih cepat diucapkan
          const utterance = new SpeechSynthesisUtterance(`Selamat datang, ${data.guest.guestName}. Silakan masuk.`);
          utterance.lang = 'id-ID';
          utterance.rate = 1.1; // Sedikit lebih cepat
          
          // Coba cari voice bahasa indonesia jika ada untuk mempercepat
          const voices = window.speechSynthesis.getVoices();
          const idVoice = voices.find(v => v.lang.includes('id'));
          if (idVoice) utterance.voice = idVoice;
          
          window.speechSynthesis.speak(utterance);
        }
        
        setRecentScans(prev => {
          const newScan = {
            id: data.guest.id,
            name: data.guest.guestName,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };
          return [newScan, ...prev].slice(0, 5);
        });
      } else {
        setStatus('error');
        setMessage(data.error || 'Scan failed');
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
        }
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200]);
      }
    } finally {
      setBarcode('');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
        setIsVip(false);
      }, 2000);
    }
  };

  const handleScanForm = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleScanValue(inputRef.current?.value || barcode);
  };

  if (!event) return <div className="min-h-screen flex items-center justify-center">Loading event...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 text-gray-900 font-sans flex flex-col">
      <header className="h-20 border-b border-indigo-100/50 px-4 md:px-8 flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/" className="w-10 h-10 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-light tracking-wide text-gray-900">{event.eventName}</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Scanner Active
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Colorful floating blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[40%] left-[20%] w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        <div className="w-full max-w-md space-y-8 text-center relative z-10">
          
          <div className="relative">
            {useCamera ? (
              <div className="w-full aspect-[3/4] max-w-sm mx-auto overflow-hidden rounded-3xl border-4 border-white/60 bg-white/20 shadow-[0_8px_32px_rgba(99,102,241,0.2)] relative backdrop-blur-md">
                <QrScanner
                  onScan={(codes) => { if (codes.length > 0) handleScanValue(codes[0].rawValue) }}
                  onError={(error) => console.log(error?.message)}
                  allowMultiple={true}
                  scanDelay={2000}
                  constraints={{ facingMode }}
                />
                {status === 'success' && (
                  <div className="absolute inset-0 bg-emerald-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <div className="absolute inset-0 bg-emerald-400 opacity-50 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]"></div>
                    {isVip && (
                      <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 animate-bounce">
                        <Crown className="w-4 h-4" /> VIP
                      </div>
                    )}
                    <CheckCircle2 className="w-16 h-16 mb-4 animate-[bounce_0.5s_ease-in-out_1]" />
                    <p className="text-xl font-bold text-center leading-tight">{message}</p>
                  </div>
                )}
                {status === 'error' && (
                  <div className="absolute inset-0 bg-red-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <XCircle className="w-16 h-16 mb-4" />
                    <p className="text-xl font-bold text-center leading-tight">{message}</p>
                  </div>
                )}
                {status === 'scanning' && (
                  <div className="absolute inset-0 bg-indigo-500/95 flex flex-col items-center justify-center z-10 text-white p-6 backdrop-blur-sm transition-all duration-300">
                    <QrCode className="w-16 h-16 mb-4 animate-pulse" />
                    <p className="text-xl font-bold text-center leading-tight">Processing...</p>
                  </div>
                )}
              </div>
            ) : (
              <div className={`w-64 h-64 mx-auto rounded-3xl border flex items-center justify-center transition-all duration-300 relative backdrop-blur-sm ${
                status === 'idle' ? 'bg-white/60 border-white/60 shadow-[0_8px_32px_rgba(99,102,241,0.15)]' :
                status === 'success' ? 'bg-emerald-50 border-emerald-500/50 shadow-sm' :
                status === 'error' ? 'bg-red-50 border-red-500/50 shadow-sm' :
                'bg-indigo-50 border-indigo-500/50 shadow-sm'
              }`}>
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-indigo-300"></div>
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-indigo-300"></div>
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-indigo-300"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-indigo-300"></div>

                {status === 'success' ? (
                  <>
                    <div className="absolute inset-0 bg-emerald-400 opacity-20 rounded-3xl animate-[ping_1s_cubic-bezier(0,0,0.2,1)_1]"></div>
                    {isVip && (
                      <div className="absolute top-[-10px] right-[-10px] bg-amber-400 text-amber-900 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1 animate-bounce z-20">
                        <Crown className="w-3 h-3" /> VIP
                      </div>
                    )}
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 animate-[bounce_0.5s_ease-in-out_1]" />
                  </>
                ) :
                 status === 'error' ? <XCircle className="w-24 h-24 text-red-500" /> :
                 <QrCode className={`w-24 h-24 ${status === 'idle' ? 'text-indigo-200/50' : 'text-indigo-600'}`} />}
                 
                 {status === 'scanning' && (
                   <div className="absolute inset-0 border-t-2 border-indigo-600 rounded-3xl w-full h-1 animate-pulse"></div>
                 )}
              </div>
            )}
          </div>

          <div className="h-16 flex flex-col items-center justify-center">
            {message && (
              <p className={`text-xl font-serif tracking-wide ${status === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
            {status === 'idle' && (
              <p className="text-[10px] uppercase tracking-widest text-gray-500">Ready to authenticate. Point scanner at barcode.</p>
            )}
          </div>

          <div className="flex items-center justify-center mt-4 gap-2">
            <button
              onClick={() => setUseCamera(!useCamera)}
              className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors border border-gray-200 shadow-sm"
            >
              <Camera className="w-4 h-4" />
              {useCamera ? 'Use Physical Scanner' : 'Use Camera Scanner'}
            </button>
            {useCamera && (
              <button
                onClick={() => setFacingMode(prev => prev === 'environment' ? 'user' : 'environment')}
                className="flex items-center justify-center w-12 h-12 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors border border-gray-200 shadow-sm"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleScanForm} className="opacity-0 h-0 overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              value={barcode}
              onChange={e => setBarcode(e.target.value)}
              autoFocus
              className="w-full"
              autoComplete="off"
            />
          </form>

        </div>
      </main>
    </div>
  );
}
