import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-navy-deep">
      <SiteHeader />
      <Hero />
      <Features />
    </main>
  )
}
