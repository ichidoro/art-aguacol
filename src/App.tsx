import { useState, useEffect, MouseEvent } from "react";
import { 
  FileText, 
  History, 
  Activity, 
  CheckCircle, 
  AlertOctagon, 
  Upload as UploadIcon, 
  Sparkles, 
  Printer, 
  ChevronRight, 
  Trash2, 
  Gauge, 
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Info,
  Download,
  Plus
} from "lucide-react";
import UploadZone from "./components/UploadZone";
import AguacolLogo from "./components/AguacolLogo";
import CompareViewer from "./components/CompareViewer";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import { ComparisonReport, ComparisonData, DiscrepancyAlert, UserAccount } from "./types";
import { downloadReportPDF } from "./utils/pdfGenerator";
import { compressBase64Image } from "./utils/compressor";

// Import sample packaging design mockups as base64 or custom static descriptions
import { SAMPLE_OLD_LABEL, SAMPLE_NEW_LABEL, SAMPLE_OLD_AROMATIZANTE, SAMPLE_NEW_AROMATIZANTE } from "./sampleLabels";

export const DEFAULT_QUALITY_PAUTA = `Analizar ambas etiquetas como un inspector de pautas de calidad gráfica profesional con el siguiente enfoque de alta precisión:

🔍 REVISIÓN EXHAUSTIVA DETALLADA (ELEMENTO POR ELEMENTOS - PIXEL POR PIXEL):
- Textos (errores ortográficos, cambios de palabras, espacios, saltos de línea, tamaños y tipos de letra).
- Colores (variaciones de tonalidad, saturación, brillo y degradados).
- Logotipos (posición, tamaño, proporciones y calidad).
- Códigos de barras, QR y numeraciones.
- Tablas, iconos y símbolos.
- Alineación y distribución de elementos.
- Márgenes y distancias entre objetos.
- Imágenes y fotografías.
- Resolución, nitidez y calidad de impresión.
- Dimensiones de cada elemento.
- Capas ocultas o elementos faltantes.
- Diferencias de tamaño en milímetros o píxeles cuando sea posible.

🎯 REGLA DE CONCENTRACIÓN SEGÚN CONFIGURACIÓN:
- Si se activa 'Limitar sólo a Etiqueta Principal', concéntrate prioritariamente en el diseño de la etiqueta expuesta (ilustraciones, colores de fondo principal, distorsiones del logotipo central, etc.) e ignora las tablas de información nutricional, tablas de ingredientes, códigos de barras, y textos legales reglamentarios traseros.
- Si no está activado, realiza un análisis completo incluyendo todas las tablas y textos secundarios.

🌐 TÉCNICAS EXTRA DE NIVEL PROFESIONAL APLICABLES:
1. Comparación OCR contra OCR: Extraer y contrastar textos de modo electrónico literal.
2. Comparación de histogramas de color: Analizar la distribución de luminancia y tonalidades completas.
3. Detección de diferencias CMYK: Prevenir desviaciones e inconsistencias cromáticas en los canales de pre-prensa.
4. Análisis de sangrado (bleed): Garantizar que los rebasamientos gráficos sobrepasen el troquel de corte.
5. Revisión de zonas seguras: Evitar textos o logotipos vulnerables a mermas por corte.
6. Comparación de porcentajes de cobertura de tinta: Asegurar coberturas de pigmento técnica y comercialmente viables.
7. Detección de objetos vectoriales modificados: Fiscalizar alteraciones sutiles en curvas complejas o contornos bezier.
8. Revisión de consistencia de branding: Salvaguardar directrices estrictas del manual corporativo.
9. Verificación de requisitos regulatorios: Cumplir estándares obligatorios vigentes de legibilidad y advertencias.
10. Análisis de contraste y legibilidad: Garantizar óptimo contraste óptico de la tipografía legal chica contra el fondo.

⭐ DIRECTIVAS DE AUDITORÍA AVANZADA OBLIGATORIAS:
1) Haz una segunda revisión independiente para confirmar todos tus hallazgos.
2) No ignores diferencias pequeñas. Actúa como una lupa digital de alta precisión.
3) Enumera cada diferencia encontrada, aunque parezca insignificante.
4) Si no estás seguro de una diferencia, márcala como "requiere verificación" en lugar de descartarla.`;

interface InspectionTechnique {
  id: number;
  name: string;
  detects: string;
  directive: string;
}

export const INSPECTION_TECHNIQUES: InspectionTechnique[] = [
  { id: 1, name: "Comparación píxel a píxel", detects: "Diferencias mínimas de color, forma o posición.", directive: "💡 Aplicar técnica 1 (Comparación píxel a píxel): Auditar detalladamente colores, tonalidades y descalces microscópicos píxel por píxel." },
  { id: 2, name: "Comparación por cuadrantes", detects: "Divide la etiqueta en secciones y revisa cada una individualmente.", directive: "💡 Aplicar técnica 2 (Comparación por cuadrantes): Dividir la etiqueta en cuadrantes y reportar separadamente según el plano cartesiano." },
  { id: 3, name: "Superposición de imágenes", detects: "Elementos desplazados o faltantes.", directive: "💡 Aplicar técnica 3 (Superposición de imágenes): Buscar desfases, desplazamientos o ausencias relativas superponiendo ambas capas vectoriales." },
  { id: 4, name: "Detección de diferencias por transparencia", detects: "Cambios casi imperceptibles en diseño.", directive: "💡 Aplicar técnica 4 (Diferencias por transparencia): Evaluar variaciones de mezcla de tintas de fondo y cambios semi-transparentes ocultos." },
  { id: 5, name: "Revisión de alineación", detects: "Objetos descentrados o mal posicionados.", directive: "💡 Aplicar técnica 5 (Revisión de alineación): Estudiar la alineación geométrica de nombres, logotipos secundarios, y advertencias legales." },
  { id: 6, name: "Medición de distancias", detects: "Espacios inconsistentes entre elementos.", directive: "💡 Aplicar técnica 6 (Medición de distancias): Comprobar márgenes simétricos y distancias en milímetros/píxeles entre las franjas y el troquel." },
  { id: 7, name: "Comparación tipográfica", detects: "Cambios de fuente, tamaño, grosor o interlineado.", directive: "💡 Aplicar técnica 7 (Comparación tipográfica): Detectar variaciones de familias tipográficas, grosor de fuente o espaciados de kerning." },
  { id: 8, name: "Revisión ortográfica avanzada", detects: "Errores de escritura o cambios de texto.", directive: "💡 Aplicar técnica 8 (Revisión ortográfica avanzada): Buscar faltas de ortografía, tildes, duplicados, espacios dobles o cambios de palabras." },
  { id: 9, name: "Comparación cromática", detects: "Variaciones de colores corporativos.", directive: "💡 Aplicar técnica 9 (Comparación cromática): Examinar desviaciones de color en logotipo principal AGUACOL y fondos degradados." },
  { id: 10, name: "Detección de cambios de resolución", detects: "Imágenes pixeladas o de menor calidad.", directive: "💡 Aplicar técnica 10 (Cambios de resolución): Desglosar la fidelidad y nitidez gráfica reportando imágenes pixeladas o con ruidos de impresión." },
  { id: 11, name: "Revisión de logotipos", detects: "Diferencias en proporción, tamaño o ubicación.", directive: "💡 Aplicar técnica 11 (Revisión de logotipos): Contrastar el escalamiento de los isotipos principales asegurando que no haya estiración horizontal." },
  { id: 12, name: "Comparación de códigos de barras", detects: "Códigos de barra o QR distintos o modificados.", directive: "💡 Aplicar técnica 12 (Comparación de códigos de barras): Validar la numeración y legibilidad del código de barras y códigos QR del empaque." },
  { id: 13, name: "Verificación de tablas nutricionales o técnicas", detects: "Datos nutricionales modificados o desplazados.", directive: "💡 Aplicar técnica 13 (Verificación de tablas nutricionales): Comprobar que los datos, porcentajes y renglones de la tabla nutricional no muestren desfases." },
  { id: 14, name: "Revisión de iconografía", detects: "Símbolos faltantes, nuevos o alterados.", directive: "💡 Aplicar técnica 14 (Revisión de iconografía): Contrastar la presencia e integridad de símbolos de contacto, reciclaje u advertencia." },
  { id: 15, name: "Detección de elementos ocultos", detects: "Objetos tapados o eliminados accidentalmente.", directive: "💡 Aplicar técnica 15 (Detección de elementos ocultos): Buscar capas e hilados ocultos que puedan obstruir los gráficos originales." },
  { id: 16, name: "Comparación de bordes y contornos", detects: "Diferencias de troquel, marcos o líneas.", directive: "💡 Aplicar técnica 16 (Bordes y contornos): Medir precisión en el contorno del troquel de imprenta para asegurar calce perfecto." },
  { id: 17, name: "Inspección de capas visuales", detects: "Objetos delante o detrás de capas incorrectamente.", directive: "💡 Aplicar técnica 17 (Inspección de capas): Verificar la posición relativa de las capas para evitar solapamientos incorrectos de texto." },
  { id: 18, name: "Análisis de consistencia de márgenes", detects: "Márgenes desiguales o deformados.", directive: "💡 Aplicar técnica 18 (Consistencia de márgenes): Controlar márgenes regulares de seguridad perimetral contra posibles desgarres de troquelado." },
  { id: 19, name: "Detección de duplicados o faltantes", detects: "Elementos gráficos repetidos o ausentes.", directive: "💡 Aplicar técnica 19 (Duplicados o faltantes): Constatar la repetición o ausencia indebida de textos informativos o legales." },
  { id: 20, name: "Auditoría de preprensa completa", detects: "Revisión integral como arte final para impresión.", directive: "💡 Aplicar técnica 20 (Auditoría de preprensa): Revisar aspectos técnicos de corte, rebasamiento, fuentes incrustadas y tintas directas." },
  { id: 21, name: "Comparación OCR contra OCR", detects: "Diferencias literales en el texto del empaque.", directive: "💡 Aplicar técnica 21 (Comparación OCR): Extraer y comparar todo el texto del diseño vía OCR para certificar similitud ortográfica absoluta." },
  { id: 22, name: "Comparación de histogramas de color", detects: "Variaciones de tonalidad, luminancia y contrastes de fondo.", directive: "💡 Aplicar técnica 22 (Histogramas de color): Contrastar los histogramas de color para certificar consistencia en brillo, degradado y transiciones." },
  { id: 23, name: "Detección de diferencias CMYK", detects: "Desviaciones del perfil de color de impresión.", directive: "💡 Aplicar técnica 23 (Diferencias CMYK): Auditar desvíos cromáticos simulando la descomposición de tintas de imprenta (Cian, Magenta, Amarillo y Negro)." },
  { id: 24, name: "Análisis de sangrado (bleed)", detects: "Tolerancias de corte perimetral en troqueles.", directive: "💡 Aplicar técnica 24 (Análisis de sangrado - bleed): Controlar la extensión adecuada de fondos sobre la línea de troquel exterior para evitar bordes blancos." },
  { id: 25, name: "Revisión de zonas seguras", detects: "Gráficos o textos importantes en riesgo de corte.", directive: "💡 Aplicar técnica 25 (Zonas seguras): Certificar que ningún texto legal u isotipo relevante esté dentro de los 3mm críticos de corte del troquel." },
  { id: 26, name: "Porcentajes de cobertura de tinta", detects: "Saturación excesiva o acumulación incorrecta de tinta.", directive: "💡 Aplicar técnica 26 (Cobertura de tinta): Evaluar si el porcentaje acumulado de cobertura de tintas supera el límite técnico recomendado para offset (máx 300%)." },
  { id: 27, name: "Detección de objetos vectoriales modificados", detects: "Cambios en curvas bezier o trazados tipográficos.", directive: "💡 Aplicar técnica 27 (Objetos vectoriales modificados): Estudiar la fidelidad de vectores, detectando curvas distorsionadas o nodos alterados." },
  { id: 28, name: "Revisión de consistencia de branding", detects: "Fidelidad rigurosa del logotipo y manual de marca.", directive: "💡 Aplicar técnica 28 (Consistencia de branding): Confrontar logos e isotipos contra el manual de identidad corporativa de AGUACOL." },
  { id: 29, name: "Verificación de requisitos regulatorios", detects: "Cumplimiento en dimensiones de advertencias u octógonos.", directive: "💡 Aplicar técnica 29 (Verificación de requisitos regulatorios): Analizar el tamaño exacto y legibilidad legal de los octógonos de advertencia, lote, y fecha." },
  { id: 30, name: "Análisis de contraste y legibilidad", detects: "Relación de contraste tipográfico de textos de menor tamaño.", directive: "💡 Aplicar técnica 30 (Contraste y legibilidad): Validar la relación de contraste (según estándares de empaque) de la letra chica reglamentaria contra su fondo inmediato." },
];

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem("_aguacol_logged_in_user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    localStorage.setItem("_aguacol_logged_in_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("_aguacol_logged_in_user");
  };

  // Active module for sidebar navigation
  const [activeModule, setActiveModule] = useState("revision-etiquetas");

  // History list
  const [history, setHistory] = useState<ComparisonReport[]>([]);
  // Currently active report being displayed
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  // Selected discrepancy alert to circle on the visual inspector
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedAlertId(null);
  }, [activeReportId]);

  // Upload inputs
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [oldFileName, setOldFileName] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState<string | null>(null);

  // Dynamic extra alternative candidates for multi-comparison
  const [extraCandidates, setExtraCandidates] = useState<Array<{ id: string; image: string | null; fileName: string | null }>>([]);
  const [scanningMsg, setScanningMsg] = useState("");

  const [additionalContext, setAdditionalContext] = useState(DEFAULT_QUALITY_PAUTA);
  const [onlyMainLabel, setOnlyMainLabel] = useState(true);

  // Custom name of PDF to download
  const [pdfCustomName, setPdfCustomName] = useState("");

  // Sync custom PDF filename with active report changes
  useEffect(() => {
    const actReport = history.find((r) => r.id === activeReportId);
    if (actReport) {
      const baseName = actReport.newFileName
        ? actReport.newFileName.replace(/\.[^/.]+$/, "")
        : `Reporte_QA_${actReport.id}`;
      setPdfCustomName(`Reporte_QA_Aguacol_${baseName}`);
    } else {
      setPdfCustomName("");
    }
  }, [activeReportId, history]);

  // 30 Digital inspection techniques state
  const [techniqueFilter, setTechniqueFilter] = useState("");
  const handleInjectTechnique = (tech: (typeof INSPECTION_TECHNIQUES)[0]) => {
    if (additionalContext.includes(tech.directive)) {
      setAdditionalContext((prev) => {
        return prev
          .replace(tech.directive, "")
          .replace(/\n\n+/g, "\n")
          .trim();
      });
    } else {
      setAdditionalContext((prev) => {
        const trimmed = prev.trim();
        const separator = trimmed === "" ? "" : "\n";
        return trimmed + separator + tech.directive;
      });
    }
  };

  const handleSelectAll = () => {
    setAdditionalContext((prev) => {
      let updated = prev;
      INSPECTION_TECHNIQUES.forEach((tech) => {
        if (!updated.includes(tech.directive)) {
          const trimmed = updated.trim();
          const separator = trimmed === "" ? "" : "\n";
          updated = trimmed + separator + tech.directive;
        }
      });
      return updated;
    });
  };

  const handleDeselectAll = () => {
    setAdditionalContext((prev) => {
      let updated = prev;
      INSPECTION_TECHNIQUES.forEach((tech) => {
        updated = updated.replace(tech.directive, "");
      });
      return updated.replace(/\n\n+/g, "\n").trim();
    });
  };

  const handleAddCandidate = () => {
    setExtraCandidates((prev) => [
      ...prev,
      { id: String(Date.now() + Math.random()), image: null, fileName: null }
    ]);
  };

  const handleRemoveCandidate = (id: string) => {
    setExtraCandidates((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdateCandidate = (id: string, image: string | null, fileName: string | null) => {
    setExtraCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, image, fileName } : c))
    );
  };

  // Loading & error states
  const [isComparing, setIsComparing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  // Custom modal-less deletion confirmation states for sandbox safety
  const [reportIdToDelete, setReportIdToDelete] = useState<string | null>(null);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);

  // Load initial history with samples if empty
  useEffect(() => {
    const saved = localStorage.getItem("art-aguacol-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ComparisonReport[];
        setHistory(parsed);
        if (parsed.length > 0) {
          setActiveReportId(parsed[0].id);
        }
      } catch (e) {
        console.error("Error decoding saved logs:", e);
      }
    } else {
      // Setup majestic initial mock reports for onboarding
      const defaultReports: ComparisonReport[] = [
        {
          id: "AUDIT-2026-001",
          timestamp: "03/06/2026 12:44:15",
          oldFileName: "Aguacol_ConGas_1500ml_V3_Ref.png",
          newFileName: "Aguacol_ConGas_1500ml_V4_ProveedorSello.png",
          oldImage: SAMPLE_OLD_LABEL,
          newImage: SAMPLE_NEW_LABEL,
          additionalContext: "Verificar cambio de proveedor. Comprobar que no hayan alterado la tabla nutricional ni estirado el logotipo.",
          results: {
            similarityScore: 82,
            isApproved: false,
            verdict: "Rechazado debido a cambios tipográficos severos en el texto de regulación sanitaria y estiramiento del logo de Aguacol en el panel principal.",
            detailedAnalysis: {
              color: "La paleta de colores mantiene los azules de fondo estables. Sin embargo, se identificó un incremento del 8% en la saturación del celeste decorativo del fondo, lo que podría provocar variaciones con el acabado metálico de las botellas.",
              typography: "La sección de ingredientes y tabla nutricional ha sido modificada sustancialmente. El tamaño de letra de 'Sodio' y 'Gasificación' disminuyó de 8.5pt a un ilegible 5.5pt. Adicionalmente, el texto legal obligatorio 'Registro Sanitario RS-CO-2025' ha sido omitido en la versión enviada por el nuevo proveedor.",
              proportions: "Se observa una desalineación de 4.5mm en el cuerpo principal del banner del logo. Los márgenes de sangrado izquierdo de la etiqueta disminuyeron un 12%, lo que podría ocasionar un corte de empaquetado defectuoso en la cinta de sellado continuo.",
              images: "El logotipo principal de AGUACOL presenta una distorsión de relación de aspecto. Ha sido ligeramente estirado horizontalmente en un 14%, perdiendo la geometría de marca registrada original. Se requiere corregir de inmediato."
            },
            discrepancyAlerts: [
              {
                id: "DISC-01",
                category: "Imagen",
                severity: "Alta",
                title: "Deformación Geométrica en Logotipo",
                description: "El logotipo central de AGUACOL fue escalado de manera no uniforme, estirándolo horizontalmente y alterando la identidad de marca.",
                oldValue: "Proporción 1:1 original, simétrico e impecable.",
                newValue: "Imagen estirada horizontalmente en un 14% (Relación alterada).",
                boxOld: { x: 42, y: 35, w: 16, h: 25 },
                boxNew: { x: 42, y: 35, w: 16, h: 25 }
              },
              {
                id: "DISC-02",
                category: "Tipografía",
                severity: "Alta",
                title: "Falta Sello y Texto Legal Obligatorio",
                description: "Se omitió el texto de exención legal 'Registro Sanitario RS-CO-2025' de la etiqueta posterior, fundamental para la comercialización legal.",
                oldValue: "Texto presente en panel de sanidad posterior, Arial 7.5pt.",
                newValue: "Espacio vacío (Texto completamente eliminado).",
                boxOld: { x: 74, y: 78, w: 20, h: 10 },
                boxNew: { x: 74, y: 78, w: 20, h: 10 }
              },
              {
                id: "DISC-03",
                category: "Tipografía",
                severity: "Media",
                title: "Reducción de Contratipo Nutricional",
                description: "Se disminuyó el cuerpo de la fuente tipográfica de la tabla de sodio y minerales para ganar espacio estético, dificultando la lectura del consumidor.",
                oldValue: "Letra a un tamaño regulatorio de 8.5 puntos.",
                newValue: "Letra reducida drásticamente a 5.5 puntos.",
                boxOld: { x: 7, y: 22, w: 22, h: 32 },
                boxNew: { x: 7, y: 22, w: 22, h: 32 }
              }
            ]
          }
        }
      ];
      setHistory(defaultReports);
      setActiveReportId(defaultReports[0].id);
      localStorage.setItem("art-aguacol-history", JSON.stringify(defaultReports));
    }
  }, []);

  // Sync state to LocalStorage
  const updateHistoryAndSave = (updated: ComparisonReport[]) => {
    setHistory(updated);
    try {
      localStorage.setItem("art-aguacol-history", JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage quota limit detected, automatically pruning historical image payloads...", e);
      let clone = JSON.parse(JSON.stringify(updated)) as ComparisonReport[];
      let savedSuccessfully = false;

      // Keep active report's and latest report's image payloads, but purge older ones to save huge spaces
      for (let i = clone.length - 1; i >= 0; i--) {
        if (clone[i].id === activeReportId) continue;
        if (i === 0) continue; // Keep the very latest one intact

        clone[i].oldImage = "";
        clone[i].newImage = "";

        try {
          localStorage.setItem("art-aguacol-history", JSON.stringify(clone));
          setHistory(clone);
          savedSuccessfully = true;
          break;
        } catch (ex) {
          // Still too big, continue pruning
        }
      }

      // If still failing, keep a maximum of 5 reports and clear their images
      if (!savedSuccessfully) {
        try {
          const trimmed = clone.slice(0, 5).map((report, idx) => {
            if (idx === 0) return report;
            return { ...report, oldImage: "", newImage: "" };
          });
          localStorage.setItem("art-aguacol-history", JSON.stringify(trimmed));
          setHistory(trimmed);
        } catch (ex) {
          console.error("Critical storage clean up triggered.");
          localStorage.removeItem("art-aguacol-history");
        }
      }
    }
  };

  // Steps for realistic scanning illusion
  const scanSteps = [
    "Leyendo archivos de empaque...",
    "Extrayendo paleta cromática de tintas...",
    "Analizando cuerpos y fuentes tipográficas...",
    "Verificando alineación geométrica y proporciones de imágenes...",
    "Comparando con modelo de visión artificial ETIQUETAS AGUACOL...",
    "Generando informe detallado de discrepancias..."
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isComparing) {
      timer = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < scanSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isComparing]);

  const activeReport = history.find((r) => r.id === activeReportId) || null;

  // Process the comparison call
  const handleCompareArtes = async () => {
    // Collect all valid new art candidates
    const activeCandidates: Array<{ image: string; fileName: string }> = [];
    if (newImage) {
      activeCandidates.push({ image: newImage, fileName: newFileName || "ArteNuevo.png" });
    }
    extraCandidates.forEach((c, idx) => {
      if (c.image) {
        activeCandidates.push({ image: c.image, fileName: c.fileName || `Alternativa_${idx + 1}.png` });
      }
    });

    if (!oldImage) {
      setErrorMessage("Por favor, cargue el Arte Antiguo de Referencia antes de proceder con el escaneo.");
      return;
    }
    if (activeCandidates.length === 0) {
      setErrorMessage("Por favor, cargue al menos un Arte Nuevo a Auditar (Muestra o Alternativa) antes de proceder con el escaneo.");
      return;
    }

    setErrorMessage(null);
    setIsComparing(true);
    setLoadingStep(0);
    setScanningMsg(activeCandidates.length > 1 ? `[1/${activeCandidates.length}] Procesando primera etiqueta...` : "");

    try {
      let currentHistory = [...history];
      let lastCreatedReportId: string | null = null;

      // Compress reference image once
      const apiOldImage = await compressBase64Image(oldImage, 1200, 0.82);
      const compressedOld = await compressBase64Image(apiOldImage, 600, 0.7);

      for (let i = 0; i < activeCandidates.length; i++) {
        const candidate = activeCandidates[i];
        if (activeCandidates.length > 1) {
          setScanningMsg(`[${i + 1}/${activeCandidates.length}] Analizando: ${candidate.fileName}...`);
        }

        // Compress candidate image
        const apiNewImage = await compressBase64Image(candidate.image, 1200, 0.82);

        const response = await fetch("/api/compare", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldImage: apiOldImage,
            newImage: apiNewImage,
            oldFileName: oldFileName || "ArteAntiguo.png",
            newFileName: candidate.fileName,
            additionalContext: additionalContext,
            onlyMainLabel: onlyMainLabel,
          }),
        });

        const responseText = await response.text();
        let resJson: any;
        try {
          resJson = JSON.parse(responseText);
        } catch (parseError) {
          console.error("No se pudo parsear como JSON:", responseText);
          if (response.status === 413 || responseText.includes("Payload Too Large")) {
            throw new Error(`[${candidate.fileName}] El tamaño de la imagen supera el límite máximo de 50MB.`);
          }
          if (responseText.includes("GEMINI_API_KEY")) {
            throw new Error("La clave GEMINI_API_KEY no está configurada o es inválida en AI Studio.");
          }
          throw new Error(`[${candidate.fileName}] El servidor devolvió un resultado no estructurado.`);
        }

        if (!response.ok || !resJson.success) {
          throw new Error(resJson.error || `Error analizando la etiqueta ${candidate.fileName}`);
        }

        const results = resJson.data as ComparisonData;
        const compressedNew = await compressBase64Image(apiNewImage, 600, 0.7);

        const newReport: ComparisonReport = {
          id: "AUDIT-" + new Date().getFullYear() + "-" + String(Date.now() + i).slice(-4),
          timestamp: new Date().toLocaleString("es-CO", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric", 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit" 
          }),
          oldFileName: oldFileName || "ArteAntiguo.png",
          newFileName: candidate.fileName,
          oldImage: compressedOld,
          newImage: compressedNew,
          additionalContext: additionalContext,
          results: results,
        };

        currentHistory = [newReport, ...currentHistory];
        lastCreatedReportId = newReport.id;
      }

      updateHistoryAndSave(currentHistory);
      if (lastCreatedReportId) {
        setActiveReportId(lastCreatedReportId);
      }
      
      // Reset inputs
      setOldImage(null);
      setOldFileName(null);
      setNewImage(null);
      setNewFileName(null);
      setExtraCandidates([]);
      setAdditionalContext("");
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Error de red al conectar con el servidor de análisis ETIQUETAS AGUACOL.");
    } finally {
      setIsComparing(false);
      setScanningMsg("");
    }
  };

  const triggerDeleteReport = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setReportIdToDelete(id);
  };

  const confirmDeleteReport = (id: string) => {
    const filtered = history.filter((r) => r.id !== id);
    updateHistoryAndSave(filtered);
    if (activeReportId === id) {
      setActiveReportId(filtered.length > 0 ? filtered[0].id : null);
    }
    setReportIdToDelete(null);
  };

  const confirmClearHistory = () => {
    updateHistoryAndSave([]);
    setActiveReportId(null);
    setShowClearAllConfirm(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!activeReport) return;
    setIsDownloadingPdf(true);
    try {
      await downloadReportPDF(activeReport, pdfCustomName);
    } catch (err) {
      console.error("Error generating PDF document:", err);
      alert("Hubo un contratiempo temporal al preparar el documento PDF. Por favor, inténtelo de nuevo.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Helper to trigger loading Aguacol Agua Mineral demo images
  const setDemoAguacol = () => {
    setOldImage(SAMPLE_OLD_LABEL);
    setOldFileName("Aguacol_ConGas_1500ml_V3_Ref.png");
    setNewImage(SAMPLE_NEW_LABEL);
    setNewFileName("Aguacol_ConGas_1500ml_V4_ProveedorSello.png");
    setAdditionalContext("Auditar cambios por cambio de proveedor de etiquetas. Analizar logotipos y el tamaño de la letra legal posterior.");
  };

  // Helper to trigger loading Aromatizante Algodón demo images (Specific request)
  const setDemoAromatizante = () => {
    setOldImage(SAMPLE_OLD_AROMATIZANTE);
    setOldFileName("Original_Aromatizante_Algodon_Aprobado.png");
    setNewImage(SAMPLE_NEW_AROMATIZANTE);
    setNewFileName("Proveedor_Aromatizante_Algodon_Muestra.png");
    setAdditionalContext("Analizar detalladamente el color de fondo (saturación y contraste), la tipografía del aroma 'ALGODÓN' (revisar si cambió el estilo de letra), los brillos dorados del fondo ('brillos que caen' que faltan), y el tamaño menor de los datos legales y de contacto de la empresa en la parte inferior.");
  };

  const setDemoImages = () => {
    setDemoAguacol();
  };

  // Overall counts for dashboard summary card
  const totalAudits = history.length;
  const approvedAudits = history.filter((r) => r.results.isApproved).length;
  const rejectedAudits = history.filter((r) => !r.results.isApproved).length;
  const totalAlerts = history.reduce((acc, curr) => acc + curr.results.discrepancyAlerts.length, 0);

  // Filter 30 inspection techniques based on user's query search text
  const filteredTechniques = INSPECTION_TECHNIQUES.filter((tech) => {
    const q = techniqueFilter.trim().toLowerCase();
    if (!q) return true;
    return tech.name.toLowerCase().includes(q) || tech.detects.toLowerCase().includes(q);
  });

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        currentUser={currentUser}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* HEADER COCKPIT BAR */}
        <header className="bg-slate-900 text-white shadow-md border-b-4 border-emerald-500 no-print">
          <div className="px-4 py-3 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center gap-3 pl-10 lg:pl-0">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold uppercase tracking-tight">ETIQUETAS AGUACOL</h1>
                  <span className="bg-emerald-500/25 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-mono border border-emerald-500/30">Vision AI QA v1.8</span>
                </div>
                <p className="text-xs text-slate-400 font-light">
                  Sistema Automatizado de Control de Calidad de Etiquetas y Artes Gráficos
                </p>
              </div>
            </div>
            <AguacolLogo className="h-9 md:h-11 w-auto shadow-md rounded-lg" />
          </div>
        </header>

        {/* DASHBOARD CONTAINER */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 no-print">
        {/* STATS TILES */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              <History className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lotes Auditados</p>
              <p className="text-lg font-bold text-slate-800 font-mono">{totalAudits}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aprobaciones</p>
              <p className="text-lg font-bold text-emerald-600 font-mono">{approvedAudits}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rechazados</p>
              <p className="text-lg font-bold text-rose-600 font-mono">{rejectedAudits}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Discrepancias</p>
              <p className="text-lg font-bold text-amber-600 font-mono">{totalAlerts}</p>
            </div>
          </div>
        </section>

        {/* WORKSPACE LAYOUT (LEFT: Uploader / History, RIGHT: Results Viewer) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: CONTROL & PAST CHECKS */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* COMPARATOR TRIGGER BOX */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide mb-4">
                <UploadIcon className="w-4 h-4 text-emerald-600" />
                Nueva Comparación de Empaques
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Reference upload */}
                <UploadZone
                  label="Arte Antiguo de Referencia"
                  subtitle="El archivo patrón aprobado (.png, .jpg)"
                  selectedImage={oldImage}
                  fileName={oldFileName}
                  onImageLoaded={(base64, name) => {
                    setOldImage(base64);
                    setOldFileName(name);
                  }}
                  onClear={() => {
                    setOldImage(null);
                    setOldFileName(null);
                  }}
                  accentColor="bg-emerald-500"
                />

                {/* Audit candidate upload */}
                <UploadZone
                  label="Arte Nuevo a Auditar"
                  subtitle="El archivo bajo prueba del proveedor"
                  selectedImage={newImage}
                  fileName={newFileName}
                  onImageLoaded={(base64, name) => {
                    setNewImage(base64);
                    setNewFileName(name);
                  }}
                  onClear={() => {
                    setNewImage(null);
                    setNewFileName(null);
                  }}
                  accentColor="bg-indigo-500"
                />
              </div>

              {/* BATCH ACTION TO ADD MORE CANDIDATE ALTERNATIVES */}
              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Alternativas de Arte Adicionales ({extraCandidates.length}):</span>
                <button
                  type="button"
                  onClick={handleAddCandidate}
                  className="text-[11px] bg-indigo-50 hover:bg-slate-200 active:scale-95 text-indigo-700 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs flex items-center gap-1.5 transition cursor-pointer"
                  title="Agregar otra alternativa del proveedor para comparar en simultáneo con el original"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar Alternativa</span>
                </button>
              </div>

              {extraCandidates.length > 0 && (
                <div className="mt-3 space-y-3 p-3 bg-slate-50 border border-slate-205 rounded-xl animate-fade-in">
                  {extraCandidates.map((candidate, index) => (
                    <div key={candidate.id} className="relative bg-white border border-slate-200 rounded-lg p-3 shadow-3xs">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-150 px-2.5 py-0.5 rounded-full">
                          Alternativa #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveCandidate(candidate.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 active:scale-95 transition cursor-pointer"
                          title="Eliminar esta alternativa"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <UploadZone
                        label={`Arte Alternativo ${index + 1}`}
                        subtitle="Muestra o versión alternativa bajo evaluación"
                        selectedImage={candidate.image}
                        fileName={candidate.fileName}
                        onImageLoaded={(base64, name) => {
                          handleUpdateCandidate(candidate.id, base64, name);
                        }}
                        onClear={() => {
                          handleUpdateCandidate(candidate.id, null, null);
                        }}
                        accentColor="bg-indigo-400"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Extra instructions with premium presets */}
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 label-pauta-ajustes">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <span>Pauta de Inspección (Mensaje Genérico):</span>
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdditionalContext(DEFAULT_QUALITY_PAUTA)}
                      className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-bold flex items-center gap-1 transition cursor-pointer"
                      title="Cargar la pauta de control de calidad estandarizada"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                      Cargar Pauta Estándar
                    </button>
                    {additionalContext && (
                      <button
                        type="button"
                        onClick={() => setAdditionalContext("")}
                        className="text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded-md font-medium transition cursor-pointer"
                        title="Limpiar campo"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                </div>
                
                <textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Escribe o personaliza los puntos a revisar obligatoriamente..."
                  rows={4}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 font-mono text-slate-700 focus:border-indigo-500 focus:ring focus:ring-indigo-100 placeholder-slate-400 bg-white shadow-inner transition leading-relaxed resize-y"
                />
                
                <div className="mt-2.5 border-t border-slate-200/60 pt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">Rápidos:</span>
                  <button
                    type="button"
                    onClick={() => setAdditionalContext(`Realizar auditoría minuciosa cuadro a cuadro en plano cartesiano. Enfocar con lupa extrema en el fondo e ilustraciones: revisar si el proveedor incluyó marcas de agua o texturas de rocas de fondo añadidas sin autorización previo diseño oficial.`)}
                    className="text-[9.5px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition cursor-pointer"
                  >
                    🎨 Solo Fondo/Rocas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdditionalContext(`Realizar auditoría minuciosa cuadro a cuadro en plano cartesiano. Enfocar con lupa extrema en textos tipográficos legales, tablas de ingredientes, exención sanitaria y de sodio corporativo, controlando la nitidez de la tipografía.`)}
                    className="text-[9.5px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition cursor-pointer"
                  >
                    ✍️ Letras y Nutricional
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdditionalContext(`Realizar auditoría minuciosa cuadro a cuadro en plano cartesiano. Enfocar en geometría del logotipo y relación de aspecto, revisando estiramientos horizontales o distorsiones de escalamiento de marca.`)}
                    className="text-[9.5px] px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition cursor-pointer"
                  >
                    📐 Proporciones Logo
                  </button>
                </div>
              </div>

              {/* Dynamic Toggle & Unlimited License Status */}
              <div className="mt-4 p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col gap-2.5 shadow-lg shadow-slate-950/15">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">PLAN CORP AGUACOL</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                    Comparación Ilimitada Activa
                  </span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyMainLabel}
                    onChange={(e) => setOnlyMainLabel(e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-slate-700 bg-slate-950 text-emerald-505 focus:ring-emerald-500 focus:ring-offset-slate-900 mt-0.5 cursor-pointer accent-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">Auditar únicamente la Etiqueta Principal</span>
                    <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
                      Habilitado por defecto. Ignorará de forma inteligente las cotas externas, márgenes de troquel de imprenta, planos técnicos u hojas de ficha completa para evaluar sólo el diseño de la etiqueta principal.
                    </span>
                  </div>
                </label>
              </div>

              {/* Compare action button */}
              <div className="mt-5">
                {errorMessage && (
                  <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs px-3 py-2.5 rounded-lg flex items-start gap-2 animate-fade-in">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Error detectado:</p>
                      <p>{errorMessage}</p>
                    </div>
                  </div>
                )}

                {isComparing ? (
                  <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center shadow-inner">
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                      <span className="text-xs font-semibold font-mono text-emerald-700 uppercase tracking-widest animate-pulse">
                        Procesando Visión AI...
                      </span>
                    </div>
                    
                    {/* Realistic scanning diagnostics message */}
                    <div className="w-full mt-3 bg-white border border-slate-150 p-2 rounded-lg">
                      {scanningMsg && (
                        <div className="mb-2 bg-indigo-50 border border-indigo-150 text-indigo-800 text-[11px] font-bold px-2 py-1.5 rounded flex items-center gap-1.5 animate-pulse">
                          <Activity className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                          <span>{scanningMsg}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold mb-1">
                        <span>ESTADO DE ANÁLISIS</span>
                        <span>{Math.round(((loadingStep + 1) / scanSteps.length) * 100)}%</span>
                      </div>
                      <p className="text-xs font-mono text-slate-600 flex items-center gap-1">
                        <ChevronRight className="w-3 h-3 text-emerald-500" />
                        {scanSteps[loadingStep]}
                      </p>
                      <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                        <div 
                          className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                          style={{ width: `${((loadingStep + 1) / scanSteps.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleCompareArtes}
                    type="button"
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-700/25 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    <Sparkles className="w-4 h-4" />
                    Comparar Artes con IA
                  </button>
                )}
              </div>
            </div>

            {/* INTERACTIVE GRAPHIC QUALITY SUITE: 30 ADVANCED TECHNIQUES */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-slate-105 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shadow-xs border border-indigo-100 animate-pulse">
                    30
                  </div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide">
                    Técnicas de Inspección de Lupa
                  </h3>
                </div>
                <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-150 font-bold px-2 py-0.5 rounded-full uppercase">
                  Lupa de Precisión Activa
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-normal">
                Haz clic en cualquier técnica de calidad gráfica para <strong>inyectarla de inmediato</strong> a tu pauta de inspección y obligar al scanner IA a buscar ese detalle píxel por píxel:
              </p>

              {/* Filtering bar tool and batch actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Buscar técnica (ej. píxel, color, barras, etc.)..."
                    className="w-full text-[11.5px] rounded-lg border border-slate-250 bg-slate-50/50 px-3 py-1.5 focus:bg-white focus:border-indigo-500 focus:ring focus:ring-indigo-100 placeholder-slate-400 font-sans transition"
                    value={techniqueFilter}
                    onChange={(e) => setTechniqueFilter(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-[11px] bg-indigo-50 hover:bg-indigo-150 active:scale-95 text-indigo-700 px-3 py-1.5 rounded-lg font-bold border border-indigo-100 transition cursor-pointer text-center flex items-center justify-center gap-1"
                    title="Seleccionar todas las 30 técnicas de inspección"
                  >
                    <span>✓ Seleccionar todo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 px-3 py-1.5 rounded-lg font-bold border border-slate-200 transition cursor-pointer text-center flex items-center justify-center gap-1"
                    title="Deseleccionar todas las técnicas"
                  >
                    <span>✕ Deseleccionar todo</span>
                  </button>
                </div>
              </div>

              {/* Scrollable grid-table list */}
              <div className="border border-slate-150 rounded-lg overflow-hidden max-h-[305px] overflow-y-auto bg-slate-50/20 shadow-inner">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-250 uppercase text-[9px] tracking-wider sticky top-0 z-10">
                      <th className="py-2 px-2.5 w-[10%] text-center border-r border-slate-200 bg-slate-100">Nº</th>
                      <th className="py-2 px-2.5 w-[42%] border-r border-slate-200 bg-slate-100">Método</th>
                      <th className="py-2 px-2.5 bg-slate-100">Qué devela en la etiqueta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredTechniques.map((tech) => {
                      const isAlreadyInPauta = additionalContext.includes(tech.directive);
                      return (
                        <tr 
                          key={tech.id} 
                          onClick={() => handleInjectTechnique(tech)}
                          className={`hover:bg-indigo-55/70 transition cursor-pointer group ${
                            isAlreadyInPauta ? "bg-emerald-50/55 hover:bg-emerald-50" : ""
                          }`}
                          title="Fijar esta técnica de precisión en el prompt"
                        >
                          <td className={`py-2 px-2.5 text-center font-bold font-mono border-r border-slate-200 text-xs ${
                            isAlreadyInPauta ? "text-emerald-700" : "text-slate-400 group-hover:text-indigo-600"
                          }`}>
                            {tech.id}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-200">
                            <span className={`font-bold block text-[11.5px] leading-tight ${
                              isAlreadyInPauta ? "text-emerald-800" : "text-slate-700 group-hover:text-indigo-900"
                            }`}>
                              {tech.name}
                            </span>
                            <span className="text-[8.5px] text-slate-400 group-hover:text-indigo-500 block leading-none mt-0.5">
                              {isAlreadyInPauta ? "✓ Inyectado en pauta" : "⚡ Clic para inyectar"}
                            </span>
                          </td>
                          <td className="py-2 px-2.5 text-slate-600 text-[10.5px] leading-tight font-medium">
                            {tech.detects}
                          </td>
                        </tr>
                      );
                    })}
                    {filteredTechniques.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-8 px-4 text-center text-slate-400 text-xs">
                          Ninguna técnica gráfica coincide con tu búsqueda.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between text-[9.5px] text-slate-400 italic">
                <span>Mostrando {filteredTechniques.length} de 30 técnicas de lupas</span>
                <button 
                  type="button" 
                  onClick={() => setAdditionalContext(DEFAULT_QUALITY_PAUTA)} 
                  className="text-xs text-indigo-600 hover:text-indigo-805 hover:underline font-bold transition not-italic bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-100 cursor-pointer"
                >
                  Restaurar Pauta Completa
                </button>
              </div>
            </div>

            {/* AUDIT LOGS HISTORY PANEL */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex-1 min-h-[300px] flex flex-col">
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide">
                  <History className="w-4 h-4 text-emerald-600" />
                  Historial de Auditorías
                </h2>
                {history.length > 0 && (
                  <div className="flex items-center gap-1">
                    {showClearAllConfirm ? (
                      <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded border border-rose-100 flex-shrink-0">
                        <span className="text-[9px] font-bold text-rose-700 uppercase tracking-tight px-0.5">¿Borrar todo?</span>
                        <button
                          onClick={confirmClearHistory}
                          type="button"
                          className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold px-2 py-0.5 rounded transition"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setShowClearAllConfirm(false)}
                          type="button"
                          className="bg-slate-200 hover:bg-slate-300 text-slate-750 text-[9px] font-bold px-2 py-0.5 rounded transition"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowClearAllConfirm(true)}
                        type="button"
                        className="text-[10px] text-rose-600 hover:text-rose-800 hover:underline font-bold transition flex items-center gap-1 bg-rose-50 px-2 py-1 rounded"
                        title="Eliminar todo el historial para evitar saturación de la página"
                      >
                        <Trash2 className="w-3 h-3 text-rose-600" />
                        Limpiar Todo
                      </button>
                    )}
                  </div>
                )}
              </div>

              {history.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border border-dashed border-slate-200 bg-slate-50/50 rounded-xl">
                  <FileText className="w-8 h-8 text-slate-300 mb-2" />
                  <p className="text-xs font-medium text-slate-500">¿No hay reportes de QA cargados?</p>
                  <p className="text-[10px] text-slate-400 mt-1 max-w-[200px]">Suba imágenes y solicite la comparación para generar el historial de auditorías.</p>
                </div>
              ) : (
                <div className="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
                  {history.map((report) => {
                    const isActive = report.id === activeReportId;
                    const alertCount = report.results.discrepancyAlerts.length;
                    const score = report.results.similarityScore;
                    return (
                      <div
                        key={report.id}
                        onClick={() => setActiveReportId(report.id)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-start ${
                          isActive
                            ? "bg-slate-900 text-white border-transparent shadow shadow-slate-900/30"
                            : "bg-white text-slate-800 hover:bg-slate-50 border-slate-200"
                        }`}
                        id={`report-item-${report.id}`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              isActive 
                                ? "bg-emerald-500/25 text-emerald-400 border border-emerald-500/30" 
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}>
                              {report.id}
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              report.results.isApproved
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-rose-100 text-rose-800"
                            }`}>
                              {report.results.isApproved ? "APROBADO" : "RECHAZADO"}
                            </span>
                          </div>
                          <p className={`text-xs font-semibold truncate ${isActive ? "text-white" : "text-slate-800"}`}>
                            {report.newFileName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-[10px]" style={{ color: isActive ? "#94a3b8" : "#94a3b8" }}>
                            <span>{report.timestamp}</span>
                            <span>•</span>
                            <span className="truncate max-w-[120px]" title={report.oldFileName}>v3: {report.oldFileName}</span>
                          </div>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1.5 ml-2">
                          <div 
                            className={`text-xs font-bold font-mono px-2 py-0.5 rounded-full ${
                              score >= 90
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                                : score >= 80
                                ? "bg-amber-50 text-amber-700 border border-amber-150"
                                : "bg-rose-50 text-rose-700 border border-rose-150"
                            }`}
                            style={{ color: isActive && score >= 90 ? "#10b981" : undefined }}
                          >
                            {score}% Sim.
                          </div>
                          <span className={`text-[9px] font-semibold py-0.5 px-2 rounded-full ${
                            alertCount > 0 
                              ? "bg-amber-100 text-amber-900" 
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {alertCount} {alertCount === 1 ? "alerta" : "alertas"}
                          </span>
                          
                          {reportIdToDelete === report.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 border border-rose-150 p-1 rounded animate-fade-in mt-1 flex-shrink-0 z-20 text-rose-800">
                              <span className="text-[9px] font-bold">¿Borrar?</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  confirmDeleteReport(report.id);
                                }}
                                type="button"
                                className="bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded transition"
                              >
                                Sí
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReportIdToDelete(null);
                                }}
                                type="button"
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[9px] font-bold px-1.5 py-0.5 rounded transition"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={(e) => triggerDeleteReport(report.id, e)}
                              className={`p-1 rounded opacity-60 hover:opacity-100 transition mt-1 z-10 ${
                                isActive ? "text-slate-400 hover:text-rose-400" : "text-slate-400 hover:text-rose-600"
                              }`}
                              title="Eliminar del historial"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ACTIVE RESULTS VIEWER */}
          <div className="lg:col-span-7">
            {activeReport ? (
              <div className="flex flex-col gap-6 animate-fade-in" id="report-view-container">
                
                {/* ACTIVE REPORT HEADER & ACTIONS */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-indigo-500" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono bg-slate-100 font-bold px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                          ID: {activeReport.id}
                        </span>
                        <span className="text-xs text-slate-400">• Analizado en: {activeReport.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider ${
                          activeReport.results.isApproved
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {activeReport.results.isApproved ? "APROBADO" : "RECHAZADO"}
                        </span>
                        <span className="text-[10px] font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded">
                          Similitud: {activeReport.results.similarityScore}%
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-800 mt-1.5 max-w-[420px] truncate" title={activeReport.newFileName}>
                        {activeReport.newFileName}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      <button
                        onClick={handleDownloadPDF}
                        disabled={isDownloadingPdf}
                        className={`px-4 py-2 select-none font-bold rounded-lg text-xs shadow-md flex items-center justify-center gap-1.5 transition uppercase tracking-wider ${
                          isDownloadingPdf 
                            ? "bg-slate-700 text-slate-300 cursor-not-allowed" 
                            : "bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95 cursor-pointer"
                        }`}
                        title="Descargar PDF real"
                      >
                        {isDownloadingPdf ? (
                          <>
                            <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            <span>Generando PDF...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-4 h-4 text-emerald-200" />
                            <span>Descargar Reporte PDF</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handlePrint}
                        className="px-3.5 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-lg text-xs shadow-sm flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer uppercase tracking-wider"
                        title="Imprimir copia física"
                      >
                        <Printer className="w-4 h-4 text-slate-400" />
                        <span>Imprimir</span>
                      </button>
                    </div>
                  </div>

                  {/* EDITABLE PDF FILENAME BLOCK */}
                  <div className="mt-4 border-t border-slate-150 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nombre del Archivo PDF a Descargar:</span>
                      <span className="text-[9.5px] text-slate-400 truncate">Saber exactamente qué etiqueta estás descargando de inmediato</span>
                    </div>
                    <div className="flex items-center gap-1 w-full sm:w-auto shrink-0">
                      <input
                        type="text"
                        value={pdfCustomName}
                        onChange={(e) => setPdfCustomName(e.target.value)}
                        placeholder="ej. Reporte_QA_Etiqueta_1"
                        className="w-full sm:w-[260px] text-xs font-mono rounded bg-white border border-slate-250 px-2 py-1.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-100 text-slate-800 font-bold transition"
                      />
                      <span className="text-xs text-slate-400 font-mono font-bold mr-1 shrink-0">.pdf</span>
                    </div>
                  </div>

                </div>

                {/* SHORT ORDERED SUMMARY OF DISCREPANCIES */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 animate-fade-in">
                  <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                    <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                    Resumen Rápido de Inconsistencias ({activeReport.results.discrepancyAlerts.length})
                  </h3>
                  {activeReport.results.discrepancyAlerts.length === 0 ? (
                    <div className="text-xs bg-emerald-50/60 border border-emerald-150 rounded-lg p-2.5 text-emerald-800 font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>✓ Todo en orden. No se detectaron discrepancias en esta versión de etiqueta.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {activeReport.results.discrepancyAlerts.map((alert, index) => {
                        const isHigh = alert.severity === "Alta";
                        const isMed = alert.severity === "Media";
                        return (
                          <div 
                            key={alert.id || index} 
                            onClick={() => setSelectedAlertId(alert.id)}
                            className="flex items-start gap-2 bg-slate-50/70 hover:bg-slate-100/90 active:scale-[0.99] p-2 rounded-lg border border-slate-205 cursor-pointer transition select-none animate-fade-in"
                          >
                            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0 mt-0.5 border ${
                              isHigh 
                                ? "bg-rose-100 text-rose-800 border-rose-250" 
                                : isMed
                                ? "bg-amber-100 text-amber-900 border-amber-250"
                                : "bg-slate-200 text-slate-700 border-slate-300"
                            }`}>
                              {alert.severity}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate" title={alert.title}>{alert.title}</p>
                              <p className="text-[10px] text-slate-500 truncate leading-tight font-mono">{alert.oldValue} ➔ {alert.newValue}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* CRITICAL VARIATIONS AND ALERT GRID */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                      <AlertCircle className="w-4.5 h-4.5 text-amber-500" />
                      Alertas de Discrepancias Detectadas
                    </h3>
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2 rounded-full py-0.5">
                      {activeReport.results.discrepancyAlerts.length} Variaciones
                    </span>
                  </div>

                  {activeReport.results.discrepancyAlerts.length === 0 ? (
                    <div className="p-8 text-center bg-emerald-50/50 rounded-xl border border-dashed border-emerald-100 flex flex-col items-center">
                      <CheckCircle className="w-8 h-8 text-emerald-500 mb-1" />
                      <p className="text-xs font-bold text-emerald-800">¡Ninguna variación detectada!</p>
                      <p className="text-[10px] text-emerald-600 mt-1">El arte nuevo es cromáticamente, tipográficamente y dimensionalmente idéntico al patrón.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeReport.results.discrepancyAlerts.map((alert, index) => {
                        const isHigh = alert.severity === "Alta";
                        const isMed = alert.severity === "Media";
                        const isSelected = selectedAlertId === alert.id;
                        return (
                          <div 
                            key={alert.id || index} 
                            onClick={() => setSelectedAlertId(isSelected ? null : alert.id)}
                            className={`p-4 rounded-xl border transition-all cursor-pointer ${
                              isSelected
                                ? "ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50 shadow-sm"
                                : isHigh 
                                ? "bg-rose-50/50 border-rose-200 hover:bg-rose-50 hover:border-rose-300" 
                                : isMed 
                                ? "bg-amber-50/50 border-amber-200 hover:bg-amber-50 hover:border-amber-300" 
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2 mb-2 flex-wrap">
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isHigh 
                                    ? "bg-rose-500 text-white" 
                                    : isMed 
                                    ? "bg-amber-500 text-slate-900" 
                                    : "bg-slate-500 text-white"
                                }`}>
                                  Riesgo {alert.severity}
                                </span>
                                
                                <span className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                  {alert.category}
                                </span>
                              </div>

                              <span className="text-[10px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-650 animate-ping" />}
                                {alert.id}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-800 tracking-tight">
                              {alert.title}
                            </h4>
                            
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {alert.description}
                            </p>

                            {/* Reference value vs. Received value check blocks */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-slate-200/60 text-xs">
                              <div className="bg-white/70 p-2 rounded-lg border border-slate-150">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">En Arte Antiguo (Patrón):</span>
                                <span className="font-mono text-slate-700 block break-words break-all">{alert.oldValue}</span>
                              </div>

                              <div className={`p-2 rounded-lg border ${
                                isHigh 
                                  ? "bg-rose-50/80 border-rose-150 text-rose-900" 
                                  : isMed 
                                  ? "bg-amber-50/85 border-amber-150 text-amber-900" 
                                  : "bg-white/70 border-slate-200 text-slate-900"
                              }`}>
                                <span className="text-[9px] uppercase font-bold opacity-60 block mb-1">En Arte Nuevo (Bajo Prueba):</span>
                                <span className="font-mono font-bold block break-words break-all">{alert.newValue}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* INTERACTIVE ZOOMABLE SLIDER VIEW */}
                <CompareViewer 
                  oldImage={activeReport.oldImage} 
                  newImage={activeReport.newImage} 
                  oldFileName={activeReport.oldFileName}
                  newFileName={activeReport.newFileName}
                  alerts={activeReport.results.discrepancyAlerts}
                  selectedAlertId={selectedAlertId}
                  onAlertClick={(id) => setSelectedAlertId(id)}
                />

                {/* DETAILED TECHNICAL COMPARTMENTS */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                    <Info className="w-4.5 h-4.5 text-emerald-600" />
                    Análisis Técnico Detallado
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Colors Analysis */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        Afinidad Cromática & Color
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeReport.results.detailedAnalysis.color}
                      </p>
                    </div>

                    {/* Typography Analysis */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                        Texto & Tipografías
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeReport.results.detailedAnalysis.typography}
                      </p>
                    </div>

                    {/* Proportions analysis */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Dimesionado & Proporciones
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeReport.results.detailedAnalysis.proportions}
                      </p>
                    </div>

                    {/* Image assets analysis */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-150">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                        Activos Gráficos y Logotipos
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeReport.results.detailedAnalysis.images}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8 bg-white border border-slate-200 rounded-2xl shadow-sm">
                <FileText className="w-16 h-16 text-slate-200 mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Ningún informe activo</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-[340px]">
                  Seleccione un registro del historial de auditoría a la izquierda o ingrese nuevos archivos de arte para arrancar la comparación con Inteligencia Artificial.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* PRINT-ONLY CANVAS: STYLED HIGH FIDELITY PDF REPORT DOCUMENT */}
      {activeReport && (
        <div className="hidden print-only print-root p-8 bg-white text-black font-sans leading-normal">
          {/* Print Letter Head */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-slate-900">ETIQUETAS AGUACOL</span>
                <span className="text-[10px] font-mono border border-slate-500 px-1 py-0.5 rounded text-slate-800">SISTEMA QA VISION-AI</span>
              </div>
              <p className="text-xs text-slate-500">Aguacol S.A.S - Departamento de Envases, Embalaje y Control de Calidad Tecno-Gráfico</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold block">INFORME DE AUDITORÍA GRÁFICA</span>
              <span className="font-mono text-xs block text-slate-700">REPORTE RECURSO: {activeReport.id}</span>
              <span className="text-xs text-slate-500 block">Fecha emisión: {activeReport.timestamp}</span>
            </div>
          </div>

          {/* Abstract details table */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div>
              <p className="mb-1"><strong>Diseño de Referencia (Antiguo):</strong> {activeReport.oldFileName}</p>
              <p className="mb-1"><strong>Muestra del Proveedor (Nuevo):</strong> {activeReport.newFileName}</p>
            </div>
            <div className="text-right">
              <p className="mb-1 text-sm"><strong>Similitud Métrica:</strong> <span className="font-mono font-bold text-base">{activeReport.results.similarityScore}%</span></p>
              <p className="mb-1 text-sm">
                <strong>Veredicto Final: </strong> 
                <span className={`font-bold px-2 py-0.5 rounded text-xs ${
                  activeReport.results.isApproved ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {activeReport.results.isApproved ? "APROBADO" : "RECHAZADO PARA PRODUCCIÓN"}
                </span>
              </p>
            </div>
          </div>

          {/* Graphic comparative documentation annex */}
          <div className="mb-6 border border-slate-200 p-4 rounded-xl bg-slate-50/50 page-break-inside-avoid">
            <h3 className="font-bold text-sm uppercase border-b-2 border-slate-950 pb-1.5 mb-3">
              Evidencia Gráfica Auxiliar (Inspección Fotométrica)
            </h3>
            <p className="text-[11px] text-slate-600 mb-3 bg-white p-2 rounded border border-slate-200">
              A continuación se acompañan las muestras del diseño original frente a la propuesta provista por el proveedor de etiquetas, las cuales sirvieron para la determinación del puntaje y verificación de inconsistencias tipográficas, de tonalidad/brillo de fondo, y dimensiones.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-300 p-3 rounded-lg bg-white flex flex-col items-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block text-center">ARTE ANTIGUO (Referencia Inicial Aprobada)</span>
                <img 
                  src={activeReport.oldImage} 
                  alt={activeReport.oldFileName} 
                  className="max-h-[220px] max-w-full object-contain rounded border border-slate-200" 
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-slate-600 font-mono mt-2 truncate w-full text-center font-bold">Ref: {activeReport.oldFileName}</span>
              </div>
              <div className="border border-slate-300 p-3 rounded-lg bg-white flex flex-col items-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5 block text-center">ARTE NUEVO (Lote del Proveedor a Evaluar)</span>
                <img 
                  src={activeReport.newImage} 
                  alt={activeReport.newFileName} 
                  className="max-h-[220px] max-w-full object-contain rounded border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[10px] text-slate-600 font-mono mt-2 truncate w-full text-center font-bold">Muestra: {activeReport.newFileName}</span>
              </div>
            </div>
            <p className="text-[9px] text-slate-400 mt-2.5 italic text-center">
              * El análisis destaca discrepancias cromáticas notables en el fondo y sustitución de fuentes estilizadas clave.
            </p>
          </div>

          {/* Discrepancy Alerts List */}
          <div className="mb-6">
            <h3 className="font-bold text-sm uppercase border-b-2 border-slate-900 pb-1.5 mb-3 flex items-center">
              Variaciones Detectadas e Inconsistencias de Formato
            </h3>
            
            {activeReport.results.discrepancyAlerts.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No se hallaron discrepancias formales. El empaque cumple completamente la igualdad geométrica.</p>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300">
                    <th className="p-2 border font-bold">Ref ID</th>
                    <th className="p-2 border font-bold">Categoría</th>
                    <th className="p-2 border font-bold">Severidad</th>
                    <th className="p-2 border font-bold">Descripción del Error / Desviación</th>
                  </tr>
                </thead>
                <tbody>
                  {activeReport.results.discrepancyAlerts.map((alert) => (
                    <tr key={alert.id} className="border-b border-slate-200">
                      <td className="p-2 border font-mono font-bold text-slate-700">{alert.id}</td>
                      <td className="p-2 border font-semibold">{alert.category}</td>
                      <td className="p-2 border">
                        <span className={`font-bold font-mono px-1 py-0.5 rounded ${
                          alert.severity === "Alta" ? "text-rose-600 bg-rose-50" : alert.severity === "Media" ? "text-yellow-600 bg-yellow-50" : "text-slate-600"
                        }`}>
                          {alert.severity}
                        </span>
                      </td>
                      <td className="p-2 border">
                        <p className="font-bold mb-0.5">{alert.title}</p>
                        <p className="text-slate-600 leading-tight mb-1">
                          {alert.description}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] mt-1 bg-white p-1 rounded border">
                          <div><strong className="text-slate-400 font-normal">Antiguo:</strong> {alert.oldValue}</div>
                          <div><strong className="text-slate-400 font-normal">Nuevo:</strong> {alert.newValue}</div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Technical Section */}
          <div className="mb-8 page-break">
            <h3 className="font-bold text-sm uppercase border-b-2 border-slate-900 pb-1.5 mb-3">
              Informe Técnico del Escaneo de Visión
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border p-3 rounded-lg">
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[10px] text-slate-500">Colorimetría (Afinidad Cromática)</h4>
                <p className="text-slate-700">{activeReport.results.detailedAnalysis.color}</p>
              </div>

              <div className="border p-3 rounded-lg">
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[10px] text-slate-500">Tipografía, Textos e Ideogramas</h4>
                <p className="text-slate-700">{activeReport.results.detailedAnalysis.typography}</p>
              </div>

              <div className="border p-3 rounded-lg mt-3">
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[10px] text-slate-500">Alineaciones y Dimensiones</h4>
                <p className="text-slate-700">{activeReport.results.detailedAnalysis.proportions}</p>
              </div>

              <div className="border p-3 rounded-lg mt-3">
                <h4 className="font-bold mb-1 uppercase tracking-wider text-[10px] text-slate-500">Conservación Iconográfica e Isotipos</h4>
                <p className="text-slate-700">{activeReport.results.detailedAnalysis.images}</p>
              </div>
            </div>
          </div>

          {/* Signature slots block */}
          <div className="mt-16 grid grid-cols-2 gap-12 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 w-48 mx-auto mb-1 mt-6" />
              <p className="font-bold">Firma Analista de Calidad</p>
              <p className="text-slate-500">ETIQUETAS AGUACOL Inspector</p>
            </div>
            
            <div>
              <div className="border-t border-slate-400 w-48 mx-auto mb-1 mt-6" />
              <p className="font-bold">Firma Aprobador de Empaque</p>
              <p className="text-slate-500">Gerente de Empaque / Tintas</p>
            </div>
          </div>
        </div>
      )}
      </div>{/* end content wrapper */}
    </div>
  );
}
