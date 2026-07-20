import sys

def modify(filepath):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Update interface
    old_interface = """  event: {
    id: string;
    eventName: string;
    eventDate: string;
    location: string | null;
    logo: string | null;
  };"""
    new_interface = """  event: {
    id: string;
    eventName: string;
    eventDate: string;
    location: string | null;
    logo: string | null;
    twibbonBackground?: string | null;
    twibbonConfig?: string | null;
  };"""
    content = content.replace(old_interface, new_interface)

    # 2. Add states and function
    old_states = """  const [success, setSuccess] = useState(false);
  const [paxInput, setPaxInput] = useState<string>('1');"""
    
    new_states = """  const [success, setSuccess] = useState(false);
  const [paxInput, setPaxInput] = useState<string>('1');
  const [generatedTwibbon, setGeneratedTwibbon] = useState<string | null>(null);
  const [isGeneratingTwibbon, setIsGeneratingTwibbon] = useState(false);

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
      
      if (eventData.twibbonConfig) {
        try {
          config = { ...config, ...JSON.parse(eventData.twibbonConfig) };
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

      ctx.font = "bold 40px sans-serif";
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.fillText((eventData.eventName || "Event").toUpperCase(), canvas.width / 2, config.eventNameY);

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
    } catch (error) {
      console.error("Twibbon generation failed:", error);
    } finally {
      setIsGeneratingTwibbon(false);
    }
  };"""
    content = content.replace(old_states, new_states)

    # 3. trigger twibbon generation
    old_effect = """          if (guestData.rsvpStatus !== 'pending') {
            setSuccess(true);
          }
        }
      } catch (error) {"""

    new_effect = """          if (guestData.rsvpStatus !== 'pending') {
            setSuccess(true);
            if (guestData.rsvpStatus === 'attending' && barcodeUid) {
              generateTwibbonImage(barcodeUid, guestData.guestName, guestData.event);
            }
          }
        }
      } catch (error) {"""
    content = content.replace(old_effect, new_effect)

    old_submit = """      if (res.ok) {
        setData(prev => prev ? { ...prev, rsvpStatus: status, paxCount: pax } : null);
        setSuccess(true);
      }"""

    new_submit = """      if (res.ok) {
        setData(prev => prev ? { ...prev, rsvpStatus: status, paxCount: pax } : null);
        setSuccess(true);
        if (status === 'attending' && barcodeUid && data) {
          generateTwibbonImage(barcodeUid, data.guestName, data.event);
        }
      }"""
    content = content.replace(old_submit, new_submit)

    # 4. Update UI to show twibbon
    old_ui = """                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">RSVP Confirmed!</h3>
                  <p className="text-gray-600 text-sm">Thank you for confirming your attendance.</p>
                  <div className="mt-4 py-2 px-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium inline-block border border-emerald-200">
                    {data.paxCount} Guest(s)
                  </div>
                  <p className="text-xs text-gray-500 mt-6">You will receive your entry barcode shortly.</p>"""

    new_ui = """                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">RSVP Confirmed!</h3>
                  <p className="text-gray-600 text-sm mb-6">Thank you for confirming your attendance.</p>
                  
                  {isGeneratingTwibbon ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Generating ID Card...</p>
                    </div>
                  ) : generatedTwibbon ? (
                    <div className="w-full max-w-[320px] mx-auto mt-4">
                      <img src={generatedTwibbon} alt="Guest ID Card" className="w-full h-auto rounded-2xl shadow-xl border border-gray-200" />
                      <a
                        href={generatedTwibbon}
                        download={`${data.guestName.replace(/\s+/g, "_")}_ID_Card.png`}
                        className="mt-4 block w-full py-3 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-md"
                      >
                        Download ID Card
                      </a>
                    </div>
                  ) : (
                    <div className="mt-4 py-2 px-4 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium inline-block border border-emerald-200">
                      {data.paxCount} Guest(s)
                    </div>
                  )}"""
    content = content.replace(old_ui, new_ui)

    with open(filepath, "w") as f:
        f.write(content)

modify("src/components/GuestRSVP.tsx")
