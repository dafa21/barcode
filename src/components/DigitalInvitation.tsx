
import React, { useEffect, useRef, useState } from 'react';
import { Calendar, MapPin, X, Music, VolumeX, FileText, Clock, Globe, Youtube, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  eventName: string;
  eventDate: string;
  location: string | null;
  mapsLink?: string | null;
  guestName: string;
  company?: string | null;
  jobTitle?: string | null;
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
  customInvitationFileUrl?: string;
  openingQuote?: string | null;
  eventEndDate?: string | null;
  rundown?: string | null;
  socialWebsite?: string | null;
  socialYoutube?: string | null;
  socialInstagram?: string | null;
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

const FloralCornerTL = ({ className = "" }: { className?: string }) => (
  <svg className={`w-20 h-20 absolute -top-1 -left-1 text-[var(--theme-primary)] opacity-25 pointer-events-none ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M0,0 Q50,10 70,40 Q40,40 20,20 Q10,50 0,100 Z" opacity="0.5" />
    <path d="M10,0 C30,15 50,30 65,65 C40,55 25,35 0,10 Z" />
    <circle cx="25" cy="25" r="4" />
    <circle cx="45" cy="15" r="3" />
    <circle cx="15" cy="45" r="3" />
  </svg>
);

const FloralCornerTR = ({ className = "" }: { className?: string }) => (
  <svg className={`w-20 h-20 absolute -top-1 -right-1 text-[var(--theme-primary)] opacity-25 pointer-events-none transform scale-x-[-1] ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M0,0 Q50,10 70,40 Q40,40 20,20 Q10,50 0,100 Z" opacity="0.5" />
    <path d="M10,0 C30,15 50,30 65,65 C40,55 25,35 0,10 Z" />
    <circle cx="25" cy="25" r="4" />
    <circle cx="45" cy="15" r="3" />
    <circle cx="15" cy="45" r="3" />
  </svg>
);

const FloralCornerBL = ({ className = "" }: { className?: string }) => (
  <svg className={`w-20 h-20 absolute -bottom-1 -left-1 text-[var(--theme-primary)] opacity-25 pointer-events-none transform scale-y-[-1] ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M0,0 Q50,10 70,40 Q40,40 20,20 Q10,50 0,100 Z" opacity="0.5" />
    <path d="M10,0 C30,15 50,30 65,65 C40,55 25,35 0,10 Z" />
    <circle cx="25" cy="25" r="4" />
    <circle cx="45" cy="15" r="3" />
    <circle cx="15" cy="45" r="3" />
  </svg>
);

const FloralCornerBR = ({ className = "" }: { className?: string }) => (
  <svg className={`w-20 h-20 absolute -bottom-1 -right-1 text-[var(--theme-primary)] opacity-25 pointer-events-none transform scale-[-1] ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M0,0 Q50,10 70,40 Q40,40 20,20 Q10,50 0,100 Z" opacity="0.5" />
    <path d="M10,0 C30,15 50,30 65,65 C40,55 25,35 0,10 Z" />
    <circle cx="25" cy="25" r="4" />
    <circle cx="45" cy="15" r="3" />
    <circle cx="15" cy="45" r="3" />
  </svg>
);

const FloralRosePattern = ({ className = "" }: { className?: string }) => (
  <svg className={`w-28 h-28 absolute text-[var(--theme-primary)] opacity-20 pointer-events-none ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <circle cx="50" cy="50" r="14" opacity="0.3" />
    <path d="M50,20 C65,20 70,35 50,50 C30,35 35,20 50,20 Z" />
    <path d="M20,50 C20,35 35,30 50,50 C35,70 20,65 20,50 Z" />
    <path d="M50,80 C35,80 30,65 50,50 C70,65 65,80 50,80 Z" />
    <path d="M80,50 C80,65 65,70 50,50 C65,30 80,35 80,50 Z" />
  </svg>
);

const FloralLeafPattern = ({ className = "" }: { className?: string }) => (
  <svg className={`w-28 h-28 absolute text-[var(--theme-primary)] opacity-20 pointer-events-none ${className}`} viewBox="0 0 100 100" fill="currentColor">
    <path d="M10,90 Q50,80 90,10 C70,30 60,60 10,90 Z" />
    <path d="M10,90 Q30,70 10,50 C30,60 50,70 10,90 Z" opacity="0.6" />
    <path d="M10,90 Q50,70 50,40 C60,55 70,70 10,90 Z" opacity="0.6" />
  </svg>
);

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
  company,
  jobTitle,
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
  customInvitationFileUrl,
  logo,
  openingQuote,
  eventEndDate,
  rundown,
  socialWebsite,
  socialYoutube,
  socialInstagram,
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
                      src={logo} alt="Event Logo" className="max-h-48 md:max-h-56 max-w-[90%] object-contain drop-shadow-2xl bg-white/20 backdrop-blur-md p-4 rounded-3xl border border-white/30" 
                    />
                  )}
                  
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-4 px-4 text-center"
                  >
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-amber-200/90 font-sans font-semibold">
                        KAMI MENGUNDANG DENGAN HORMAT
                      </p>
                      <p className="text-xs sm:text-sm text-white/90 font-serif italic mt-1">
                        Yth. Bapak/Ibu/Saudara/i
                      </p>
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-cursive capitalize text-[#fef3c7] drop-shadow-md my-1">
                        {guestName}
                      </h2>
                      {(jobTitle || company) && (
                        <p className="text-xs sm:text-sm text-white/95 font-sans font-medium tracking-wide bg-black/30 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/20 mt-1 shadow-lg">
                          {jobTitle}{jobTitle && company ? ' • ' : ''}{company}
                        </p>
                      )}
                    </div>
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
              className={`relative overflow-hidden w-full bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 ${!heroImage && 'mt-8'}`}
            >
              <FloralCornerTL />
              <FloralCornerBR />
              {logo && (
                <div className="flex justify-center mb-6">
                  <img src={logo} alt="Event Logo" className="max-h-24 w-auto object-contain drop-shadow-md" />
                </div>
              )}
              <div className="flex flex-col items-center justify-center">
                <p className="text-[13px] font-semibold text-[var(--theme-primary)] mb-3 font-serif">
                  Assalamu'alaikum Warahmatullahi Wabarakatuh
                </p>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-6 px-2 md:px-6">
                  Dengan memohon rahmat dan ridho Allah SWT, kami dari <strong>LAZNAS Dewan Da'wah</strong> dengan hormat bermaksud mengundang Bapak/Ibu untuk hadir pada acara:
                </p>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight mb-4 font-cursive text-[var(--theme-primary)]">
                {eventName}
              </h1>

              <div className="w-12 h-[2px] bg-[var(--theme-primary)] opacity-40 mx-auto my-6"></div>

              <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 font-bold">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
              <h2 className="text-2xl font-bold text-gray-900 font-serif">
                {guestName}
              </h2>
              {(jobTitle || company) && (
                <p className="text-sm font-semibold text-indigo-900 mt-1 font-sans">
                  {jobTitle}{jobTitle && company ? ' - ' : ''}{company}
                </p>
              )}
              <p className="text-[9px] text-gray-400 mt-2 italic">*Mohon maaf apabila terdapat kesalahan penulisan nama/gelar</p>
              
              {children && (
                <div className="mt-6 w-full flex justify-center">
                  <button 
                    onClick={() => {
                      document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 bg-[var(--theme-primary)] text-white px-6 py-2.5 rounded-full font-sans font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[var(--theme-primary)] hover:brightness-90 hover:scale-105 transition-all"
                  >
                    Reservasi Kehadiran
                  </button>
                </div>
              )}
            </motion.div>

            {openingQuote && (
              <motion.div
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 0.4, duration: 1 }}
                className="relative overflow-hidden w-full bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60"
              >
                <FloralRosePattern className="top-0 right-0" />
                <FloralRosePattern className="bottom-0 left-0 rotate-180" />
                <div 
                  className="text-sm text-gray-800 leading-relaxed ql-editor !p-0 font-serif"
                  dangerouslySetInnerHTML={{ 
                    __html: openingQuote.replaceAll('&nbsp;', ' ')
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
              className="relative overflow-hidden space-y-6 w-full bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/80"
            >
              <FloralLeafPattern className="top-0 left-0 -translate-x-2 -translate-y-2" />
              <FloralLeafPattern className="bottom-0 right-0 translate-x-2 translate-y-2 rotate-180" />
              {/* Tanggal */}
              <div className="flex items-start space-x-4 text-gray-800 text-left w-full">
                <div className="w-10 h-10 rounded-2xl bg-[var(--theme-secondary)] flex items-center justify-center shrink-0 border border-[var(--theme-primary)]/20 shadow-sm">
                  <Calendar className="w-5 h-5 text-[var(--theme-primary)]" />
                </div>
                <div className="flex-1 w-full">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--theme-primary)] font-sans font-bold mb-1">HARI & TANGGAL</p>
                  <span className="text-base font-bold text-gray-900 block font-serif">
                    {new Date(eventDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>

              <div className="w-full h-[1px] bg-gray-100/80"></div>

              {/* Waktu */}
              <div className="flex items-start space-x-4 text-gray-800 text-left w-full">
                <div className="w-10 h-10 rounded-2xl bg-[var(--theme-secondary)] flex items-center justify-center shrink-0 border border-[var(--theme-primary)]/20 shadow-sm">
                  <Clock className="w-5 h-5 text-[var(--theme-primary)]" />
                </div>
                <div className="flex-1 w-full">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--theme-primary)] font-sans font-bold mb-1">WAKTU ACARA</p>
                  <span className="text-sm font-bold text-gray-900 block font-sans">
                    {eventEndDate ? (
                      `Pukul ${new Date(eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(eventEndDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })} WIB`
                    ) : (
                      `Pukul ${new Date(eventDate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })} WIB - Selesai`
                    )}
                  </span>
                </div>
              </div>
              
              {location && (
                <>
                  <div className="w-full h-[1px] bg-gray-100/80"></div>
                  <div className="flex items-start space-x-4 text-gray-800 text-left w-full">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--theme-secondary)] flex items-center justify-center shrink-0 border border-[var(--theme-primary)]/20 shadow-sm">
                      <MapPin className="w-5 h-5 text-[var(--theme-primary)]" />
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--theme-primary)] font-sans font-bold mb-1">LOKASI ACARA</p>
                      <span className="text-sm font-bold text-gray-900 block leading-relaxed mb-4 break-words font-sans">{location}</span>
                      
                      {!isPrint && (
                        <div className="w-full h-48 md:h-56 rounded-2xl overflow-hidden shadow-inner border border-white/60 mt-4 relative">
                          <iframe 
                            className="absolute inset-0 w-full h-full border-0 z-0 opacity-90"  
                            loading="lazy" 
                            allowFullScreen 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                          ></iframe>
                          <a href={mapsLink || `https://maps.google.com/?q=${encodeURIComponent(location)}`} target="_blank" rel="noopener noreferrer" className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-[var(--theme-primary)] shadow-lg border border-[var(--theme-secondary)] hover:bg-[var(--theme-secondary)] transition-all flex items-center gap-1.5 z-10">
                            <MapPin className="w-3.5 h-3.5" />
                            Buka di Maps
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {(customInvitationFileUrl || (hasInvitationFile && eventSlug)) && !isPrint && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="w-full mt-6"
                    >
                      <a 
                        href={customInvitationFileUrl ? customInvitationFileUrl : `/api/events/public/invitation/${eventSlug}`}
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
                className="relative overflow-hidden text-sm text-gray-800 leading-relaxed ql-editor !p-0 bg-white/85 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/60 w-full"
              >
                <FloralCornerTR />
                <FloralCornerBL />
                <div dangerouslySetInnerHTML={{ __html: content.replaceAll('&nbsp;', ' ').replace(/\{\{nama_tamu\}\}/g, `<span class="font-bold underline text-[var(--theme-primary)]">${guestName}</span>`) }} />
              </motion.div>
            )}

            {rundown && (
              <motion.div 
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 1.0, duration: 1 }}
                className="w-full mt-6"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="h-[1px] bg-[var(--theme-primary)] opacity-40 flex-1"></div>
                  <h3 className="px-4 text-xs tracking-[0.3em] uppercase text-gray-500 font-sans font-bold">Rundown Acara</h3>
                  <div className="h-[1px] bg-[var(--theme-primary)] opacity-40 flex-1"></div>
                </div>
                <div className="relative overflow-hidden bg-white/85 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/60 w-full">
                  <FloralRosePattern className="top-0 left-0 scale-75" />
                  <FloralRosePattern className="bottom-0 right-0 scale-75 rotate-180" />
                  {rundown.startsWith('data:image/') || rundown.startsWith('http://') || rundown.startsWith('https://') ? (
                    <div className="flex justify-center">
                      <img 
                        src={rundown} 
                        alt="Rundown Acara" 
                        className="w-full h-auto rounded-2xl shadow-md border border-white/60 cursor-pointer hover:scale-[1.02] transition-transform duration-300"
                        onClick={() => setSelectedImage(rundown)}
                      />
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto custom-scrollbar">
                      <div 
                        className="text-sm text-gray-800 leading-relaxed ql-editor !p-0 min-w-full"
                        dangerouslySetInnerHTML={{ __html: rundown.replaceAll('&nbsp;', ' ') }}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
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

            {(socialWebsite || socialYoutube || socialInstagram) && (
              <motion.div
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 1.4, duration: 1 }}
                className="w-full mt-8 flex flex-col items-center justify-center gap-4"
              >
                <div className="flex items-center justify-center w-full max-w-[200px] mb-2 opacity-50">
                  <div className="h-[1px] bg-[var(--theme-primary)] flex-1"></div>
                  <div className="px-3 text-[10px] tracking-[0.2em] uppercase text-[var(--theme-primary)] font-bold">Connect</div>
                  <div className="h-[1px] bg-[var(--theme-primary)] flex-1"></div>
                </div>
                <div className="flex justify-center gap-4">
                  {socialWebsite && (
                    <a href={socialWebsite} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/50 backdrop-blur-sm rounded-full text-[var(--theme-primary)] shadow-sm border border-[var(--theme-secondary)] hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                  {socialYoutube && (
                    <a href={socialYoutube} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/50 backdrop-blur-sm rounded-full text-[var(--theme-primary)] shadow-sm border border-[var(--theme-secondary)] hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                      <Youtube className="w-5 h-5" />
                    </a>
                  )}
                  {socialInstagram && (
                    <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/50 backdrop-blur-sm rounded-full text-[var(--theme-primary)] shadow-sm border border-[var(--theme-secondary)] hover:bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}

            {children && (
              <motion.div
                id="rsvp-section"
                initial={isPrint ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: 1.3, duration: 1 }}
                className="w-full mt-8 scroll-mt-10"
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
