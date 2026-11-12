import type { CSSProperties } from "react"
import {
  ActivityIcon,
  BookmarkIcon,
  BriefcaseIcon,
  Building2Icon,
  CalendarIcon,
  CheckCircle2Icon,
  GiftIcon,
  LockIcon,
  MinusIcon,
  SendIcon,
  TrendingUpIcon,
  UserIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import type { StatCard, StatTone } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

const ICONS: Record<StatCard["icon"], LucideIcon> = {
  bookmark: BookmarkIcon,
  send: SendIcon,
  calendar: CalendarIcon,
  gift: GiftIcon,
  briefcase: BriefcaseIcon,
  users: UsersIcon,
  check: CheckCircle2Icon,
  building: Building2Icon,
  dollar: WalletIcon,
  pulse: ActivityIcon,
  lock: LockIcon,
  user: UserIcon,
}

const TONE_TEXT: Record<StatTone, string> = {
  default: "text-[#ededef]",
  brand: "text-[#8f88ff]",
  success: "text-[#22c55e]",
  warning: "text-[#f59e0b]",
  danger: "text-[#ef4444]",
  info: "text-[#60a5fa]",
}

type StatCardVariant = "plain" | "icon" | "admin"

/**
 * Metric card used across all dashboards.
 * - "plain"  → seeker cards: label + trailing icon, big value (Figma 262x128)
 * - "icon"   → recruiter cards: leading icon box (Figma 262x166)
 * - "admin"  → admin cards: icon box + trend pill (Figma 204x150)
 */
export function StatCardView({
  stat,
  variant = "plain",
  className,
}: {
  stat: StatCard
  variant?: StatCardVariant
  className?: string
}) {
  const Icon = ICONS[stat.icon] ?? ActivityIcon
  const valueTone = TONE_TEXT[stat.valueTone ?? "default"]
  const iconTone = TONE_TEXT[stat.iconTone ?? "default"]

  if (variant === "icon") {
    return (
      <Card
        style={{ "--card-spacing": "25px" } as CSSProperties}
        className={cn("justify-between rounded-xl", className)}
      >
        <div className="flex size-10 items-center justify-center rounded-[10px] bg-[#222228]">
          <Icon aria-hidden className="size-[18px] text-[#e5e2e3]" />
        </div>
        <p className="text-[13px] font-normal text-[#a0a0ab]">{stat.label}</p>
        <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
          {stat.value}
        </p>
      </Card>
    )
  }

  if (variant === "admin") {
    const trending = stat.trendDirection === "up"
    return (
      <Card
        style={{ "--card-spacing": "25px" } as CSSProperties}
        className={cn("justify-between rounded-xl", className)}
      >
        <div className="flex items-center justify-between">
          <div className="flex size-9 items-center justify-center rounded-[10px] bg-white/[0.10]">
            <Icon aria-hidden className="size-4 text-white" />
          </div>
          {stat.trend ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs font-normal",
                trending ? "text-[#22c55e]" : "text-[#a0a0ab]",
              )}
            >
              {trending ? (
                <TrendingUpIcon aria-hidden className="size-[9px]" />
              ) : (
                <MinusIcon aria-hidden className="size-[9px] text-[#c4c7c8]" />
              )}
              {stat.trend}
            </span>
          ) : null}
        </div>
        <p className="text-[13px] font-medium text-[#a0a0ab]">{stat.label}</p>
        <p className="text-[26px] leading-8 font-semibold tracking-[-0.02em] text-[#ededef]">
          {stat.value}
        </p>
      </Card>
    )
  }

  return (
    <Card
      style={{ "--card-spacing": "21px" } as CSSProperties}
      className={cn("justify-between rounded-xl", className)}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-normal text-[#a0a0ab]">{stat.label}</p>
        <Icon aria-hidden className={cn("size-[15px] shrink-0", iconTone)} />
      </div>
      <p className={cn("text-[26px] leading-8 font-semibold tracking-[-0.02em]", valueTone)}>
        {stat.value}
      </p>
    </Card>
  )
}

export function StatGrid({
  stats,
  variant,
  className,
}: {
  stats: StatCard[]
  variant?: StatCardVariant
  className?: string
}) {
  return (
    <div className={cn("grid gap-6", className)}>
      {stats.map((stat) => (
        <StatCardView key={stat.label} stat={stat} variant={variant} />
      ))}
    </div>
  )
}
