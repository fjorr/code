import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/**
 * Fjorr Pro is loaded in globals.css with font-family "Fjorr Pro".
 * next/font would publish the variable name (fjorrPro) in Inspect instead.
 */

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

/** Avenir Next Variable (subset woff2) — display headlines via font-futura. */
const avenirNextVariable = localFont({
  src: "../public/fonts/AvenirNextVariable-Roman.woff2",
  weight: "250 900",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});

export const fontVariables = `${jetbrainsMono.variable} ${avenirNextVariable.variable}`;
