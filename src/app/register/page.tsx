import type { Metadata } from "next"
import RegisterClientPage from "./RegisterClientPage"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your ECOMMERCE account to start exploring our marketplace and marking your interests.",
}

export default function RegisterPage() {
  return <RegisterClientPage />
}
