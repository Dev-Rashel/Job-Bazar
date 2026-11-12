export const USER_ROLES = {
  admin: "admin",
  recruiter: "recruiter",
  jobSeeker: "job-seeker",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const USER_ROLE_VALUES: UserRole[] = [
  USER_ROLES.jobSeeker,
  USER_ROLES.recruiter,
  USER_ROLES.admin,
]

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.admin]: "Admin",
  [USER_ROLES.recruiter]: "Company / Recruiter",
  [USER_ROLES.jobSeeker]: "Job Seeker",
}

/** Landing route for each role's dashboard. */
export const USER_ROLE_DASHBOARDS: Record<UserRole, string> = {
  [USER_ROLES.jobSeeker]: "/dashboard/seeker",
  [USER_ROLES.recruiter]: "/dashboard/recruiter",
  [USER_ROLES.admin]: "/dashboard/admin",
}

export const USER_STATUSES = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
} as const

export type UserStatus = (typeof USER_STATUSES)[keyof typeof USER_STATUSES]

export const USER_STATUS_VALUES: UserStatus[] = [
  USER_STATUSES.pending,
  USER_STATUSES.approved,
  USER_STATUSES.rejected,
]

export function isUserRole(value: unknown): value is UserRole {
  return (
    typeof value === "string" &&
    (USER_ROLE_VALUES as readonly string[]).includes(value)
  )
}

export function isUserStatus(value: unknown): value is UserStatus {
  return (
    typeof value === "string" &&
    (USER_STATUS_VALUES as readonly string[]).includes(value)
  )
}
