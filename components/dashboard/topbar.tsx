"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BellIcon,
  LogOutIcon,
  MailIcon,
  MenuIcon,
  SearchIcon,
  SettingsIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut } from "@/lib/auth-client"
import type { UserRole } from "@/lib/roles"
import { cn, getInitials } from "@/lib/utils"

import { SidebarContent, type DashboardUser } from "./sidebar"

const SEARCH_PLACEHOLDERS: Record<UserRole, string> = {
  "job-seeker": "Search for opportunities...",
  recruiter: "Search candidates, jobs...",
  admin: "Global search...",
}

const SETTINGS_HREFS: Record<UserRole, string> = {
  "job-seeker": "/dashboard/seeker/settings",
  recruiter: "/dashboard/recruiter/settings",
  admin: "/dashboard/admin/settings",
}

const iconButtonClass =
  "relative flex size-9 items-center justify-center rounded-lg text-[#c4c7c8] transition-colors hover:bg-white/[0.06] hover:text-[#ededef] focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"

export function Topbar({ user }: { user: DashboardUser }) {
  const router = useRouter()

  async function handleSignOut() {
    try {
      await signOut()
    } finally {
      router.push("/")
      router.refresh()
    }
  }

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/[0.06] px-4 sm:px-6">
      {/* Mobile nav */}
      <Sheet>
        <SheetTrigger
          render={
            <button
              type="button"
              aria-label="Open navigation"
              className={cn(iconButtonClass, "lg:hidden")}
            />
          }
        >
          <MenuIcon aria-hidden className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-62 gap-0 border-white/[0.06] bg-[#08080a] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent user={user} />
        </SheetContent>
      </Sheet>

      {/* Search */}
      <div className="relative hidden w-80 sm:block">
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#c4c7c8]"
        />
        <Input
          placeholder={SEARCH_PLACEHOLDERS[user.role]}
          className="h-9 rounded-lg border-white/[0.08] bg-[#0c0c0f] pr-3 pl-9 text-[13px] text-[#ededef] placeholder:text-[#828997] focus-visible:border-[#5c53fe]/60 focus-visible:ring-[#5c53fe]/20"
        />
      </div>

      {/* Actions */}
      <div className="ml-auto flex items-center gap-1">
        <button type="button" aria-label="Notifications" className={iconButtonClass}>
          <BellIcon aria-hidden className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#ef4444] ring-2 ring-[#0e0e11]" />
        </button>
        <button type="button" aria-label="Messages" className={iconButtonClass}>
          <MailIcon aria-hidden className="size-[18px]" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#22c55e] ring-2 ring-[#0e0e11]" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="ml-1 flex rounded-full focus-visible:ring-2 focus-visible:ring-[#5c53fe]/40 focus-visible:outline-none"
          >
            <Avatar className="size-8">
              <AvatarFallback className="bg-[#222228] text-xs font-semibold text-[#ededef]">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-[#141418]">
            <DropdownMenuLabel className="text-[#a0a0ab]">
              <span className="block truncate text-[13px] font-medium text-[#ededef]">
                {user.name}
              </span>
              <span className="block truncate text-xs font-normal">{user.email}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/[0.08]" />
            <DropdownMenuItem
              render={<Link href={SETTINGS_HREFS[user.role]} />}
              className="text-[13px] text-[#ededef] focus:text-[#ededef]"
            >
              <SettingsIcon aria-hidden className="size-4 text-[#c4c7c8]" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-[13px] text-[#ededef] focus:text-[#ededef]"
            >
              <LogOutIcon aria-hidden className="size-4 text-[#c4c7c8]" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
