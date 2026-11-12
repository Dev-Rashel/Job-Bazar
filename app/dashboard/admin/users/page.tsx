import type { Metadata } from "next"
import type { ReactNode } from "react"
import Link from "next/link"
import {
  CheckIcon,
  SearchIcon,
  ShieldCheckIcon,
  UserRoundXIcon,
  UsersIcon,
  XIcon,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { StatGrid } from "@/components/dashboard/stat-card"
import { StatusBadge, type StatusTone } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { db } from "@/lib/auth"
import type { StatCard } from "@/lib/dashboard-data"
import { requireDashboardRole } from "@/lib/dashboard-guard"
import {
  isUserRole,
  isUserStatus,
  USER_ROLE_LABELS,
  USER_ROLES,
  USER_STATUSES,
  type UserRole,
  type UserStatus,
} from "@/lib/roles"
import { cn } from "@/lib/utils"
import { approveUser, rejectUser } from "./actions"

export const metadata: Metadata = {
  title: "Users · Admin · HireLoop",
  description: "Manage every HireLoop account: seekers, recruiters, and admins.",
}

export const dynamic = "force-dynamic"

const ROLE_FILTERS: Array<{ label: string; value?: UserRole }> = [
  { label: "All roles" },
  { label: "Job seekers", value: USER_ROLES.jobSeeker },
  { label: "Recruiters", value: USER_ROLES.recruiter },
  { label: "Admins", value: USER_ROLES.admin },
]

const STATUS_FILTERS: Array<{ label: string; value?: UserStatus }> = [
  { label: "Any status" },
  { label: "Approved", value: USER_STATUSES.approved },
  { label: "Pending", value: USER_STATUSES.pending },
  { label: "Rejected", value: USER_STATUSES.rejected },
]

const ROLE_TONES: Record<UserRole, StatusTone> = {
  [USER_ROLES.admin]: "brand",
  [USER_ROLES.recruiter]: "info",
  [USER_ROLES.jobSeeker]: "neutral",
}

const STATUS_TONES: Record<UserStatus, StatusTone> = {
  [USER_STATUSES.approved]: "success",
  [USER_STATUSES.pending]: "warning",
  [USER_STATUSES.rejected]: "danger",
}

const AVATAR_TONES: Record<UserRole, string> = {
  [USER_ROLES.admin]: "bg-[#5c53fe]/20 text-[#a5a1ff] ring-[#5c53fe]/30",
  [USER_ROLES.recruiter]: "bg-[#60a5fa]/15 text-[#93c5fd] ring-[#60a5fa]/25",
  [USER_ROLES.jobSeeker]: "bg-white/[0.06] text-[#c4c7c8] ring-white/10",
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

function initials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "?"
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; role?: string; status?: string }>
}) {
  const admin = await requireDashboardRole("admin")
  const params = await searchParams

  const q = typeof params.q === "string" ? params.q.trim() : ""
  const role = isUserRole(params.role) ? params.role : undefined
  const status = isUserStatus(params.status) ? params.status : undefined

  const match: Record<string, unknown> = {}
  if (role) match.role = role
  if (status) match.status = status
  if (q) {
    const needle = new RegExp(escapeRegex(q), "i")
    match.$or = [{ name: needle }, { email: needle }]
  }

  const [users, buckets] = await Promise.all([
    db
      .collection("user")
      .find(match)
      .sort({ createdAt: -1 })
      .toArray(),
    db
      .collection("user")
      .aggregate<{ _id: { role?: string; status?: string }; n: number }>([
        { $group: { _id: { role: "$role", status: "$status" }, n: { $sum: 1 } } },
      ])
      .toArray(),
  ])

  const total = buckets.reduce((sum, bucket) => sum + bucket.n, 0)
  const roleCounts = buckets.reduce<Record<string, number>>((acc, bucket) => {
    const key = bucket._id.role ?? USER_ROLES.jobSeeker
    acc[key] = (acc[key] ?? 0) + bucket.n
    return acc
  }, {})
  const statusCounts = buckets.reduce<Record<string, number>>((acc, bucket) => {
    const key = bucket._id.status ?? USER_STATUSES.approved
    acc[key] = (acc[key] ?? 0) + bucket.n
    return acc
  }, {})

  const stats: StatCard[] = [
    { label: "Total accounts", value: String(total), icon: "users" },
    {
      label: "Job seekers",
      value: String(roleCounts[USER_ROLES.jobSeeker] ?? 0),
      icon: "user",
    },
    {
      label: "Recruiters",
      value: String(roleCounts[USER_ROLES.recruiter] ?? 0),
      icon: "briefcase",
    },
    {
      label: "Awaiting approval",
      value: String(statusCounts[USER_STATUSES.pending] ?? 0),
      icon: "lock",
      valueTone: (statusCounts[USER_STATUSES.pending] ?? 0) > 0 ? "warning" : "default",
    },
  ]

  function href(next: { role?: string; status?: string; q?: string }) {
    const merged = { q, role, status, ...next }
    const search = new URLSearchParams()
    if (merged.q) search.set("q", merged.q)
    if (merged.role) search.set("role", String(merged.role))
    if (merged.status) search.set("status", String(merged.status))
    const query = search.toString()
    return `/dashboard/admin/users${query ? `?${query}` : ""}`
  }

  const hasFilters = Boolean(q || role || status)

  return (
    <DashboardShell user={admin}>
      <div className="flex flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium tracking-[0.18em] text-[#8f88ff] uppercase">
              Admin
            </p>
            <h1 className="mt-1.5 text-2xl font-semibold tracking-[-0.02em] text-[#ededef] sm:text-[28px]">
              Users
            </h1>
            <p className="mt-1 text-sm text-[#a0a0ab]">
              Review every account on HireLoop and approve the ones waiting for
              access.
            </p>
          </div>
          <Button
            nativeButton={false}
            className="h-9 rounded-lg bg-[#5c53fe] px-4 text-[13px] font-medium text-white hover:bg-[#6a62ff]"
            render={<Link href="/admin" />}
          >
            <ShieldCheckIcon aria-hidden className="size-4" />
            Approval queue
          </Button>
        </div>

        <StatGrid
          stats={stats}
          variant="admin"
          className="grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        />

        <div className="overflow-hidden rounded-xl bg-[#141418] ring-1 ring-white/[0.06]">
          <div className="flex flex-col gap-4 border-b border-white/[0.06] px-5 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-[15px] leading-6 font-semibold text-[#ededef]">
                  Accounts
                </h2>
                <p className="mt-0.5 text-xs text-[#a0a0ab]">
                  {users.length} of {total} accounts
                  {hasFilters ? " match your filters" : ""}.
                </p>
              </div>

              <form
                action="/dashboard/admin/users"
                className="flex w-full items-center gap-2 sm:w-auto"
              >
                {role ? <input type="hidden" name="role" value={role} /> : null}
                {status ? (
                  <input type="hidden" name="status" value={status} />
                ) : null}
                <div className="relative min-w-0 flex-1 sm:w-64">
                  <SearchIcon
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#82838d]"
                  />
                  <input
                    type="search"
                    name="q"
                    defaultValue={q}
                    placeholder="Search name or email…"
                    aria-label="Search accounts"
                    className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] pr-3 pl-9 text-[13px] text-[#ededef] outline-none transition-colors placeholder:text-[#82838d] focus:border-[#5c53fe]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#5c53fe]/20"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 text-xs font-medium text-[#c4c7c8] transition-colors hover:border-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
                >
                  Search
                </button>
                {hasFilters ? (
                  <Link
                    href="/dashboard/admin/users"
                    className="inline-flex h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-medium text-[#8f88ff] transition-colors hover:text-[#a5a1ff]"
                  >
                    <XIcon aria-hidden className="size-3.5" />
                    Reset
                  </Link>
                ) : null}
              </form>
            </div>

            <div className="flex flex-col gap-3">
              <FilterRow label="Role">
                {ROLE_FILTERS.map((filter) => (
                  <FilterPill
                    key={filter.label}
                    href={href({ role: filter.value, status })}
                    active={role === filter.value}
                    count={
                      filter.value ? (roleCounts[filter.value] ?? 0) : total
                    }
                  >
                    {filter.label}
                  </FilterPill>
                ))}
              </FilterRow>

              <FilterRow label="Status">
                {STATUS_FILTERS.map((filter) => (
                  <FilterPill
                    key={filter.label}
                    href={href({ status: filter.value, role })}
                    active={status === filter.value}
                    count={
                      filter.value ? (statusCounts[filter.value] ?? 0) : total
                    }
                  >
                    {filter.label}
                  </FilterPill>
                ))}
              </FilterRow>
            </div>
          </div>

          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-[#82838d]">
                <UsersIcon aria-hidden className="size-6" />
              </span>
              <p className="text-sm text-[#a0a0ab]">
                No accounts match these filters.
              </p>
              {hasFilters ? (
                <Link
                  href="/dashboard/admin/users"
                  className="text-xs font-medium text-[#8f88ff] hover:text-[#a5a1ff]"
                >
                  Clear filters
                </Link>
              ) : null}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/[0.06] hover:bg-transparent">
                  <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                    User
                  </TableHead>
                  <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase md:table-cell">
                    Role
                  </TableHead>
                  <TableHead className="h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                    Status
                  </TableHead>
                  <TableHead className="hidden h-9 px-5 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase lg:table-cell">
                    Joined
                  </TableHead>
                  <TableHead className="h-9 px-5 text-right text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((account) => {
                  const id = String(account._id ?? account.id ?? "")
                  const name = String(account.name ?? "Unnamed")
                  const email = String(account.email ?? "")
                  const accountRole = isUserRole(account.role)
                    ? account.role
                    : USER_ROLES.jobSeeker
                  const accountStatus = isUserStatus(account.status)
                    ? account.status
                    : USER_STATUSES.approved
                  const isSelf = email.toLowerCase() === admin.email.toLowerCase()
                  const joined = account.createdAt
                    ? dateFormatter.format(new Date(account.createdAt))
                    : "—"

                  return (
                    <TableRow
                      key={id}
                      className="border-white/[0.06] hover:bg-white/[0.03]"
                    >
                      <TableCell className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-1",
                              AVATAR_TONES[accountRole]
                            )}
                          >
                            {initials(name, email)}
                          </span>
                          <div className="min-w-0">
                            <p className="flex items-center gap-2 text-[13px] font-medium text-[#ededef]">
                              <span className="truncate">{name}</span>
                              {isSelf ? (
                                <span className="rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium tracking-[0.06em] text-[#a0a0ab] uppercase">
                                  You
                                </span>
                              ) : null}
                            </p>
                            <p className="truncate text-xs text-[#a0a0ab]">
                              {email}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="hidden px-5 py-3.5 md:table-cell">
                        <StatusBadge tone={ROLE_TONES[accountRole]}>
                          {USER_ROLE_LABELS[accountRole]}
                        </StatusBadge>
                      </TableCell>

                      <TableCell className="px-5 py-3.5">
                        <StatusBadge tone={STATUS_TONES[accountStatus]}>
                          {accountStatus.charAt(0).toUpperCase() +
                            accountStatus.slice(1)}
                        </StatusBadge>
                      </TableCell>

                      <TableCell className="hidden px-5 py-3.5 text-xs text-[#a0a0ab] lg:table-cell">
                        {joined}
                      </TableCell>

                      <TableCell className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {isSelf ? (
                            <span className="text-[11px] text-[#82838d]">
                              Signed in
                            </span>
                          ) : accountStatus === USER_STATUSES.approved ? (
                            <form action={rejectUser}>
                              <input type="hidden" name="userId" value={id} />
                              <ActionButton tone="danger" icon="ban">
                                Revoke
                              </ActionButton>
                            </form>
                          ) : (
                            <>
                              <form action={approveUser}>
                                <input type="hidden" name="userId" value={id} />
                                <ActionButton tone="primary" icon="check">
                                  Approve
                                </ActionButton>
                              </form>
                              {accountStatus === USER_STATUSES.pending ? (
                                <form action={rejectUser}>
                                  <input type="hidden" name="userId" value={id} />
                                  <ActionButton tone="ghost" icon="x">
                                    Reject
                                  </ActionButton>
                                </form>
                              ) : null}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

function FilterRow({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 shrink-0 text-[11px] font-medium tracking-[0.08em] text-[#82838d] uppercase">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
    </div>
  )
}

function FilterPill({
  href,
  active,
  count,
  children,
}: {
  href: string
  active: boolean
  count: number
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
        active
          ? "bg-[#5c53fe]/15 text-[#a5a1ff] ring-1 ring-[#5c53fe]/40"
          : "text-[#a0a0ab] hover:bg-white/[0.04] hover:text-[#ededef]"
      )}
    >
      {children}
      <span
        className={cn(
          "rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
          active ? "bg-[#5c53fe]/20 text-[#c7c3ff]" : "bg-white/[0.06] text-[#82838d]"
        )}
      >
        {count}
      </span>
    </Link>
  )
}

function ActionButton({
  tone,
  icon,
  children,
}: {
  tone: "primary" | "danger" | "ghost"
  icon: "check" | "x" | "ban"
  children: ReactNode
}) {
  const Icon = icon === "check" ? CheckIcon : icon === "x" ? XIcon : UserRoundXIcon

  return (
    <button
      type="submit"
      className={cn(
        "inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none",
        tone === "primary" &&
          "bg-[#5c53fe] text-white hover:bg-[#6a62ff] focus-visible:ring-[#5c53fe]/50",
        tone === "danger" &&
          "border border-white/[0.08] bg-white/[0.02] text-[#c4c7c8] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 focus-visible:ring-red-500/30",
        tone === "ghost" &&
          "border border-white/[0.08] bg-white/[0.02] text-[#c4c7c8] hover:border-white/20 hover:text-white focus-visible:ring-white/20"
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {children}
    </button>
  )
}
