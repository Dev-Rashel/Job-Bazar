import Image from "next/image"
import Link from "next/link"
import type { SVGProps } from "react"

import logo from "@/app/images/logo.png"
import { cn } from "@/lib/utils"

const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Job discovery", href: "/jobs" },
      { label: "Worker AI", href: "/worker-ai" },
      { label: "Companies", href: "/companies" },
      { label: "Salary data", href: "/salary-data" },
    ],
  },
  {
    title: "Navigations",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Career library", href: "/career-library" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Brand Guideline", href: "/brand-guideline" },
      { label: "Newsroom", href: "/newsroom" },
    ],
  },
] as const

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FacebookIcon,
    featured: false,
  },
  {
    label: "Pinterest",
    href: "https://pinterest.com",
    icon: PinterestIcon,
    featured: true,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: LinkedInIcon,
    featured: false,
  },
] as const

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 320 512" fill="currentColor" aria-hidden {...props}>
      <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  )
}

function PinterestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 384 512" fill="currentColor" aria-hidden {...props}>
      <path d="M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z" />
    </svg>
  )
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" aria-hidden {...props}>
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
    </svg>
  )
}

export function SiteFooter() {
  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative overflow-hidden bg-[#030305] px-4 py-10 text-white sm:px-6 lg:px-8"
    >
      <h2 id="footer-heading" className="sr-only">
        HireLoop footer
      </h2>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(92,83,254,0.16),transparent_65%)]"
      />

      <div className="relative mx-auto w-full max-w-[1320px]">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[288px]">
            <Link href="/" aria-label="HireLoop home" className="inline-flex">
              <Image
                src={logo}
                alt="HireLoop"
                width={154}
                height={44}
                className="h-11 w-auto"
              />
            </Link>
            <p className="mt-6 text-base leading-[1.9] text-white/50">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:w-[632px] lg:gap-x-[72px]"
          >
            {footerColumns.map((column) => (
              <div key={column.title} className="min-w-0">
                <h3 className="text-lg leading-[1.4] font-medium text-[#5c53fe]">
                  {column.title}
                </h3>
                <ul className="mt-6 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-block text-base leading-[1.9] text-[#d0d5dd]/70 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-[72px] flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon

              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg text-white transition-colors",
                    social.featured
                      ? "bg-[#5c53fe] hover:bg-[#6a62ff]"
                      : "bg-white/5 hover:bg-white/10"
                  )}
                >
                  <Icon className="size-6" />
                </Link>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-base leading-[1.9] text-[#acabb2]">
            <p className="opacity-70">Copyright 2024 — Programming Hero</p>
            <div className="flex items-center gap-1.5">
              <Link
                href="/terms"
                className="transition-colors hover:text-white"
              >
                Terms &amp; Policy
              </Link>
              <span aria-hidden className="opacity-70">
                -
              </span>
              <Link
                href="/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy Guideline
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
