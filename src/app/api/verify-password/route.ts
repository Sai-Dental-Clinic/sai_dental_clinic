import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const expected = process.env.BLOG_PASSWORD

  if (!expected) {
    return NextResponse.json({ valid: true })
  }

  if (password === expected) {
    return NextResponse.json({ valid: true })
  }

  return NextResponse.json({ valid: false }, { status: 401 })
}
