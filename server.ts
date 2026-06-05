import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Initialize Express App
const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// Increase request size limit to handle raw high-res artwork base64 strings
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Global body-parsing and payload-limit error handler
app.use((err: any, req: any, res: any, next: any) => {
  if (err) {
    console.error("Express body parsing / payload limit error:", err);
    res.status(err.status || 400).json({
      success: false,
      error: err.status === 413 
        ? "El tamaño de las imágenes excede el límite máximo permitido por el servidor (50MB). Intente con imágenes optimizadas." 
        : `Error al decodificar los datos: ${err.message || "Formato inválido"}`,
    });
    return;
  }
  next();
});

// Helper function to lazy initialize Google GenAI SDK
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("La clave GEMINI_API_KEY no está configurada. Por favor, añádela en el panel de Configuración > Secretos.");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Robust retry wrapper to handle transient 503 / UNAVAILABLE rate limits or spikes automatically
async function generateContentWithRetry(ai: GoogleGenAI, options: any, maxRetries = 5, initialDelayMs = 2500) {
  let attempt = 0;
  while (true) {
    try {
      return await ai.models.generateContent(options);
    } catch (error: any) {
      attempt++;
      
      // Serialize error fully to inspect for deep-nested Google SDK status codes
      const errorStr = (typeof error === "object" ? JSON.stringify(error) : String(error)).toLowerCase();
      const errorMessage = String(error?.message || error?.error?.message || error || "").toLowerCase();
      const errorStatus = String(error?.status || error?.error?.status || "").toLowerCase();
      const errorCode = String(error?.code || error?.error?.code || "");
      
      const isTransient = 
        errorStr.includes("503") ||
        errorStr.includes("unavailable") ||
        errorStr.includes("high demand") ||
        errorStr.includes("temporary") ||
        errorStr.includes("overloaded") ||
        errorStr.includes("exhausted") ||
        errorStr.includes("429") ||
        errorMessage.includes("503") || 
        errorMessage.includes("unavailable") || 
        errorMessage.includes("high demand") || 
        errorMessage.includes("temporary") ||
        errorMessage.includes("overloaded") ||
        errorStatus.includes("unavailable") ||
        errorCode === "503" ||
        errorCode === "429";

      if (isTransient && attempt < maxRetries) {
        const delay = initialDelayMs * Math.pow(2, attempt - 1);
        console.warn(`[Gemini API Warning] Error transitorio: ${errorMessage || errorStatus || "503/UNAVAILABLE"}. Reintentando en ${delay}ms... (Intento ${attempt}/${maxRetries})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// REST API for Packaging Design Verification (ETIQUETAS AGUACOL)
app.post("/api/compare", async (req, res) => {
  try {
    const { oldImage, newImage, oldFileName, newFileName, additionalContext, onlyMainLabel } = req.body;

    if (!oldImage || !newImage) {
      res.status(400).json({
        success: false,
        error: "Se requieren tanto la imagen del arte antiguo como la del arte nuevo para realizar la comparación.",
      });
      return;
    }

    // Initialize Gemini Client
    const ai = getGeminiClient();

    // Helper to separate Base64 prefix
    const extractBase64Data = (dataUrl: string) => {
      const match = dataUrl.match(/^data:(image\/[a-zA-Z+.-]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      // Fallback if raw base64 is passed
      return { mimeType: "image/png", data: dataUrl };
    };

    const oldPart = extractBase64Data(oldImage);
    const newPart = extractBase64Data(newImage);

    // Prepare multimodal parts for Gemini
    const oldImagePart = {
      inlineData: {
        mimeType: oldPart.mimeType,
        data: oldPart.data,
      },
    };

    const newImagePart = {
      inlineData: {
        mimeType: newPart.mimeType,
        data: newPart.data,
      },
    };

    // Prepare the system or text prompt instructions
    const textPart = {
      text: `Actúas como un Inspector de Calidad Gráfica Profesional y Especialista Senior de Empaques en "AGUACOL".
Tu tarea consiste en realizar una auditoría visual EXTREMADAMENTE RIGUROSA Y DETALLADA. Compara ambas imágenes píxel por píxel y elemento por elemento de manera milimétrica. NO asumas bajo ninguna circunstancia que son iguales. Busca absolutamente todas las diferencias existentes, por más mínimas o insignificantes que parezcan.

MÉTODO DE INSPECCIÓN CUADRO A CUADRO (PLANO CARTESIANO):
Divide mentalmente el espacio de la etiqueta en un plano cartesiano de coordenadas relativas del 0 al 100 (donde x:0, y:0 es la esquina superior izquierda, y x:100, y:100 es la esquina inferior derecha). Recorre secuencialmente cada uno de los sectores o cuadrantes del plano para detectar diferencias mínimas.

REGLA DE CONCENTRACIÓN DE ANÁLISIS:
${onlyMainLabel ? `-> ENFOQUE PRINCIPAL EN ETIQUETA: Concéntrate prioritariamente en el diseño de la etiqueta expuesta (ilustraciones, colores de fondo principal, distas tipográficas o de logos centrales).
-> EXCLUSIONES: Ignora el texto legal secundario de la tabla nutricional si la casilla de verificación marca centrarse sólo en la etiqueta de exhibición del producto principal, a menos que el usuario especifique explícitamente lo contrario en la pauta adicional.` : `-> CONTROL DE CALIDAD INTEGRAL: Evalúa absolutamente todas las secciones de las etiquetas sin omitir nada.`}

REVISIÓN EXHAUSTIVA DE ELEMENTOS (CRÍTICO):
1. Textos: Inspecciona cada palabra y letra. Busca errores ortográficos, cambios de vocabulario, espaciados inadecuados, saltos de línea modificados, variaciones de tamaño de letra y fuentes tipográficas alteradas.
2. Colores: Detecta variaciones de tonalidad, saturación, contrastes, nivel de brillo y calidad de los de degradados.
3. Logotipos: Compara meticulosamente la posición, el tamaño de proporción geométrica, relación de aspecto (revisar si han sido estirados horizontales o verticalmente por error de escala) y calidad de definición.
4. Códigos de barras, QR y numeraciones: Verifica que sigan siendo idénticos y legibles sin distorsiones tipográficas de dígitos o barras.
5. Tablas, íconos y símbolos: Revisa formas, tamaños y consistencia de símbolos como sellos de advertencia o certificaciones.
6. Alineación y distribución: Examina la diagramación espacial, los márgenes de diseño, las distancias relativas entre objetos y posibles capas ocultas o elementos del patrón original que hayan desaparecido.
7. Resolución, nitidez y calidad: Identifica pérdidas de definición gráfica, ruidos visuales o rallas en el arte nuevo. Reporta diferencias de tamaño estimadas en píxeles o milímetros.

⭐ CONDICIONES OBLIGATORIAS DE AUDITORÍA:
- Realiza mentalmente una SEGUNDA REVISIÓN independiente para re-confirmar cada hallazgo antes de guardarlo en el reporte.
- NO ignores diferencias sumamente pequeñas. Actúa como una lupa digital de altísima definición.
- Enumera minuciosamente cada diferencia encontrada.
- Si detectas una diferencia de la cual no estás 100% convencido, NO la descartes; regístrala y márcala explícitamente como "Requiere verificación" en el campo de descripción.

REGLA DE COORDENADAS PARA DIBUJAR ENCERRADOS INDEPENDIENTES (CRÍTICO):
Para CADA discrepancia visual que detectes, provee coordenadas de recuadro/caja delimitadora ultra-exactas en escala 0-100 utilizando "boxOld" (para la versión de referencia aprobada) y/o "boxNew" (para la nueva versión de muestra del proveedor). Esto nos permitirá encerrar las inconsistencias en círculos independientes en el simulador para que se aprecien los fallos con claridad total e individualizada.

Información adicional proporcionada por el usuario para enfocar su atención: "${additionalContext || "Ninguna"}"

Desglosa e identifica sistemáticamente cada posible defecto de la etiqueta principal, reportándolo de forma inequívoca de acuerdo con los criterios de calidad anteriores.`,
    };

    // Call Gemini using the recommended 3.5 Flash model with automatic transient error/503 retry
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: {
        parts: [oldImagePart, newImagePart, textPart],
      },
      config: {
        systemInstruction: "Eres el sistema de control de calidad ultra-profesional 'ETIQUETAS AGUACOL'. Tu misión es realizar una inspección de calidad gráfica extrema, actuando como una lupa digital de alta precisión. Compara artes de empaque elemento por elemento y píxel por píxel, identificando discrepancias de texto (ortografía, saltos de línea, tamaño), color (tonalidad, degradados), proporciones de logos, códigos de barras, QR, tablas y alineaciones. Debes simular una segunda revisión independiente, enumerar cada diferencia aunque parezca insignificante, y si no estás seguro de algo, clasificarlo como 'requiere verificación'. Estima las coordenadas de recuadro boxOld y boxNew del 0 al 100 para dibujar círculos interactivos en el visor.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            similarityScore: {
              type: Type.INTEGER,
              description: "Porcentaje global estimado de coincidencia visual del 0 al 100.",
            },
            discrepancyAlerts: {
              type: Type.ARRAY,
              description: "Colección de alertas para cada discrepancia crítica o variación detectada con coordenadas para círculos marcadores.",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Identificador único de la alerta (ej. ALERT-01)." },
                  category: { 
                    type: Type.STRING, 
                    description: "Categoría del error: 'Color' | 'Tipografía' | 'Proporciones' | 'Imagen' | 'Otro'",
                  },
                  severity: { 
                    type: Type.STRING, 
                    description: "Nivel de severidad del riesgo: 'Alta' | 'Media' | 'Baja'",
                  },
                  title: {
                    type: Type.STRING,
                    description: "Título corto de la anomalía identificada (ej. Alteración de Proporciones en Logo, Tipografía Cambiada en Tabla Nutricional).",
                  },
                  description: { 
                    type: Type.STRING, 
                    description: "Explicación clara y detallada de la variación observada y por qué representa una anomalía.",
                  },
                  oldValue: { 
                    type: Type.STRING, 
                    description: "Cómo aparecía este elemento en el ARTE ANTIGUO de referencia.",
                  },
                  newValue: { 
                    type: Type.STRING, 
                    description: "Cómo aparece ahora en el ARTE NUEVO bajo revisión.",
                  },
                  boxOld: {
                    type: Type.OBJECT,
                    description: "Coordenadas del recuadro del error en la imagen antigua (escala 0-100, ej: x=10, y=20, w=15, h=12). Dejar nulo si no tiene ubicación exacta o no corresponde.",
                    properties: {
                      x: { type: Type.INTEGER },
                      y: { type: Type.INTEGER },
                      w: { type: Type.INTEGER },
                      h: { type: Type.INTEGER }
                    },
                    required: ["x", "y", "w", "h"]
                  },
                  boxNew: {
                    type: Type.OBJECT,
                    description: "Coordenadas del recuadro del error en la imagen nueva (escala 0-100, ej: x=40, y=60, w=22, h=18). Dejar nulo si no tiene ubicación exacta o no corresponde.",
                    properties: {
                      x: { type: Type.INTEGER },
                      y: { type: Type.INTEGER },
                      w: { type: Type.INTEGER },
                      h: { type: Type.INTEGER }
                    },
                    required: ["x", "y", "w", "h"]
                  }
                },
                required: ["id", "category", "severity", "title", "description", "oldValue", "newValue"],
              },
            },
            detailedAnalysis: {
              type: Type.OBJECT,
              properties: {
                color: { 
                  type: Type.STRING, 
                  description: "Reporte descriptivo exhaustivo enfocado en variaciones cromáticas, paletas, contrastes y consistencia de marca.",
                },
                typography: { 
                  type: Type.STRING, 
                  description: "Reporte descriptivo detallando cambios tipográficos, variaciones de fuentes, ortografía, tamaño y legibilidad general.",
                },
                proportions: { 
                  type: Type.STRING, 
                  description: "Reporte descriptivo sobre dimensionamiento general, márgenes, sangrados, distribución espacial y alineación de cajas.",
                },
                images: { 
                  type: Type.STRING, 
                  description: "Reporte descriptivo enfocado en la integridad geométrica de logotipos, estiramiento de fotos, sellos, códigos de barras y resolución.",
                },
              },
              required: ["color", "typography", "proportions", "images"],
            },
            verdict: {
              type: Type.STRING,
              description: "Veredicto final formal o recomendación técnica del control de calidad (ej. 'Rechazado debido a cambios críticos en la tabla nutricional', 'Aprobado con observaciones menores en color').",
            },
            isApproved: {
              type: Type.BOOLEAN,
              description: "true si se aprueba el arte tal cual, false si requiere corrección inmediata.",
            }
          },
          required: ["similarityScore", "discrepancyAlerts", "detailedAnalysis", "verdict", "isApproved"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("El modelo de IA devolvió una respuesta vacía.");
    }

    // Parse the structured JSON response
    const analysisReport = JSON.parse(resultText);

    res.status(200).json({
      success: true,
      data: analysisReport,
    });
  } catch (error: any) {
    console.error("Error en comparación de artes con Gemini:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Ocurrió un error inesperado al procesar y comparar las imágenes entregadas.",
    });
  }
});

// Setup Vite Development Server or Static Build Assets Production Server
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in development mode");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Static file server running in production mode");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ETIQUETAS AGUACOL server running on port ${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Critical error starting ETIQUETAS AGUACOL backend server:", err);
});
