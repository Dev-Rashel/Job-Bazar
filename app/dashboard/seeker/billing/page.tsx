import type { Metadata } from "next"
import Link from "next/link"
import {
  CheckIcon,
  CreditCardIcon,
  CrownIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { SectionHeader } from "@/components/dashboard/section-header"
import { StatGrid } from "@/components/dashboard/stat-card"
import { StatusDot } from "@/components/dashboard/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StatCard } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard-guard"
import { billingHistory, planFeatures } from "@/lib/dashboard-data"

export const metadata: Metadata = {
  title: "Billing · HireLoop",
  description: "Manage your plan, payment method, and invoices.",
}

export const dynamic = "force-dynamic"

const planStats: StatCard[] = [
  {
    label: "Current plan",
    value: "$29/mo",
    trend: "Professional tier",
    trendDirection: "flat",
    icon: "dollar",
    iconTone: "brand",
  },
  {
    label: "Next invoice",
    value: "$29.00",
    trend: "Oct 24, 2023",
    trendDirection: "flat",
    icon: "calendar",
  },
  {
    label: "Lifetime spend",
    value: "$87.00",
    trend: "3 payments",
    trendDirection: "flat",
    icon: "pulse",
    valueTone: "success",
  },
]

export default async function SeekerBillingPage() {
  const user = await requireDashboardRole("job-seeker")

  return (
    <DashboardShell user={user}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Job seeker
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Billing
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              Manage your subscription, payment method, and invoices.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
          >
            <CrownIcon aria-hidden className="size-4" />
            Upgrade plan
          </button>
        </div>

        <StatGrid
          stats={planStats}
          variant="admin"
          className="grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
          <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Professional tier
                  </h2>
                  <span className="rounded-md border border-[#5c53fe]/40 bg-[#5c53fe]/15 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-[#a5a1ff] uppercase">
                    Active
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-[#a0a0ab]">
                  Renews automatically on Oct 24, 2023. Cancel any time.
                </p>
              </div>
              <p className="text-right">
                <span className="text-2xl font-semibold text-[#ededef]">
                  $29
                </span>
                <span className="text-xs text-[#82838d]"> / month</span>
              </p>
            </div>

            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {planFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2.5 text-xs text-[#c4c7c8] ring-1 ring-white/[0.06]"
                >
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#22c55e]/15 text-[#22c55e]">
                    <CheckIcon aria-hidden className="size-3" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
              >
                Change plan
              </button>
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-lg border border-white/[0.08] bg-white/[0.02] px-4 text-[13px] text-[#c4c7c8] transition-colors hover:border-red-500/40 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:outline-none"
              >
                Cancel subscription
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#ededef]">
                    Payment method
                  </h2>
                  <p className="mt-0.5 text-xs text-[#a0a0ab]">
                    Used for your monthly subscription.
                  </p>
                </div>
                <span className="flex size-9 items-center justify-center rounded-[10px] bg-[#222228]">
                  <CreditCardIcon aria-hidden className="size-4 text-[#8f88ff]" />
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-gradient-to-br from-[#1c1c22] to-[#141418] p-4">
                <span className="flex h-7 w-10 items-center justify-center rounded-md bg-white/[0.06] text-[10px] font-bold tracking-[0.08em] text-[#ededef]">
                  VISA
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-[#ededef] tabular-nums">
                    •••• •••• •••• 4242
                  </p>
                  <p className="text-[11px] text-[#82838d]">Expires 08/26</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[13px] text-[#ededef] transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none"
              >
                Update payment method
              </button>
              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[#82838d]">
                <ShieldCheckIcon aria-hidden className="size-3.5" />
                Payments are encrypted and processed securely.
              </p>
            </div>

            <div className="rounded-xl bg-[#141418] p-5 ring-1 ring-white/[0.06]">
              <SectionHeader
                title="Billing contact"
                description="Invoices are emailed to this address."
              />
              <p className="mt-4 truncate rounded-lg bg-white/[0.03] px-3 py-2.5 text-[13px] text-[#c4c7c8] ring-1 ring-white/[0.06]">
                {user.email}
              </p>
              <Link
                href="/dashboard/seeker/settings"
                className="mt-3 inline-flex text-xs font-medium text-[#8f88ff] hover:text-[#a5a1ff]"
              >
                Update account email
              </Link>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
          <div className="flex items-center justify-between gap-3 px-5 py-4">
            <SectionHeader
              title="Billing history"
              description="Every invoice on your account."
            />
            <span className="hidden items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-1.5 text-[11px] text-[#a0a0ab] sm:inline-flex">
              <ReceiptTextIcon aria-hidden className="size-3.5" />
              PDF invoices
            </span>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-white/[0.06] hover:bg-transparent">
                <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                  Invoice
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
              {billingHistory.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="border-white/[0.06] hover:bg-white/[0.03]"
                >
                  <TableCell className="px-5 py-3.5">
                    <p className="text-[13px] font-medium text-[#ededef]">
                      {invoice.txnId}
                    </p>
                    <p className="mt-0.5 text-xs text-[#a0a0ab]">
                      {invoice.user}
                    </p>
                  </TableCell>
                  <TableCell className="hidden px-5 py-3.5 text-xs text-[#c4c7c8] sm:table-cell">
                    {invoice.plan}
                  </TableCell>
                  <TableCell className="hidden px-5 py-3.5 text-xs text-[#a0a0ab] lg:table-cell">
                    {invoice.date}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-right text-[13px] font-medium text-[#ededef] tabular-nums">
                    {invoice.amount}
                  </TableCell>
                  <TableCell className="px-5 py-3.5 text-right">
                    <StatusDot
                      tone={invoice.status === "Success" ? "success" : "warning"}
                    >
                      {invoice.status}
                    </StatusDot>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardShell>
  )
}
