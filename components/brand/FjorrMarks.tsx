import type { CSSProperties } from "react";

const WORDMARK = "/brand/fjorr-wordmark.png";
const ICON = "/brand/fjorr-icon.png";

function markStyle(src: string, ratio: string): CSSProperties {
  return {
    backgroundColor: "currentColor",
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
    aspectRatio: ratio,
  };
}

/** Wordmark. Inherits text color so it works on light and dark. */
export function FjorrWordmark({
  className = "h-[15px] w-[25px]",
}: {
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Fjorr"
      className={`inline-block ${className}`}
      style={markStyle(WORDMARK, "523 / 320")}
    />
  );
}

/** Icon. Inherits text color so it works on light and dark. */
export function FjorrIcon({
  className = "h-[18px] w-[18px]",
}: {
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label="Fjorr"
      className={`inline-block ${className}`}
      style={markStyle(ICON, "1 / 1")}
    />
  );
}
