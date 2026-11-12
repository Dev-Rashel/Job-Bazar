"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Building2Icon,
  CheckCircle2Icon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  LockIcon,
  MailIcon,
  ShieldCheckIcon,
  UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { signIn, signOut, signUp } from "@/lib/auth-client"
import {
  isUserRole,
  USER_ROLE_DASHBOARDS,
  USER_ROLE_LABELS,
  USER_ROLES,
  type UserRole,
} from "@/lib/roles"
import { cn } from "@/lib/utils"

type AuthMode = "sign-in" | "sign-up"

const fieldClass =
  "h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white outline-none transition-colors placeholder:text-gray-600 focus:border-[#5c53fe]/70 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#5c53fe]/20"

const roleOptions = [
  {
    value: USER_ROLES.jobSeeker,
    label: "Job Seeker",
    icon: UserIcon,
  },
  {
    value: USER_ROLES.recruiter,
    label: "Recruiter",
    icon: Building2Icon,
  },
  {
    value: USER_ROLES.admin,
    label: "Admin",
    icon: ShieldCheckIcon,
  },
] as const

export function AuthForm({
  mode,
  redirectTo = "/",
}: {
  mode: AuthMode
  redirectTo?: string
}) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"

  const [role, setRole] = React.useState<UserRole>(USER_ROLES.jobSeeker)
  const [showPassword, setShowPassword] = React.useState(false)
  const [pending, setPending] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [success, setSuccess] = React.useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (isSignUp && !name) {
      setError("Please enter your full name.")
      return
    }
    if (!email || !password) {
      setError("Please enter your email and password.")
      return
    }
    if (isSignUp && password.length < 8) {
      setError("Your password must be at least 8 characters long.")
      return
    }

    setPending(true)

    try {
      if (isSignUp) {
        const result = await signUp.email({ name, email, password, role })

        if (result.error) {
          setError(
            result.error.message ??
              "We couldn't create your account. Please try again."
          )
          return
        }

        setSuccess(
          role === USER_ROLES.jobSeeker
            ? "Your account is ready. Sign in to start exploring jobs."
            : "Your account was created and is waiting for admin approval. You'll be able to sign in once it's approved."
        )
        return
      }

      const result = await signIn.email({ email, password })

      if (result.error) {
        setError(
          result.error.message ??
            "We couldn't sign you in. Please check your details and try again."
        )
        return
      }

      // The account's stored role is the source of truth. If the selected
      // role doesn't match it, drop the fresh session and ask again.
      const actualRole = result.data?.user?.role
      if (isUserRole(actualRole) && actualRole !== role) {
        try {
          await signOut()
        } catch {
          // The next sign-in attempt replaces any session left behind.
        }
        setError(
          `This account is registered as ${USER_ROLE_LABELS[actualRole]}. Please select that role and try again.`
        )
        return
      }

      router.push(
        redirectTo === "/" ? USER_ROLE_DASHBOARDS[role] : redirectTo
      )
      router.refresh()
    } catch {
      setError("Unable to reach the server. Please try again in a moment.")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="w-full max-w-[430px]">
      <div className="rounded-3xl border border-white/10 bg-[#0b0b0e]/90 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-8">
        {success ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="flex size-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2Icon aria-hidden className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">
              Account created
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">{success}</p>
            <Button
              variant="ghost"
              nativeButton={false}
              className="mt-6 h-11 w-full gap-2 rounded-xl bg-[#5c53fe] text-sm font-semibold text-white transition-colors hover:bg-[#6a62ff]"
              render={<Link href="/sign-in" />}
            >
              Go to sign in
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <p className="text-[11px] font-medium tracking-[0.2em] text-[#a5a1ff] uppercase">
                {isSignUp ? "Get started" : "Welcome back"}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-[28px]">
                {isSignUp ? "Create your account" : "Sign in to HireLoop"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                {isSignUp
                  ? "Choose how you'll use HireLoop. Recruiter and admin accounts are reviewed before they can sign in."
                  : "Select the role linked to your account and sign in to pick up where you left off."}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
              noValidate
            >
              <div>
                <span className="text-xs font-medium text-gray-300">
                  {isSignUp ? "I am a" : "Sign in as"}
                </span>
                <div
                  role="radiogroup"
                  aria-label="Account type"
                  className="mt-2 grid grid-cols-3 gap-2"
                >
                  {roleOptions.map((option) => {
                    const selected = role === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setRole(option.value)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none",
                          selected
                            ? "border-[#5c53fe] bg-[#5c53fe]/15 text-white"
                            : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-white/20 hover:text-white"
                        )}
                      >
                        <option.icon aria-hidden className="size-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>
                {isSignUp ? (
                  role !== USER_ROLES.jobSeeker ? (
                    <p className="mt-2 text-[11px] leading-3 text-amber-300/80">
                      This account needs admin approval before you can sign in.
                    </p>
                  ) : null
                ) : (
                  <p className="mt-2 text-[11px] leading-4 text-gray-500">
                    Choose the role linked to your account.
                  </p>
                )}
              </div>

              {isSignUp ? (
                <Field
                  id="name"
                  name="name"
                  type="text"
                  label="Full name"
                  placeholder="Jane Cooper"
                  autoComplete="name"
                  icon={<UserIcon className="size-4" />}
                />
              ) : null}

              <Field
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@example.com"
                autoComplete="email"
                icon={<MailIcon className="size-4" />}
              />

              <div>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-xs font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-gray-600">
                    {isSignUp ? "8+ characters" : "Required"}
                  </span>
                </div>
                <div className="relative mt-2">
                  <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-500">
                    <LockIcon aria-hidden className="size-4" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete={
                      isSignUp ? "new-password" : "current-password"
                    }
                    minLength={8}
                    required
                    className={cn(fieldClass, "pr-11 pl-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/[0.06] hover:text-gray-200 focus-visible:ring-2 focus-visible:ring-[#5c53fe]/50 focus-visible:outline-none"
                  >
                    {showPassword ? (
                      <EyeOffIcon aria-hidden className="size-4" />
                    ) : (
                      <EyeIcon aria-hidden className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              {error ? (
                <p
                  role="alert"
                  className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs leading-5 text-red-300"
                >
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={pending}
                className="mt-1 h-11 w-full rounded-xl bg-[#5c53fe] text-sm font-semibold text-white transition-colors hover:bg-[#6a62ff] disabled:opacity-70"
              >
                {pending ? (
                  <>
                    <Loader2Icon aria-hidden className="size-4 animate-spin" />
                    Please wait…
                  </>
                ) : isSignUp ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              {isSignUp ? "Already have an account?" : "New to HireLoop?"}{" "}
              <Link
                href={isSignUp ? "/sign-in" : "/sign-up"}
                className="font-medium text-white underline-offset-4 transition-colors hover:text-[#a5a1ff] hover:underline"
              >
                {isSignUp ? "Sign in" : "Create an account"}
              </Link>
            </p>
          </>
        )}
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-gray-600">
        By continuing you agree to HireLoop&apos;s terms of service and privacy
        policy.
      </p>
    </div>
  )
}

function Field({
  id,
  name,
  type,
  label,
  placeholder,
  autoComplete,
  icon,
}: {
  id: string
  name: string
  type: React.HTMLInputTypeAttribute
  label: string
  placeholder: string
  autoComplete: string
  icon: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-gray-300">
        {label}
      </label>
      <div className="relative mt-2">
        <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-500">
          {icon}
        </span>
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className={cn(fieldClass, "px-10")}
        />
      </div>
    </div>
  )
}
