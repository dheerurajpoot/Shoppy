import { type NextRequest, NextResponse } from "next/server"
import { getUserFromToken } from "@/lib/db"

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value
  const user = getUserFromToken(token)

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.json({
    selectedCategories: user.selectedCategories || [],
  })
}
