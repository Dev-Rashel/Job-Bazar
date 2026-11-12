"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ObjectId } from "mongodb"

import { auth, db } from "@/lib/auth"
import { USER_ROLES, USER_STATUSES } from "@/lib/roles"

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  if (
    !user ||
    user.role !== USER_ROLES.jobSeeker ||
    user.status !== USER_STATUSES.approved ||
    !user.id
  ) {
    throw new Error("Only approved job seekers can update this profile.")
  }

  const name = String(formData.get("name") ?? "").trim()
  if (!name) {
    redirect("/dashboard/seeker/settings?error=name")
  }

  const filter = ObjectId.isValid(user.id)
    ? { _id: new ObjectId(user.id) }
    : { id: user.id }

  await db
    .collection("user")
    .updateOne(filter, { $set: { name, updatedAt: new Date() } })

  revalidatePath("/dashboard/seeker/settings")
  revalidatePath("/dashboard/seeker")
  redirect("/dashboard/seeker/settings?saved=1")
}
