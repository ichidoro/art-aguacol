import React, { useState, useRef, useEffect } from "react";
import { Upload, Trash2, ImageIcon } from "lucide-react";

export default function AguacolLogo({ className = "h-11" }: { className?: string }) {
  const [customLogo, setCustomLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load the custom logo from localStorage on mount
  useEffect(() => {
    try {
      const savedLogo = localStorage.getItem("aguacol_custom_logo");
      if (savedLogo) {
        setCustomLogo(savedLogo);
      }
    } catch (e) {
      console.warn("No se pudo acceder a localStorage para el logo:", e);
    }
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          try {
            localStorage.setItem("aguacol_custom_logo", base64);
            setCustomLogo(base64);
          } catch (err) {
            alert("El archivo es demasiado grande. Por favor, sube un archivo más pequeño (menor a 2MB).");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file selection
    try {
      localStorage.removeItem("aguacol_custom_logo");
      setCustomLogo(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error(err);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // If the user has uploaded/set their custom logo, render it instantly and perfectly
  if (customLogo) {
    return (
      <div 
        className="relative group cursor-pointer flex items-center justify-center border border-slate-700/50 rounded-lg bg-slate-900/45 p-1 hover:border-emerald-500 hover:bg-slate-800/60 transition-all duration-200"
        onClick={triggerFileSelect}
        title="Haz clic para cambiar el logotipo original"
      >
        <img 
          src={customLogo} 
          alt="Aguacol Original Logo" 
          className={`${className} object-contain max-h-[48px]`}
          referrerPolicy="no-referrer"
        />
        
        {/* Hidden File Picker Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleLogoUpload} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Hover Controls */}
        <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 rounded transition-opacity duration-200">
          <button 
            type="button" 
            onClick={triggerFileSelect} 
            className="p-1 bg-emerald-500 hover:bg-emerald-600 text-slate-900 rounded font-bold text-[10px] uppercase flex items-center gap-1 px-1.5 transition-transform active:scale-95"
            title="Sustituir Logo"
          >
            <Upload className="w-3 h-3" />
            Cambiar
          </button>
          
          <button 
            type="button" 
            onClick={clearLogo} 
            className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded transition-transform active:scale-95"
            title="Restablecer al predeterminado"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Fallback: A pristine, high-fidelity replica SVG of the Aguacol logo
  return (
    <div 
      className="relative group cursor-pointer flex items-center justify-center transition-all duration-200"
      onClick={triggerFileSelect}
      title="Haz clic aquí para subir tu archivo original de logotipo"
    >
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleLogoUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* High-Fidelity Handcrafted SVG matching original colors and curves */}
      <svg 
        viewBox="0 0 320 90" 
        className={`${className} w-auto`}
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        id="aguacol-corporate-logo"
      >
        <defs>
          <linearGradient id="aguacolGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#05125a" />
            <stop offset="45%" stopColor="#0a2a8c" />
            <stop offset="100%" stopColor="#1b58bf" />
          </linearGradient>
          
          <linearGradient id="waveHighlightGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0c35ab" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#1d5ecc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2580eb" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="leafLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#116b1e" />
            <stop offset="100%" stopColor="#1e541b" />
          </linearGradient>
          
          <linearGradient id="leafRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#43cf49" />
            <stop offset="100%" stopColor="#6dc736" />
          </linearGradient>

          <linearGradient id="dropletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#175ad8" />
            <stop offset="100%" stopColor="#05175c" />
          </linearGradient>
        </defs>

        {/* rounded container */}
        <rect 
          x="1.5" 
          y="1.5" 
          width="317" 
          height="87" 
          rx="15" 
          fill="url(#aguacolGrad)" 
          stroke="#1d4cca" 
          strokeWidth="1.5" 
        />

        {/* Wave swoop */}
        <path 
          d="M 1.5 88.5 
             C 40 85, 80 55, 120 48 
             C 180 38, 230 75, 318.5 65 
             L 318.5 88.5 
             Z" 
          fill="url(#waveHighlightGrad)" 
        />
        
        {/* White soft ambient overlay */}
        <path 
          d="M 1.5 88.5 
             C 30 75, 70 30, 150 15 
             C 190 8, 240 22, 318.5 5 
             L 318.5 1.5 
             L 1.5 1.5 
             Z" 
          fill="white" 
          opacity="0.06" 
        />

        {/* 'A' representation */}
        <g id="letter-A-container">
          <path 
            d="M 52.5 14 
               C 49.5 14, 43 23, 39 31 
               L 24 62.5 
               C 21.5 67.5, 23 72, 28 72 
               L 34.5 72 
               C 38 72, 40 70, 42 65 
               L 46 53.5 
               L 59 53.5 
               L 63 65 
               C 65 70, 67 72, 70.5 72 
               L 77 72 
               C 82 72, 83.5 67.5, 81 62.5 
               L 66 31 
               C 62 23, 55.5 14, 52.5 14 
               Z" 
            fill="white" 
          />
          
          <path 
            d="M 52.5 24 
               C 43.5 35, 43.5 50.5, 52.5 58.5 
               C 61.5 50.5, 61.5 35, 52.5 24 
               Z" 
            fill="#061652" 
          />

          <path 
            d="M 52.5 24 
               C 45.5 35, 45.5 48.5, 52.5 58.5 
               Z" 
            fill="url(#leafLeft)" 
          />

          <path 
            d="M 52.5 24 
               C 59.5 35, 59.5 48.5, 52.5 58.5 
               Z" 
            fill="url(#leafRight)" 
          />

          <path 
            d="M 46.5 43 
               C 39 49, 41 57.5, 48.5 57.5 
               C 52.5 57.5, 53.5 54, 49.5 49 
               C 47.5 46.5, 47.5 44.5, 46.5 43 
               Z" 
            fill="url(#dropletGrad)" 
            stroke="white"
            strokeWidth="1"
          />
        </g>

        {/* Vector text "guacol" */}
        <g fill="white" id="guacol-vector-text">
          <path 
            d="M 116 23 L 116 57 
               C 116 63, 111.5 69.5, 102.5 69.5 
               C 91.5 69.5, 86.5 64.5, 86.5 58.5 
               L 95 58.5 
               C 95 61, 97.5 63, 102.5 63 
               C 106.5 63, 108.5 61, 108.5 58 
               L 108.5 51 
               C 105.5 54, 101.5 55.5, 97.5 55.5 
               C 87.5 55.5, 81 48, 81 38 
               C 81 28, 87.5 20.5, 97.5 20.5 
               C 101.5 20.5, 105.5 22, 108.5 25 
               L 108.5 22 
               L 116 22 
               Z 
               M 98.5 27 
               C 92.5 27, 88.5 32, 88.5 38 
               C 88.5 44, 92.5 49, 98.5 49 
               C 104 49, 108 44, 108 38 
               C 108 32, 104 27, 98.5 27 
               Z" 
            fillRule="evenodd"
          />
          <path 
            d="M 124 23 L 131.5 23 L 131.5 45 
               C 131.5 49.5, 134.5 51.5, 139 51.5 
               C 143.5 51.5, 146.5 49.5, 146.5 45 
               L 146.5 23 
               L 154 23 
               L 154 54.5 
               L 146.5 54.5 
               L 146.5 48.5 
               C 143.5 52.5, 139.5 54.5, 134.5 54.5 
               C 126.5 54.5, 124 50, 124 43.5 
               Z" 
          />
          <path 
            d="M 189 23 L 189 54.5 L 181.5 54.5 L 181.5 48.5 
               C 178.5 52.5, 174.5 54.5, 169.5 54.5 
               C 159.5 54.5, 153.5 47, 153.5 38 
               C 153.5 28.5, 159.5 20.5, 169.5 20.5 
               C 174.5 20.5, 178.5 22, 181.5 25 
               L 181.5 23 
               L 189 23 
               Z 
               M 171.5 27 
               C 165.5 27, 161.5 32, 161.5 38 
               C 161.5 44, 165.5 49, 171.5 49 
               C 177 49, 181 44, 181 38 
               C 181 32, 177 27, 171.5 27 
               Z" 
            fillRule="evenodd"
          />
          <path 
            d="M 221.5 26.5 L 214.5 29.5 
               C 213 27.5, 210.5 26.5, 206 26.5 
               C 200 26.5, 195.5 31.5, 195.5 38 
               C 195.5 44.5, 200 49, 206 49 
               C 210.5 49, 213 47.5, 214.5 45.5 
               L 221.5 48.5 
               C 218.5 53, 213.5 55.5, 205.5 55.5 
               C 194 55.5, 187.5 47.5, 187.5 38 
               C 187.5 28.5, 194.5 20.5, 205.5 20.5 
               C 213.5 20.5, 218.5 22.5, 221.5 26.5 
               Z" 
          />
          <path 
            d="M 243.5 20.5 
               C 254 20.5, 261 28, 261 38 
               C 261 47.5, 254 55.5, 243.5 55.5 
               C 233 55.5, 226 47.5, 226 38 
               C 226 28, 233 20.5, 243.5 20.5 
               Z 
               M 243.5 27 
               C 237.5 27, 233.5 32, 233.5 38 
               C 233.5 44, 237.5 49, 243.5 49 
               C 249.5 49, 253.5 44, 253.5 38 
               C 253.5 32, 249.5 27, 243.5 27 
               Z" 
            fillRule="evenodd"
          />
          <path 
            d="M 267.5 13.5 L 275 13.5 L 275 54.5 L 267.5 54.5 Z" 
          />
        </g>

        {/* slogan */}
        <text 
          x="275" 
          y="78" 
          fill="white" 
          fontSize="12.5" 
          fontWeight="bold" 
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          letterSpacing="0.4px"
          textAnchor="end"
          opacity="0.95"
        >
          calidad y servicio
        </text>
      </svg>

      {/* Modern overlay guide showing how the user can instantly upload with a click */}
      <div className="absolute inset-0 bg-slate-950/85 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 rounded-xl border border-dashed border-emerald-500">
        <Upload className="w-5 h-5 text-emerald-400 animate-bounce" />
        <span className="text-[10px] font-bold text-white uppercase tracking-wider text-center px-2">
          Haga clic para subir el Logo Original
        </span>
        <span className="text-[8px] text-slate-400 font-mono">
          Formatos sugeridos: PNG / JPG o SVG
        </span>
      </div>
    </div>
  );
}
