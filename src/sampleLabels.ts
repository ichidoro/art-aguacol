// Beautiful inlined svg samples encoded in standard Base64 for flawless, instant rendering in our ART AGUACOL demo workspace.

// SAMPLE OLD ARTWORK: Emerald circle logo, perfectly proportioned, with healthy green markers and barcode
const oldSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- Soft slate-teal pattern background -->
  <rect width="800" height="600" fill="#1e293b"/>
  <g opacity="0.1">
    <circle cx="400" cy="300" r="280" fill="none" stroke="#10b981" stroke-width="4" stroke-dasharray="8 8"/>
    <circle cx="400" cy="300" r="200" fill="none" stroke="#10b981" stroke-width="2"/>
  </g>
  
  <!-- Outer border frame -->
  <rect x="25" y="25" width="750" height="550" rx="15" fill="none" stroke="#334155" stroke-width="3"/>
  
  <!-- Left Panel: Technical specs -->
  <g transform="translate(60, 100)">
    <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">INFORMACIÓN DE EMBALAJE</text>
    <line x1="0" y1="12" x2="220" y2="12" stroke="#475569" stroke-width="1.5" />
    
    <text x="0" y="35" fill="#f1f5f9" font-family="sans-serif" font-size="12">Lote Original:</text>
    <text x="120" y="35" fill="#10b981" font-family="monospace" font-size="12" font-weight="bold">AG-993-C</text>
    
    <text x="0" y="60" fill="#f1f5f9" font-family="sans-serif" font-size="12">Capacidad:</text>
    <text x="120" y="60" fill="#f1f5f9" font-family="monospace" font-size="12">1500 ml e</text>
    
    <text x="0" y="85" fill="#f1f5f9" font-family="sans-serif" font-size="12">pH de Origen:</text>
    <text x="120" y="85" fill="#f1f5f9" font-family="monospace" font-size="12">7.2 Neutral</text>

    <!-- Nutrition Facts Box -->
    <rect x="0" y="115" width="220" height="150" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="15" y="135" fill="#0f172a" font-family="sans-serif" font-size="13" font-weight="bold">Tabla Nutricional</text>
    <line x1="15" y1="145" x2="205" y2="145" stroke="#0f172a" stroke-width="1.5"/>
    
    <text x="15" y="165" fill="#334155" font-family="sans-serif" font-size="11">Sodio (Na+)</text>
    <text x="160" y="165" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold">8.5 mg/L</text>
    <line x1="15" y1="175" x2="205" y2="175" stroke="#cbd5e1" stroke-width="1"/>
    
    <text x="15" y="195" fill="#334155" font-family="sans-serif" font-size="11">Calcio (Ca2+)</text>
    <text x="160" y="195" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold">24.0 mg/L</text>
    <line x1="15" y1="205" x2="205" y2="205" stroke="#cbd5e1" stroke-width="1"/>

    <text x="15" y="225" fill="#334155" font-family="sans-serif" font-size="11">Sodio Min.</text>
    <text x="160" y="225" fill="#0f172a" font-family="sans-serif" font-size="11" font-weight="bold">Aprobado</text>
  </g>
  
  <!-- CENTER PANEL: Brand Logo & Graphics -->
  <g transform="translate(400, 275)">
    <!-- Proportional emerald circle logo -->
    <circle cx="0" cy="0" r="110" fill="#0c1d24" stroke="#10b981" stroke-width="7" />
    
    <!-- Fine inner gold circle detailing -->
    <circle cx="0" cy="0" r="95" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4" />
    
    <!-- Droplet design icon representing water -->
    <path d="M 0 -55 C 28 -15 45 5 45 35 C 45 60 25 80 0 80 C -25 80 -45 60 -45 35 C -45 5 -28 -15 0 -55 Z" fill="none" stroke="#10b981" stroke-width="6" />
    <path d="M 0 -35 C 18 -10 28 5 28 25 C 28 40 16 52 0 52 C -16 52 -28 40 -28 25 C -28 5 -18 -10 0 -35 Z" fill="#10b981" opacity="0.8" />
    
    <text x="0" y="-125" fill="#f1f5f9" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4" text-anchor="middle">MANANTIAL PURO</text>
    
    <text x="0" y="145" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="4" text-anchor="middle">AGUACOL</text>
    <text x="0" y="175" fill="#10b981" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="3" text-anchor="middle">AGUA CON GAS</text>
  </g>
  
  <!-- Right Panel: Certifications & legal clauses -->
  <g transform="translate(520, 100)">
    <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">REGULACIÓN SANITARIA</text>
    <line x1="0" y1="12" x2="225" y2="12" stroke="#475569" stroke-width="1.5" />
    
    <text x="0" y="35" fill="#f1f5f9" font-family="sans-serif" font-size="11">Registro Sanitario:</text>
    <text x="0" y="52" fill="#94a3b8" font-family="sans-serif" font-size="11">RS-CO-2025-AG-993</text>
    
    <!-- Certifications icons -->
    <rect x="0" y="80" width="55" height="40" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="27.5" y="105" fill="#10b981" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">♻️ ECO</text>
    
    <rect x="65" y="80" width="55" height="40" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="92.5" y="105" fill="#f59e0b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✓ ISO</text>

    <!-- Barcode structure -->
    <g transform="translate(0, 160)">
      <rect x="0" y="0" width="200" height="75" fill="#ffffff" rx="4" />
      <text x="100" y="68" fill="#000000" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">7701234567895</text>
      <!-- Draw bars of barcode of old label -->
      <rect x="25" y="10" width="3" height="45" fill="#000" />
      <rect x="31" y="10" width="1" height="45" fill="#000" />
      <rect x="35" y="10" width="4" height="45" fill="#000" />
      <rect x="43" y="10" width="2" height="45" fill="#000" />
      <rect x="50" y="10" width="1" height="45" fill="#000" />
      <rect x="54" y="10" width="3" height="45" fill="#000" />
      <rect x="62" y="10" width="4" height="45" fill="#000" />
      <rect x="70" y="10" width="1" height="45" fill="#000" />
      <rect x="74" y="10" width="2" height="45" fill="#000" />
      <rect x="82" y="10" width="3" height="45" fill="#000" />
      <rect x="91" y="10" width="1" height="45" fill="#000" />
      <rect x="95" y="10" width="4" height="45" fill="#000" />
      <rect x="105" y="10" width="2" height="45" fill="#000" />
      <rect x="110" y="10" width="1" height="45" fill="#000" />
      <rect x="115" y="10" width="3" height="45" fill="#000" />
      <rect x="122" y="10" width="4" height="45" fill="#000" />
      <rect x="130" y="10" width="1" height="45" fill="#000" />
      <rect x="135" y="10" width="2" height="45" fill="#000" />
      <rect x="141" y="10" width="3" height="45" fill="#000" />
      <rect x="150" y="10" width="1" height="45" fill="#000" />
      <rect x="155" y="10" width="4" height="45" fill="#000" />
      <rect x="165" y="10" width="2" height="45" fill="#000" />
      <rect x="172" y="10" width="3" height="45" fill="#000" />
    </g>
  </g>
</svg>
`;

// SAMPLE NEW ARTWORK: Stretched central logo, changed blue gradient background, modified table scales and missing text
const newSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- Same slate teal pattern, but background has a lighter bluish tint -->
  <rect width="800" height="600" fill="#1c2534"/>
  <g opacity="0.1">
    <circle cx="400" cy="300" r="280" fill="none" stroke="#2563eb" stroke-width="4" stroke-dasharray="8 8"/>
    <circle cx="400" cy="300" r="180" fill="none" stroke="#2563eb" stroke-width="2"/>
  </g>
  
  <rect x="25" y="25" width="750" height="550" rx="15" fill="none" stroke="#334155" stroke-width="3"/>
  
  <!-- Left Panel: MODIFIED smaller nutritional labels -->
  <g transform="translate(60, 100)">
    <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">INFORMACIÓN DE EMBALAJE</text>
    <line x1="0" y1="12" x2="220" y2="12" stroke="#475569" stroke-width="1.5" />
    
    <text x="0" y="35" fill="#f1f5f9" font-family="sans-serif" font-size="12">Lote Original:</text>
    <text x="120" y="35" fill="#2563eb" font-family="monospace" font-size="12" font-weight="bold">AG-993-C</text>
    
    <text x="0" y="60" fill="#f1f5f9" font-family="sans-serif" font-size="12">Capacidad:</text>
    <text x="120" y="60" fill="#f1f5f9" font-family="monospace" font-size="12">1500 ml e</text>
    
    <text x="0" y="85" fill="#f1f5f9" font-family="sans-serif" font-size="12">pH de Origen:</text>
    <text x="120" y="85" fill="#f1f5f9" font-family="monospace" font-size="12">7.2 Neutral</text>

    <!-- Nutrition Facts Box (MODIFIED TEXT SIZE REDUCED ILLEGALLY) -->
    <rect x="0" y="115" width="220" height="150" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <text x="15" y="132" fill="#0f172a" font-family="sans-serif" font-size="12" font-weight="bold">Tabla Nutricional</text>
    <line x1="15" y1="140" x2="205" y2="140" stroke="#0f172a" stroke-width="1"/>
    
    <!-- Value shrunk from 8.5 to 5.5 -->
    <text x="15" y="155" fill="#64748b" font-family="sans-serif" font-size="8">Sodio (Na+)</text>
    <text x="165" y="155" fill="#0f172a" font-family="sans-serif" font-size="8" font-weight="bold">8.5 mg/L</text>
    <line x1="15" y1="162" x2="205" y2="162" stroke="#e2e8f0" stroke-width="0.8"/>
    
    <!-- Value shrunk from 24 to 5.5 -->
    <text x="15" y="178" fill="#64748b" font-family="sans-serif" font-size="8">Calcio (Ca2+)</text>
    <text x="165" y="178" fill="#0f172a" font-family="sans-serif" font-size="8" font-weight="bold">24.0 mg/L</text>
    <line x1="15" y1="185" x2="205" y2="185" stroke="#e2e8f0" stroke-width="0.8"/>

    <text x="15" y="202" fill="#64748b" font-family="sans-serif" font-size="8">Sodio Min.</text>
    <text x="165" y="202" fill="#0c1d24" font-family="sans-serif" font-size="8" font-weight="bold">Modificado</text>
  </g>
  
  <!-- CENTER PANEL: Brand Logo & Graphics -->
  <!-- NOTICE: Oval has transformed circle (rx=145, ry=105) stretching it non-proportionally! -->
  <g transform="translate(400, 275)">
    <!-- STRETCHED BLUE CIRCLE (NON PROPORTIONAL STRETCH 14%!) -->
    <!-- Original CX was: r=110. Now rx=130, ry=95. This is severely ovalized! -->
    <ellipse cx="0" cy="0" rx="130" ry="92" fill="#0b171c" stroke="#2563eb" stroke-width="7" />
    
    <!-- Fine inner blue circle detail -->
    <ellipse cx="0" cy="0" rx="114" ry="80" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4 4" />
    
    <!-- Stretched inner droplet logo -->
    <path d="M 0 -48 C 34 -13 54 4 54 30 C 54 52 30 70 0 70 C -30 70 -54 52 -54 30 C -54 4 -34 -13 0 -48 Z" fill="none" stroke="#2563eb" stroke-width="6" />
    <path d="M 0 -30 C 22 -8 32 4 32 21 C 32 34 18 45 0 45 C -18 45 -32 34 -32 21 C -32 4 -22 -8 0 -30 Z" fill="#2563eb" opacity="0.8" />
    
    <text x="0" y="-125" fill="#f1f5f9" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4" text-anchor="middle">MANANTIAL PURO</text>
    
    <text x="0" y="145" fill="#ffffff" font-family="sans-serif" font-weight="900" font-size="36" letter-spacing="4" text-anchor="middle">AGUACOL</text>
    <!-- Text altered with blue typography descriptor -->
    <text x="0" y="175" fill="#2563eb" font-family="sans-serif" font-size="14" font-weight="600" letter-spacing="3" text-anchor="middle">AGUA CON GAS</text>
  </g>
  
  <!-- Right Panel: ERROR: Registro Sanitario RS-CO-2025 is missing completely, left only empty text -->
  <g transform="translate(520, 100)">
    <text x="0" y="0" fill="#94a3b8" font-family="monospace" font-size="12" font-weight="bold" letter-spacing="2">REGULACIÓN SANITARIA</text>
    <line x1="0" y1="12" x2="225" y2="12" stroke="#475569" stroke-width="1.5" />
    
    <!-- CRITICAL REMISSION: No sanitary RS-CO-2025 lines present! -->
    <text x="0" y="35" fill="#f1f5f9" font-family="sans-serif" font-size="11">Registro Sanitario:</text>
    <!-- TEXT ABSENT (BLANK ROW) -->
    
    <!-- Certifications icons -->
    <rect x="0" y="80" width="55" height="40" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="27.5" y="105" fill="#2563eb" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">♻️ ECO</text>
    
    <rect x="65" y="80" width="55" height="40" rx="4" fill="#1e293b" stroke="#475569" stroke-width="1" />
    <text x="92.5" y="105" fill="#f59e0b" font-family="sans-serif" font-size="12" font-weight="bold" text-anchor="middle">✓ ISO</text>

    <!-- Barcode shifted coordinates to the right -->
    <g transform="translate(20, 160)">
      <rect x="0" y="0" width="190" height="75" fill="#ffffff" rx="4" />
      <text x="95" y="68" fill="#000000" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">7701234567895</text>
      <rect x="25" y="10" width="3" height="45" fill="#000" />
      <rect x="31" y="10" width="1" height="45" fill="#000" />
      <rect x="35" y="10" width="4" height="45" fill="#000" />
      <rect x="43" y="10" width="2" height="45" fill="#000" />
      <rect x="130" y="10" width="1" height="45" fill="#000" />
      <rect x="135" y="10" width="2" height="45" fill="#000" />
      <rect x="141" y="10" width="3" height="45" fill="#000" />
      <rect x="150" y="10" width="1" height="45" fill="#000" />
      <rect x="155" y="10" width="4" height="45" fill="#000" />
      <rect x="165" y="10" width="2" height="45" fill="#000" />
      <rect x="172" y="10" width="3" height="45" fill="#000" />
    </g>
  </g>
</svg>
`;

// Helper binary encoding of SVG string to clean inline Data URL
export const SAMPLE_OLD_LABEL = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(oldSvg.trim())));
export const SAMPLE_NEW_LABEL = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(newSvg.trim())));

// SAMPLE AROMATIZANTE: Old Original with rich Purple, elegant Cursive Font for Algodón, sparkling golden drops, and large enterprise details
const aromatizanteOldSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- Elegant rich dark purple background -->
  <rect width="800" height="600" fill="#4c1d95"/>
  <defs>
    <!-- Radial glow for premium look -->
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#4c1d95" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="800" height="600" fill="url(#glow)"/>

  <!-- Brillos que caen (Falling premium sparkles and highlights) -->
  <g id="brillos-decorativos">
    <circle cx="150" cy="120" r="12" fill="#fef08a" opacity="0.8"/>
    <path d="M 150 100 L 150 140 M 130 120 L 170 120" stroke="#ffffff" stroke-width="2"/>
    <circle cx="650" cy="180" r="16" fill="#fef08a" opacity="0.9"/>
    <path d="M 650 155 L 650 205 M 625 180 L 675 180" stroke="#ffffff" stroke-width="2.5"/>
    
    <circle cx="400" cy="100" r="6" fill="#ffffff" opacity="0.7"/>
    <circle cx="320" cy="220" r="8" fill="#fef08a" opacity="0.6"/>
    <circle cx="480" cy="240" r="10" fill="#ffffff" opacity="0.8"/>
    <circle cx="580" cy="110" r="5" fill="#fef08a" opacity="0.9"/>
    <circle cx="210" cy="270" r="7" fill="#ffffff" opacity="0.5"/>
  </g>

  <!-- Golden borders -->
  <rect x="30" y="30" width="740" height="540" rx="12" fill="none" stroke="#fbbf24" stroke-width="4" opacity="0.8"/>
  
  <!-- Content Panel -->
  <g transform="translate(400, 300)" text-anchor="middle">
    <!-- Premium label top -->
    <text x="0" y="-190" fill="#d8b4fe" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4">AROMATIZANTE ULTRA PREMIUM</text>
    
    <!-- Big title -->
    <text x="0" y="-120" fill="#ffffff" font-family="sans-serif" font-size="44" font-weight="900" letter-spacing="2">SUAVIDAD DE HOGAR</text>
    
    <!-- Central visual asset: cotton flower representation -->
    <g transform="translate(0, 0)">
      <circle cx="-35" cy="0" r="45" fill="#ffffff" stroke="#ddd6fe" stroke-width="2"/>
      <circle cx="35" cy="0" r="45" fill="#ffffff" stroke="#ddd6fe" stroke-width="2"/>
      <circle cx="0" cy="-35" r="45" fill="#ffffff" stroke="#ddd6fe" stroke-width="2"/>
      <circle cx="0" cy="35" r="45" fill="#ffffff" stroke="#ddd6fe" stroke-width="2"/>
      <circle cx="0" cy="0" r="30" fill="#f3e8ff"/>
      <text x="0" y="8" fill="#7c3aed" font-family="sans-serif" font-size="28">☁️</text>
    </g>

    <!-- Specific Word: Algodón - WRITTEN IN AN ELEGANT cursive-style serif serif font -->
    <text x="0" y="125" fill="#fef08a" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="42" letter-spacing="1">Algodón</text>
    <text x="0" y="160" fill="#ffffff" font-family="sans-serif" font-size="16" letter-spacing="3">CON EXTRACTOS NATURALES SENSITIVOS</text>
    
    <!-- Corporate enterprise detail - Font size 13px (original reference size) -->
    <text x="0" y="220" fill="#e9d5ff" font-family="sans-serif" font-size="13" font-weight="bold">eQuímica Internacional S.A.S | Nit: 900.123.456-7 | Tel: 555-1234 | Calle 44 Sur, Medellín</text>
  </g>
</svg>
`;

// SAMPLE NEW CANDIDATE: Background is softer purple, missing sparks entirely, altered font for Algodón, smaller enterprise text
const aromatizanteNewSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <!-- Softer/washed-out lighter purple background (Color change!) -->
  <rect width="800" height="600" fill="#6d28d9"/>
  <!-- NOTICE: Radial glow and decorative falling golden sparkles ARE COMPLETELY MISSING HERE! -->

  <!-- Golden borders - Slightly lighter yellow -->
  <rect x="30" y="30" width="740" height="540" rx="12" fill="none" stroke="#fcd34d" stroke-width="4" opacity="0.7"/>
  
  <!-- Content Panel -->
  <g transform="translate(400, 300)" text-anchor="middle">
    <!-- Premium label top -->
    <text x="0" y="-190" fill="#c084fc" font-family="sans-serif" font-size="14" font-weight="bold" letter-spacing="4">AROMATIZANTE ULTRA PREMIUM</text>
    
    <!-- Big title -->
    <text x="0" y="-120" fill="#ffffff" font-family="sans-serif" font-size="44" font-weight="900" letter-spacing="2">SUAVIDAD DE HOGAR</text>
    
    <!-- Central visual asset: cotton flower representation -->
    <g transform="translate(0, 0)">
      <circle cx="-35" cy="0" r="45" fill="#ffffff" stroke="#e9d5ff" stroke-width="2"/>
      <circle cx="35" cy="0" r="45" fill="#ffffff" stroke="#e9d5ff" stroke-width="2"/>
      <circle cx="0" cy="-35" r="45" fill="#ffffff" stroke="#e9d5ff" stroke-width="2"/>
      <circle cx="0" cy="35" r="45" fill="#ffffff" stroke="#e9d5ff" stroke-width="2"/>
      <circle cx="0" cy="0" r="30" fill="#f3e8ff"/>
      <text x="0" y="8" fill="#7c3aed" font-family="sans-serif" font-size="28">☁️</text>
    </g>

    <!-- Specific Word: Algodón - CHANGED FONT STYLE! No longer Georgia serif italic, it's Arial/Sans-serif straight sans-serif block! -->
    <text x="0" y="125" fill="#fbbf24" font-family="sans-serif" font-weight="bold" font-size="36" letter-spacing="1">ALGODÓN</text>
    <text x="0" y="160" fill="#ffffff" font-family="sans-serif" font-size="16" letter-spacing="3">CON EXTRACTOS NATURALES SENSITIVOS</text>
    
    <!-- Corporate enterprise detail - SHRUNK SENSIVELY from 13px down to 8.5px! -->
    <text x="0" y="225" fill="#d8b4fe" font-family="sans-serif" font-size="8.5">eQuímica Internacional S.A.S | Nit: 900.123.456-7 | Tel: 555-1234 | Calle 44 Sur, Medellín</text>
  </g>
</svg>
`;

export const SAMPLE_OLD_AROMATIZANTE = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(aromatizanteOldSvg.trim())));
export const SAMPLE_NEW_AROMATIZANTE = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(aromatizanteNewSvg.trim())));

