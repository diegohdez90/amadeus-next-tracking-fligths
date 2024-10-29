import amadeus from "@/app/utils/amadeus"
import HTTPStatus from 'http-status-codes'
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get('latitude') as unknown as number
  const lng = req.nextUrl.searchParams.get('longitude') as unknown as number
  const res =  await amadeus.referenceData.locations.airports.get({
    latitude: lat,
    longitude: lng
  })
  return NextResponse.json({
    message: 'airports',
    data: res.data
  }, {
    status: HTTPStatus.OK
  })
}

