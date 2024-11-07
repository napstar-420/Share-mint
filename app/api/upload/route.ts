// import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
// import { auth } from '@/auth'
import { uploadFile } from '@/app/service'

export async function POST(req: Request) {
  // const header = await headers()
  // const ip = (header.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0]
  // const session = await auth()
  const formData = await req.formData()
  const file = formData.get("file") as File
  try {
    const res = await uploadFile(file);
    return NextResponse.json(res);
  } catch (error: unknown) {
    return NextResponse.json(error, { status: 500 })
  }
}