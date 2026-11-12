import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { nextCookies } from "better-auth/next-js"
import { APIError } from "better-auth/api"
import { MongoClient } from "mongodb"

import {
  isUserRole,
  isUserStatus,
  USER_ROLES,
  USER_STATUSES,
  type UserRole,
} from "@/lib/roles"

const uri = process.env.MONGODB_URI?.trim() || undefined
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build"

if (!uri && !isBuildPhase) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Add your MongoDB Atlas connection string to .env"
  )
}

// Reuse the client across hot reloads in development.
const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient
}

const client =
  globalForMongo.mongoClient ??
  new MongoClient(uri ?? "mongodb://127.0.0.1:27017/hireloop")

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client
}

export const db = client.db("hireloop")

/** Emails listed here skip approval and always become approved admins. */
function getBootstrapAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

export const auth = betterAuth({
  appName: "HireLoop",
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  basePath: "/api/auth",
  database: mongodbAdapter(db, { client }),
  emailAndPassword: {
    enabled: true,
    // Do not create a session on sign-up. Job seekers sign in explicitly and
    // recruiter/admin accounts must be approved before they can get a session.
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: USER_ROLES.jobSeeker,
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: USER_STATUSES.approved,
        input: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = (user as { role?: unknown }).role
          const email =
            typeof user.email === "string" ? user.email.toLowerCase() : ""
          const isBootstrapAdmin = getBootstrapAdminEmails().includes(email)

          const role: UserRole = isBootstrapAdmin
            ? USER_ROLES.admin
            : isUserRole(requestedRole)
              ? requestedRole
              : USER_ROLES.jobSeeker

          const status =
            isBootstrapAdmin || role === USER_ROLES.jobSeeker
              ? USER_STATUSES.approved
              : USER_STATUSES.pending

          return { data: { ...user, role, status } }
        },
      },
    },
    session: {
      create: {
        before: async (session, ctx) => {
          const internalAdapter = ctx?.context?.internalAdapter
          if (!internalAdapter) return

          const user = await internalAdapter.findUserById(session.userId)
          if (!user) return

          const email =
            typeof user.email === "string" ? user.email.toLowerCase() : ""
          const isBootstrapAdmin = getBootstrapAdminEmails().includes(email)
          const existingRole = (user as { role?: unknown }).role
          const existingStatus = (user as { status?: unknown }).status

          // ADMIN_EMAILS account owners become approved admins on their next
          // sign-in, even if they registered before the env var was set.
          const role = isBootstrapAdmin
            ? USER_ROLES.admin
            : isUserRole(existingRole)
              ? existingRole
              : USER_ROLES.jobSeeker
          // Accounts created before roles existed default to approved.
          const status = isBootstrapAdmin
            ? USER_STATUSES.approved
            : isUserStatus(existingStatus)
              ? existingStatus
              : USER_STATUSES.approved

          if (role !== existingRole || status !== existingStatus) {
            await internalAdapter.updateUser(session.userId, { role, status })
          }

          if (status !== USER_STATUSES.approved) {
            throw APIError.from("FORBIDDEN", {
              message:
                status === USER_STATUSES.pending
                  ? "Your account is waiting for admin approval. Please try again once you've been approved."
                  : "Your account has been rejected. Please contact HireLoop support.",
              code: "ACCOUNT_NOT_APPROVED",
            })
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
})
