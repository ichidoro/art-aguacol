export interface DiscrepancyAlert {
  id: string;
  category: "Color" | "Tipografía" | "Proporciones" | "Imagen" | "Otro";
  severity: "Alta" | "Media" | "Baja";
  title: string;
  description: string;
  oldValue: string;
  newValue: string;
  // Dynamic visual location marker on a 0-100 percentage scale for responsive overlays
  boxOld?: { x: number; y: number; w: number; h: number } | null;
  boxNew?: { x: number; y: number; w: number; h: number } | null;
}

export interface DetailedAnalysis {
  color: string;
  typography: string;
  proportions: string;
  images: string;
}

export interface ComparisonData {
  similarityScore: number;
  discrepancyAlerts: DiscrepancyAlert[];
  detailedAnalysis: DetailedAnalysis;
  verdict: string;
  isApproved: boolean;
}

export interface ComparisonReport {
  id: string;
  timestamp: string;
  oldFileName: string;
  newFileName: string;
  oldImage: string; // base64 / objectURL for display refernce
  newImage: string; // base64 / objectURL for display reference
  additionalContext: string;
  results: ComparisonData;
}

export interface UserAccount {
  username: string;
  passwordHash: string; // Storing hashed / base64 for basic obfuscation
  fullName: string;
  createdAt: string;
}

