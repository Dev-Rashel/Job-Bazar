import type { Metadata } from "next"

import { AuthForm } from "@/components/auth-form"
import { AuthShell } from "@/components/auth-shell"

export const metadata: Metadata = {
  title: "Create your account · HireLoop",
  description:
    "Create a free HireLoop account and get matched with thousands of curated job opportunities.",
}

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthForm mode="sign-up" />
    </AuthShell>
  )
}
