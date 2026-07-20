
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, X, Music, VolumeX, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  eventName: string;
  eventDate: string;
  location: string | null;
  mapsLink?: string | null;
  guestName: string;
  heroImage: string | null;
  logo?: string | null;
  background: string | null;
  content: string;
  backsound?: string | null;
  gallery?: string;
  themePrimary?: string | null;
  themeSecondary?: string | null;
  isPreview?: boolean;
  isPrint?: boolean;
  eventSlug?: string;
  hasInvitationFile?: boolean;
  openingQuote?: string | null;
  children?: React.ReactNode;
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
  mapsLink,
  guestName,
  heroImage,
  background,
  content,
  backsound,
  gallery,
  themePrimary,
  themeSecondary,
  isPreview = false,
  isPrint = false,
  eventSlug,
  hasInvitationFile = false,
  logo,
  openingQuote,
  children
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [isOpened, setIsOpened] = useState(isPreview || isPrint);

  useEffect(() => {
    if (isOpened && !isPreview && backsound && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.log("Audio play prevented by browser", e);
        setIsPlaying(false);
      });
    }
  }, [backsound, isPreview, isOpened]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&display=swap');
        .font-wedding { font-family: 'Playfair Display', serif; }
        .font-cursive { font-family: 'Great Vibes', cursive; }
      `}} />
      <div className="relative w-full max-w-md mx-auto min-h-screen flex flex-col shadow-2xl overflow-hidden font-wedding text-center bg-[#fdfbf7]" style={{ "--theme-primary": themePrimary || "#b45309", "--theme-secondary": themeSecondary || "#fef3c7" } as React.CSSProperties}>
        <AnimatePresence>
          {!isOpened && (
            <motion.div 
              key="cover"
              initial={{ y: 0 }}
              exit={{ y: '-100vh', opacity: 0, transition: { duration: 1.2, ease: [0.7, 0, 0.3, 1] } }}
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-8 overflow-hidden bg-cover bg-center"
              style={{
                backgroundImage: background ? `url(${background})` : undefined,
                backgroundColor: background ? 'transparent' : '#fdfbf7',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {background && <div className="absolute inset-0 bg-black/60" />}
              
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-white space-y-10 py-10">
                <div className="flex-1 flex flex-col items-center justify-center space-y-6 w-full mt-4">
                  {logo && (
                    <motion.img 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                      src={logo} alt="Event Logo" className="max-h-24 w-auto object-contain drop-shadow-xl" 
                    />
                  )}
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-4"
                  >
                    <p className="text-xs tracking-[0.4em] uppercase opacity-90 font-sans font-bold">K E P A D A   Y T H.</p>
                    <h2 className="text-4xl font-bold font-cursive capitalize text-[#fef3c7]">{guestName}</h2>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="w-full flex justify-center pb-8"
                >
                  <button
                    onClick={handleOpenInvitation}
                    className="px-8 py-3 bg-[var(--theme-primary)] text-white font-sans font-bold text-sm tracking-wider uppercase rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.5)] border border-white/30 hover:scale-105 hover:bg-[#fef3c7] hover:text-[var(--theme-primary)] hover:border-[var(--theme-primary)] transition-all duration-300 flex items-center gap-3 group"
                  >
                    Buka Undangan
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {backsound && (
          <>
            <audio ref={audioRef} src={backsound} loop />
            <button 
              onClick={toggleAudio}
              className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[var(--theme-secondary)] flex items-center justify-center text-[var(--theme-primary)] hover:scale-110 transition-transform"
            >
              {isPlaying ? <Music className="w-5 h-5 animate-pulse" /> : <VolumeX className="w-5 h-5 opacity-50" />}
            </button>
          </>
        )}
        
        {/* Background Image/Color */}
        {background && (
          <>
            <div 
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'top center' }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 w-full h-full bg-[#fdfbf7]/85 pointer-events-none" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-white/40 to-[#fcfbf9] pointer-events-none" />
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

          <div className={`px-6 flex-1 flex flex-col items-center space-y-10 ${heroImage ? '-mt-10' : 'pt-16'}`}>
            <motion.div
              initial={isPrint ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.3, duration: 1 }}
              className={`w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 ${!heroImage && 'mt-8'}`}
            >
              {logo && (
                <div className="flex justify-center mb-6">
                  <img src={logo} alt="Event Logo" className="max-h-24 w-auto object-contain drop-shadow-md" />
                </div>
              )}
              <h4 className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-4 font-sans font-semibold">You are invited to</h4>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 font-cursive text-[var(--theme-primary)]">
                {eventName}
              </h1>

              <div className="w-12 h-[2px] bg-[var(--theme-primary)] opacity-40 mx-auto my-6"></div>

              <p className="text-xs text-gray-500 mb-2 italic">Dear,</p>
              <h2 className="text-xl font-bold text-gray-800">
                Bapak/Ibu {guestName}
              </h2>
            </motion.div>

            {openingQuote && (
              <motion.div
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4, duration: 1 }}
                className="w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60"
              >
                <div 
                  className="text-sm text-gray-800 leading-relaxed ql-editor !p-0 font-serif"
                  dangerouslySetInnerHTML={{ 
                    __html: openingQuote
                  }}
                />
              </motion.div>
            )}

            <motion.div
              initial={isPrint ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <CountdownTimer targetDate={eventDate} />
            </motion.div>

            <motion.div 
              initial={isPrint ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.7, duration: 1 }}
              className="space-y-6 w-full bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60"
            >
              <div className="flex items-start space-x-4 text-gray-700 text-left w-full">
                <Calendar className="w-5 h-5 text-[var(--theme-primary)] opacity-90 mt-0.5 shrink-0" />
                <div className="flex-1 w-full">
                  <p className="text-[10px] uppercase tracking-widest text-[var(--theme-primary)] opacity-60 font-sans font-bold mb-1">Tanggal</p>
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
                  <div className="flex items-start space-x-4 text-gray-700 text-left w-full">
                    <MapPin className="w-5 h-5 text-[var(--theme-primary)] opacity-90 mt-0.5 shrink-0" />
                    <div className="flex-1 w-full min-w-0">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--theme-primary)] opacity-60 font-sans font-bold mb-1">Lokasi</p>
                      <span className="text-sm font-medium block leading-relaxed mb-4 break-words">{location}</span>
                      
                      {!isPrint && (
                        <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden shadow-inner border border-white/60 mt-4 relative">
                          <iframe 
                            className="absolute inset-0 w-full h-full border-0 z-0 opacity-90"  
                            loading="lazy" 
                            allowFullScreen 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                          <a href={mapsLink || `https://maps.google.com/?q=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs font-bold text-[var(--theme-primary)] shadow-md border border-[var(--theme-secondary)] hover:bg-[var(--theme-secondary)] transition-colors flex items-center gap-1 z-10">
                            Buka di Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {hasInvitationFile && eventSlug && !isPrint && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="w-full mt-6"
                    >
                      <a 
                        href={`/api/events/public/invitation/${eventSlug}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-[var(--theme-primary)] to-amber-700 text-white px-6 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all w-full"
                      >
                        <FileText className="w-5 h-5" />
                        Unduh Surat Undangan (PDF)
                      </a>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>

            {content && (
              <motion.div 
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.9, duration: 1 }}
                className="text-sm text-gray-800 leading-relaxed ql-editor !p-0 bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 w-full"
                dangerouslySetInnerHTML={{ __html: content.replace(/\{\{nama_tamu\}\}/g, `<span class="font-bold underline text-[var(--theme-primary)]">${guestName}</span>`) }}
              />
            )}

            {parsedGallery.length > 0 && (
              <motion.div
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 1.1, duration: 1 }}
                className="w-full mt-8"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="h-[1px] bg-[var(--theme-primary)] opacity-40 flex-1"></div>
                  <h3 className="px-4 text-xs tracking-[0.3em] uppercase text-gray-500 font-sans font-bold">Event Highlights</h3>
                  <div className="h-[1px] bg-[var(--theme-primary)] opacity-40 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {parsedGallery.map((img, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedImage(img)}
                      className="cursor-pointer aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white/60"
                    >
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {children && (
              <motion.div
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 1.3, duration: 1 }}
                className="w-full mt-8"
              >
                {children}
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
