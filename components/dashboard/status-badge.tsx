import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone =
  | "brand"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"

const TONE_STYLES: Record<StatusTone, string> = {
  brand: "border-[#8f88ff]/60 bg-[#8f88ff]/[0.14] text-[#8f88ff]",
  success: "border-[#22c55e]/60 bg-[#22c55e]/[0.14] text-[#22c55e]",
  warning: "border-[#f59e0b]/60 bg-[#f59e0b]/[0.14] text-[#f59e0b]",
  danger: "border-[#ef4444]/60 bg-[#ef4444]/[0.14] text-[#ef4444]",
  info: "border-[#60a5fa]/60 bg-[#60a5fa]/[0.14] text-[#60a5fa]",
  neutral: "border-[#a0a0ab]/60 bg-[#a0a0ab]/[0.14] text-[#a0a0ab]",
}

const TONE_DOT: Record<StatusTone, string> = {
  brand: "bg-[#8f88ff]",
  success: "bg-[#22c55e]",
  warning: "bg-[#f59e0b]",
  danger: "bg-[#ef4444]",
  info: "bg-[#60a5fa]",
  neutral: "bg-[#a0a0ab]",
}

/** Status pill used in tables and cards (Figma: color @ 14% + border + text). */
export function StatusBadge({
  tone,
  children,
  className,
}: {
  tone: StatusTone
  children: ReactNode
  className?: string
}) {
  return (
    <Badge
      className={cn("h-[22px] rounded-md px-2 text-xs font-medium", TONE_STYLES[tone], className)}
    >
      {children}
    </Badge>
  )
}

/** Dot + plain label variant used for transaction statuses (Figma admin table). */
export function StatusDot({ tone, children }: { tone: StatusTone; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-normal text-[#a0a0ab]">
      <span className={cn("size-1.5 shrink-0 rounded-full", TONE_DOT[tone])} />
      <span className={TONE_STYLES[tone].split(" ").pop()}>{children}</span>
    </span>
  )
}

const STATUS_TONES: Record<string, StatusTone> = {
  // Application lifecycle
  applied: "info",
  new: "info",
  review: "warning",
  reviewing: "warning",
  shortlisted: "success",
  offered: "success",
  interviewing: "brand",
  interview: "brand",
  rejected: "danger",
  // Jobs
  active: "success",
  closed: "neutral",
  // Payments
  success: "success",
  paid: "success",
  pending: "warning",
  failed: "danger",
  // Accounts
  suspended: "danger",
}

export function statusTone(status: string): StatusTone {
  return STATUS_TONES[status.toLowerCase()] ?? "neutral"
}

export function StatusBadgeAuto({ status }: { status: string }) {
  return (
    <StatusBadge tone={statusTone(status)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </StatusBadge>
  )
}
