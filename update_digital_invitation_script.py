import sys

content = """
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  eventName: string;
  eventDate: string;
  location: string | null;
  guestName: string;
  heroImage: string | null;
  background: string | null;
  content: string;
  backsound?: string | null;
  isPreview?: boolean;
  isPrint?: boolean;
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isEventPassed, setIsEventPassed] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setIsEventPassed(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (isEventPassed) {
    return null;
  }

  return (
    <div className="flex justify-center items-center space-x-3 mt-4 mb-2">
      <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 min-w-[70px] shadow-sm border border-white/50">
        <span className="text-2xl font-light text-gray-800 leading-none mb-1">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold">Hari</span>
      </div>
      <span className="text-xl font-light text-gray-400 mb-3">:</span>
      <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 min-w-[70px] shadow-sm border border-white/50">
        <span className="text-2xl font-light text-gray-800 leading-none mb-1">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold">Jam</span>
      </div>
      <span className="text-xl font-light text-gray-400 mb-3">:</span>
      <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 min-w-[70px] shadow-sm border border-white/50">
        <span className="text-2xl font-light text-gray-800 leading-none mb-1">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold">Menit</span>
      </div>
      <span className="text-xl font-light text-gray-400 mb-3">:</span>
      <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-xl p-3 min-w-[70px] shadow-sm border border-white/50">
        <span className="text-2xl font-light text-gray-800 leading-none mb-1">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold">Detik</span>
      </div>
    </div>
  );
}

export function DigitalInvitation({
  eventName,
  eventDate,
  location,
  guestName,
  heroImage,
  background,
  content,
  backsound,
  isPreview = false,
  isPrint = false
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!isPreview && backsound && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play prevented by browser", e));
    }
  }, [backsound, isPreview]);

  return (
    <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl overflow-hidden font-serif text-center bg-[#fcfbf9]">
      {backsound && (
        <audio ref={audioRef} src={backsound} loop />
      )}
      
      {/* Background Image/Color */}
      {background && (
        <>
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url(${background})` }}
          />
          {/* Overlay to ensure text readability */}
          <div className="absolute inset-0 w-full h-full bg-white/40 backdrop-blur-[2px] pointer-events-none" />
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/20 via-white/50 to-[#fcfbf9] pointer-events-none" />
        </>
      )}
      {!background && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef] pointer-events-none" />
      )}

      <div className="relative z-10 flex-1 flex flex-col pb-10">
        {/* Hero Image */}
        {heroImage && (
          <motion.div 
            initial={isPrint ? false : { opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-64 md:h-80 relative rounded-b-[3rem] overflow-hidden shadow-lg border-b-4 border-white"
          >
            <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </motion.div>
        )}

        <div className={`px-6 flex-1 flex flex-col items-center justify-center space-y-8 ${heroImage ? '-mt-12' : 'pt-16'}`}>
          <motion.div
            initial={isPrint ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className={`w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/60 ${!heroImage && 'mt-8'}`}
          >
            <h4 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-3 font-sans font-semibold">You are invited to</h4>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {eventName}
            </h1>

            <div className="w-16 h-[1px] bg-gray-300 mx-auto my-6"></div>

            <p className="text-xs text-gray-500 mb-2 italic font-sans">Dear,</p>
            <h2 className="text-xl font-bold text-gray-800">
              Bapak/Ibu {guestName}
            </h2>
          </motion.div>

          <motion.div
            initial={isPrint ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <CountdownTimer targetDate={eventDate} />
          </motion.div>

          <motion.div 
            initial={isPrint ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="space-y-4 w-full bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60"
          >
            <div className="flex items-start justify-center space-x-4 text-gray-700 text-left">
              <Calendar className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold mb-1">Tanggal</p>
                <span className="text-sm font-medium block">
                  {new Date(eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
                <span className="text-sm font-medium block text-gray-500 mt-0.5">
                  Pukul {new Date(eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            
            {location && (
              <>
                <div className="w-full h-[1px] bg-gray-200 my-3"></div>
                <div className="flex items-start justify-center space-x-4 text-gray-700 text-left">
                  <MapPin className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-sans font-bold mb-1">Lokasi</p>
                    <span className="text-sm font-medium block leading-relaxed">{location}</span>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {content && (
            <motion.div 
              initial={isPrint ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-sm text-gray-700 leading-relaxed ql-editor !p-0 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 w-full"
              dangerouslySetInnerHTML={{ __html: content.replace(/\{\{nama_tamu\}\}/g, `<span class="font-bold underline">${guestName}</span>`) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
"""

with open("src/components/DigitalInvitation.tsx", "w") as f:
    f.write(content)
