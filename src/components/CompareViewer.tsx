import { useState, useRef, MouseEvent, TouchEvent } from "react";
import { Columns, Eye, Layers, ChevronsLeftRight, Grid, Target } from "lucide-react";
import { DiscrepancyAlert } from "../types";

interface CompareViewerProps {
  oldImage: string;
  newImage: string;
  oldFileName?: string;
  newFileName?: string;
  alerts?: DiscrepancyAlert[];
  selectedAlertId?: string | null;
  onAlertClick?: (id: string) => void;
}

export default function CompareViewer({
  oldImage,
  newImage,
  oldFileName = "Arte Antiguo de Referencia",
  newFileName = "Arte Nuevo a Verificar",
  alerts = [],
  selectedAlertId = null,
  onAlertClick,
}: CompareViewerProps) {
  const [viewMode, setViewMode] = useState<"split" | "side" | "overlay">("split");
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const [opacity, setOpacity] = useState(50); // for overlay mode (0 to 100)
  const [showCartesianGrid, setShowCartesianGrid] = useState(true); // default to true for Cartesian inspection aid
  const [focusSelectedOnly, setFocusSelectedOnly] = useState(false); // only render selected alert to separate and avoid clutter
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Handle slide mouse movement
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (viewMode !== "split") return;
    // We only slide on move if mouse button is down, or we can slide tracking directly
    if (e.buttons === 1 || isDraggingRef.current) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (viewMode !== "split") return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  // Render clickable marker highlights overlays over images (using percentages 0-100)
  const renderMarkers = (imageType: "old" | "new") => {
    if (!alerts || alerts.length === 0) return null;
    
    // ONLY display alerts on the NEW image under evaluation, NOT on the original/old image
    if (imageType === "old") return null;
    
    // Filter alerts to isolate / separate errors
    const filteredAlerts = alerts.filter(alert => {
      if (focusSelectedOnly && selectedAlertId) {
        return alert.id === selectedAlertId;
      }
      return true;
    });

    return filteredAlerts.map((alert, idx) => {
      // Use boxNew primarily, fallback to boxOld if boxNew is null, to ensure it is rendered on the new image
      const box = alert.boxNew || alert.boxOld;
      if (!box) return null;

      const isSelected = selectedAlertId === alert.id;
      const x = box.x;
      const y = box.y;
      const w = Math.max(box.w || 0, 7);
      const h = Math.max(box.h || 0, 7);

      const isOldType = false; // Always render as new/discrepancy alert styling on the evaluated image

      return (
        <div key={`${imageType}-${alert.id || idx}`}>
          {/* Double ripple pulse */}
          <div
            className={`absolute rounded-full pointer-events-none animate-pulse ${
              isSelected 
                ? "bg-yellow-400/50 ring-4 ring-yellow-400" 
                : isOldType 
                  ? "bg-emerald-500/25" 
                  : "bg-rose-500/25"
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
          />
          {/* Main selectable indicator circle with card labels */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              onAlertClick?.(alert.id);
            }}
            className={`absolute rounded-full border-2 cursor-pointer flex flex-col justify-between items-center transition-all group select-none shadow hover:scale-110 ${
              isSelected
                ? "border-yellow-400 bg-yellow-400/30 ring-4 ring-yellow-400/40 z-50 animate-bounce scale-105"
                : isOldType
                  ? "border-emerald-500 bg-emerald-500/15 hover:bg-emerald-500/35 hover:border-emerald-600 z-40"
                  : "border-rose-500 bg-rose-500/15 hover:bg-rose-500/35 hover:border-rose-600 z-40"
            }`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${w}%`,
              height: `${h}%`,
            }}
          >
            {/* Tag badge with alert id */}
            <span
              className={`absolute -top-6 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono shadow-md whitespace-nowrap pointer-events-none ${
                isSelected
                  ? "bg-yellow-400 text-slate-900 border border-yellow-500"
                  : isOldType
                    ? "bg-emerald-605 text-white bg-emerald-600 border border-emerald-500"
                    : "bg-rose-605 text-white bg-rose-600 border border-rose-500"
              }`}
            >
              {isSelected ? "🔍" : isOldType ? "✓ REF:" : "🚨 ERR:"} {alert.id}
            </span>

            {/* Hover Tooltip tooltip */}
            <div className="absolute top-full mt-1.5 hidden group-hover:block bg-slate-900/95 text-white text-[10px] p-2.5 rounded-lg shadow-xl z-50 w-48 text-left pointer-events-none leading-normal border border-slate-700 backdrop-blur-sm">
              <span className={`font-bold block border-b border-white/10 pb-1 mb-1 ${isOldType ? "text-emerald-400" : "text-rose-450"}`}>
                {isOldType ? "APROBADO REFERENCIA" : "INCONSISTENCIA DETECTADA"} ({alert.id})
              </span>
              <span className="font-semibold text-white block text-[9.5px] mb-1 leading-tight">
                {alert.title}
              </span>
              <span className="text-slate-300 text-[9px] block mb-1">
                {alert.description}
              </span>
              <div className="mt-1.5 pt-1 border-t border-white/10 flex flex-col gap-0.5 text-[8px] font-mono">
                <span className="text-emerald-350 truncate">Patrón: {alert.oldValue}</span>
                <span className="text-rose-350 truncate font-semibold">Proveedor: {alert.newValue}</span>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  // Render Cartesian 10x10 grid layout over the images as a layout coordinate helper
  const renderCartesianGrid = () => {
    if (!showCartesianGrid) return null;
    const steps = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    return (
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
        {/* Horizontal grid lines */}
        {steps.map((percent) => (
          <div
            key={`h-${percent}`}
            className="absolute left-0 right-0 border-t border-slate-300/25 text-[7px] text-slate-400/80 font-mono font-medium flex items-center"
            style={{ top: `${percent}%` }}
          >
            <span className="bg-white/85 backdrop-blur-xs px-1 py-0.5 rounded-r border border-slate-205/50 -mt-1 text-[6.5px] scale-90">Y:{percent}</span>
          </div>
        ))}
        {/* Vertical grid lines */}
        {steps.map((percent) => (
          <div
            key={`v-${percent}`}
            className="absolute top-0 bottom-0 border-l border-slate-300/25 text-[7px] text-slate-400/80 font-mono font-medium"
            style={{ left: `${percent}%` }}
          >
            <span className="absolute top-1 bg-white/85 backdrop-blur-xs px-1 py-0.5 rounded border border-slate-205/50 -ml-2 text-[6.5px] scale-90">X:{percent}</span>
          </div>
        ))}
        
        {/* Border labels representing the 0-100 plano cartesiano */}
        <div className="absolute inset-x-0 top-0 flex justify-between px-1 text-[8px] font-mono text-slate-500 z-20 font-bold bg-slate-50/45 py-0.5 border-b border-dashed border-slate-205/30">
          <span>(0, 0)</span>
          <span>Eje X (Ancho: 100%)</span>
          <span>(100, 0)</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[8px] font-mono text-slate-500 z-20 font-bold bg-slate-50/45 py-0.5 border-t border-dashed border-slate-205/30">
          <span>(0, 100)</span>
          <span>Eje Y (Alto: 100%)</span>
          <span>(100, 100)</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm" id="comparison-interactive-viewer">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-800 tracking-tight">
            Herramientas de Inspección Visual
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Alterna entre modos para auditar alineación, colores, tipografía y proporciones.
          </p>
        </div>

        {/* View Mode Selectors */}
        <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-center">
          {/* Focus Selected Anomaly Toggle Button */}
          <button
            onClick={() => setFocusSelectedOnly(!focusSelectedOnly)}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              focusSelectedOnly
                ? "bg-rose-50 border-rose-200 text-rose-700 shadow-xs ring-2 ring-rose-500/10"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
            title="Aislar y encerrar inconsistencias por separado para ver detalles individualmente"
          >
            <Target className={`w-3.5 h-3.5 ${focusSelectedOnly ? "text-rose-600 animate-pulse" : ""}`} />
            <span>Ver por Separado (Lupa): {focusSelectedOnly ? "SÍ" : "NO"}</span>
          </button>

          {/* Cartesian Grid Toggle Button */}
          <button
            onClick={() => setShowCartesianGrid(!showCartesianGrid)}
            type="button"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
              showCartesianGrid
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-xs ring-2 ring-indigo-500/10"
                : "bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
            title="Activar cuadrícula del plano cartesiano"
          >
            <Grid className={`w-3.5 h-3.5 ${showCartesianGrid ? "text-indigo-600 animate-pulse" : ""}`} />
            <span>Malla Cartesiana: {showCartesianGrid ? "SÍ" : "NO"}</span>
          </button>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "split"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <ChevronsLeftRight className="w-3.5 h-3.5" />
              Deslizador
            </button>
            
            <button
              onClick={() => setViewMode("overlay")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "overlay"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Cebolla (Fusión)
            </button>

            <button
              onClick={() => setViewMode("side")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "side"
                  ? "bg-white text-slate-800 shadow-sm"
                  : "text-slate-500 hover:text-slate-850"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              Paralelo
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Canvas Viewport */}
      {viewMode === "split" && (
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-2 font-medium flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            Arrastra el control deslizante para comparar diferencias estructurales o proporciones de un vistazo.
          </p>

          <div
            ref={containerRef}
            className="relative w-full aspect-[4/3] max-h-[480px] bg-slate-100 rounded-xl overflow-hidden shadow-inner border border-slate-200 select-none cursor-ew-resize"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onMouseDown={() => { isDraggingRef.current = true; }}
            onMouseUp={() => { isDraggingRef.current = false; }}
            onMouseLeave={() => { isDraggingRef.current = false; }}
          >
            {/* New Image (Background) with interactive markers */}
            <div className="absolute inset-0 p-4">
              <div className="relative w-full h-full">
                <img
                  src={newImage}
                  alt="Nuevo"
                  className="absolute inset-0 w-full h-full object-contain"
                  draggable="false"
                  referrerPolicy="no-referrer"
                />
                {renderMarkers("new")}
                {renderCartesianGrid()}
              </div>
            </div>
            <div className="absolute bottom-3 right-3 bg-indigo-600/90 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-20">
              NUEVO: {newFileName}
            </div>
 
            {/* Old Image (Foreground with Split Width) with interactive markers clipped */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              {/* Inner container wrapper forced to remain at 100% size of parent container */}
              <div className="absolute inset-0 w-full h-full aspect-[4/3] max-h-[480px] bg-slate-100 p-4">
                <div className="relative w-full h-full">
                  <img
                    src={oldImage}
                    alt="Antiguo"
                    className="absolute inset-0 w-full h-full object-contain"
                    draggable="false"
                    referrerPolicy="no-referrer"
                    style={{ width: containerRef.current?.clientWidth ? (containerRef.current.clientWidth - 32) : "100%", maxWidth: "none" }}
                  />
                  {renderMarkers("old")}
                  {renderCartesianGrid()}
                </div>
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-emerald-600/90 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-20">
              ANTIGUO: {oldFileName}
            </div>

            {/* Slider Divider Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 shadow-xl z-30 cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-100">
                <ChevronsLeftRight className="w-4 h-4 text-slate-800" />
              </div>
            </div>
          </div>

          <div className="w-full max-w-md mt-4 flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Antiguo</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="flex-grow accent-yellow-400 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nuevo</span>
          </div>
        </div>
      )}

      {viewMode === "overlay" && (
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-400 mb-2 font-medium">
            Ajusta la opacidad para fusionar el arte nuevo encima del de referencia. Excelente para detectar pequeños desplazamientos tipográficos.
          </p>

          <div className="relative w-full aspect-[4/3] max-h-[480px] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner p-4">
            <div className="relative w-full h-full">
              {/* Old base image */}
              <img
                src={oldImage}
                alt="Antiguo"
                className="absolute inset-0 w-full h-full object-contain"
                draggable="false"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 pointer-events-none z-10">
                <div className="absolute inset-0 pointer-events-auto">
                  {renderMarkers("old")}
                </div>
              </div>

              {/* New translucent overlayed image */}
              <img
                src={newImage}
                alt="Nuevo"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-75"
                style={{ opacity: opacity / 100 }}
                draggable="false"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 pointer-events-none z-20" style={{ opacity: opacity / 100 }}>
                <div className="absolute inset-0 pointer-events-auto">
                  {renderMarkers("new")}
                </div>
              </div>

              {renderCartesianGrid()}
            </div>

            <div className="absolute top-3 left-3 bg-emerald-600/90 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-30">
              Referencia Base (Antiguo)
            </div>
            <div className="absolute top-3 right-3 bg-indigo-600/90 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur-sm z-30" style={{ opacity: opacity / 100 }}>
              Superpuesto ({opacity}%) (Nuevo)
            </div>
          </div>

          <div className="w-full max-w-md mt-4 flex items-center gap-3">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ver Referencia</span>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="flex-grow accent-indigo-650 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ver Nuevo</span>
          </div>
        </div>
      )}

      {viewMode === "side" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 animate-fadeIn">
            <div className="bg-emerald-50 text-emerald-800 text-xs px-3 py-2 font-semibold border-b border-emerald-100 flex justify-between items-center animate-pulse-slow">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Referencia Aprobada (Antiguo)
              </span>
              <span className="text-[10px] font-mono text-emerald-650">{oldFileName}</span>
            </div>
            <div className="flex-1 aspect-[4/3] p-4 flex items-center justify-center bg-white relative">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={oldImage}
                  alt="Antiguo"
                  className="max-h-full max-w-full object-contain absolute"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 pointer-events-none">
                  {/* We enable pointer events on markers inside renderMarkers */}
                  <div className="absolute inset-0 pointer-events-auto">
                    {renderMarkers("old")}
                    {renderCartesianGrid()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 animate-fadeIn">
            <div className="bg-indigo-50 text-indigo-800 text-xs px-3 py-2 font-semibold border-b border-indigo-100 flex justify-between items-center animate-pulse-slow">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                Muestra Recibida (Nuevo)
              </span>
              <span className="text-[10px] font-mono text-indigo-650">{newFileName}</span>
            </div>
            <div className="flex-1 aspect-[4/3] p-4 flex items-center justify-center bg-white relative">
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={newImage}
                  alt="Nuevo"
                  className="max-h-full max-w-full object-contain absolute"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 pointer-events-auto">
                    {renderMarkers("new")}
                    {renderCartesianGrid()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
