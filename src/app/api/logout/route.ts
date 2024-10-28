import { cookies } from 'next/headers'
import { NextResponse } from "next/server";

export async function GET() {
  try {
    (await cookies()).delete('token')
    return NextResponse.json({
      message: 'Sesion deleted successfully'
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({
      message: new String(e)
    })
  }
}
