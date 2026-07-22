import React, { useState, useEffect, useRef } from 'react';
import { Event } from '../types.ts';
import { X, Save, Upload, Settings } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface TwibbonConfig {
  logoX: number;
  logoY: number;
  logoSize: number;
  qrX: number;
  qrY: number;
  qrSize: number;
  eventNameY: number;
  badgeY: number;
  guestNameY: number;
  guestLabelY: number;
}

const DEFAULT_CONFIG: TwibbonConfig = {
  logoX: 400 - 55,
  logoY: 70,
  logoSize: 110,
  qrX: 400 - 175,
  qrY: 380,
  qrSize: 350,
  eventNameY: 230,
  badgeY: 275,
  guestNameY: 810,
  guestLabelY: 860,
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

export function TwibbonConfigurator({ event, onClose, onSave }: { event: Event, onClose: () => void, onSave: (bg: string, config: string) => void }) {
  const [background, setBackground] = useState<string>(event.twibbonBackground || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop");
  
  const initialConfig = event.twibbonConfig ? JSON.parse(event.twibbonConfig) : DEFAULT_CONFIG;
  const [config, setConfig] = useState<TwibbonConfig>(initialConfig);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderCanvas = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    try {
      const bgImg = new Image();
      if (background.startsWith("http")) { bgImg.crossOrigin = "anonymous"; }
      bgImg.src = background;
      await new Promise((resolve, reject) => { bgImg.onload = resolve; bgImg.onerror = reject; });
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.error("Failed to load background", e);
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(17,24,39,0.2)");
    gradient.addColorStop(1, "rgba(17,24,39,0.9)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Logo
    try {
      const logoSrc = event.logo || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80";
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
    } catch (e) {
      console.error("Failed to load logo", e);
    }

    ctx.fillStyle = "white";
    drawWrappedText(ctx, (event.eventName || "Event").toUpperCase(), canvas.width / 2, config.eventNameY, 700, 36);

    // Badge
    const badgeText = "OFFICIAL INVITATION";
    ctx.font = "bold 20px sans-serif";
    const badgeWidth = ctx.measureText(badgeText).width + 40;
    ctx.fillStyle = "#FDB931";
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - badgeWidth / 2, config.badgeY, badgeWidth, 40, 20);
    ctx.fill();
    ctx.fillStyle = "#5C4000";
    ctx.fillText(badgeText, canvas.width / 2, config.badgeY + 28);

    // QR Code Placeholder
    const { qrX, qrY, qrSize } = config;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.roundRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 32);
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 10;
    ctx.fill();
    ctx.shadowColor = "transparent";
    
    ctx.fillStyle = "#f3f4f6";
    ctx.beginPath();
    ctx.roundRect(qrX, qrY, qrSize, qrSize, 16);
    ctx.fill();
    ctx.fillStyle = "#9ca3af";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("QR CODE", canvas.width / 2, qrY + qrSize / 2 + 10);

    ctx.fillStyle = "white";
    drawWrappedText(ctx, "John Doe", canvas.width / 2, config.guestNameY, 700, 48);

    // Guest Label
    ctx.font = "600 24px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText("GUEST IDENTITY", canvas.width / 2, config.guestLabelY);
  };

  useEffect(() => {
    renderCanvas();
  }, [config, background, event]);

  const handleChange = (key: keyof TwibbonConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Preview Panel */}
        <div className="flex-1 bg-gray-100 p-8 flex flex-col items-center justify-center overflow-y-auto">
          <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-6">Live Preview</h3>
          <div className="relative shadow-2xl rounded-2xl overflow-hidden w-full max-w-[400px] aspect-[2/3]">
            <canvas
              ref={canvasRef}
              width={800}
              height={1200}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="w-full md:w-96 p-6 border-l border-gray-200 overflow-y-auto flex flex-col h-full bg-white">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold tracking-widest uppercase text-gray-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-indigo-600" />
              Customize Layout
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 flex-1">
            {/* Background Image Upload */}
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Background Image</label>
              <div className="flex items-center gap-3">
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
                        const maxW = 800;
                        const maxH = 1200;
                        if (width > maxW || height > maxH) {
                          const ratio = Math.min(maxW / width, maxH / height);
                          width = width * ratio;
                          height = height * ratio;
                        }
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        if(ctx) {
                           ctx.drawImage(img, 0, 0, width, height);
                           setBackground(canvas.toDataURL('image/jpeg', 0.85));
                        }
                      };
                      img.src = url;
                    }
                  }}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 border-b pb-1">Logo Positioning (Base: 800x1200)</h4>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Size</span>
                  <span>{config.logoSize}</span>
                </label>
                <input type="range" min="50" max="300" value={config.logoSize} onChange={(e) => handleChange('logoSize', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Position X</span>
                  <span>{config.logoX}</span>
                </label>
                <input type="range" min="0" max="800" value={config.logoX} onChange={(e) => handleChange('logoX', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Position Y</span>
                  <span>{config.logoY}</span>
                </label>
                <input type="range" min="0" max="1200" value={config.logoY} onChange={(e) => handleChange('logoY', parseInt(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 border-b pb-1">QR Code Positioning</h4>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Size</span>
                  <span>{config.qrSize}</span>
                </label>
                <input type="range" min="100" max="600" value={config.qrSize} onChange={(e) => handleChange('qrSize', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Position X</span>
                  <span>{config.qrX}</span>
                </label>
                <input type="range" min="0" max="800" value={config.qrX} onChange={(e) => handleChange('qrX', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Position Y</span>
                  <span>{config.qrY}</span>
                </label>
                <input type="range" min="0" max="1200" value={config.qrY} onChange={(e) => handleChange('qrY', parseInt(e.target.value))} className="w-full" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-900 border-b pb-1">Text Positioning</h4>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Event Name Y</span>
                  <span>{config.eventNameY}</span>
                </label>
                <input type="range" min="0" max="1200" value={config.eventNameY} onChange={(e) => handleChange('eventNameY', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Badge Y</span>
                  <span>{config.badgeY}</span>
                </label>
                <input type="range" min="0" max="1200" value={config.badgeY} onChange={(e) => handleChange('badgeY', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Guest Name Y</span>
                  <span>{config.guestNameY}</span>
                </label>
                <input type="range" min="0" max="1200" value={config.guestNameY} onChange={(e) => handleChange('guestNameY', parseInt(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Guest Label Y</span>
                  <span>{config.guestLabelY}</span>
                </label>
                <input type="range" min="0" max="1200" value={config.guestLabelY} onChange={(e) => handleChange('guestLabelY', parseInt(e.target.value))} className="w-full" />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
            <button
              onClick={() => {
                setConfig(DEFAULT_CONFIG);
                setBackground(event.twibbonBackground || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=800&auto=format&fit=crop");
              }}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest shadow-sm"
            >
              Reset
            </button>
            <button
              onClick={() => onSave(background, JSON.stringify(config))}
              className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-[10px] font-bold uppercase tracking-widest shadow-md border border-indigo-500/50 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
