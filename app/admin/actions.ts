"use server"

import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import { USER_STATUSES, type UserStatus } from "@/lib/roles"

async function requireApprovedAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (!user || user.role !== "admin" || user.status !== "approved") {
    throw new Error("Only approved admins can review accounts.")
  }
}

async function updateUserStatus(formData: FormData, status: UserStatus) {
  await requireApprovedAdmin()

  const userId = String(formData.get("userId") ?? "")
  const filter = ObjectId.isValid(userId)
    ? { _id: new ObjectId(userId) }
    : { id: userId }

  await db
    .collection("user")
    .updateOne(filter, { $set: { status, updatedAt: new Date() } })

  revalidatePath("/admin")
}

export async function approveUser(formData: FormData) {
  await updateUserStatus(formData, USER_STATUSES.approved)
}

export async function rejectUser(formData: FormData) {
  await updateUserStatus(formData, USER_STATUSES.rejected)
}
