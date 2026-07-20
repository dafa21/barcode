import React from "react";
import { useState, useEffect, useRef } from 'react';
import { User, Event, Guest } from '../types.ts';
import { Calendar, Plus, Edit, Trash2, Users, MapPin, Search, QrCode, BarChart2, LayoutList, Activity, Download, MessageCircle, X, UserPlus, Printer, Crown, Upload, FileText, Menu, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnalyticsDashboard } from './AnalyticsDashboard.tsx';
import { TwibbonConfigurator } from "./TwibbonConfigurator.tsx";
import { QRCodeSVG } from 'qrcode.react';
import ReactQuill from 'react-quill-new';
import { DigitalInvitation } from './DigitalInvitation.tsx';
import 'react-quill-new/dist/quill.snow.css';

const getBaseUrl = () => {
  const origin = window.location.origin;
  if (origin.includes('aistudio.google.com') || origin.includes('ais-dev-')) {
    return 'https://ais-pre-zf5i2wwg3sbzzeqtrus6hh-702811290214.asia-east1.run.app';
  }
  return origin;
};

const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > height && width > maxDim) {
          height *= maxDim / width;
          width = maxDim;
        } else if (height > maxDim) {
          width *= maxDim / height;
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(reader.result as string);
        }
      };
      img.onerror = () => resolve(reader.result as string);
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export function OfficeAdminDashboard({ user }: { user: User }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'guests' | 'analytics' | 'pics'>('events');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [selectedGuestDetail, setSelectedGuestDetail] = useState<Guest | null>(null);

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isTwibbonConfigOpen, setIsTwibbonConfigOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  
  const [newEventName, setNewEventName] = useState('');
  const [newEventDate, setNewEventDate] = useState('');
  const [newEventLogo, setNewEventLogo] = useState<string | undefined>(undefined);
  const [newEventInvitationFile, setNewEventInvitationFile] = useState<string | null>(null);
  const [newEventLetterBackground, setNewEventLetterBackground] = useState<string | null>(null);
  const [newEventLetterSize, setNewEventLetterSize] = useState<'A4' | 'LETTER'>('A4');
  const [newEventLetterContent, setNewEventLetterContent] = useState('');
  const [newEventOpeningQuote, setNewEventOpeningQuote] = useState('');
  const [newEventEndDate, setNewEventEndDate] = useState('');
  const [newEventRundown, setNewEventRundown] = useState('');
  const [newEventHeroImage, setNewEventHeroImage] = useState<string | null>(null);
  const [newEventBacksound, setNewEventBacksound] = useState<string | null>(null);
  const [newEventGallery, setNewEventGallery] = useState<string[]>([]);
  const [newEventThemePrimary, setNewEventThemePrimary] = useState('#b45309');
  const [newEventThemeSecondary, setNewEventThemeSecondary] = useState('#fef3c7');
  const [printingGuest, setPrintingGuest] = useState<any | null>(null);
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventMapsLink, setNewEventMapsLink] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestCompany, setNewGuestCompany] = useState('');
  const [newGuestJobTitle, setNewGuestJobTitle] = useState('');
  const [newGuestPicId, setNewGuestPicId] = useState('');
  const [newGuestIsVip, setNewGuestIsVip] = useState(false);
  const [pics, setPics] = useState<User[]>([]);
  const [newPicName, setNewPicName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'attending' | 'pending' | 'not_attending' | 'checked_in'>('all');
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [generatedBarcode, setGeneratedBarcode] = useState<{uid: string, name: string} | null>(null);
  const [generatedTwibbon, setGeneratedTwibbon] = useState<string | null>(null);
  const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);

  useEffect(() => {
    if (generatedBarcode) {
      generateTwibbonImage(generatedBarcode.uid, generatedBarcode.name);
    } else {
      setGeneratedTwibbon(null);
    }
  }, [generatedBarcode, selectedEvent]);

  const generateTwibbonImage = async (uid: string, name: string) => {
    setIsGeneratingTwibbon(true);
    try {
      const QRCode = (await import("qrcode")).default;
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const background = selectedEvent?.twibbonBackground || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop";
      let config = {
        logoX: 400 - 60,
        logoY: 80,
        logoSize: 120,
        qrX: 400 - 200,
        qrY: 600 - 200 + 50,
        qrSize: 400,
        eventNameY: 80 + 120 + 60,
        badgeY: 80 + 120 + 90,
        guestNameY: 450 + 400 + 100,
        guestLabelY: 450 + 400 + 140,
      };
      
      if (selectedEvent?.twibbonConfig) {
        try {
          config = { ...config, ...JSON.parse(selectedEvent.twibbonConfig) };
        } catch(e) {}
      }

      const bgImg = new Image();
      if (background.startsWith("http")) { bgImg.crossOrigin = "anonymous"; }
      bgImg.src = background;
      await new Promise((resolve, reject) => { bgImg.onload = resolve; bgImg.onerror = reject; });
          const imgRatio = bgImg.width / bgImg.height;
    const canvasRatio = canvas.width / canvas.height;
    let sWidth, sHeight, sx, sy;

    if (imgRatio > canvasRatio) {
      sHeight = bgImg.height;
      sWidth = bgImg.height * canvasRatio;
      sy = 0;
      sx = (bgImg.width - sWidth) / 2;
    } else {
      sWidth = bgImg.width;
      sHeight = bgImg.width / canvasRatio;
      sx = 0;
      sy = (bgImg.height - sHeight) / 2;
    }
    ctx.drawImage(bgImg, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(17,24,39,0.2)");
      gradient.addColorStop(1, "rgba(17,24,39,0.9)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const logoSrc = selectedEvent?.logo || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";
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

      ctx.font = "bold 40px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText((selectedEvent?.eventName || "Event").toUpperCase(), canvas.width / 2, config.eventNameY);

      const badgeText = "OFFICIAL INVITATION";
      ctx.font = "bold 20px sans-serif";
      const badgeWidth = ctx.measureText(badgeText).width + 40;
      ctx.fillStyle = "#FDB931";
      ctx.beginPath();
      ctx.roundRect(canvas.width / 2 - badgeWidth / 2, config.badgeY, badgeWidth, 40, 20);
      ctx.fill();
      ctx.fillStyle = "#5C4000";
      ctx.fillText(badgeText, canvas.width / 2, config.badgeY + 28);

      const qrDataUrl = await QRCode.toDataURL(uid, {
        width: config.qrSize,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" }
      });
      const qrImg = new Image();
      qrImg.src = qrDataUrl;
      await new Promise((resolve) => { qrImg.onload = resolve; });

      const { qrX, qrY, qrSize } = config;
      
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 32);
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fill();
      ctx.shadowColor = "transparent";
      
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

      ctx.font = "bold 56px sans-serif";
      ctx.fillStyle = "white";
      ctx.fillText(name, canvas.width / 2, config.guestNameY);

      ctx.font = "600 24px sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("GUEST IDENTITY", canvas.width / 2, config.guestLabelY);

      const dataUrl = canvas.toDataURL("image/png");
      setGeneratedTwibbon(dataUrl);
      return dataUrl;
    } catch (error) {
      console.error("Twibbon generation failed:", error);
      return null;
    } finally {
      setIsGeneratingTwibbon(false);
    }
  };
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedGuestIds, setSelectedGuestIds] = useState<string[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedEvent) {
      interval = setInterval(() => {
        fetchGuests(selectedEvent.id);
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedEvent]);

  useEffect(() => { fetchPics(); }, []);

  const fetchPics = async () => {
    try {
      const res = await fetch('/api/pics', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setPics(await res.json());
      }
    } catch (e) {}
  };

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
    } finally {
      setLoading(false);
    }
  };

  const fetchGuests = async (eventId: string) => {
    try {
      const res = await fetch(`/api/guests/event/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setGuests(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleManualCheckIn = async (barcodeUid: string) => {
    if (!selectedEvent) return;
    try {
      const res = await fetch('/api/scanner/scan', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ barcodeUid, eventId: selectedEvent.id })
      });
      if (res.ok) {
        fetchGuests(selectedEvent.id);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to check in manually');
      }
    } catch (err) {
      console.error(err);
      alert('Network error during manual check-in');
    }
  };

  const handleSaveTwibbonConfig = async (bg: string, config: string) => {
    if (!selectedEvent) return;
    try {
      const res = await fetch(`/api/events/${selectedEvent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          ...selectedEvent,
          twibbonBackground: bg,
          twibbonConfig: config
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedEvent({ ...selectedEvent, twibbonBackground: updated.twibbonBackground, twibbonConfig: updated.twibbonConfig });
        setIsTwibbonConfigOpen(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEventId) return;
    try {
      const res = await fetch(`/api/events/${editingEventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ 
          eventName: newEventName, 
          eventDate: new Date(newEventDate).toISOString(),
          location: newEventLocation,
          mapsLink: newEventMapsLink,
          logo: newEventLogo,
          invitationFile: newEventInvitationFile,
          letterBackground: newEventLetterBackground,
          letterSize: newEventLetterSize,
          letterContent: newEventLetterContent,
          openingQuote: newEventOpeningQuote,
          eventEndDate: newEventEndDate ? new Date(newEventEndDate).toISOString() : null,
          rundown: newEventRundown,
          heroImage: newEventHeroImage,
          backsound: newEventBacksound,
          gallery: JSON.stringify(newEventGallery),
          themePrimary: newEventThemePrimary,
          themeSecondary: newEventThemeSecondary
        })
      });
      if (res.ok) {
        setIsEditEventModalOpen(false);
        setEditingEventId(null);
        setNewEventName("");
        setNewEventDate("");
        setNewEventLocation("");
        setNewEventMapsLink("");
        setNewEventLogo(undefined);
        setNewEventInvitationFile(null);
        setNewEventLetterBackground(null);
        setNewEventLetterSize('A4');
        setNewEventLetterContent('');
        setNewEventOpeningQuote('');
        setNewEventEndDate('');
        setNewEventRundown('');
        setNewEventHeroImage(null);
        setNewEventBacksound(null);
        setNewEventGallery([]);
      setNewEventThemePrimary('#b45309');
      setNewEventThemeSecondary('#fef3c7');
        fetchEvents();
        if (selectedEvent?.id === editingEventId) {
          setSelectedEvent({ ...selectedEvent, eventName: newEventName, eventDate: new Date(newEventDate).toISOString(), eventEndDate: newEventEndDate ? new Date(newEventEndDate).toISOString() : undefined, location: newEventLocation, mapsLink: newEventMapsLink, logo: newEventLogo, invitationFile: newEventInvitationFile, letterBackground: newEventLetterBackground, letterSize: newEventLetterSize, letterContent: newEventLetterContent, openingQuote: newEventOpeningQuote, rundown: newEventRundown });
        }
      } else {
        alert("Gagal memperbarui acara. File mungkin terlalu besar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Gagal menghubungi server."));
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? This will also delete all guests and attendances associated with it.")) return;
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      if (res.ok) {
        fetchEvents();
        if (selectedEvent?.id === id) {
          setSelectedEvent(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          eventName: newEventName, 
          eventDate: new Date(newEventDate).toISOString(),
          location: newEventLocation, 
          mapsLink: newEventMapsLink,
          logo: newEventLogo,
          invitationFile: newEventInvitationFile,
          letterBackground: newEventLetterBackground,
          letterSize: newEventLetterSize,
          letterContent: newEventLetterContent,
          openingQuote: newEventOpeningQuote,
          eventEndDate: newEventEndDate ? new Date(newEventEndDate).toISOString() : null,
          rundown: newEventRundown,
          heroImage: newEventHeroImage,
          backsound: newEventBacksound,
          gallery: JSON.stringify(newEventGallery),
          themePrimary: newEventThemePrimary,
          themeSecondary: newEventThemeSecondary
        })
      });
      if (res.ok) {
        setShowNewEvent(false);
        setNewEventName('');
        setNewEventDate('');
        setNewEventLocation('');
        setNewEventLogo(undefined);
        setNewEventLetterBackground(null);
        setNewEventLetterSize('A4');
        setNewEventLetterContent('');
        setNewEventOpeningQuote('');
        setNewEventHeroImage(null);
        setNewEventBacksound(null);
        setNewEventGallery([]);
      setNewEventThemePrimary('#b45309');
      setNewEventThemeSecondary('#fef3c7');
        fetchEvents();
      } else {
        alert("Gagal membuat acara. File mungkin terlalu besar.");
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Gagal menghubungi server."));
    }
  };

  const handleAddPic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/pics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name: newPicName })
      });
      if (res.ok) {
        setNewPicName('');
        fetchPics();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    try {
      const res = await fetch('/api/guests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          eventId: selectedEvent.id,
          guestName: newGuestName,
          email: newGuestEmail,
          phone: newGuestPhone,
          company: newGuestCompany,
          jobTitle: newGuestJobTitle,
          picId: newGuestPicId || undefined,
          isVip: newGuestIsVip
        })
      });
      if (res.ok) {
        const guestData = await res.json();
        setNewGuestName('');
        setNewGuestEmail('');
        setNewGuestPhone('');
        setNewGuestCompany('');
        setNewGuestJobTitle('');
        setNewGuestPicId('');
        setNewGuestIsVip(false);
        fetchGuests(selectedEvent.id);
        setGeneratedBarcode({ uid: guestData.barcodeUid, name: guestData.guestName });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrintBarcode = async (uid: string, name: string) => {
    // Generate twibbon if not already generated for this user
    let imageUrl = generatedTwibbon;
    if (!generatedBarcode || generatedBarcode.uid !== uid) {
      imageUrl = await generateTwibbonImage(uid, name);
    }
    
    if (!imageUrl) return;

    // Use a hidden iframe to print
    let iframe = document.getElementById('print-iframe') as HTMLIFrameElement;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = 'print-iframe';
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);
    }

    const iframeDoc = iframe.contentWindow?.document || iframe.contentDocument;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>Print ID Card</title>
          <style>
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: white;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              @page { margin: 0; size: auto; }
              body { background: white; display: block; height: auto; }
              img { max-height: none; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" />
          <script>
            window.onload = () => {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    iframeDoc.close();
  };

  const selectEvent = (event: Event) => {
    setSelectedEvent(event);
    fetchGuests(event.id);
    setSelectedGuestIds([]);
  };

  const handleBulkSendInvitations = () => {
    if (!selectedEvent) return;
    
    guests
      .filter(g => selectedGuestIds.includes(g.id) && g.phone)
      .forEach(guest => {
        const phoneStr = guest.phone!.replace(/[^0-9]/g, '');
        const formattedPhone = phoneStr.startsWith('0') ? '62' + phoneStr.slice(1) : phoneStr;
        
        if (guest.rsvpStatus === 'attending') {
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${guest.barcodeUid}`;
          const message = `Yth. Bapak/Ibu ${guest.guestName},\n\nTerima kasih atas konfirmasi kehadiran Bapak/Ibu pada acara *${selectedEvent.eventName}*.\n\nUntuk kemudahan proses registrasi dan akses masuk di lokasi, mohon berkenan menunjukkan QR Code pada tautan di bawah ini atau menyebutkan Kode Kehadiran kepada petugas kami:\n\n🔗 Tautan QR Code: ${qrUrl}\n📝 Kode UID: *${guest.barcodeUid}*\n\nKami menantikan kehadiran Bapak/Ibu.\n\nHormat kami,\nPanitia Acara`;
          window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
        } else {
          const rsvpUrl = `${getBaseUrl()}/rsvp/${guest.barcodeUid}`;
          const message = `Yth. Bapak/Ibu ${guest.guestName},\n\nKami dengan hormat mengundang Bapak/Ibu untuk hadir pada acara *${selectedEvent.eventName}* yang akan diselenggarakan pada:\n\nWaktu: ${new Date(selectedEvent.eventDate).toLocaleString()}\nLokasi: ${selectedEvent.location || 'Akan diinformasikan'}\n\nMohon berkenan untuk memberikan konfirmasi kehadiran Bapak/Ibu melalui tautan berikut:\n🔗 ${rsvpUrl}\n\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran, kami akan mengirimkan tiket barcode akses masuk secara otomatis.\n\nKehadiran Bapak/Ibu sangat berarti bagi kami. Atas perhatian dan perkenannya, kami ucapkan terima kasih.\n\nHormat kami,\nPanitia Acara`;
          window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`, '_blank');
        }
      });
      
    setSelectedGuestIds([]);
  };


  // Reset page when event changes
  useEffect(() => {
    setCurrentPage(1);
    setSelectedGuestDetail(null);
  }, [selectedEvent?.id, searchQuery, statusFilter]);

  if (loading) return <div>Loading events...</div>;

  const filteredGuests = guests.filter(guest => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = (guest.guestName?.toLowerCase() || '').includes(searchLower) || 
                          (guest.email?.toLowerCase() || '').includes(searchLower) ||
                          (guest.barcodeUid?.toLowerCase() || '').includes(searchLower);
    
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    if (statusFilter === 'checked_in') return guest.status === 'attended';
    if (statusFilter === 'attending') return guest.rsvpStatus === 'attending' && guest.status !== 'attended';
    if (statusFilter === 'not_attending') return guest.rsvpStatus === 'not_attending';
    if (statusFilter === 'pending') return guest.rsvpStatus === 'pending' && guest.status !== 'attended';
    return true;
  });
  
  const pendingFilteredGuests = filteredGuests.filter(g => g.status !== 'attended' && g.phone);
  const isAllSelected = pendingFilteredGuests.length > 0 && pendingFilteredGuests.every(g => selectedGuestIds.includes(g.id));


  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedGuestIds([]);
    } else {
      setSelectedGuestIds(pendingFilteredGuests.map(g => g.id));
    }
  };

  const toggleSelectGuest = (id: string) => {
    setSelectedGuestIds(prev => 
      prev.includes(id) ? prev.filter(gId => gId !== id) : [...prev, id]
    );
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedEvent) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const XLSX = await import('xlsx');
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        const newGuests = data.map((row: any) => ({
          eventId: selectedEvent.id,
          guestName: row['Nama Tamu'] || row['Name'] || row['Guest Name'] || '',
          email: row['Email'] || null,
          phone: row['Telepon'] || row['Phone'] || null,
          company: row['Instansi'] || row['Company'] || null,
          jobTitle: row['Jabatan'] || row['Job Title'] || null,
          isVip: (row['VIP'] || '').toString().toLowerCase() === 'ya' || (row['VIP'] || '').toString().toLowerCase() === 'yes',
        })).filter(g => g.guestName);

        if (newGuests.length === 0) {
          alert('Tidak ada data tamu yang valid ditemukan. Pastikan format kolom sesuai dengan template.');
          return;
        }

        const res = await fetch('/api/guests/bulk', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ guests: newGuests })
        });

        if (res.ok) {
          fetchGuests(selectedEvent.id);
          alert(`${newGuests.length} tamu berhasil ditambahkan.`);
        } else {
          const err = await res.json();
          alert(`Gagal mengupload: ${err.error}`);
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Gagal memproses file Excel.');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadTemplate = async () => {
    const XLSX = await import('xlsx');
    const ws = XLSX.utils.json_to_sheet([
      { 'Nama Tamu': 'John Doe', 'Email': 'john@example.com', 'Telepon': '08123456789', 'Instansi': 'PT Contoh', 'Jabatan': 'Direktur', 'VIP': 'Ya' },
      { 'Nama Tamu': 'Jane Smith', 'Email': '', 'Telepon': '', 'Instansi': '', 'Jabatan': '', 'VIP': 'Tidak' },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template Tamu");
    XLSX.writeFile(wb, "Template_Tamu_Undangan.xlsx");
  };

  const handleExportToExcel = async () => {
    if (!selectedEvent) return;
    try {
      const XLSX = await import('xlsx');
      const dataToExport = guests.map((g, index) => ({
        No: index + 1,
        "Guest Name": g.guestName,
        "Email": g.email || "",
        "Company": g.company || "",
        "Job Title": g.jobTitle || "",
        "Phone": g.phone || "",
        "PIC": g.picId ? pics.find(p => p.id === g.picId)?.username || "" : "",
        "Barcode UID": g.barcodeUid,
        "Status": g.status === 'attended' ? 'Attended' : 'Registered',
        "Check-in Time": g.scannedAt ? new Date(g.scannedAt).toLocaleString() : "-"
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
      
      XLSX.writeFile(workbook, `${selectedEvent.eventName}_Guests.xlsx`);
    } catch (err) {
      console.error("Failed to export Excel", err);
      alert("Failed to generate Excel file.");
    }
  };

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
  const paginatedGuests = filteredGuests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
    {/* Mobile Header Toggle */}
    <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shrink-0">
      <span className="text-sm font-bold text-gray-800 uppercase tracking-widest">Dashboard Menu</span>
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-100 text-gray-600 rounded-lg">
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>

    <div className="flex flex-col md:flex-row h-full flex-1 bg-white overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} ${isMobileMenuOpen ? 'flex fixed inset-y-0 left-0 h-full shadow-2xl' : 'hidden md:flex relative'} shrink-0 flex-col gap-2 border-r border-gray-200 bg-white overflow-y-auto transition-all duration-300 z-50 p-4`}>
        <div className="flex items-center justify-between mb-4">
          {isSidebarOpen && <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-2">Menu</h3>}
          <div className="flex gap-1 ml-auto">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden md:flex p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Toggle Sidebar">
              {isSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <button
          onClick={() => { setActiveTab('events'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-xl transition-colors group ${
            activeTab === 'events' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Event Management"
        >
          <Calendar className={`w-4 h-4 shrink-0 ${isSidebarOpen ? 'mr-3' : ''} ${activeTab === 'events' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          {isSidebarOpen && <span className="text-xs font-semibold">Event Management</span>}
        </button>

        <button
          onClick={() => { setActiveTab('guests'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-xl transition-colors group ${
            activeTab === 'guests' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Daftar Tamu"
        >
          <Users className={`w-4 h-4 shrink-0 ${isSidebarOpen ? 'mr-3' : ''} ${activeTab === 'guests' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          {isSidebarOpen && <span className="text-xs font-semibold">Daftar Tamu</span>}
        </button>

        <button
          onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false); }}
          className={`w-full flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-xl transition-colors group ${
            activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700 shadow-sm' : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Analytics"
        >
          <Activity className={`w-4 h-4 shrink-0 ${isSidebarOpen ? 'mr-3' : ''} ${activeTab === 'analytics' ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
          {isSidebarOpen && <span className="text-xs font-semibold">Analytics</span>}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto flex flex-col min-w-0 bg-gray-50">
        {activeTab === 'analytics' && <AnalyticsDashboard />}
        {activeTab === 'events' && (
<div className="flex flex-col gap-4 h-full">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300">
              <div className="p-5 border-b border-gray-100 bg-white/50 flex items-center justify-between sticky top-0 z-10">
                <h2 className="text-xs font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Active Events
                </h2>
                <button
                  onClick={() => setShowNewEvent(!showNewEvent)}
                  className="w-9 h-9 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-md shadow-indigo-500/25 transform hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-3">
                {showNewEvent && (
                  <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-[10px] uppercase tracking-widest text-indigo-700 mb-3 font-bold">Initialize Event</h3>
                    <form onSubmit={handleCreateEvent} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Event Name"
                        required
                        value={newEventName}
                        onChange={e => setNewEventName(e.target.value)}
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3"
                      />
                      <div className="flex gap-3">
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Waktu Mulai</label>
                          <input
                            type="datetime-local"
                            required
                            value={newEventDate}
                            onChange={e => setNewEventDate(e.target.value)}
                            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3 [color-scheme:light]"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Waktu Selesai (Opsional)</label>
                          <input
                            type="datetime-local"
                            value={newEventEndDate}
                            onChange={e => setNewEventEndDate(e.target.value)}
                            className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3 [color-scheme:light]"
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Location (Optional)"
                        value={newEventLocation}
                        onChange={e => setNewEventLocation(e.target.value)}
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3 mb-3"
                      />
                      <input
                        type="url"
                        placeholder="Google Maps Link (Optional)"
                        value={newEventMapsLink}
                        onChange={e => setNewEventMapsLink(e.target.value)}
                        className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2 px-3"
                      />
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Event Logo (Optional)</label>
                        {newEventLogo && (
                          <div className="mb-2 relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                            <img src={newEventLogo} alt="Logo" className="w-full h-full object-contain bg-white" />
                            <button
                              type="button"
                              onClick={() => setNewEventLogo(undefined)}
                              className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              compressImage(file).then(setNewEventLogo);
                            } else {
                              setNewEventLogo(undefined);
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                      </div>
                      <div className="mt-4">
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">File Undangan (PDF)</label>
                        {newEventInvitationFile && (
                          <div className="mb-2 p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                            <span className="text-xs text-gray-600 truncate">File PDF terpilih</span>
                            <button
                              type="button"
                              onClick={() => setNewEventInvitationFile(null)}
                              className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                              reader.readAsDataURL(file);
                            } else {
                              setNewEventInvitationFile(null);
                            }
                          }}
                          className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                        />
                      </div>

                      <div className="mt-4 border-t border-gray-100 pt-4">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Pengaturan Surat</h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Ukuran Kertas</label>
                            <select
                              value={newEventLetterSize}
                              onChange={e => setNewEventLetterSize(e.target.value as any)}
                              className="hidden w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                            >
                              <option value="A4">A4</option>
                              <option value="LETTER">Letter</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Background Undangan Digital</label>
                            {newEventLetterBackground && (
                              <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                <img src={newEventLetterBackground} alt="Background Surat" className="w-full h-full object-contain" />
                                <button
                                  type="button"
                                  onClick={() => setNewEventLetterBackground(null)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  compressImage(file).then(setNewEventLetterBackground);
                                } else {
                                  setNewEventLetterBackground(null);
                                }
                              }}
                              className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                            />
                          </div>
                          
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Hero Image / Foto Utama (Opsional)</label>
                              {newEventHeroImage && (
                                <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                  <img src={newEventHeroImage} alt="Hero" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setNewEventHeroImage(null)}
                                    className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    compressImage(file).then(setNewEventHeroImage);
                                  }
                                }}
                                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Backsound Musik (MP3/WAV Opsional)</label>
                              {newEventBacksound && (
                                <div className="mb-2 relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center">
                                  <audio src={newEventBacksound} controls className="w-full h-8" />
                                  <button
                                    type="button"
                                    onClick={() => setNewEventBacksound(null)}
                                    className="ml-2 w-6 h-6 bg-white rounded-full flex shrink-0 items-center justify-center text-red-500 shadow-sm"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              )}
                              <input
                                type="file"
                                accept="audio/*"
                                onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setNewEventBacksound(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                              />
                            </div>


                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Event Highlights / Galeri Foto (Opsional)</label>
                              {newEventGallery.length > 0 && (
                                <div className="mb-2 flex gap-2 flex-wrap">
                                  {newEventGallery.map((img, idx) => (
                                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                      <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newG = [...newEventGallery];
                                          newG.splice(idx, 1);
                                          setNewEventGallery(newG);
                                        }}
                                        className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                                      >
                                        <X className="w-2 h-2" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={e => {
                                  const files = Array.from(e.target.files || []) as File[];
                                  if (files.length > 0) {
                                    Promise.all(files.map(compressImage)).then(results => {
                                      setNewEventGallery(prev => [...prev, ...results]);
                                    });
                                  }
                                }}
                                className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Primary Color</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={newEventThemePrimary} 
                                    onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                  />
                                  <input 
                                    type="text" 
                                    value={newEventThemePrimary} 
                                    onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Secondary Color</label>
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="color" 
                                    value={newEventThemeSecondary} 
                                    onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                                    className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                  />
                                  <input 
                                    type="text" 
                                    value={newEventThemeSecondary} 
                                    onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                                    className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                                  />
                                </div>
                              </div>
                            </div>
                              <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Kutipan / Ayat Pembuka</label>
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[100px] [&_.ql-editor]:text-xs mb-4">
                                <ReactQuill 
                                  theme="snow" 
                                  value={newEventOpeningQuote} 
                                  onChange={setNewEventOpeningQuote} 
                                  placeholder="Ketik kutipan atau ayat disini..."
                                  modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'align': []}]] }}
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Rundown / Jadwal Acara (Opsional)</label>
                              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs mb-4">
                                <ReactQuill 
                                  theme="snow" 
                                  value={newEventRundown} 
                                  onChange={setNewEventRundown} 
                                  placeholder="Tulis rundown atau susunan acara disini..."
                                  modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'align': []}]] }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Isi Undangan Digital (Gunakan {'{{nama_tamu}}'} untuk nama tamu)</label>
                            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs">
                              <ReactQuill 
                                theme="snow" 
                                value={newEventLetterContent} 
                                onChange={setNewEventLetterContent} 
                                placeholder="Ketik isi surat disini..."
                                modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'align': []}]] }}
                              />
                            </div>
                            
                            {/* Live Preview Letter */}
                            {(newEventLetterContent || newEventLetterBackground || newEventHeroImage || newEventOpeningQuote) && (
                                <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Live Preview Undangan Digital</h4>
                                  <div className="w-full relative mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transform scale-[0.8] origin-top h-[600px] overflow-y-auto">
                                    <DigitalInvitation 
                                      eventName={newEventName || 'Nama Acara'}
                                      eventDate={newEventDate || new Date().toISOString()}
                                      location={newEventLocation || 'Lokasi Acara'}
                                      mapsLink={newEventMapsLink}
                                      guestName="Nama Tamu Preview"
                                      heroImage={newEventHeroImage}
                                      logo={newEventLogo}
                                      background={newEventLetterBackground}
                                      content={newEventLetterContent}
                                      openingQuote={newEventOpeningQuote}
                                      backsound={newEventBacksound}
                                      gallery={JSON.stringify(newEventGallery)}
                                      themePrimary={newEventThemePrimary}
                                      themeSecondary={newEventThemeSecondary}
                                      isPreview={true}
                                    />
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest shadow-sm">
                        Create
                      </button>
                    </form>
                  </div>
                )}
                {events.map(event => (
                  <button
                    key={event.id}
                    onClick={() => selectEvent(event)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group ${
                      selectedEvent?.id === event.id 
                        ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-md ring-1 ring-indigo-500/20' 
                        : 'bg-white border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                  >
                    <h3 className={`font-serif mb-2 leading-tight transition-colors ${selectedEvent?.id === event.id ? 'text-indigo-900 font-semibold' : 'text-gray-900 group-hover:text-indigo-600'}`}>{event.eventName}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {event.location}
                      </div>
                    )}
                  </button>
                ))}
                {events.length === 0 && <div className="text-gray-500 text-xs italic py-4 text-center">No active events.</div>}
              </div>
            </div>
          </div>

          
        )}
        {activeTab === 'guests' && (
<div className="flex flex-col gap-6 h-full">
            {selectedEvent ? (
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-gray-100 overflow-hidden flex flex-col flex-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-start justify-between bg-white/50 gap-4">
                  <div>
                    <h2 className="text-2xl font-serif text-gray-900 mb-2">{selectedEvent.eventName}</h2>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-indigo-600"/> {new Date(selectedEvent.eventDate).toLocaleString()}</span>
                      {selectedEvent.location && <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-emerald-600"/> {selectedEvent.location}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => {
                        setEditingEventId(selectedEvent.id);
                        setNewEventName(selectedEvent.eventName);
                        setNewEventDate(new Date(selectedEvent.eventDate).toISOString().slice(0,16));
                        setNewEventLocation(selectedEvent.location || "");
                        setNewEventMapsLink(selectedEvent.mapsLink || "");
                        setNewEventLogo(selectedEvent.logo);
                        setNewEventInvitationFile(selectedEvent.invitationFile || null);
                        setNewEventLetterBackground(selectedEvent.letterBackground || null);
                        setNewEventLetterSize((selectedEvent.letterSize as 'A4' | 'LETTER') || 'A4');
                        setNewEventLetterContent(selectedEvent.letterContent || "");
                        setNewEventOpeningQuote(selectedEvent.openingQuote || "");
                        setNewEventEndDate(selectedEvent.eventEndDate ? new Date(selectedEvent.eventEndDate).toISOString().slice(0,16) : "");
                        setNewEventRundown(selectedEvent.rundown || "");
                        setNewEventHeroImage(selectedEvent.heroImage || null);
                        setNewEventBacksound(selectedEvent.backsound || null);
                        setNewEventGallery(selectedEvent.gallery ? JSON.parse(selectedEvent.gallery) : []);
                        setNewEventThemePrimary(selectedEvent.themePrimary || '#b45309');
                        setNewEventThemeSecondary(selectedEvent.themeSecondary || '#fef3c7');
                        setIsEditEventModalOpen(true);
                      }}
                      className="inline-flex items-center justify-center w-10 h-10 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                      title="Edit Event"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="inline-flex items-center justify-center w-10 h-10 bg-white text-gray-500 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors shadow-sm"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <Link
                      to={`/scanner/${selectedEvent.id}`}
                      target="_blank"
                      className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                      title="Open Scanner"
                    >
                      <QrCode className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setIsTwibbonConfigOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 border border-gray-200 text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <LayoutList className="w-4 h-4" />
                      Design Twibbon
                    </button>
                  </div>
                </div>
                  <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Registered</p>
                          <p className="text-2xl font-serif text-gray-900">{guests.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Total Checked-in</p>
                          <p className="text-2xl font-serif text-gray-900">{guests.filter(g => g.status === 'attended').length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-emerald-600" />
                          Live Check-ins
                        </h3>
                      </div>
                      <div className="flex gap-4 overflow-x-auto pb-4 mb-4">
                        {guests
                          .filter(g => g.status === 'attended' && g.scannedAt)
                          .sort((a, b) => new Date(b.scannedAt!).getTime() - new Date(a.scannedAt!).getTime())
                          .slice(0, 8)
                          .map(guest => (
                            <div key={guest.id} className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex items-center justify-between min-w-[240px] flex-shrink-0">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{guest.guestName}</div>
                                <div className="text-[10px] text-gray-500 font-mono mt-0.5">{guest.barcodeUid.substring(0, 8)}</div>
                              </div>
                              <div className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-md">
                                {new Date(guest.scannedAt!).toLocaleTimeString()}
                              </div>
                            </div>
                          ))
                        }
                        {guests.filter(g => g.status === 'attended').length === 0 && (
                          <div className="text-gray-400 text-xs italic py-2">No check-ins yet.</div>
                        )}
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-500">Access Log ({guests.length})</h3>
                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                          <button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors shadow-sm"
                          >
                            <UserPlus className="w-4 h-4" />
                            Add Guest
                          </button>
                          <button
                            onClick={handleExportToExcel}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 text-xs font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
                          >
                            <Download className="w-4 h-4" />
                            Export to XLSX
                          </button>
                          
                          <div className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
                            <input
                              type="file"
                              accept=".xlsx, .xls"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                            />
                            <button
                              onClick={() => fileInputRef.current?.click()}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors shadow-sm"
                            >
                              <Upload className="w-4 h-4" />
                              Upload XLSX
                            </button>
                            <button
                              onClick={handleDownloadTemplate}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium rounded-lg hover:bg-amber-100 transition-colors shadow-sm"
                              title="Download Excel Template"
                            >
                              <FileText className="w-4 h-4" />
                              Template
                            </button>
                          </div>
                          {selectedGuestIds.length > 0 && (
                            <button
                              onClick={handleBulkSendInvitations}
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-medium rounded-lg hover:bg-emerald-100 transition-colors shadow-sm"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Send {selectedGuestIds.length} Invitations
                            </button>
                          )}
                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 shadow-sm outline-none"
                          >
                            <option value="all">All Status</option>
                            <option value="attending">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="not_attending">Not Attending</option>
                            <option value="checked_in">Checked In</option>
                          </select>
                          <div className="relative w-full md:w-auto">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input 
                              type="text" 
                              placeholder="Query identities..." 
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 w-full md:w-64" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="border border-gray-200 rounded-xl overflow-hidden flex-1 flex flex-col">
                        <div className="overflow-x-auto flex-1">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
  {paginatedGuests.map(guest => (
    <div key={guest.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative">
      <div className="absolute top-4 right-4">
        <input
          type="checkbox"
          className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
          checked={selectedGuestIds.includes(guest.id)}
          onChange={() => toggleSelectGuest(guest.id)}
          disabled={guest.status === 'attended' || !guest.phone}
        />
      </div>
      <div className="pr-8">
        <h3 className="font-bold text-gray-900 text-sm">{guest.guestName} {guest.isVip && <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"><Crown className="w-3 h-3"/> VIP</span>}</h3>
        <p className="text-xs text-gray-500 mt-1">{guest.email || 'No email'} {guest.phone ? `• ${guest.phone}` : '• No phone'}</p>
        {guest.company && <p className="text-xs text-gray-500 mt-0.5">{guest.company} {guest.jobTitle && `- ${guest.jobTitle}`}</p>}
      </div>
      
      <div className="flex items-center gap-2 mt-1">
        <div className="bg-indigo-50 p-1.5 rounded-lg shrink-0">
          <QRCodeSVG value={guest.barcodeUid} size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Barcode UID</p>
          <p className="text-xs font-mono text-indigo-600 truncate">{guest.barcodeUid}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-gray-100">
        {guest.status === 'attended' ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
            Attended
          </span>
        ) : (
          <button
            onClick={() => handleManualCheckIn(guest.barcodeUid)}
            className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 transition-colors shadow-sm"
          >
            Check In
          </button>
        )}
        
        {guest.rsvpStatus === 'attending' ? (
          <div className="flex flex-col">
            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-200">Hadir</span>
          </div>
        ) : guest.rsvpStatus === 'not_attending' ? (
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-200">Tidak Hadir</span>
        ) : (
          <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200">Menunggu</span>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
         {guest.rsvpStatus === 'attending' && !guest.isPrinted && (
           <button onClick={() => setPrintingGuest(guest)} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-indigo-600 transition-colors" title="Print ID Card">
             <Printer className="w-3.5 h-3.5" />
           </button>
         )}
         <button onClick={() => handlePrintBarcode(guest.barcodeUid, guest.guestName)} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-indigo-600 transition-colors" title="Download Barcode">
            <Download className="w-3.5 h-3.5" />
         </button>
         <button onClick={() => setSelectedGuestDetail(guest)} className="inline-flex items-center justify-center py-1.5 px-3 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 hover:bg-indigo-100 transition-colors ml-auto text-[10px] font-bold uppercase tracking-widest shadow-sm">
           Detail
         </button>
         <button onClick={() => {
            const rsvpUrl = `${getBaseUrl()}/rsvp/${guest.barcodeUid}`;
            const fileUrl = `${getBaseUrl()}/api/events/public/invitation/${selectedEvent?.slug}`;
            const eventDateStr = new Date(selectedEvent?.eventDate || '').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const eventTimeStr = new Date(selectedEvent?.eventDate || '').toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            const message = guest.rsvpStatus === 'attending' 
              ? `*Tiket Resmi Acara* 🎟️\n\nKepada Yth.\n*Bapak/Ibu ${guest.guestName}*\n\nTerima kasih telah mengonfirmasi kehadiran Anda pada acara *${selectedEvent?.eventName}*.\n\nBerikut adalah tautan tiket Barcode (QR Code) Anda. Mohon tunjukkan tiket ini kepada petugas registrasi saat tiba di lokasi acara:\n\n🔗 *Tautan Tiket:*\n${rsvpUrl}\n\nKami menantikan kehadiran Anda pada:\n📅 *Hari/Tanggal:* ${eventDateStr}\n⏰ *Waktu:* ${eventTimeStr}\n📍 *Lokasi:* ${selectedEvent?.location || 'Akan diinformasikan'}\n\nSampai jumpa di acara!\n\nHormat kami,\n*Panitia Penyelenggara*`
              : `*Undangan Resmi Acara* ✉️\n\nKepada Yth.\n*Bapak/Ibu ${guest.guestName}*\n\nDengan hormat,\n\nMelalui pesan ini, kami bermaksud mengundang Bapak/Ibu untuk berkenan hadir pada acara *${selectedEvent?.eventName}* yang akan diselenggarakan pada:\n\n📅 *Hari/Tanggal:* ${eventDateStr}\n⏰ *Waktu:* ${eventTimeStr}\n📍 *Lokasi:* ${selectedEvent?.location || 'Akan diinformasikan'}\n\n📎 *Tautan File Undangan Resmi:*\n${fileUrl}\n\nMengingat pentingnya acara ini, kami sangat mengharapkan kehadiran Bapak/Ibu. Untuk kelancaran persiapan acara, mohon berkenan memberikan konfirmasi kehadiran (RSVP) melalui sistem registrasi kami pada tautan di bawah ini:\n\n🔗 *Tautan Konfirmasi Kehadiran (RSVP):*\n${rsvpUrl}\n\nSetelah Bapak/Ibu melakukan konfirmasi kehadiran melalui tautan di atas, sistem akan secara otomatis menerbitkan Kartu Identitas Tamu (ID Card) beserta QR Code sebagai tiket akses masuk resmi Bapak/Ibu.\n\nDemikian undangan ini kami sampaikan. Atas perhatian dan perkenan Bapak/Ibu, kami mengucapkan terima kasih yang sebesar-besarnya.\n\nHormat kami,\n\n*Panitia Penyelenggara*`;
            
            window.open(`https://wa.me/${guest.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
         }} disabled={!guest.phone} className="inline-flex items-center justify-center p-1.5 bg-gray-50 text-gray-600 rounded border border-gray-200 hover:bg-white hover:text-green-600 transition-colors disabled:opacity-50" title={guest.rsvpStatus === 'attending' ? 'Kirim Tiket Barcode WA' : 'Kirim Link Konfirmasi RSVP WA'}>
            <MessageCircle className="w-3.5 h-3.5" />
         </button>
         
      </div>
    </div>
  ))}
</div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Show:</span>
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          {totalPages > 1 && (

            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-xl shadow-sm mt-2">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-700">
                    Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, filteredGuests.length)}</span> of{' '}
                    <span className="font-bold">{filteredGuests.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {/* Simplified page numbers, just show current and total */}
                    <span className="relative inline-flex items-center px-4 py-2 text-xs font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 p-12 text-center">
                  <div>
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                    <p className="text-sm">Select an event to view details and manage access.</p>
                  </div>
                </div>
              )}
            </div>
          )}            
      </div>
    </div>
    
      {isEditEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsEditEventModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 flex items-center gap-2">
                <Edit className="w-4 h-4 text-indigo-600" />
                Edit Event
              </h3>
              <button onClick={() => setIsEditEventModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleUpdateEvent} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event Name</label>
                  <input
                    type="text"
                    required
                    value={newEventName}
                    onChange={e => setNewEventName(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Waktu Mulai</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEventDate}
                      onChange={e => setNewEventDate(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Waktu Selesai (Opsional)</label>
                    <input
                      type="datetime-local"
                      value={newEventEndDate}
                      onChange={e => setNewEventEndDate(e.target.value)}
                      className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Location (Optional)</label>
                  <input
                    type="text"
                    value={newEventLocation}
                    onChange={e => setNewEventLocation(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3 mb-3"
                  />
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 mt-3">Google Maps Link (Optional)</label>
                  <input
                    type="url"
                    value={newEventMapsLink}
                    onChange={e => setNewEventMapsLink(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Event Logo (Optional)</label>
                  {newEventLogo && (
                    <div className="mb-2 relative w-16 h-16 rounded-lg overflow-hidden border border-gray-200">
                      <img src={newEventLogo} alt="Logo" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setNewEventLogo(undefined)}
                        className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const img = new Image();
                        const url = URL.createObjectURL(file);
                        img.onload = () => {
                          URL.revokeObjectURL(url);
                          const canvas = document.createElement('canvas');
                          let width = img.width;
                          let height = img.height;
                          const max = 300;
                          if (width > max || height > max) {
                            const ratio = Math.min(max / width, max / height);
                            width = width * ratio;
                            height = height * ratio;
                          }
                          canvas.width = width;
                          canvas.height = height;
                          const ctx = canvas.getContext('2d');
                          if(ctx) {
                             ctx.drawImage(img, 0, 0, width, height);
                             setNewEventLogo(canvas.toDataURL('image/jpeg', 0.85));
                          }
                        };
                        img.src = url;
                      } else {
                        setNewEventLogo(undefined);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">File Undangan (PDF)</label>
                  {newEventInvitationFile && (
                    <div className="mb-2 p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                      <span className="text-xs text-gray-600 truncate">File PDF terpilih</span>
                      <button
                        type="button"
                        onClick={() => setNewEventInvitationFile(null)}
                        className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setNewEventInvitationFile(reader.result as string);
                        reader.readAsDataURL(file);
                      } else {
                        setNewEventInvitationFile(null);
                      }
                    }}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3">Pengaturan Surat</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Ukuran Kertas</label>
                      <select
                        value={newEventLetterSize}
                        onChange={e => setNewEventLetterSize(e.target.value as any)}
                        className="hidden w-full text-xs bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3"
                      >
                        <option value="A4">A4</option>
                        <option value="LETTER">Letter</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Background Undangan Digital</label>
                      {newEventLetterBackground && (
                        <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={newEventLetterBackground} alt="Background Surat" className="w-full h-full object-contain" />
                          <button
                            type="button"
                            onClick={() => setNewEventLetterBackground(null)}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressImage(file).then(setNewEventLetterBackground);
                          } else {
                            setNewEventLetterBackground(null);
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Hero Image / Foto Utama (Opsional)</label>
                      {newEventHeroImage && (
                        <div className="mb-2 relative w-full h-24 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                          <img src={newEventHeroImage} alt="Hero" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewEventHeroImage(null)}
                            className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            compressImage(file).then(setNewEventHeroImage);
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Backsound Musik (MP3/WAV Opsional)</label>
                      {newEventBacksound && (
                        <div className="mb-2 relative w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2 flex items-center">
                          <audio src={newEventBacksound} controls className="w-full h-8" />
                          <button
                            type="button"
                            onClick={() => setNewEventBacksound(null)}
                            className="ml-2 w-6 h-6 bg-white rounded-full flex shrink-0 items-center justify-center text-red-500 shadow-sm"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewEventBacksound(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>


                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Event Highlights / Galeri Foto (Opsional)</label>
                      {newEventGallery.length > 0 && (
                        <div className="mb-2 flex gap-2 flex-wrap">
                          {newEventGallery.map((img, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                              <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => {
                                  const newG = [...newEventGallery];
                                  newG.splice(idx, 1);
                                  setNewEventGallery(newG);
                                }}
                                className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm"
                              >
                                <X className="w-2 h-2" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => {
                          const files = Array.from(e.target.files || []) as File[];
                          if (files.length > 0) {
                            Promise.all(files.map(compressImage)).then(results => {
                              setNewEventGallery(prev => [...prev, ...results]);
                            });
                          }
                        }}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Primary Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newEventThemePrimary} 
                            onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input 
                            type="text" 
                            value={newEventThemePrimary} 
                            onChange={(e) => setNewEventThemePrimary(e.target.value)} 
                            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Secondary Color</label>
                        <div className="flex items-center gap-2">
                          <input 
                            type="color" 
                            value={newEventThemeSecondary} 
                            onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                          />
                          <input 
                            type="text" 
                            value={newEventThemeSecondary} 
                            onChange={(e) => setNewEventThemeSecondary(e.target.value)} 
                            className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Kutipan / Ayat Pembuka</label>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[100px] [&_.ql-editor]:text-xs mb-4">
                        <ReactQuill 
                          theme="snow" 
                          value={newEventOpeningQuote} 
                          onChange={setNewEventOpeningQuote} 
                          placeholder="Ketik kutipan atau ayat disini..."
                          modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'align': []}]] }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Rundown / Jadwal Acara (Opsional)</label>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs mb-4">
                        <ReactQuill 
                          theme="snow" 
                          value={newEventRundown} 
                          onChange={setNewEventRundown} 
                          placeholder="Tulis rundown atau susunan acara disini..."
                          modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'align': []}]] }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5 font-bold">Isi Undangan Digital (Gunakan {'{{nama_tamu}}'} untuk nama tamu)</label>
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden [&_.ql-editor]:min-h-[150px] [&_.ql-editor]:text-xs">
                        <ReactQuill 
                          theme="snow" 
                          value={newEventLetterContent} 
                          onChange={setNewEventLetterContent} 
                          placeholder="Ketik isi surat disini..."
                          modules={{ toolbar: [['bold', 'italic', 'underline', 'strike'], [{'list': 'ordered'}, {'list': 'bullet'}], [{'align': []}]] }}
                        />
                      </div>
                      
                      {/* Live Preview Letter */}
                            {(newEventLetterContent || newEventLetterBackground || newEventHeroImage || newEventOpeningQuote) && (
                                <div className="mt-4 border border-dashed border-gray-300 rounded-xl p-4 bg-gray-50/50">
                                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-3">Live Preview Undangan Digital</h4>
                                  <div className="w-full relative mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transform scale-[0.8] origin-top h-[600px] overflow-y-auto">
                                    <DigitalInvitation 
                                      eventName={newEventName || 'Nama Acara'}
                                      eventDate={newEventDate || new Date().toISOString()}
                                      location={newEventLocation || 'Lokasi Acara'}
                                      mapsLink={newEventMapsLink}
                                      guestName="Nama Tamu Preview"
                                      heroImage={newEventHeroImage}
                                      logo={newEventLogo}
                                      background={newEventLetterBackground}
                                      content={newEventLetterContent}
                                      openingQuote={newEventOpeningQuote}
                                      backsound={newEventBacksound}
                                      gallery={JSON.stringify(newEventGallery)}
                                      themePrimary={newEventThemePrimary}
                                      themeSecondary={newEventThemeSecondary}
                                      isPreview={true}
                                    />
                                  </div>
                                </div>
                            )}
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest mt-4 shadow-md border border-indigo-500/50">
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Register Identity
              </h3>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form onSubmit={handleAddGuest} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Guest Name</label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={e => setNewGuestName(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Email (Optional)</label>
                  <input
                    type="email"
                    value={newGuestEmail}
                    onChange={e => setNewGuestEmail(e.target.value)}
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Instansi/Company (Optional)</label>
                    <input type="text" value={newGuestCompany} onChange={e => setNewGuestCompany(e.target.value)} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Jabatan/Job Title (Optional)</label>
                    <input type="text" value={newGuestJobTitle} onChange={e => setNewGuestJobTitle(e.target.value)} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">PIC / Pengundang (Optional)</label>
                  <select value={newGuestPicId} onChange={e => setNewGuestPicId(e.target.value)} className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 py-2.5 px-3">
                    <option value="">-- Pilih PIC --</option>
                    {pics.map(pic => (
                      <option key={pic.id} value={pic.id}>{pic.username}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">WhatsApp Number (Optional)</label>
                  <input
                    type="tel"
                    value={newGuestPhone}
                    onChange={e => setNewGuestPhone(e.target.value)}
                    placeholder="e.g. +628123456789"
                    className="w-full text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-400 py-2.5 px-3"
                  />
                </div>
                <div className="flex items-center gap-2 mt-4 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <input
                    type="checkbox"
                    id="isVip"
                    checked={newGuestIsVip}
                    onChange={e => setNewGuestIsVip(e.target.checked)}
                    className="w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <label htmlFor="isVip" className="text-sm font-medium text-amber-900 cursor-pointer select-none">
                    Tandai sebagai Tamu VIP
                  </label>
                </div>
                <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest mt-4 shadow-md border border-indigo-500/50">
                  Generate Barcode
                </button>
              </form>
              
              {generatedBarcode && (
                <div className="mt-8 flex flex-col items-center relative z-10 w-full">
                  {isGeneratingTwibbon ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Generating ID Card...</p>
                    </div>
                  ) : generatedTwibbon ? (
                    <div className="w-full max-w-[320px] mx-auto">
                      <img src={generatedTwibbon} alt="Guest ID Card" className="w-full h-auto rounded-2xl shadow-2xl border border-gray-200" />
                      <div className="mt-6 flex gap-3 w-full">
                        <a
                          href={generatedTwibbon}
                          download={`${generatedBarcode.name.replace(/\s+/g, "_")}_ID_Card.png`}
                          className="flex-1 flex justify-center items-center gap-2 py-2.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600 border border-indigo-200 hover:bg-indigo-50 bg-indigo-50/50 shadow-sm rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <button 
                          onClick={() => {
                            setGeneratedBarcode(null);
                            setIsRegisterModalOpen(false);
                          }}
                          className="flex-1 py-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 border border-gray-200 hover:bg-gray-100 bg-white shadow-sm rounded-lg transition-colors"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {isTwibbonConfigOpen && selectedEvent && (
        <TwibbonConfigurator
          event={selectedEvent}
          onClose={() => setIsTwibbonConfigOpen(false)}
          onSave={handleSaveTwibbonConfig}
        />
      )}

      {/* Letter Print Modal */}
      {printingGuest && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
              <h2 className="text-xl font-serif text-gray-900">Lampiran Surat Undangan</h2>
              <button 
                onClick={() => setPrintingGuest(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 bg-gray-50 flex justify-center items-start min-h-[500px]">
              <div 
                id="letter-print-area" 
                className="bg-white shadow-lg relative overflow-hidden"
                style={{ 
                  width: '794px',
                  minHeight: '1123px',
                }}
              >
                <DigitalInvitation 
                  eventName={selectedEvent.eventName || 'Nama Acara'}
                  eventDate={selectedEvent.eventDate || new Date().toISOString()}
                  location={selectedEvent.location || 'Lokasi Acara'}
                  mapsLink={selectedEvent.mapsLink}
                  guestName={printingGuest.guestName}
                  heroImage={selectedEvent.heroImage || null}
                  logo={selectedEvent.logo || null}
                  background={selectedEvent.letterBackground || null}
                  content={selectedEvent.letterContent || ''}
                  backsound={selectedEvent.backsound || null}
                  themePrimary={selectedEvent.themePrimary || null}
                  themeSecondary={selectedEvent.themeSecondary || null}
                  isPreview={true}
                  isPrint={true}
                />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6">
              <button
                onClick={async () => {
                  try {
                    const html2canvas = (await import('html2canvas')).default;
                    const jsPDF = (await import('jspdf')).default;
                    const element = document.getElementById('letter-print-area');
                    if (!element) return;
                    
                    const canvas = await html2canvas(element, { scale: 2, useCORS: true });
                    const imgData = canvas.toDataURL('image/png');
                    const isLetter = selectedEvent.letterSize === 'LETTER';
                    const pdf = new jsPDF({
                      orientation: 'portrait',
                      unit: 'mm',
                      format: isLetter ? 'letter' : 'a4'
                    });
                    
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Surat_Undangan_${printingGuest.guestName.replace(/\s+/g, '_')}.pdf`);
                  } catch (err) {
                    console.error(err);
                    alert('Gagal mencetak surat.');
                  }
                }}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl transition-colors text-sm font-bold uppercase tracking-widest shadow-md"
              >
                Cetak Surat
              </button>
            </div>
          </div>
        </div>
      )}
    </>

      
  );
}