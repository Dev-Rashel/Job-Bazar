import type { ReactNode } from "react"

import { Sidebar, type DashboardUser } from "./sidebar"
import { Topbar } from "./topbar"

/**
 * Shared dashboard chrome: dark app canvas, fixed role sidebar, rounded main
 * panel with the top navigation bar — matches the HL 2.0 Figma shell.
 */
export function DashboardShell({
  user,
  children,
}: {
  user: DashboardUser
  children: ReactNode
}) {
  return (
    <div className="dark min-h-svh bg-[#08080a]">
      <div className="flex min-h-svh items-stretch gap-2 p-2">
        <Sidebar user={user} className="hidden lg:flex" />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-[#0e0e11] ring-1 ring-white/[0.08]">
          <Topbar user={user} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
