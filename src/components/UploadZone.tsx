import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, X, FileImage, ShieldAlert } from "lucide-react";

interface UploadZoneProps {
  label: string;
  subtitle: string;
  selectedImage: string | null;
  fileName: string | null;
  onImageLoaded: (base64: string, name: string) => void;
  onClear: () => void;
  accentColor: string;
}

export default function UploadZone({
  label,
  subtitle,
  selectedImage,
  fileName,
  onImageLoaded,
  onClear,
  accentColor,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, suba únicamente archivos de imagen (PNG, JPG, JPEG, WEBP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Str = e.target?.result as string;
      if (base64Str) {
        onImageLoaded(base64Str, file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-slate-700 tracking-tight flex items-center gap-1.5">
          <div className={`w-2.5 h-2.5 rounded-full ${accentColor}`} />
          {label}
        </label>
        {fileName && (
          <span className="text-xs text-slate-400 font-mono max-w-[200px] truncate">
            {fileName}
          </span>
        )}
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={selectedImage ? undefined : triggerFileInput}
        className={`relative flex-1 min-h-[220px] rounded-xl border border-dashed flex flex-col items-center justify-center p-6 transition-all duration-300 ${
          selectedImage
            ? "border-slate-200 bg-slate-50/50"
            : isDragging
            ? "border-emerald-500 bg-emerald-50/30 ring-4 ring-emerald-50/50 cursor-pointer scale-[1.01]"
            : "border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/35 cursor-pointer"
        }`}
        id={`upload-${label.toLowerCase().replace(/\s+/g, "-")}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {selectedImage ? (
          <div className="relative w-full h-full flex flex-col items-center justify-center group">
            <div className="relative max-w-full max-h-[160px] rounded-lg overflow-hidden border border-slate-200 shadow-sm bg-white p-1">
              <img
                src={selectedImage}
                alt={label}
                className="max-w-full max-h-[150px] object-contain rounded"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center rounded">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                  className="px-3 py-1.5 bg-white text-slate-800 text-xs font-semibold rounded-md shadow-lg hover:bg-slate-100 transition-all transform scale-90 group-hover:scale-100 duration-200"
                >
                  Reemplazar
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute -top-3 -right-3 p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full shadow-md transition-transform active:scale-95"
              title="Eliminar imagen"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <FileImage className="w-3.5 h-3.5" />
              Empaque Cargado
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center p-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 mb-3 shadow-inner group-hover:scale-105 transition-transform duration-200">
              <Upload className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-800">
              Arrastra y suelta tu archivo aquí
            </p>
            <p className="text-xs text-slate-400 mt-1">
              o haz clic para explorar en tu equipo
            </p>
            <p className="text-[10px] text-slate-400 mt-3 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
