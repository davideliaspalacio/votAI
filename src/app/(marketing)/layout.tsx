import { Header } from "@/components/common/Header"
import { LegalFooter } from "@/components/common/LegalFooter"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <LegalFooter />
    </div>
  )
}
