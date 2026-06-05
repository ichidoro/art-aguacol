# 🏷️ Etiquetas Aguacol

Sistema de **Control de Calidad Gráfica** para etiquetas de empaque. Compara artes de referencia vs. nuevas versiones usando **Gemini AI** para detectar discrepancias de color, tipografía, proporciones, logos y más.

## 🚀 Instalación Rápida

**Requisitos:** [Node.js](https://nodejs.org/) v18 o superior.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables de entorno
#    Copia .env.example a .env y agrega tu API Key de Gemini:
cp .env.example .env
#    Edita .env y reemplaza MY_GEMINI_API_KEY con tu clave real

# 3. Ejecutar la aplicación
npm run dev
```

La app estará disponible en **http://localhost:3000**

## 🔑 Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/apikey)
2. Crea una API Key
3. Pégala en tu archivo `.env`:
   ```
   GEMINI_API_KEY="tu-clave-aquí"
   ```

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm start` | Ejecuta la versión compilada |

## 🛠️ Tecnologías

- **Frontend:** React 19 + Vite + TailwindCSS + Motion
- **Backend:** Express + TypeScript
- **AI:** Google Gemini 3.5 Flash (comparación visual de etiquetas)
- **PDF:** jsPDF para generación de reportes
