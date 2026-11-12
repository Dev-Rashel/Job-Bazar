import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

/** Title row used at the top of dashboard cards and tables. */
export function SectionHeader({
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  title: string
  description?: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-[15px] leading-6 font-semibold text-[#ededef]">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-xs text-[#a0a0ab]">{description}</p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[#8f88ff] transition-colors hover:text-[#a5a1ff]"
        >
          {linkLabel}
          <ArrowRightIcon aria-hidden className="size-3.5" />
        </Link>
      ) : null}
    </div>
  )
}
