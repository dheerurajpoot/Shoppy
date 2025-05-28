import type { Metadata } from "next"
import VerifyPageClient from "./VerifyPageClient"

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Verify your email address to complete your ECOMMERCE account registration.",
}

export default function VerifyPage() {
  return <VerifyPageClient />
}
