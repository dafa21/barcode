import { useState, useEffect } from 'react';
import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle, MapPin, Calendar as CalendarIcon, Users, FileText, X, Music } from 'lucide-react';
import { DigitalInvitation } from './DigitalInvitation.tsx';

interface RSVPData {
  id: string;
  guestName: string;
  company: string | null;
  jobTitle?: string | null;
  customInvitationFile?: string | null;
  rsvpStatus: 'pending' | 'attending' | 'not_attending';
  paxCount: number;
  event: {
    id: string;
    eventName: string;
    eventDate: string;
    location: string | null;
    logo: string | null;
    twibbonBackground?: string | null;
    twibbonConfig?: string | null;
    backsound?: string | null;
    heroImage?: string | null;
    letterBackground?: string | null;
    letterContent?: string | null;
    gallery?: string | null;
    themePrimary?: string | null;
    themeSecondary?: string | null;
    openingQuote?: string | null;
    eventEndDate?: string | null;
    rundown?: string | null;
  };
};

const drawWrappedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  centerY: number,
  maxWidth: number,
  baseFontSize: number,
  fontFamily: string = "sans-serif",
  fontWeight: string = "bold"
) => {
  if (!text) return;
  ctx.save();
  ctx.textAlign = "center";
  
  let fontSize = baseFontSize;
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  
  const words = text.split(" ");
  
  const computeLines = (fSize: number) => {
    ctx.font = `${fontWeight} ${fSize}px ${fontFamily}`;
    const result: string[] = [];
    let curLine = "";
    for (const w of words) {
      const testLine = curLine ? `${curLine} ${w}` : w;
      if (ctx.measureText(testLine).width > maxWidth && curLine !== "") {
        result.push(curLine);
        curLine = w;
      } else {
        curLine = testLine;
      }
    }
    if (curLine) result.push(curLine);
    return result;
  };

  let lines = computeLines(fontSize);

  while (fontSize > 16 && (lines.length > 2 || lines.some(l => ctx.measureText(l).width > maxWidth))) {
    fontSize -= 2;
    lines = computeLines(fontSize);
  }

  const lineHeight = fontSize * 1.25;
  const startY = centerY - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, centerX, startY + i * lineHeight);
  });

  ctx.restore();
};

export function GuestRSVP() {
  const { barcodeUid } = useParams<{ barcodeUid: string }>();
  const [data, setData] = useState<RSVPData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [paxInput, setPaxInput] = useState<string>('1');
  const [generatedTwibbon, setGeneratedTwibbon] = useState<string | null>(null);
  const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);
  const [showDigitalInvitation, setShowDigitalInvitation] = useState(true);
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  const generateTwibbonImage = async (uid: string, name: string, eventData: RSVPData['event']) => {
    setIsGeneratingTwibbon(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const background = eventData.twibbonBackground || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop";
      let config = {
        logoX: 400 - 40,
        logoY: 40,
        logoSize: 80,
        qrX: 400 - 125,
        qrY: 290,
        qrSize: 250,
        eventNameY: 150,
        badgeY: 210,
        guestNameY: 600,
        guestLabelY: 640,
      };
      
      if (eventData.twibbonConfig) {
        try {
          config = { ...config, ...JSON.parse(eventData.twibbonConfig) };
        } catch(e) {}
      }

      const bgImg = new Image();
      if (background.startsWith("http")) { bgImg.crossOrigin = "anonymous"; }
      bgImg.src = background;
      await new Promise((resolve, reject) => { bgImg.onload = resolve; bgImg.onerror = reject; });
      
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(17,24,39,0.2)");
      gradient.addColorStop(0.5, "rgba(17,24,39,0.5)");
      gradient.addColorStop(1, "rgba(17,24,39,0.85)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const logoSrc = eventData.logo || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";
      const logoImg = new Image();
      if (logoSrc.startsWith("http")) { logoImg.crossOrigin = "anonymous"; }
      logoImg.src = logoSrc;
      await new Promise((resolve) => { logoImg.onload = resolve; logoImg.onerror = resolve; });
      
      const { logoX, logoY, logoSize } = config;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.roundRect(logoX - 8, logoY - 8, logoSize + 16, logoSize + 16, 24);
      ctx.fill();
      
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(logoX, logoY, logoSize, logoSize, 16);
      ctx.clip();
      
      const lRatio = logoImg.width / logoImg.height;
      let lSWidth, lSHeight, lSx, lSy;
      if (lRatio > 1) {
        lSHeight = logoImg.height;
        lSWidth = logoImg.height;
        lSy = 0;
        lSx = (logoImg.width - lSWidth) / 2;
      } else {
        lSWidth = logoImg.width;
        lSHeight = logoImg.width;
        lSx = 0;
        lSy = (logoImg.height - lSHeight) / 2;
      }
      ctx.drawImage(logoImg, lSx, lSy, lSWidth, lSHeight, logoX, logoY, logoSize, logoSize);
      ctx.restore();

      ctx.fillStyle = "white";
      drawWrappedText(ctx, (eventData.eventName || "Event").toUpperCase(), canvas.width / 2, config.eventNameY, 680, 26);

      const badgeText = "OFFICIAL INVITATION";
      ctx.save();
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const badgeWidth = ctx.measureText(badgeText).width + 44;
      const computedBadgeY = Math.max(config.badgeY, config.eventNameY + 50);
      ctx.fillStyle = "#FDB931";
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - badgeWidth / 2, computedBadgeY, badgeWidth, 38, 19);
      ctx.fill();
      ctx.fillStyle = "#5C4000";
      ctx.fillText(badgeText, canvas.width / 2, computedBadgeY + 19);
      ctx.restore();

      const computedQrY = Math.max(config.qrY, computedBadgeY + 55);
      const qrDataUrl = await QRCode.toDataURL(uid, {
        width: config.qrSize,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" }
      });
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => { qrImg.onload = resolve; });
      const { qrX, qrSize } = config;
      
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.roundRect(qrX - 20, computedQrY - 20, qrSize + 40, qrSize + 40, 32);
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fill();
      ctx.shadowColor = "transparent";
      
      ctx.drawImage(qrImg, qrX, computedQrY, qrSize, qrSize);

      const computedGuestNameY = Math.max(config.guestNameY, computedQrY + qrSize + 55);
      ctx.fillStyle = "white";
      drawWrappedText(ctx, name, canvas.width / 2, computedGuestNameY, 700, 42);

      const computedGuestLabelY = Math.max(config.guestLabelY, computedGuestNameY + 45);
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 20px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.fillText("GUEST IDENTITY", canvas.width / 2, computedGuestLabelY);
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/png");
      setGeneratedTwibbon(dataUrl);
    } catch (error) {
      console.error("Twibbon generation failed:", error);
    } finally {
      setIsGeneratingTwibbon(false);
    }
  };
  const pax = parseInt(paxInput) || 1;
  const [additionalGuests, setAdditionalGuests] = useState<{guestName: string, phone: string, jobTitle: string}[]>([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (pax > 1) {
      setAdditionalGuests(prev => {
        const needed = pax - 1;
        const copy = [...prev];
        while (copy.length < needed) copy.push({ guestName: '', phone: '', jobTitle: '' });
        while (copy.length > needed) copy.pop();
        return copy;
      });
    } else {
      setAdditionalGuests([]);
    }
  }, [pax]);

  useEffect(() => {
    const fetchRSVP = async () => {
      try {
        const res = await fetch(`/api/guests/rsvp/${barcodeUid}`);
        if (res.ok) {
          const guestData = await res.json();
          setData(guestData);
          setPaxInput(String(guestData.paxCount || 1));
          if (guestData.rsvpStatus !== 'pending') {
            setSuccess(true);
            if (guestData.rsvpStatus === 'attending' && barcodeUid) {
              generateTwibbonImage(barcodeUid, guestData.guestName, guestData.event);
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRSVP();
  }, [barcodeUid]);

  const handleSubmit = async (status: 'attending' | 'not_attending') => {
    setFormError('');
    if (status === 'attending' && pax > 1) {
      for (let i = 0; i < additionalGuests.length; i++) {
        const ag = additionalGuests[i];
        if (!ag.guestName.trim() || !ag.phone.trim()) {
          setFormError('Mohon isi Nama dan Nomor WhatsApp untuk semua tamu tambahan.');
          return;
        }
      }
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/guests/rsvp/${barcodeUid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rsvpStatus: status, 
          paxCount: pax,
          additionalGuests: status === 'attending' ? additionalGuests : [] 
        })
      });
      
      if (res.ok) {
        setData(prev => prev ? { ...prev, rsvpStatus: status, paxCount: pax } : null);
        setSuccess(true);
        if (status === 'attending' && barcodeUid && data) {
          generateTwibbonImage(barcodeUid, data.guestName, data.event);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Invitation not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center w-full overflow-x-hidden" style={{ "--theme-primary": data.event.themePrimary || "#b45309", "--theme-secondary": data.event.themeSecondary || "#fef3c7" } as React.CSSProperties}>
      <DigitalInvitation
        eventName={data.event.eventName}
        eventDate={data.event.eventDate}
        location={data.event.location}
        guestName={data.guestName}
        company={data.company}
        jobTitle={data.jobTitle}
        heroImage={data.event.heroImage || null}
        logo={data.event.logo || null}
        background={data.event.letterBackground || null}
        content={data.event.letterContent || ''}
        backsound={data.event.backsound || null}
        gallery={data.event.gallery || '[]'}
        openingQuote={data.event.openingQuote || null}
        eventEndDate={data.event.eventEndDate || null}
        rundown={data.event.rundown || null}
        themePrimary={data.event.themePrimary}
        themeSecondary={data.event.themeSecondary}
        isPreview={false}
        eventSlug={data.event.eventName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
        hasInvitationFile={true}
        customInvitationFileUrl={data.customInvitationFile ? `/api/guests/public/invitation/${barcodeUid}` : undefined}
      >
        {rsvpContent}
      </DigitalInvitation>
    </div>
  );
}
