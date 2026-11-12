/**
 * Dashboard content mirroring the HireLoop 2.0 Figma file.
 * The platform's job/application/billing collections land later; until then
 * the dashboard pages render this seeded content so the UI matches the
 * approved design exactly.
 */

export type TrendDirection = "up" | "flat"

export type StatTone = "default" | "brand" | "success" | "warning" | "danger" | "info"

export type StatCard = {
  label: string
  value: string
  trend?: string
  trendDirection?: TrendDirection
  trendHint?: string
  iconTone?: StatTone
  valueTone?: StatTone
  icon:
    | "bookmark"
    | "send"
    | "calendar"
    | "gift"
    | "briefcase"
    | "users"
    | "check"
    | "building"
    | "dollar"
    | "pulse"
    | "lock"
    | "user"
}

export type Activity = {
  id: string
  message: string
  time: string
  tone: "brand" | "success" | "neutral"
}

export type JobStatus =
  | "Applied"
  | "Review"
  | "Shortlisted"
  | "Offered"
  | "Rejected"
  | "Interviewing"
  | "New"

export type Application = {
  id: string
  title: string
  type: string
  company: string
  companyMark: string
  applied: string
  status: JobStatus
}

export type JobListing = {
  id: string
  title: string
  company: string
  companyMark: string
  location: string
  type: string
  salary: string
  posted: string
  category: string
  tags: string[]
  featured?: boolean
}

export type SavedJob = {
  id: string
  title: string
  company: string
  companyMark: string
  location: string
  salary: string
  savedAt: string
  closingIn?: string
  category: string
}

export type RecruiterApplicant = {
  id: string
  name: string
  role: string
  applied: string
  status: JobStatus
  experience: string
}

export type RecruiterJobPost = {
  id: string
  title: string
  dept: string
  company: string
  location: string
  deadline: string
  posted: string
  status: "Active" | "Closed"
  type: string
  applicants: number
  compensation: string
}

export type Transaction = {
  id: string
  user: string
  company: string
  plan: string
  status: "Success" | "Pending" | "Failed"
  txnId: string
  date: string
  relative?: string
  amount: string
}

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: "Seeker" | "Recruiter"
  status: "Active" | "Suspended"
  joined: string
}

export type ManagedJob = {
  id: string
  title: string
  ref: string
  company: string
  companyMark: string
  category: string
  status: "Active" | "Closed"
  type: string
  posted: string
}

export type ManagedCompany = {
  id: string
  name: string
  recruiterEmail: string
  industry: string
  status: "Pending" | "Approved" | "Rejected"
  submitted: string
}

/* ---------------------------------- Seeker -------------------------------- */

export const seekerStats: StatCard[] = [
  { label: "Saved Jobs", value: "12", icon: "bookmark", iconTone: "default" },
  { label: "Applications Submitted", value: "24", icon: "send", iconTone: "default" },
  { label: "Interviews Scheduled", value: "3", icon: "calendar", iconTone: "warning" },
  { label: "Offers Received", value: "1", icon: "gift", iconTone: "success" },
]

export const seekerActivity: Activity[] = [
  {
    id: "a1",
    message:
      "Application for Senior Product Designer at TechFlow updated to 'Under Review'",
    time: "2 hours ago",
    tone: "brand",
  },
  {
    id: "a2",
    message:
      "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
    tone: "success",
  },
  {
    id: "a3",
    message:
      "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
    tone: "neutral",
  },
]

export const seekerApplications: Application[] = [
  {
    id: "app-1",
    title: "Senior Frontend Engineer",
    type: "Full-time • Remote",
    company: "Stark Industries",
    companyMark: "S",
    applied: "2 hours ago",
    status: "Applied",
  },
  {
    id: "app-2",
    title: "Product Designer",
    type: "Contract • Hybrid",
    company: "Cyberdyne Systems",
    companyMark: "C",
    applied: "1 day ago",
    status: "Review",
  },
  {
    id: "app-3",
    title: "Lead Data Scientist",
    type: "Full-time • On-site",
    company: "Wayne Enterprises",
    companyMark: "W",
    applied: "4 days ago",
    status: "Shortlisted",
  },
  {
    id: "app-4",
    title: "AI Research Engineer",
    type: "Full-time • Hybrid",
    company: "Hooli Corp",
    companyMark: "H",
    applied: "2 weeks ago",
    status: "Offered",
  },
  {
    id: "app-5",
    title: "Cloud Architect",
    type: "Full-time • Remote",
    company: "Oscorp Tech",
    companyMark: "O",
    applied: "1 week ago",
    status: "Rejected",
  },
]

export const applicationStats: StatCard[] = [
  { label: "Total Applied", value: "24", icon: "send" },
  { label: "Shortlisted", value: "8", icon: "check" },
  { label: "Interviews", value: "3", icon: "calendar", valueTone: "warning" },
  { label: "Success Rate", value: "12%", icon: "pulse", valueTone: "success" },
]

export const jobListings: JobListing[] = [
  {
    id: "open-1",
    title: "Senior Frontend Engineer",
    company: "Vercel",
    companyMark: "V",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$140k - $180k",
    posted: "Posted 2 hours ago",
    category: "Engineering",
    tags: ["React", "Next.js", "TypeScript"],
    featured: true,
  },
  {
    id: "open-2",
    title: "Product Designer",
    company: "TechFlow",
    companyMark: "T",
    location: "San Francisco, CA (Hybrid)",
    type: "Full-time",
    salary: "$150k - $190k",
    posted: "Posted 5 hours ago",
    category: "Design",
    tags: ["Figma", "Design systems", "Prototyping"],
  },
  {
    id: "open-3",
    title: "Backend Engineer (Go)",
    company: "FinGrid",
    companyMark: "F",
    location: "New York, NY (On-site)",
    type: "Full-time",
    salary: "$160k - $200k",
    posted: "Posted 1 day ago",
    category: "Engineering",
    tags: ["Go", "Kubernetes", "AWS"],
  },
  {
    id: "open-4",
    title: "Lead Product Manager",
    company: "Nexus Lab",
    companyMark: "N",
    location: "London, UK (Hybrid)",
    type: "Full-time",
    salary: "£95k - £120k",
    posted: "Posted 1 day ago",
    category: "Product",
    tags: ["Roadmap", "B2B SaaS"],
  },
  {
    id: "open-5",
    title: "Data Scientist",
    company: "Wayne Enterprises",
    companyMark: "W",
    location: "Remote (EU)",
    type: "Contract",
    salary: "€70 - €90 / hr",
    posted: "Posted 2 days ago",
    category: "Data",
    tags: ["Python", "Machine learning", "SQL"],
  },
  {
    id: "open-6",
    title: "Marketing Lead",
    company: "Hooli Corp",
    companyMark: "H",
    location: "Remote (US)",
    type: "Full-time",
    salary: "$110k - $140k",
    posted: "Posted 3 days ago",
    category: "Marketing",
    tags: ["Growth", "SEO", "Content"],
  },
  {
    id: "open-7",
    title: "Staff Platform Engineer",
    company: "Oscorp Tech",
    companyMark: "O",
    location: "Austin, TX (Hybrid)",
    type: "Full-time",
    salary: "$190k - $230k",
    posted: "Posted 4 days ago",
    category: "Engineering",
    tags: ["Terraform", "IaC", "Observability"],
  },
  {
    id: "open-8",
    title: "UX Researcher",
    company: "Humanize Studio",
    companyMark: "H",
    location: "Berlin, DE (Remote)",
    type: "Part-time",
    salary: "€45 - €60 / hr",
    posted: "Posted 5 days ago",
    category: "Design",
    tags: ["Interviews", "Usability testing"],
  },
]

export const savedJobs: SavedJob[] = [
  {
    id: "job-1",
    title: "Senior Product Designer",
    company: "TECHFLOW",
    companyMark: "T",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k + Equity",
    savedAt: "Saved 2 hours ago",
    closingIn: "Closes in 3 days",
    category: "Design",
  },
  {
    id: "job-2",
    title: "Frontend Engineer",
    company: "VERCEL",
    companyMark: "V",
    location: "Remote (US)",
    salary: "$140k - $180k",
    savedAt: "Saved 1 day ago",
    closingIn: "Closes in 12 days",
    category: "Engineering",
  },
  {
    id: "job-3",
    title: "Lead Product Manager",
    company: "NEXUS LAB",
    companyMark: "N",
    location: "London, UK (Hybrid)",
    salary: "£95k - £120k",
    savedAt: "Saved 3 days ago",
    closingIn: "Closes in 3 weeks",
    category: "Product",
  },
  {
    id: "job-4",
    title: "Staff Engineer, Platform",
    company: "FINGRID",
    companyMark: "F",
    location: "New York, NY (On-site)",
    salary: "$190k - $230k",
    savedAt: "Saved 5 days ago",
    closingIn: "Closes in 1 week",
    category: "Engineering",
  },
]

export const billingHistory: Transaction[] = [
  {
    id: "bill-1",
    user: "Professional Tier",
    company: "",
    plan: "Monthly",
    status: "Success",
    txnId: "TRX-948102-HL",
    date: "Sep 24, 2023",
    amount: "$29.00",
  },
  {
    id: "bill-2",
    user: "Professional Tier",
    company: "",
    plan: "Monthly",
    status: "Success",
    txnId: "TRX-771920-HL",
    date: "Aug 24, 2023",
    amount: "$29.00",
  },
  {
    id: "bill-3",
    user: "Professional Tier",
    company: "",
    plan: "Monthly",
    status: "Success",
    txnId: "TRX-331005-HL",
    date: "Jul 24, 2023",
    amount: "$29.00",
  },
]

export const planFeatures = [
  "Unlimited Applications",
  "Premium Job Insights",
  "Priority Candidate Badge",
  "Direct Recruiter Messaging",
]

/* -------------------------------- Recruiter ------------------------------- */

export const recruiterStats: StatCard[] = [
  { label: "Total Job Posts", value: "48", icon: "briefcase" },
  { label: "Total Applicants", value: "1,284", icon: "users" },
  { label: "Active Jobs", value: "18", icon: "pulse" },
  { label: "Jobs Closed", value: "32", icon: "check" },
]

export const recruiterApplicants: RecruiterApplicant[] = [
  {
    id: "r1",
    name: "Julianne Moore",
    role: "Senior Product Designer",
    applied: "Oct 24, 2023",
    status: "Interviewing",
    experience: "6 years",
  },
  {
    id: "r2",
    name: "Robert Downey",
    role: "Backend Engineer",
    applied: "Oct 23, 2023",
    status: "New",
    experience: "4 years",
  },
  {
    id: "r3",
    name: "Emma Stone",
    role: "Marketing Lead",
    applied: "Oct 22, 2023",
    status: "Review",
    experience: "8 years",
  },
  {
    id: "r4",
    name: "Chris Pratt",
    role: "Product Manager",
    applied: "Oct 21, 2023",
    status: "Rejected",
    experience: "5 years",
  },
]

export const recruiterJobPosts: RecruiterJobPost[] = [
  {
    id: "rp-1",
    title: "Frontend Developer",
    dept: "Engineering",
    company: "HirePulse Network",
    location: "Remote (New York, USA)",
    deadline: "May 30, 2025",
    posted: "Posted 4d ago",
    status: "Active",
    type: "Full-time",
    applicants: 34,
    compensation: "€25 - €40 / hr",
  },
  {
    id: "rp-2",
    title: "Senior Product Designer",
    dept: "Design",
    company: "HirePulse Labs",
    location: "London, UK (Hybrid)",
    deadline: "Jun 14, 2025",
    posted: "Posted 1w ago",
    status: "Active",
    type: "Full-time",
    applicants: 19,
    compensation: "€90k - €115k / yr",
  },
  {
    id: "rp-3",
    title: "QA Automation Engineer",
    dept: "Quality",
    company: "HirePulse Platform",
    location: "Dublin, Ireland (Hybrid)",
    deadline: "May 01, 2025",
    posted: "Posted 2w ago",
    status: "Closed",
    type: "Part-time",
    applicants: 8,
    compensation: "€35 - €50 / hr",
  },
]

/* ---------------------------------- Admin --------------------------------- */

export const adminStats: StatCard[] = [
  {
    label: "Total Users",
    value: "124,892",
    trend: "12%",
    trendDirection: "up",
    icon: "users",
  },
  {
    label: "Total Recruiters",
    value: "12,405",
    trend: "8%",
    trendDirection: "up",
    icon: "briefcase",
  },
  {
    label: "Total Companies",
    value: "4,281",
    trend: "0%",
    trendDirection: "flat",
    icon: "building",
  },
  {
    label: "Jobs Posted",
    value: "8,920",
    trend: "24%",
    trendDirection: "up",
    icon: "pulse",
  },
  {
    label: "Platform Revenue",
    value: "$245,800",
    trend: "18.5%",
    trendDirection: "up",
    icon: "dollar",
  },
]

export const adminUserStats: StatCard[] = [
  {
    label: "Total Active Users",
    value: "12,842",
    trend: "+12% vs last month",
    trendDirection: "up",
    icon: "users",
  },
  {
    label: "Recruiter Growth",
    value: "843",
    trend: "High demand",
    trendDirection: "up",
    icon: "briefcase",
  },
  {
    label: "Suspended Accounts",
    value: "124",
    trend: "0.8% of total",
    trendDirection: "flat",
    icon: "lock",
  },
  {
    label: "New Signups (24h)",
    value: "42",
    trend: "Steady activity",
    trendDirection: "up",
    icon: "user",
  },
]

export const adminTransactions: Transaction[] = [
  {
    id: "tx-1",
    user: "marcus.k@techcorp.io",
    company: "TechCorp Inc.",
    plan: "Enterprise Monthly",
    status: "Success",
    txnId: "#TXN-902341",
    date: "Oct 24, 2023, 14:20",
    amount: "$1,299.00",
  },
  {
    id: "tx-2",
    user: "sarah.l@creativestudio.com",
    company: "Creative Studio",
    plan: "Professional Annual",
    status: "Success",
    txnId: "#TXN-882103",
    date: "Oct 24, 2023, 11:05",
    amount: "$499.00",
  },
  {
    id: "tx-3",
    user: "j.doe@freelance.org",
    company: "Independent",
    plan: "Starter Monthly",
    status: "Pending",
    txnId: "#TXN-774129",
    date: "Oct 23, 2023, 16:45",
    amount: "$49.00",
  },
  {
    id: "tx-4",
    user: "admin@retailglobal.net",
    company: "Retail Global",
    plan: "Enterprise Monthly",
    status: "Failed",
    txnId: "#TXN-552014",
    date: "Oct 23, 2023, 09:12",
    amount: "$1,299.00",
  },
]

export const paymentStats: StatCard[] = [
  {
    label: "Total Revenue",
    value: "$1,284,500",
    trend: "+12.4%",
    trendDirection: "up",
    icon: "dollar",
  },
  {
    label: "Monthly Revenue",
    value: "$94,210",
    trend: "+8.1%",
    trendDirection: "up",
    icon: "pulse",
  },
  {
    label: "Active Pro Users",
    value: "12,408",
    trend: "+2.3%",
    trendDirection: "up",
    icon: "users",
  },
  {
    label: "Active Enterprise Users",
    value: "842",
    trend: "+15.7%",
    trendDirection: "up",
    icon: "building",
  },
]

export const adminManagedJobs: ManagedJob[] = [
  {
    id: "mj-1",
    title: "Senior Product Designer",
    ref: "Ref: HL-90210",
    company: "Nexus Lab",
    companyMark: "N",
    category: "Design",
    status: "Active",
    type: "Full-time",
    posted: "Oct 24, 2023",
  },
  {
    id: "mj-2",
    title: "Full-stack Engineer",
    ref: "Ref: HL-88231",
    company: "Quantum",
    companyMark: "Q",
    category: "Engineering",
    status: "Active",
    type: "Contract",
    posted: "Oct 22, 2023",
  },
  {
    id: "mj-3",
    title: "Marketing Director",
    ref: "Ref: HL-11022",
    company: "Vanguard",
    companyMark: "V",
    category: "Marketing",
    status: "Closed",
    type: "Full-time",
    posted: "Oct 15, 2023",
  },
  {
    id: "mj-4",
    title: "UX Research Lead",
    ref: "Ref: HL-44112",
    company: "Humanize",
    companyMark: "H",
    category: "Design",
    status: "Active",
    type: "Part-time",
    posted: "Oct 12, 2023",
  },
]

export const managedCompanies: ManagedCompany[] = [
  {
    id: "mc-1",
    name: "Nexus Lab",
    recruiterEmail: "alex.chen@nexuslab.io",
    industry: "Developer Tools",
    status: "Pending",
    submitted: "Oct 24, 2023",
  },
  {
    id: "mc-2",
    name: "Quantum Systems",
    recruiterEmail: "r.brooks@quantum.dev",
    industry: "AI & ML",
    status: "Approved",
    submitted: "Oct 21, 2023",
  },
  {
    id: "mc-3",
    name: "Vanguard Retail",
    recruiterEmail: "ops@vanguard.shop",
    industry: "E-Commerce",
    status: "Pending",
    submitted: "Oct 19, 2023",
  },
  {
    id: "mc-4",
    name: "Humanize Studio",
    recruiterEmail: "maya@humanize.design",
    industry: "Design Agency",
    status: "Rejected",
    submitted: "Oct 11, 2023",
  },
]

/* --------------------------------- Helpers -------------------------------- */

export const savedJobCategories = [
  { label: "All Saved", count: 24 },
  { label: "Design", count: 8 },
  { label: "Engineering", count: 12 },
  { label: "Product", count: 4 },
]
