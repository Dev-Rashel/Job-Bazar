import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  MapPinIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { getInitials } from "@/lib/utils"
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
  recruiterApplicants,
  recruiterJobPosts,
  recruiterStats,
} from "@/lib/dashboard-data"

export const metadata: Metadata = {
  title: "Recruiter dashboard · HireLoop",
  description: "Manage job posts, applicants, and your hiring pipeline.",
}

export const dynamic = "force-dynamic"

const HIRING_PIPELINE = [
  { label: "New applicants", value: 128, percent: 100 },
  { label: "In review", value: 84, percent: 66 },
  { label: "Interviewing", value: 32, percent: 25 },
  { label: "Offers sent", value: 9, percent: 7 },
]

export default async function RecruiterDashboardPage() {
  const user = await requireDashboardRole("recruiter")
  const activeJobs = recruiterJobPosts.filter((job) => job.status === "Active")

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Recruiter
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Hiring overview
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              Your open roles and the candidates moving through them.
            </p>
          </div>
          <Button
            nativeButton={false}
            className="h-9 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white hover:bg-[#6a62ff]"
            render={<Link href="/dashboard/recruiter/jobs/new" />}
          >
            <PlusIcon aria-hidden className="size-4" />
            Create job post
          </Button>
        </div>

        <StatGrid
          stats={recruiterStats}
          variant="icon"
          className="grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
              <div className="px-5 py-4">
                <SectionHeader
                  title="Recent applicants"
                  description="Candidates who applied in the last few days."
                  href="/dashboard/recruiter/applications"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Candidate
                    </TableHead>
                    <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase sm:table-cell">
                      Applied for
                    </TableHead>
                    <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase md:table-cell">
                      Experience
                    </TableHead>
                    <TableHead className="h-9 px-5 text-right text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recruiterApplicants.map((applicant) => (
                    <TableRow
                      key={applicant.id}
                      className="border-white/[0.06] hover:bg-white/[0.03]"
                    >
                      <TableCell className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#222228] text-[11px] font-semibold text-[#ededef]">
                            {getInitials(applicant.name)}
                          </span>
                          <div>
                            <p className="text-[13px] font-medium text-[#ededef]">
                              {applicant.name}
                            </p>
                            <p className="mt-0.5 text-xs text-[#a0a0ab]">
                              {applicant.role}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden px-5 py-3.5 text-[13px] text-[#c4c7c8] sm:table-cell">
                        {applicant.applied}
                      </TableCell>
                      <TableCell className="hidden px-5 py-3.5 text-xs text-[#a0a0ab] md:table-cell">
                        {applicant.experience}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right">
                        <StatusBadgeAuto status={applicant.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
              <div className="px-5 py-4">
                <SectionHeader
                  title="Active job posts"
                  description={`${activeJobs.length} roles are currently accepting applications.`}
                  href="/dashboard/recruiter/jobs"
                  linkLabel="Manage jobs"
                />
              </div>
              <ul className="divide-y divide-white/[0.06] border-t border-white/[0.06]">
                {activeJobs.map((job) => (
                  <li
                    key={job.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#ededef]">
                        {job.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#a0a0ab]">
                        <span className="inline-flex items-center gap-1">
                          <MapPinIcon aria-hidden className="size-3" />
                          {job.location}
                        </span>
                        <span>{job.type}</span>
                        <span>Closes {job.deadline}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.04] px-2 py-1 text-[11px] text-[#c4c7c8] ring-1 ring-white/[0.06]">
                        <UsersIcon aria-hidden className="size-3" />
                        {job.applicants} applicants
                      </span>
                      <Button
                        nativeButton={false}
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Open ${job.title}`}
                        className="text-[#c4c7c8] hover:bg-white/[0.06] hover:text-white"
                        render={<Link href="/dashboard/recruiter/jobs" />}
                      >
                        <ArrowUpRightIcon aria-hidden className="size-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Hiring pipeline
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    Candidates across all active roles.
                  </p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#222228]">
                  <BriefcaseIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>

              <ul className="mt-5 flex flex-col gap-4">
                {HIRING_PIPELINE.map((stage) => (
                  <li key={stage.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#a0a0ab]">{stage.label}</span>
                      <span className="font-medium text-[#ededef]">
                        {stage.value}
                      </span>
                    </div>
                    <Progress
                      value={stage.percent}
                      className="w-full gap-0 [&_[data-slot=progress-indicator]]:bg-[#5c53fe] [&_[data-slot=progress-track]]:h-1.5 [&_[data-slot=progress-track]]:bg-white/[0.08]"
                    />
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <h2 className="text-[15px] font-semibold text-[#ededef]">
                Company profile
              </h2>
              <p className="mt-0.5 text-xs text-[#a0a0ab]">
                Keep your company page up to date to attract better candidates.
              </p>

              <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/[0.06]">
                <span className="flex size-9 items-center justify-center rounded-lg bg-[#222228] text-xs font-semibold text-[#ededef]">
                  HP
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[#ededef]">
                    HirePulse Network
                  </p>
                  <p className="text-xs text-[#a0a0ab]">Technology · Verified</p>
                </div>
              </div>

              <Button
                nativeButton={false}
                variant="ghost"
                className="mt-4 h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] text-[13px] text-[#ededef] hover:bg-white/[0.06] hover:text-white"
                render={<Link href="/dashboard/recruiter/company" />}
              >
                Edit company profile
                <ArrowUpRightIcon aria-hidden className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
