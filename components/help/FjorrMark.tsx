import { FjorrWordmark } from "@/components/brand/FjorrMarks";

/** Compact Fjorr wordmark for The Manual. */
export default function FjorrMark({ className = "h-[14px] w-[23px]" }: { className?: string }) {
  return <FjorrWordmark className={className} />;
}
