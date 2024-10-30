import { amadeus } from "@/app/utils/amadeus"
import HTTPStatus from 'http-status-codes'
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const term = req.nextUrl.searchParams.get('term') as unknown as string
  const res =  await amadeus.referenceData.locations.get({
    subType: 'AIRPORT',
    keyword: term
  })
  return NextResponse.json({
    message: 'airports',
    data: res.result.data
  }, {
    status: HTTPStatus.OK
  })
}

