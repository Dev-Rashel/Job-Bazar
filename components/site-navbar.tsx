"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOutIcon, MenuIcon } from "lucide-react"

import logo from "@/app/images/logo.png"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { signOut, useSession } from "@/lib/auth-client"
import {
  isUserRole,
  USER_ROLE_DASHBOARDS,
  USER_ROLE_LABELS,
  type UserRole,
} from "@/lib/roles"
import { cn } from "@/lib/utils"

const navLinks = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Company", href: "/companies" },
  { label: "Pricing", href: "/pricing" },
]

const signInButtonClass =
  "h-14 rounded-xl border border-[#090a15] bg-white px-6 text-lg font-semibold text-[#5c53fe] shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] hover:bg-white/90"

const getStartedButtonClass =
  "h-14 rounded-xl border border-[#090a15] bg-[#5c53fe] px-6 text-lg font-medium text-white shadow-[inset_0_3px_10px_rgba(255,255,255,0.2)] hover:bg-[#6a62ff]"

export function SiteNavbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const { data: session, isPending } = useSession()

  const user = session?.user
  const isAdmin = user?.role === "admin" && user?.status === "approved"
  const roleLabel = user?.role
    ? (USER_ROLE_LABELS[user.role as UserRole] ?? user.role)
    : null
  const dashboardHref =
    user?.role && isUserRole(user.role) ? USER_ROLE_DASHBOARDS[user.role] : null

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  async function handleSignOut() {
    setOpen(false)
    await signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="mx-auto flex h-[74px] w-full max-w-[1320px] items-center justify-between rounded-2xl bg-[#222222] px-4 ring-1 ring-white/10 sm:px-6">
        <Link href="/" aria-label="HireLoop home" className="shrink-0">
          <Image
            src={logo}
            alt="HireLoop"
            width={154}
            height={44}
            priority
            className="h-9 w-auto sm:h-11"
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "text-base tracking-[-0.2px] text-white/90 transition-colors hover:text-white",
                    isActive(link.href) && "text-white"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {dashboardHref ? (
              <li>
                <Link
                  href={dashboardHref}
                  aria-current={isActive(dashboardHref) ? "page" : undefined}
                  className={cn(
                    "text-base tracking-[-0.2px] text-white/90 transition-colors hover:text-white",
                    isActive(dashboardHref) && "text-white"
                  )}
                >
                  Dashboard
                </Link>
              </li>
            ) : null}
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  aria-current={isActive("/admin") ? "page" : undefined}
                  className={cn(
                    "text-base tracking-[-0.2px] text-[#a5a1ff] transition-colors hover:text-white",
                    isActive("/admin") && "text-white"
                  )}
                >
                  Admin
                </Link>
              </li>
            ) : null}
          </ul>

          <span aria-hidden className="h-6 w-px bg-white/30" />

          {isPending ? (
            <div
              aria-hidden
              className="h-14 w-[240px] animate-pulse rounded-xl bg-white/5"
            />
          ) : user ? (
            <div className="flex items-center gap-4">
              <div className="max-w-[170px] text-right">
                <div className="truncate text-sm font-semibold text-white">
                  {user.name}
                </div>
                <div className="truncate text-xs text-white/50">
                  {roleLabel}
                </div>
              </div>
              <Button
                variant="ghost"
                className={cn(getStartedButtonClass, "gap-2")}
                onClick={handleSignOut}
              >
                <LogOutIcon aria-hidden className="size-5" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button
                nativeButton={false}
                variant="ghost"
                className={signInButtonClass}
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>
              <Button
                nativeButton={false}
                variant="ghost"
                className={getStartedButtonClass}
                render={<Link href="/sign-up" />}
              >
                Get Started
              </Button>
            </div>
          )}
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="size-10 text-white hover:bg-white/10 hover:text-white lg:hidden"
              />
            }
          >
            <MenuIcon className="size-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[300px] border-white/10 bg-[#18181b] text-white"
          >
            <SheetHeader className="p-6 pb-2">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                HireLoop site navigation
              </SheetDescription>
              <Link
                href="/"
                aria-label="HireLoop home"
                onClick={() => setOpen(false)}
              >
                <Image
                  src={logo}
                  alt="HireLoop"
                  width={154}
                  height={44}
                  className="h-10 w-auto"
                />
              </Link>
            </SheetHeader>

            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                    isActive(link.href) && "bg-white/10 text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {dashboardHref ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(dashboardHref) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-white",
                    isActive(dashboardHref) && "bg-white/10 text-white"
                  )}
                >
                  Dashboard
                </Link>
              ) : null}
              {isAdmin ? (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  aria-current={isActive("/admin") ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-3 text-base text-[#a5a1ff] transition-colors hover:bg-white/10 hover:text-white",
                    isActive("/admin") && "bg-white/10 text-white"
                  )}
                >
                  Admin
                </Link>
              ) : null}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t border-white/10 p-6">
              {user ? (
                <>
                  <div>
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-white/50">
                      {roleLabel}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className={cn(getStartedButtonClass, "w-full gap-2")}
                    onClick={handleSignOut}
                  >
                    <LogOutIcon aria-hidden className="size-5" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className={cn(signInButtonClass, "w-full")}
                    render={
                      <Link href="/sign-in" onClick={() => setOpen(false)} />
                    }
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="ghost"
                    className={cn(getStartedButtonClass, "w-full")}
                    render={
                      <Link href="/sign-up" onClick={() => setOpen(false)} />
                    }
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
