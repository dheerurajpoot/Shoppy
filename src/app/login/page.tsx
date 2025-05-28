import type { Metadata } from "next"
import LoginPageClient from "./LoginPageClient"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your ECOMMERCE account to access your personalized marketplace experience.",
}

export default function LoginPage() {
  return <LoginPageClient />
}
