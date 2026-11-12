import type { Metadata } from "next"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { CheckIcon, ShieldCheckIcon, XIcon } from "lucide-react"

import { SiteNavbar } from "@/components/site-navbar"
import { auth, db } from "@/lib/auth"
import { USER_ROLE_LABELS, USER_STATUSES, type UserRole } from "@/lib/roles"
import { approveUser, rejectUser } from "./actions"

export const metadata: Metadata = {
  title: "Admin approvals · HireLoop",
  description: "Review company, recruiter, and admin accounts.",
}

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const currentUser = session?.user

  if (
    !currentUser ||
    currentUser.role !== "admin" ||
    currentUser.status !== "approved"
  ) {
    redirect("/sign-in?next=/admin")
  }

  const pendingUsers = await db
    .collection("user")
    .find({ status: USER_STATUSES.pending })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="min-h-svh bg-[#030305] text-white">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-5xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-medium tracking-[0.2em] text-[#a5a1ff] uppercase">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Account approvals
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
              Company/recruiter and admin accounts stay locked until you approve
              them. Job seekers are approved automatically and can sign in as
              soon as they register.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-center">
            <div className="text-2xl font-semibold tracking-[-0.03em]">
              {pendingUsers.length}
            </div>
            <div className="text-[10px] tracking-[0.14em] text-gray-500 uppercase">
              Pending
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0e]">
          {pendingUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
              <span className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-500">
                <ShieldCheckIcon aria-hidden className="size-6" />
              </span>
              <p className="text-sm text-gray-400">
                No accounts are waiting for approval.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {pendingUsers.map((pending) => {
                const role = pending.role as UserRole | undefined
                const roleLabel = role
                  ? (USER_ROLE_LABELS[role] ?? String(pending.role))
                  : "Unknown"

                return (
                  <li
                    key={String(pending._id)}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium text-white">
                          {String(pending.name ?? "Unnamed")}
                        </p>
                        <span className="rounded-full border border-[#5c53fe]/30 bg-[#5c53fe]/10 px-2 py-0.5 text-[10px] tracking-[0.12em] text-[#a5a1ff] uppercase">
                          {roleLabel}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-400">
                        {String(pending.email ?? "")}
                      </p>
                      {pending.createdAt ? (
                        <p className="mt-1 text-[11px] text-gray-600">
                          Requested{" "}
                          {new Date(pending.createdAt).toLocaleString()}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <form action={approveUser}>
                        <input
                          type="hidden"
                          name="userId"
                          value={String(pending._id)}
                        />
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#5c53fe] px-4 text-sm font-medium text-white transition-colors hover:bg-[#6a62ff] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
                        >
                          <CheckIcon aria-hidden className="size-4" />
                          Approve
                        </button>
                      </form>
                      <form action={rejectUser}>
                        <input
                          type="hidden"
                          name="userId"
                          value={String(pending._id)}
                        />
                        <button
                          type="submit"
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-4 text-sm text-gray-300 transition-colors hover:border-red-500/40 hover:text-red-300 focus-visible:ring-2 focus-visible:ring-red-500/30 focus-visible:outline-none"
                        >
                          <XIcon aria-hidden className="size-4" />
                          Reject
                        </button>
                      </form>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}
