import type { Metadata } from "next"
import Link from "next/link"
import { BriefcaseIcon, FileTextIcon } from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatGrid } from "@/components/dashboard/stat-card"
import { StatusBadgeAuto } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
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
  applicationStats,
  seekerApplications,
  type JobStatus,
} from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Applications · HireLoop",
  description: "Track every application and its current stage.",
}

export const dynamic = "force-dynamic"

const STATUS_FILTERS: Array<JobStatus | "All"> = [
  "All",
  "Applied",
  "Review",
  "Shortlisted",
  "Offered",
  "Rejected",
]

export default async function SeekerApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const user = await requireDashboardRole("job-seeker")
  const params = await searchParams
  const activeStatus =
    typeof params.status === "string" &&
    (STATUS_FILTERS as string[]).includes(params.status)
      ? (params.status as JobStatus)
      : "All"

  const applications =
    activeStatus === "All"
      ? seekerApplications
      : seekerApplications.filter(
          (application) => application.status === activeStatus
        )

  const countFor = (status: JobStatus | "All") =>
    status === "All"
      ? seekerApplications.length
      : seekerApplications.filter((application) => application.status === status)
          .length

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Job seeker
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Applications
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              Every role you applied to, with its latest status.
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
          stats={applicationStats}
          className="grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        />

        <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[15px] leading-6 font-semibold text-[#ededef]">
                Application history
              </h2>
              <p className="mt-0.5 text-xs text-[#a0a0ab]">
                {applications.length} of {seekerApplications.length} applications
                shown.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {STATUS_FILTERS.map((status) => {
                const active = status === activeStatus
                const href =
                  status === "All"
                    ? "/dashboard/seeker/applications"
                    : `/dashboard/seeker/applications?status=${status}`

                return (
                  <Link
                    key={status}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
                      active
                        ? "bg-[#5c53fe]/15 text-[#a5a1ff] ring-1 ring-[#5c53fe]/40"
                        : "text-[#a0a0ab] hover:bg-white/[0.04] hover:text-[#ededef]"
                    )}
                  >
                    {status}
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                        active
                          ? "bg-[#5c53fe]/20 text-[#c7c3ff]"
                          : "bg-white/[0.06] text-[#82838d]"
                      )}
                    >
                      {countFor(status)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#82838d]">
                <FileTextIcon aria-hidden className="size-6" />
              </span>
              <p className="text-sm text-[#a0a0ab]">
                No applications with this status yet.
              </p>
              <Link
                href="/dashboard/seeker/applications"
                className="text-xs font-medium text-[#8f88ff] hover:text-[#a5a1ff]"
              >
                Show all applications
              </Link>
            </div>
          ) : (
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
                  <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                    Status
                  </TableHead>
                  <TableHead className="h-9 px-5 text-right text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
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
                    <TableCell className="px-5 py-3.5">
                      <StatusBadgeAuto status={application.status} />
                    </TableCell>
                    <TableCell className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        className="inline-flex h-8 items-center rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 text-xs font-medium text-[#c4c7c8] transition-colors hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none"
                      >
                        View
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
