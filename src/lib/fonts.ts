import { Geist_Mono, Manrope } from "next/font/google";

/* Headline face for the Crest-style design language, shared by the agency
   homepage and the contractor template. Loaded per layout (not in the root
   layout) so the legacy pages don't pay for it. */
export const homeFont = Manrope({ subsets: ["latin"], variable: "--font-home-face", display: "swap" });

/* Monospace for the Axion-style labels on the agency site ("■ ABOUT US"). */
export const monoFont = Geist_Mono({ subsets: ["latin"], variable: "--font-mono-face", display: "swap" });
