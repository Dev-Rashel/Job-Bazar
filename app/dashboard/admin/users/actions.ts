"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import { USER_STATUSES, type UserStatus } from "@/lib/roles"

async function requireApprovedAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (!user || user.role !== "admin" || user.status !== "approved") {
    throw new Error("Only approved admins can manage accounts.")
  }

  return user
}

async function updateUserStatus(formData: FormData, status: UserStatus) {
  const admin = await requireApprovedAdmin()

  const userId = String(formData.get("userId") ?? "")
  if (!userId) throw new Error("Missing user id.")

  const filter = ObjectId.isValid(userId)
    ? { _id: new ObjectId(userId) }
    : { id: userId }

  const target = await db.collection("user").findOne(filter)
  if (!target) throw new Error("User not found.")

  // Never let an admin lock themselves out of the dashboard.
  const targetEmail =
    typeof target.email === "string" ? target.email.toLowerCase() : ""
  if (targetEmail === admin.email.toLowerCase()) {
    throw new Error("You cannot change the status of your own account.")
  }

  await db
    .collection("user")
    .updateOne(filter, { $set: { status, updatedAt: new Date() } })

  revalidatePath("/dashboard/admin/users")
  revalidatePath("/dashboard/admin")
  revalidatePath("/admin")
}

export async function approveUser(formData: FormData) {
  await updateUserStatus(formData, USER_STATUSES.approved)
}

export async function rejectUser(formData: FormData) {
  await updateUserStatus(formData, USER_STATUSES.rejected)
}
