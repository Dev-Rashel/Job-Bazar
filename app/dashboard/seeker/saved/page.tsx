import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  BookmarkIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  XIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { Button } from "@/components/ui/button"
import { requireDashboardRole } from "@/lib/dashboard-guard"
import { savedJobs } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Saved jobs · HireLoop",
  description: "Every role you bookmarked, in one place.",
}

export const dynamic = "force-dynamic"

export default async function SeekerSavedJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const user = await requireDashboardRole("job-seeker")
  const params = await searchParams
  const activeCategory =
    typeof params.category === "string" && params.category !== "All saved"
      ? params.category
      : "All saved"

  const categories = [
    "All saved",
    ...Array.from(new Set(savedJobs.map((job) => job.category))),
  ]

  const countFor = (category: string) =>
    category === "All saved"
      ? savedJobs.length
      : savedJobs.filter((job) => job.category === category).length

  const jobs =
    activeCategory === "All saved"
      ? savedJobs
      : savedJobs.filter((job) => job.category === activeCategory)

  const closingSoon = savedJobs.filter((job) => job.closingIn).length

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Job seeker
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Saved jobs
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              {savedJobs.length} bookmarked roles · {closingSoon} closing soon.
            </p>
          </div>
          <Button
            nativeButton={false}
            className="h-9 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white hover:bg-[#6a62ff]"
            render={<Link href="/dashboard/seeker/jobs" />}
          >
            <BriefcaseIcon aria-hidden className="size-4" />
            Browse more jobs
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-[#141418] p-2 ring-1 ring-white/[0.06]">
          {categories.map((category) => {
            const active = category === activeCategory
            const href =
              category === "All saved"
                ? "/dashboard/seeker/saved"
                : `/dashboard/seeker/saved?category=${encodeURIComponent(category)}`

            return (
              <Link
                key={category}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors",
                  active
                    ? "bg-[#5c53fe]/15 text-[#a5a1ff] ring-1 ring-[#5c53fe]/40"
                    : "text-[#a0a0ab] hover:bg-white/[0.04] hover:text-[#ededef]"
                )}
              >
                {category}
                <span
                  className={cn(
                    "rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                    active
                      ? "bg-[#5c53fe]/20 text-[#c7c3ff]"
                      : "bg-white/[0.06] text-[#82838d]"
                  )}
                >
                  {countFor(category)}
                </span>
              </Link>
            )
          })}
        </div>

        {jobs.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-[#141418] px-6 py-16 text-center ring-1 ring-white/[0.06]">
            <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#82838d]">
              <BookmarkIcon aria-hidden className="size-6" />
            </span>
            <p className="text-sm text-[#a0a0ab]">
              Nothing saved in this category yet.
            </p>
            <Link
              href="/dashboard/seeker/jobs"
              className="text-xs font-medium text-[#8f88ff] hover:text-[#a5a1ff]"
            >
              Find jobs to save
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {jobs.map((job) => (
              <article
                key={job.id}
                className="flex flex-col rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06] transition-colors hover:ring-white/[0.14]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#222228] text-xs font-semibold text-[#ededef]">
                      {job.companyMark}
                    </span>
                    <div className="min-w-0">
                      <h2 className="truncate text-[15px] font-semibold text-[#ededef]">
                        {job.title}
                      </h2>
                      <p className="truncate text-[11px] tracking-[0.06em] text-[#82838d] uppercase">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${job.title} from saved jobs`}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#82838d] transition-colors hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:outline-none"
                  >
                    <XIcon aria-hidden className="size-4" />
                  </button>
                </div>

                <div className="mt-4 flex flex-col gap-1.5 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-[#a0a0ab]">
                    <MapPinIcon aria-hidden className="size-3.5 text-[#82838d]" />
                    {job.location}
                  </span>
                  <span className="font-medium text-[#c4c7c8]">{job.salary}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-[#a0a0ab] ring-1 ring-white/[0.06]">
                    {job.category}
                  </span>
                  {job.closingIn ? (
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-[#f59e0b]">
                      <ClockIcon aria-hidden className="size-3" />
                      {job.closingIn}
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-[#82838d]">
                    <BookmarkIcon aria-hidden className="size-3" />
                    {job.savedAt}
                  </span>
                  <Link
                    href={`/dashboard/seeker/jobs?q=${encodeURIComponent(job.title)}`}
                    className="inline-flex h-8 items-center gap-1 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-[#ededef] transition-colors hover:border-[#5c53fe]/40 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
                  >
                    View job
                    <ArrowUpRightIcon aria-hidden className="size-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
