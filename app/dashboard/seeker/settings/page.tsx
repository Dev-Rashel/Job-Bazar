import type { Metadata } from "next"
import Link from "next/link"
import {
  BellIcon,
  BriefcaseIcon,
  CheckCircle2Icon,
  ShieldCheckIcon,
  Trash2Icon,
  TriangleAlertIcon,
  UserRoundIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Progress } from "@/components/ui/progress"
import { requireDashboardRole } from "@/lib/dashboard-guard"
import { cn } from "@/lib/utils"
import { updateProfile } from "./actions"

export const metadata: Metadata = {
  title: "Settings · HireLoop",
  description: "Manage your profile, job preferences, and notifications.",
}

export const dynamic = "force-dynamic"

const fieldClass =
  "h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-[13px] text-[#ededef] outline-none transition-colors placeholder:text-[#82838d] focus:border-[#5c53fe]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#5c53fe]/20 disabled:cursor-not-allowed disabled:opacity-60"

const labelClass = "text-xs font-medium text-[#a0a0ab]"

const NOTIFICATIONS = [
  {
    id: "job-alerts",
    title: "Job alerts",
    description: "Weekly digest of roles that match your preferences.",
    defaultChecked: true,
  },
  {
    id: "application-updates",
    title: "Application updates",
    description: "Status changes, interview invites, and recruiter replies.",
    defaultChecked: true,
  },
  {
    id: "product-news",
    title: "Product news",
    description: "Occasional updates about new HireLoop features.",
    defaultChecked: false,
  },
]

function initials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "?"
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export default async function SeekerSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const user = await requireDashboardRole("job-seeker")
  const params = await searchParams
  const saved = params.saved === "1"
  const nameError = params.error === "name"

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
            Job seeker
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
            Settings
          </h1>
          <p className="mt-1 text-sm text-[#a0a0ab]">
            Keep your profile and job preferences up to date.
          </p>
        </div>

        {saved ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#22c55e]/30 bg-[#22c55e]/10 px-4 py-3 text-xs text-[#86efac]">
            <CheckCircle2Icon aria-hidden className="size-4" />
            Your profile has been updated.
          </div>
        ) : null}

        {nameError ? (
          <div className="flex items-center gap-2 rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 text-xs text-[#fca5a5]">
            <TriangleAlertIcon aria-hidden className="size-4" />
            Please enter your full name before saving.
          </div>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <form
              action={updateProfile}
              className="rounded-xl bg-[#141418] ring-1 ring-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Profile details
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    Recruiters see this information on your applications.
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#222228]">
                  <UserRoundIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>

              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={user.name}
                    placeholder="Jane Cooper"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    disabled
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (415) 555-0132"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="headline" className={labelClass}>
                    Headline
                  </label>
                  <input
                    id="headline"
                    name="headline"
                    type="text"
                    placeholder="Senior Product Designer"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="location" className={labelClass}>
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    placeholder="San Francisco, CA"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="bio" className={labelClass}>
                    About
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    placeholder="A short summary of your experience and what you're looking for…"
                    className="mt-2 w-full resize-y rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13px] leading-6 text-[#ededef] outline-none transition-colors placeholder:text-[#82838d] focus:border-[#5c53fe]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#5c53fe]/20"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] px-5 py-4">
                <p className="text-[11px] text-[#82838d]">
                  Only your display name is saved right now — more fields land
                  with the profile service.
                </p>
                <button
                  type="submit"
                  className="inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
                >
                  Save changes
                </button>
              </div>
            </form>

            <div className="rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
              <div className="flex items-start justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Job preferences
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    Used to rank the jobs we recommend.
                  </p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#222228]">
                  <BriefcaseIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>

              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="desired-role" className={labelClass}>
                    Desired role
                  </label>
                  <input
                    id="desired-role"
                    name="desiredRole"
                    type="text"
                    placeholder="Product Designer"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="desired-location" className={labelClass}>
                    Preferred location
                  </label>
                  <input
                    id="desired-location"
                    name="desiredLocation"
                    type="text"
                    placeholder="Remote or hybrid"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="salary" className={labelClass}>
                    Minimum salary
                  </label>
                  <input
                    id="salary"
                    name="salary"
                    type="text"
                    placeholder="$120,000"
                    className={cn(fieldClass, "mt-2")}
                  />
                </div>

                <div>
                  <label htmlFor="job-type" className={labelClass}>
                    Job type
                  </label>
                  <select
                    id="job-type"
                    name="jobType"
                    defaultValue="full-time"
                    className={cn(fieldClass, "mt-2 appearance-none pr-8")}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="contract">Contract</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <label className="flex items-center gap-2.5 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="remoteOnly"
                    className="size-4 rounded border-white/20 bg-white/[0.03] accent-[#5c53fe]"
                  />
                  <span className="text-xs text-[#c4c7c8]">
                    Only show remote roles
                  </span>
                </label>
              </div>

              <div className="flex justify-end border-t border-white/[0.06] px-5 py-4">
                <button
                  type="button"
                  className="inline-flex h-9 items-center rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-[13px] font-medium text-[#ededef] transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none"
                >
                  Save preferences
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-full bg-[#5c53fe]/20 text-sm font-semibold text-[#a5a1ff] ring-1 ring-[#5c53fe]/30"
                >
                  {initials(user.name, user.email)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-semibold text-[#ededef]">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-[#a0a0ab]">{user.email}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-[#a0a0ab] uppercase">
                  Job seeker
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-[#22c55e]/30 bg-[#22c55e]/10 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-[#86efac] uppercase">
                  <ShieldCheckIcon aria-hidden className="size-3" />
                  Approved
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-[#a0a0ab]">Profile strength</span>
                <span className="font-medium text-[#ededef]">72%</span>
              </div>
              <Progress
                value={72}
                className="mt-2 w-full gap-0 [&_[data-slot=progress-indicator]]:bg-[#5c53fe] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-white/[0.08]"
              />
              <Link
                href="/dashboard/seeker"
                className="mt-4 inline-flex text-xs font-medium text-[#8f88ff] hover:text-[#a5a1ff]"
              >
                Back to dashboard
              </Link>
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Notifications
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    Choose what lands in your inbox.
                  </p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#222228]">
                  <BellIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>

              <ul className="mt-4 flex flex-col gap-4">
                {NOTIFICATIONS.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-start justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#ededef]">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-4 text-[#82838d]">
                        {notification.description}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      aria-label={notification.title}
                      defaultChecked={notification.defaultChecked}
                      className="mt-0.5 size-4 shrink-0 rounded border-white/20 bg-white/[0.03] accent-[#5c53fe]"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-[#ef4444]/20 bg-[#ef4444]/[0.04] p-5">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-[#ef4444]/10 text-[#fca5a5]">
                  <TriangleAlertIcon aria-hidden className="size-4" />
                </span>
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Danger zone
                  </h2>
                  <p className="mt-1 text-[11px] leading-5 text-[#a0a0ab]">
                    Deleting your account removes your profile, applications,
                    and saved jobs permanently.
                  </p>
                  <button
                    type="button"
                    className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#ef4444]/40 bg-[#ef4444]/10 px-3 text-xs font-medium text-[#fca5a5] transition-colors hover:bg-[#ef4444]/20 hover:text-[#fecaca] focus-visible:ring-2 focus-visible:ring-[#ef4444]/30 focus-visible:outline-none"
                  >
                    <Trash2Icon aria-hidden className="size-3.5" />
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
