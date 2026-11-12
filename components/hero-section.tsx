import Image from "next/image"
import Link from "next/link"
import {
  BriefcaseIcon,
  BuildingIcon,
  MapPinIcon,
  SearchIcon,
  StarIcon,
  UserIcon,
} from "lucide-react"

import globe from "@/app/images/globe.png"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const trendingSearches = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

const stats = [
  { icon: BriefcaseIcon, value: "50K", label: "Active Jobs" },
  { icon: BuildingIcon, value: "12K", label: "Companies" },
  { icon: UserIcon, value: "2M", label: "Job Seekers" },
  { icon: StarIcon, value: "97%", label: "Satisfaction Rate" },
]

const sparkDots = [
  "left-[7%] top-[43%] bg-white/60",
  "left-[14%] top-[49%] bg-blue-300/70",
  "left-[22%] top-[54%] bg-white/60",
  "left-[28%] top-[45%] bg-[#a5a1ff]/70",
  "left-[37%] top-[52%] bg-white/50",
  "left-[62%] top-[47%] bg-blue-300/70",
  "left-[71%] top-[52%] bg-white/60",
  "left-[79%] top-[44%] bg-[#a5a1ff]/70",
  "left-[89%] top-[51%] bg-white/60",
  "right-[7%] top-[39%] bg-blue-300/70",
]

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full overflow-hidden bg-[#030305] px-4 pt-10 pb-10 text-white sm:px-6 lg:px-8"
    >
      {/* Ambient glows and fade */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[120px] left-1/2 h-[420px] w-[850px] -translate-x-1/2 rounded-full bg-[#5c53fe]/[0.02]" />
        <div className="absolute top-[375px] left-1/2 h-[300px] w-[850px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.22)_0%,rgba(52,40,190,0.10)_35%,transparent_72%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#030305] to-transparent" />
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

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#131318]/80 px-4 py-2 shadow-[0_0_20px_rgba(0,0,0,0.25)] backdrop-blur-md">
            <span aria-hidden className="text-xs">
              💼
            </span>
            <span className="text-xs font-semibold tracking-[0.12em] text-white">
              50,000+
            </span>
            <span className="text-[10px] tracking-[0.16em] text-gray-400 uppercase">
              New Jobs This Month
            </span>
          </div>
        </div>

        <div className="mx-auto mt-7 max-w-3xl text-center">
          <h1
            id="hero-heading"
            className="text-[42px] leading-[1.03] font-semibold tracking-[-0.045em] text-white sm:text-[52px] md:text-[58px]"
          >
            Find Your Dream Job Today
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-400 sm:text-base sm:leading-7">
            HireLoop connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>
        </div>

        <form
          action="/jobs"
          className="mx-auto mt-7 flex h-[56px] w-full max-w-[790px] items-center rounded-2xl border border-white/15 bg-[#0a0a0d]/95 p-2 shadow-[0_15px_50px_rgba(0,0,0,0.3)]"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-4">
            <SearchIcon
              aria-hidden
              strokeWidth={1.7}
              className="size-4 shrink-0 text-gray-500"
            />
            <label htmlFor="hero-keyword" className="sr-only">
              Job title, skill or company
            </label>
            <input
              id="hero-keyword"
              type="text"
              name="q"
              placeholder="Job title, skill or company"
              autoComplete="off"
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500 sm:text-sm"
            />
          </div>

          <div aria-hidden className="hidden h-7 w-px bg-white/10 sm:block" />

          <div className="hidden min-w-0 flex-1 items-center gap-3 px-4 sm:flex">
            <MapPinIcon
              aria-hidden
              strokeWidth={1.7}
              className="size-4 shrink-0 text-gray-500"
            />
            <label htmlFor="hero-location" className="sr-only">
              Location or Remote
            </label>
            <input
              id="hero-location"
              type="text"
              name="location"
              placeholder="Location or Remote"
              autoComplete="off"
              className="w-full bg-transparent text-[13px] text-white outline-none placeholder:text-gray-500 sm:text-sm"
            />
          </div>

          <Button
            type="submit"
            size="icon"
            aria-label="Search jobs"
            className="size-10 shrink-0 rounded-xl bg-[#5c53fe] text-white transition-colors hover:bg-[#6a62ff]"
          >
            <SearchIcon strokeWidth={2} className="size-[18px]" />
          </Button>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span className="mr-1 text-gray-500">Trending Position</span>
          {trendingSearches.map((term) => (
            <Link
              key={term}
              href={`/jobs?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-white/10 bg-[#111116]/80 px-3.5 py-1.5 text-gray-400 transition-colors hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
            >
              {term}
            </Link>
          ))}
        </div>

        <div className="relative mt-4 h-[450px] w-full sm:mt-5 sm:h-[470px]">
          {/* Halo behind the planet */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[140px] left-1/2 h-[320px] w-[min(1020px,145vw)] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(92,83,254,0.35)_0%,rgba(52,40,190,0.12)_42%,transparent_75%)] blur-2xl"
          />

          {/* Planet */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[-60px] mx-auto h-[520px] w-[min(1120px,150vw)] overflow-hidden [mask-image:radial-gradient(ellipse_70%_58%_at_50%_50%,black_38%,transparent_82%)] [mask-repeat:no-repeat]"
          >
            <Image
              src={globe}
              alt=""
              fill
              priority
              sizes="(max-width: 640px) 150vw, 1120px"
              className="object-cover object-[50%_56%] opacity-90"
            />
            <div className="absolute inset-0 bg-[#5c53fe]/15 mix-blend-color" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/35 to-[#030305]" />
          </div>

          {/* Orbit accents */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[57%] left-1/2 h-[170px] w-[min(880px,125vw)] -translate-x-1/2 rounded-[50%] border border-white/[0.07]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute top-[42%] left-[68%] size-1.5 rounded-full bg-[#a5a1ff] shadow-[0_0_14px_rgba(165,161,255,0.9)]"
          />

          <div className="absolute top-[128px] left-1/2 z-20 w-full -translate-x-1/2 px-4 text-center">
            <p className="text-[26px] leading-[1.35] font-light tracking-[-0.035em] text-gray-200 [text-shadow:0_2px_28px_rgba(3,3,5,0.85)] sm:text-[30px]">
              Assisting over{" "}
              <span className="font-medium text-white">15,000 job seekers</span>
            </p>
            <p className="text-[26px] leading-[1.35] font-light tracking-[-0.035em] text-gray-200 [text-shadow:0_2px_28px_rgba(3,3,5,0.85)] sm:text-[30px]">
              find their dream positions.
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 z-30 grid w-full max-w-[820px] -translate-x-1/2 grid-cols-2 gap-3 px-1 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="relative flex h-[118px] flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e]/95 p-4 shadow-[0_15px_45px_rgba(0,0,0,0.5)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px bg-white/[0.12]"
                />
                <stat.icon
                  aria-hidden
                  strokeWidth={1.5}
                  className="size-[18px] text-gray-300"
                />
                <div>
                  <div className="text-[32px] leading-none font-medium tracking-[-0.04em] text-white">
                    {stat.value}
                  </div>
                  <div className="mt-1.5 text-[10px] text-gray-400 sm:text-[11px]">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-50 h-24 bg-gradient-to-t from-[#030305] to-transparent"
      />
    </section>
  )
}
