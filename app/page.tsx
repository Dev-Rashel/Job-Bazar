import { HeroSection } from "@/components/hero-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"

export default function Page() {
  return (
    <div className="min-h-svh bg-[#030305]">
      <SiteNavbar />
      <main>
        <HeroSection />
      </main>
      <SiteFooter />
    </div>
  )
}
