import type { Metadata } from "next"
import Link from "next/link"
import {
  BookmarkIcon,
  BriefcaseIcon,
  ClockIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  WalletIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { requireDashboardRole } from "@/lib/dashboard-guard"
import {
  applicationStats,
  jobListings,
  savedJobs,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Browse jobs · HireLoop",
  description: "Find roles that match your skills, location, and salary goals.",
}

export const dynamic = "force-dynamic"

const TIPS = [
  "Tailor your resume keywords to each job description.",
  "Apply within 48 hours — early applicants get 3× more replies.",
  "A complete profile lifts recruiter views by up to 40%.",
]

function matchesQuery(
  job: (typeof jobListings)[number],
  query: string
) {
  const haystack = [job.title, job.company, job.category, ...job.tags]
    .join(" ")
    .toLowerCase()
  return haystack.includes(query)
}

export default async function SeekerJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>
}) {
  const user = await requireDashboardRole("job-seeker")
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q.trim() : ""
  const activeCategory =
    typeof params.category === "string" && params.category !== "All"
      ? params.category
      : "All"

  const categories = [
    "All",
    ...Array.from(new Set(jobListings.map((job) => job.category))),
  ]

  const jobs = jobListings.filter((job) => {
    const matchesCategory =
      activeCategory === "All" || job.category === activeCategory
    const matchesSearch = query ? matchesQuery(job, query.toLowerCase()) : true
    return matchesCategory && matchesSearch
  })

  function categoryHref(category: string) {
    const search = new URLSearchParams()
    if (query) search.set("q", query)
    if (category !== "All") search.set("category", category)
    const qs = search.toString()
    return `/dashboard/seeker/jobs${qs ? `?${qs}` : ""}`
  }

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Job seeker
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Browse jobs
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              {jobListings.length} curated roles from teams actively hiring.
            </p>
          </div>
          <Button
            nativeButton={false}
            variant="ghost"
            className="h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 text-[13px] text-[#ededef] hover:bg-white/[0.06] hover:text-white"
            render={<Link href="/dashboard/seeker/saved" />}
          >
            <BookmarkIcon aria-hidden className="size-4" />
            Saved jobs
          </Button>
        </div>

        <div className="rounded-xl bg-[#141418] p-4 ring-1 ring-white/[0.06]">
          <form
            action="/dashboard/seeker/jobs"
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {activeCategory !== "All" ? (
              <input type="hidden" name="category" value={activeCategory} />
            ) : null}
            <div className="relative min-w-0 flex-1">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#82838d]"
              />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search role, company, or skill…"
                aria-label="Search jobs"
                className="h-10 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pr-3 pl-10 text-[13px] text-[#ededef] outline-none transition-colors placeholder:text-[#82838d] focus:border-[#5c53fe]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#5c53fe]/20"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#5c53fe] px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
            >
              <SearchIcon aria-hidden className="size-4" />
              Search jobs
            </button>
          </form>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {categories.map((category) => {
              const active = category === activeCategory
              return (
                <Link
                  key={category}
                  href={categoryHref(category)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex h-8 items-center rounded-lg px-2.5 text-xs font-medium transition-colors",
                    active
                      ? "bg-[#5c53fe]/15 text-[#a5a1ff] ring-1 ring-[#5c53fe]/40"
                      : "text-[#a0a0ab] hover:bg-white/[0.04] hover:text-[#ededef]"
                  )}
                >
                  {category}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-[15px] font-semibold text-[#ededef]">
                {query ? `Results for “${query}”` : "Recommended for you"}
              </h2>
              <span className="text-xs text-[#82838d]">
                {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-xl bg-[#141418] px-6 py-16 text-center ring-1 ring-white/[0.06]">
                <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#82838d]">
                  <BriefcaseIcon aria-hidden className="size-6" />
                </span>
                <p className="text-sm text-[#a0a0ab]">
                  No roles match that search yet.
                </p>
                <Link
                  href="/dashboard/seeker/jobs"
                  className="text-xs font-medium text-[#8f88ff] hover:text-[#a5a1ff]"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {jobs.map((job) => (
                  <article
                    key={job.id}
                    className="group rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06] transition-colors hover:ring-white/[0.14]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#222228] text-sm font-semibold text-[#ededef]">
                          {job.companyMark}
                        </span>
                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-semibold text-[#ededef]">
                            {job.title}
                          </h3>
                          <p className="truncate text-xs text-[#a0a0ab]">
                            {job.company} · {job.location}
                          </p>
                        </div>
                      </div>
                      {job.featured ? (
                        <StatusBadge tone="brand">Featured</StatusBadge>
                      ) : null}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#a0a0ab]">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPinIcon aria-hidden className="size-3.5 text-[#82838d]" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon aria-hidden className="size-3.5 text-[#82838d]" />
                        {job.type}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-[#c4c7c8]">
                        <WalletIcon aria-hidden className="size-3.5 text-[#82838d]" />
                        {job.salary}
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-[#a0a0ab] ring-1 ring-white/[0.06]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                      <span className="text-[11px] text-[#82838d]">
                        {job.posted}
                      </span>
                      <div className="flex items-center gap-2">
                        <Link
                          href="/dashboard/seeker/saved"
                          aria-label={`Save ${job.title}`}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-[#a0a0ab] transition-colors hover:border-[#5c53fe]/40 hover:text-[#a5a1ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
                        >
                          <BookmarkIcon aria-hidden className="size-4" />
                        </Link>
                        <button
                          type="button"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
                        >
                          Apply now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <SectionHeader
                title="Application tracker"
                description="Where your search stands right now."
                href="/dashboard/seeker/applications"
              />
              <ul className="mt-4 flex flex-col gap-3 text-xs">
                {applicationStats.map((stat) => (
                  <li
                    key={stat.label}
                    className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-[#a0a0ab]">{stat.label}</span>
                    <span className="font-medium text-[#ededef] tabular-nums">
                      {stat.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <SectionHeader
                title="Saved jobs"
                description={`${savedJobs.length} roles waiting for you.`}
                href="/dashboard/seeker/saved"
                linkLabel="Manage"
              />
              <ul className="mt-4 flex flex-col gap-3">
                {savedJobs.slice(0, 2).map((job) => (
                  <li
                    key={job.id}
                    className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/[0.06]"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#222228] text-[11px] font-semibold text-[#ededef]">
                      {job.companyMark}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[#ededef]">
                        {job.title}
                      </p>
                      <p className="truncate text-[11px] text-[#82838d]">
                        {job.company} · {job.salary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Job search tips
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    Small habits, better response rates.
                  </p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#222228]">
                  <SparklesIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>
              <ul className="mt-4 flex flex-col gap-3">
                {TIPS.map((tip) => (
                  <li key={tip} className="flex gap-2.5 text-xs leading-5 text-[#a0a0ab]">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#8f88ff]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
