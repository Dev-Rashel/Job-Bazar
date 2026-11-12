import { headers } from "next/headers"
import { redirect } from "next/navigation"

import type { DashboardUser } from "@/components/dashboard/sidebar"
import { auth } from "@/lib/auth"
import {
  isUserRole,
  USER_ROLE_DASHBOARDS,
  USER_ROLES,
  USER_STATUSES,
  type UserRole,
} from "@/lib/roles"

export const DASHBOARD_HOME = USER_ROLE_DASHBOARDS

/**
 * Server-side guard for dashboard routes. Redirects anonymous users to sign-in,
 * unapproved accounts back to sign-in, and sends users to the dashboard that
 * matches their stored role.
 */
export async function requireDashboardRole(
  role: UserRole
): Promise<DashboardUser> {
  const home = DASHBOARD_HOME[role]
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (!user) {
    redirect(`/sign-in?next=${encodeURIComponent(home)}`)
  }

  if (user.status !== USER_STATUSES.approved) {
    redirect("/sign-in")
  }

  const actualRole = isUserRole(user.role) ? user.role : USER_ROLES.jobSeeker

  if (actualRole !== role) {
    redirect(DASHBOARD_HOME[actualRole])
  }

  return { name: user.name, email: user.email, role }
}
