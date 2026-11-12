import { CheckIcon } from "lucide-react"

import { SiteNavbar } from "@/components/site-navbar"
import { cn } from "@/lib/utils"

const perks = [
  "50,000+ curated roles from world-class teams",
  "One profile, endless opportunities",
  "Salary insights and application tracking",
]

const sparkDots = [
  "left-[8%] top-[18%] bg-white/50",
  "left-[22%] top-[30%] bg-blue-300/60",
  "left-[36%] top-[12%] bg-[#a5a1ff]/60",
  "left-[12%] top-[62%] bg-white/40",
  "left-[44%] top-[52%] bg-blue-300/40",
  "right-[10%] top-[22%] bg-white/50",
  "right-[26%] top-[68%] bg-[#a5a1ff]/50",
  "right-[8%] top-[84%] bg-blue-300/40",
]

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#030305] text-white">
      {/* Ambient background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[220px] left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[#5c53fe]/15 blur-[120px]" />
        <div className="absolute top-1/2 -left-[180px] h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#2f2a8f]/20 blur-[110px]" />
        <div className="absolute -right-[160px] bottom-[-160px] h-[460px] w-[460px] rounded-full bg-[#5c53fe]/10 blur-[110px]" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#030305] to-transparent" />
      </div>

      {/* Scattered stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {sparkDots.map((position) => (
          <span
            key={position}
            className={cn("absolute size-0.5 rounded-full", position)}
          />
        ))}
      </div>

      <div className="relative z-20">
        <SiteNavbar />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pt-8 pb-12 sm:px-6 lg:min-h-[calc(100svh-106px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8">
        {/* Brand / marketing panel */}
        <section className="hidden flex-col justify-center lg:flex">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[11px] tracking-[0.16em] text-gray-400 uppercase">
              <span className="size-1.5 rounded-full bg-[#5c53fe] shadow-[0_0_10px_rgba(92,83,254,0.9)]" />
              50,000+ new jobs this month
            </span>

            <h1 className="mt-6 max-w-lg text-[46px] leading-[1.04] font-semibold tracking-[-0.045em]">
              Your next chapter{" "}
              <span className="text-[#a5a1ff]">starts here.</span>
            </h1>

            <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-400">
              Join a network of ambitious people and world-class companies.
              Build your profile once, then let the right opportunities find
              you.
            </p>
          </div>

          <ul className="mt-10 flex flex-col gap-3.5">
            {perks.map((perk) => (
              <li
                key={perk}
                className="flex items-center gap-3 text-sm text-gray-300"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-[#5c53fe]/40 bg-[#5c53fe]/15 text-[#a5a1ff]">
                  <CheckIcon aria-hidden className="size-3" strokeWidth={2.5} />
                </span>
                {perk}
              </li>
            ))}
          </ul>

          <figure className="mt-12 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
            <blockquote className="text-sm leading-6 text-gray-300">
              “I set up my HireLoop profile on a Sunday and had three interviews
              booked before the end of the week.”
            </blockquote>
            <figcaption className="mt-4 flex items-center gap-3">
              <span
                aria-hidden
                className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#5c53fe] to-[#2f2a8f] text-xs font-semibold text-white"
              >
                AR
              </span>
              <div className="text-xs text-gray-400">
                <span className="block text-sm font-medium text-white">
                  Ayesha Rahman
                </span>
                Product Designer at Northwind
              </div>
            </figcaption>
          </figure>
        </section>

        {/* Form panel */}
        <section className="flex w-full flex-col items-center">
          {children}
        </section>
      </div>
    </div>
  )
}
