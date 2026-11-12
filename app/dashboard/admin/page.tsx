import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowUpRightIcon,
  BriefcaseIcon,
  Building2Icon,
  ShieldCheckIcon,
  UsersIcon,
  WalletIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatGrid } from "@/components/dashboard/stat-card"
import { StatusBadge, StatusDot } from "@/components/dashboard/status-badge"
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
  adminStats,
  adminTransactions,
  managedCompanies,
} from "@/lib/dashboard-data"

export const metadata: Metadata = {
  title: "Admin dashboard · HireLoop",
  description: "Platform-wide users, jobs, companies, and revenue.",
}

export const dynamic = "force-dynamic"

const QUICK_LINKS = [
  { label: "Manage users", href: "/dashboard/admin/users", icon: UsersIcon },
  { label: "Manage jobs", href: "/dashboard/admin/jobs", icon: BriefcaseIcon },
  {
    label: "Manage companies",
    href: "/dashboard/admin/companies",
    icon: Building2Icon,
  },
  {
    label: "View payments",
    href: "/dashboard/admin/payments",
    icon: WalletIcon,
  },
]

export default async function AdminDashboardPage() {
  const user = await requireDashboardRole("admin")
  const pendingCompanies = managedCompanies.filter(
    (company) => company.status === "Pending"
  )

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Admin
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Platform overview
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              A snapshot of growth, revenue, and accounts that need review.
            </p>
          </div>
          <Button
            nativeButton={false}
            className="h-9 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white hover:bg-[#6a62ff]"
            render={<Link href="/admin" />}
          >
            <ShieldCheckIcon aria-hidden className="size-4" />
            Account approvals
          </Button>
        </div>

        <StatGrid
          stats={adminStats}
          variant="admin"
          className="grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
              <div className="px-5 py-4">
                <SectionHeader
                  title="Recent transactions"
                  description="Latest subscription payments across the platform."
                  href="/dashboard/admin/payments"
                />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Customer
                    </TableHead>
                    <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase sm:table-cell">
                      Plan
                    </TableHead>
                    <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase lg:table-cell">
                      Date
                    </TableHead>
                    <TableHead className="h-9 px-5 text-right text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Amount
                    </TableHead>
                    <TableHead className="h-9 px-5 text-right text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="border-white/[0.06] hover:bg-white/[0.03]"
                    >
                      <TableCell className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-[#ededef]">
                          {transaction.company}
                        </p>
                        <p className="mt-0.5 text-xs text-[#a0a0ab]">
                          {transaction.user}
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-5 py-3.5 sm:table-cell">
                        <p className="text-[13px] text-[#c4c7c8]">
                          {transaction.plan}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#82838d]">
                          {transaction.txnId}
                        </p>
                      </TableCell>
                      <TableCell className="hidden px-5 py-3.5 text-xs text-[#a0a0ab] lg:table-cell">
                        {transaction.date}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right text-[13px] font-medium text-[#ededef] tabular-nums">
                        {transaction.amount}
                      </TableCell>
                      <TableCell className="px-5 py-3.5 text-right">
                        <StatusDot
                          tone={
                            transaction.status === "Success"
                              ? "success"
                              : transaction.status === "Pending"
                                ? "warning"
                                : "danger"
                          }
                        >
                          {transaction.status}
                        </StatusDot>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <SectionHeader
                title="Quick actions"
                description="Jump straight into the most common admin workflows."
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:border-[#5c53fe]/40 hover:bg-[#5c53fe]/[0.06]"
                  >
                    <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#222228]">
                      <link.icon
                        aria-hidden
                        className="size-4 text-[#8f88ff]"
                      />
                    </span>
                    <span className="flex-1 text-[13px] font-medium text-[#ededef]">
                      {link.label}
                    </span>
                    <ArrowUpRightIcon
                      aria-hidden
                      className="size-3.5 text-[#82838d] transition-colors group-hover:text-[#8f88ff]"
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <SectionHeader
                title="Pending company approvals"
                description={`${pendingCompanies.length} companies are waiting for review.`}
                href="/admin"
                linkLabel="Review"
              />
              <ul className="mt-4 flex flex-col gap-3">
                {pendingCompanies.map((company) => (
                  <li
                    key={company.id}
                    className="flex items-center gap-3 rounded-lg bg-white/[0.03] p-3 ring-1 ring-white/[0.06]"
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#222228] text-xs font-semibold text-[#ededef]">
                      {company.name.slice(0, 1)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[#ededef]">
                        {company.name}
                      </p>
                      <p className="truncate text-[11px] text-[#a0a0ab]">
                        {company.industry} · {company.submitted}
                      </p>
                    </div>
                    <StatusBadge tone="warning">Pending</StatusBadge>
                  </li>
                ))}
              </ul>
              {pendingCompanies.length === 0 ? (
                <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-6 text-center text-xs text-[#a0a0ab]">
                  Nothing waiting for review.
                </p>
              ) : null}
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <h2 className="text-[15px] font-semibold text-[#ededef]">
                Platform health
              </h2>
              <p className="mt-0.5 text-xs text-[#a0a0ab]">
                Live service status for the last 24 hours.
              </p>
              <ul className="mt-4 flex flex-col gap-3 text-xs">
                {[
                  { label: "API uptime", value: "99.98%", tone: "success" as const },
                  { label: "Job indexing", value: "Healthy", tone: "success" as const },
                  { label: "Payment gateway", value: "Degraded", tone: "warning" as const },
                ].map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-[#a0a0ab]">{item.label}</span>
                    <StatusDot tone={item.tone}>{item.value}</StatusDot>
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
