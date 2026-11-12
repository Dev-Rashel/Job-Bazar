import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  BookmarkIcon,
  ClockIcon,
  SparklesIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatGrid } from "@/components/dashboard/stat-card"
import { StatusBadgeAuto } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { requireDashboardRole } from "@/lib/dashboard-guard"
import {
  savedJobs,
  seekerActivity,
  seekerApplications,
  seekerStats,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Job seeker dashboard · HireLoop",
  description: "Track your applications, saved jobs, and interviews.",
}

export const dynamic = "force-dynamic"

const ACTIVITY_DOT: Record<(typeof seekerActivity)[number]["tone"], string> = {
  brand: "bg-[#8f88ff]",
  success: "bg-[#22c55e]",
  neutral: "bg-[#a0a0ab]",
}

export default async function SeekerDashboardPage() {
  const user = await requireDashboardRole("job-seeker")
  const firstName = user.name.trim().split(/\s+/)[0] || "there"

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Job seeker
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              Here&apos;s what&apos;s happening with your job search today.
            </p>
          </div>
          <Button
            nativeButton={false}
            className="h-9 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white hover:bg-[#6a62ff]"
            render={<Link href="/dashboard/seeker/jobs" />}
          >
            <BriefcaseIcon aria-hidden className="size-4" />
            Browse jobs
          </Button>
        </div>

        <StatGrid
          stats={seekerStats}
          className="grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
              <div className="px-5 py-4">
                <SectionHeader
                  title="Recent applications"
                  description="The latest roles you applied to."
                  href="/dashboard/seeker/applications"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Role
                    </TableHead>
                    <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase sm:table-cell">
                      Company
                    </TableHead>
                    <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase md:table-cell">
                      Applied
                    </TableHead>
                    <TableHead className="h-9 px-5 text-right text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seekerApplications.slice(0, 4).map((application) => (
                    <TableRow
                      key={application.id}
                      className="border-white/[0.06] hover:bg-white/[0.03]"
                    >
                      <TableCell className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-[#ededef]">
                          {application.title}
                        </p>
                        <p className="mt-0.5 text-xs text-[#a0a0ab]">
                          {application.type}
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-5 py-3.5 sm:table-cell">
                        <div className="flex items-center gap-2">
                          <span className="flex size-7 items-center justify-center rounded-md bg-[#222228] text-[11px] font-semibold text-[#ededef]">
                            {application.companyMark}
                          </span>
                          <span className="text-[13px] text-[#c4c7c8]">
                            {application.company}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden px-5 py-3.5 text-xs text-[#a0a0ab] md:table-cell">
                        {application.applied}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right">
                        <StatusBadgeAuto status={application.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-[15px] font-semibold text-[#ededef]">
                  Saved jobs
                </h2>
                <Link
                  href="/dashboard/seeker/saved"
                  className="text-xs font-medium text-[#8f88ff] transition-colors hover:text-[#a5a1ff]"
                >
                  Manage saved
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {savedJobs.slice(0, 2).map((job) => (
                  <div
                    key={job.id}
                    className="flex flex-col gap-3 rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-[#222228] text-xs font-semibold text-[#ededef]">
                          {job.companyMark}
                        </span>
                        <div>
                          <p className="text-[13px] font-medium text-[#ededef]">
                            {job.title}
                          </p>
                          <p className="text-[11px] tracking-[0.06em] text-[#82838d] uppercase">
                            {job.company}
                          </p>
                        </div>
                      </div>
                      <BookmarkIcon
                        aria-hidden
                        className="size-4 text-[#8f88ff]"
                      />
                    </div>
                    <div className="flex flex-col gap-1 text-xs text-[#a0a0ab]">
                      <span>{job.location}</span>
                      <span className="text-[#c4c7c8]">{job.salary}</span>
                    </div>
                    {job.closingIn ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-[#f59e0b]">
                        <ClockIcon aria-hidden className="size-3" />
                        {job.closingIn}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <SectionHeader title="Recent activity" />
              <ul className="mt-4 flex flex-col gap-4">
                {seekerActivity.map((activity) => (
                  <li key={activity.id} className="flex gap-3">
                    <span
                      className={cn(
                        "mt-1.5 size-1.5 shrink-0 rounded-full",
                        ACTIVITY_DOT[activity.tone]
                      )}
                    />
                    <div>
                      <p className="text-[13px] leading-5 text-[#c4c7c8]">
                        {activity.message}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#82838d]">
                        {activity.time}
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
                    Profile completion
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    A complete profile gets 3× more recruiter views.
                  </p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#222228]">
                  <SparklesIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="text-[#a0a0ab]">Overall progress</span>
                <span className="font-medium text-[#ededef]">72%</span>
              </div>
              <Progress
                value={72}
                className="mt-2 w-full gap-0 [&_[data-slot=progress-indicator]]:bg-[#5c53fe] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-white/[0.08]"
              />

              <p className="mt-4 text-xs leading-5 text-[#82838d]">
                Add a portfolio link and two more work samples to reach 100%.
              </p>

              <Button
                nativeButton={false}
                variant="ghost"
                className="mt-4 h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] text-[13px] text-[#ededef] hover:bg-white/[0.06] hover:text-white"
                render={<Link href="/dashboard/seeker/settings" />}
              >
                Complete profile
                <ArrowUpRightIcon aria-hidden className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
