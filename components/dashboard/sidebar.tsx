"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  BookmarkIcon,
  BriefcaseIcon,
  Building2Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  UploadIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"

import logo from "@/app/images/logo.png"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { USER_ROLE_LABELS, type UserRole } from "@/lib/roles"
import { cn, getInitials } from "@/lib/utils"

export type DashboardUser = {
  name: string
  email: string
  role: UserRole
}

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  "job-seeker": [
    { label: "Dashboard", href: "/dashboard/seeker", icon: LayoutDashboardIcon },
    { label: "Jobs", href: "/dashboard/seeker/jobs", icon: BriefcaseIcon },
    { label: "Saved Jobs", href: "/dashboard/seeker/saved", icon: BookmarkIcon },
    { label: "Applications", href: "/dashboard/seeker/applications", icon: FileTextIcon },
    { label: "Billing", href: "/dashboard/seeker/billing", icon: WalletIcon },
    { label: "Settings", href: "/dashboard/seeker/settings", icon: SettingsIcon },
  ],
  recruiter: [
    { label: "Dashboard", href: "/dashboard/recruiter", icon: LayoutDashboardIcon },
    { label: "My Company", href: "/dashboard/recruiter/company", icon: Building2Icon },
    { label: "Manage Jobs", href: "/dashboard/recruiter/jobs", icon: BriefcaseIcon },
    { label: "Applications", href: "/dashboard/recruiter/applications", icon: UsersIcon },
    { label: "Settings", href: "/dashboard/recruiter/settings", icon: SettingsIcon },
  ],
  admin: [
    { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboardIcon },
    { label: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
    { label: "Companies", href: "/dashboard/admin/companies", icon: Building2Icon },
    { label: "Jobs", href: "/dashboard/admin/jobs", icon: BriefcaseIcon },
    { label: "Payments", href: "/dashboard/admin/payments", icon: WalletIcon },
    { label: "Settings", href: "/dashboard/admin/settings", icon: SettingsIcon },
  ],
}

const BRAND_SUBTITLES: Record<UserRole, string> = {
  "job-seeker": "Seeker Portal",
  recruiter: "Recruiter Console",
  admin: "Admin Console",
}

const FOOTER_CTA: Partial<Record<UserRole, { label: string; href: string; icon: LucideIcon }>> = {
  "job-seeker": {
    label: "Post Resume",
    href: "/dashboard/seeker/settings",
    icon: UploadIcon,
  },
  recruiter: {
    label: "Create Job Post",
    href: "/dashboard/recruiter/jobs/new",
    icon: PlusIcon,
  },
}

function isActive(pathname: string, href: string, role: UserRole) {
  const home = `/dashboard/${role === "job-seeker" ? "seeker" : role}`
  if (href === home) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function SidebarContent({ user }: { user: DashboardUser }) {
  const pathname = usePathname()
  const router = useRouter()
  const items = NAV_ITEMS[user.role] ?? []
  const cta = FOOTER_CTA[user.role]

  async function handleSignOut() {
    try {
      await signOut()
    } finally {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="flex h-full flex-col gap-5 p-3">
      {/* Brand */}
      <div className="flex items-center gap-2 px-2 pt-1">
        <Image src={logo} alt="HireLoop" height={32} width={112} className="h-8 w-auto" priority />
      </div>
      <p className="-mt-4 px-2 text-xs font-medium text-[#a1a4aa]">
        {BRAND_SUBTITLES[user.role]}
      </p>

      {/* Identity card */}
      <div className="rounded-xl bg-[#141418] p-3 ring-1 ring-white/[0.08]">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-[#222228] text-xs font-semibold text-[#ededef]">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[#f4f4f5]">{user.name}</p>
            <p className="truncate text-xs text-[#a1a4aa]">
              {USER_ROLE_LABELS[user.role]}
            </p>
          </div>
        </div>
        <span className="mt-2.5 inline-flex items-center rounded-full bg-[#5c53fe]/[0.14] px-2 py-0.5 text-[11px] font-semibold text-[#8f88ff] ring-1 ring-[#5c53fe]/60">
          Premium account
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = isActive(pathname, item.href, user.role)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "bg-[#232327] text-[#ededef]"
                  : "text-[#a0a0ab] hover:bg-white/[0.05] hover:text-[#ededef]",
              )}
            >
              <item.icon
                aria-hidden
                className={cn("size-4 shrink-0", active ? "text-[#8f88ff]" : "text-[#c4c7c8]")}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto flex flex-col gap-3">
        {cta ? (
          <Button
            nativeButton={false}
            className="h-9 w-full rounded-[10px] bg-[#fafafa] text-[13px] font-medium text-[#0b0b0c] hover:bg-white/90"
            render={<Link href={cta.href} />}
          >
            <cta.icon aria-hidden className="size-4" />
            {cta.label}
          </Button>
        ) : null}
        <button
          type="button"
          onClick={handleSignOut}
          className="flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13px] font-medium text-[#a0a0ab] transition-colors hover:bg-white/[0.05] hover:text-[#ededef]"
        >
          <LogOutIcon aria-hidden className="size-4 shrink-0 text-[#c4c7c8]" />
          Log out
        </button>
      </div>
    </div>
  )
}

export function Sidebar({
  user,
  className,
}: {
  user: DashboardUser
  className?: string
}) {
  return (
    <aside className={cn("w-62 shrink-0", className)}>
      <SidebarContent user={user} />
    </aside>
  )
}
