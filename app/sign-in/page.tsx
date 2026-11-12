import type { Metadata } from "next"

import { AuthForm } from "@/components/auth-form"
import { AuthShell } from "@/components/auth-shell"

export const metadata: Metadata = {
  title: "Sign in · HireLoop",
  description:
    "Sign in to HireLoop to browse curated roles, track applications, and land your next role faster.",
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const redirectTo =
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/\\")
      ? next
      : "/"

  return (
    <AuthShell>
      <AuthForm mode="sign-in" redirectTo={redirectTo} />
    </AuthShell>
  )
}
