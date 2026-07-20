import sys

content = """
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  eventName: string;
  eventDate: string;
  location: string | null;
  guestName: string;
  heroImage: string | null;
  background: string | null;
  content: string;
  backsound?: string | null;
  gallery?: string;
  isPreview?: boolean;
  isPrint?: boolean;
}

function AnimatedNumber({ value }: { value: number }) {
  return (
    <div className="relative h-12 w-12 flex justify-center items-center overflow-hidden rounded-lg bg-white/60 backdrop-blur-sm shadow-inner border border-white/40">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ y: 20, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -20, opacity: 0, rotateX: 90 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center font-serif text-3xl font-medium text-gray-800"
          style={{ transformOrigin: "50% 50%" }}
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
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
    <div className="flex flex-col items-center justify-center mt-6 mb-4">
      <h3 className="text-[10px] tracking-[0.3em] uppercase text-gray-500 mb-4 font-sans font-semibold">Counting Down The Days</h3>
      <div className="flex justify-center items-center space-x-4">
        <div className="flex flex-col items-center">
          <AnimatedNumber value={timeLeft.days} />
          <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold mt-2">Hari</span>
        </div>
        <span className="text-xl font-light text-gray-300 pb-5">:</span>
        <div className="flex flex-col items-center">
          <AnimatedNumber value={timeLeft.hours} />
          <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold mt-2">Jam</span>
        </div>
        <span className="text-xl font-light text-gray-300 pb-5">:</span>
        <div className="flex flex-col items-center">
          <AnimatedNumber value={timeLeft.minutes} />
          <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold mt-2">Menit</span>
        </div>
        <span className="text-xl font-light text-gray-300 pb-5">:</span>
        <div className="flex flex-col items-center">
          <AnimatedNumber value={timeLeft.seconds} />
          <span className="text-[9px] tracking-[0.2em] uppercase text-gray-500 font-bold mt-2">Detik</span>
        </div>
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
  gallery,
  isPreview = false,
  isPrint = false
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const parsedGallery = React.useMemo(() => {
    if (!gallery) return [];
    try {
      return JSON.parse(gallery) as string[];
    } catch {
      return [];
    }
  }, [gallery]);

  useEffect(() => {
    if (!isPreview && backsound && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play prevented by browser", e));
    }
  }, [backsound, isPreview]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&display=swap');
        .font-wedding { font-family: 'Playfair Display', serif; }
        .font-cursive { font-family: 'Great Vibes', cursive; }
      `}} />
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl overflow-hidden font-wedding text-center bg-[#fdfbf7]">
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
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#fdfbf7] to-[#f4f1ea] pointer-events-none" />
        )}

        <div className="relative z-10 flex-1 flex flex-col pb-12">
          {/* Hero Image */}
          {heroImage && (
            <motion.div 
              initial={isPrint ? false : { opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-72 md:h-80 relative rounded-b-[2rem] overflow-hidden shadow-xl border-b-[6px] border-white"
            >
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </motion.div>
          )}

          <div className={`px-6 flex-1 flex flex-col items-center space-y-8 ${heroImage ? '-mt-10' : 'pt-16'}`}>
            <motion.div
              initial={isPrint ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className={`w-full bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-gray-100 ${!heroImage && 'mt-8'}`}
            >
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4 font-sans font-semibold">You are invited to</h4>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 font-cursive text-amber-800">
                {eventName}
              </h1>

              <div className="w-12 h-[2px] bg-amber-200 mx-auto my-6"></div>

              <p className="text-xs text-gray-500 mb-2 italic">Dear,</p>
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
              className="space-y-4 w-full bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100"
            >
              <div className="flex items-start justify-center space-x-4 text-gray-700 text-left">
                <Calendar className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-amber-800/60 font-sans font-bold mb-1">Tanggal</p>
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
                  <div className="w-full h-[1px] bg-gray-100 my-4"></div>
                  <div className="flex items-start justify-center space-x-4 text-gray-700 text-left">
                    <MapPin className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-amber-800/60 font-sans font-bold mb-1">Lokasi</p>
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
                className="text-sm text-gray-700 leading-relaxed ql-editor !p-0 bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-gray-100 w-full"
                dangerouslySetInnerHTML={{ __html: content.replace(/\{\{nama_tamu\}\}/g, `<span class="font-bold underline">${guestName}</span>`) }}
              />
            )}

            {parsedGallery.length > 0 && (
              <motion.div
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 1 }}
                className="w-full mt-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="h-[1px] bg-amber-200 flex-1"></div>
                  <h3 className="px-4 text-xs tracking-[0.3em] uppercase text-gray-500 font-sans font-bold">Event Highlights</h3>
                  <div className="h-[1px] bg-amber-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {parsedGallery.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedImage(img)}
                      className="cursor-pointer aspect-square rounded-xl overflow-hidden shadow-sm border border-white/50"
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 cursor-zoom-out"
            >
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
                className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                src={selectedImage}
                alt="Enlarged gallery view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
"""

with open("src/components/DigitalInvitation.tsx", "w") as f:
    f.write(content)

