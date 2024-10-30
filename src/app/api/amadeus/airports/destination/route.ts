import { amadeus } from "@/app/utils/amadeus";
import HTTPStatus from 'http-status-codes'
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest
) {
  const departureAirportCode = req.nextUrl.searchParams.get('departureAirportCode') as string
  const res = await amadeus.airport.directDestinations.get({
    departureAirportCode: departureAirportCode,
    max: 2
  })
  return NextResponse.json({
    message: 'destinations',
    data: res.data
  }, {
    status: HTTPStatus.OK
  })
}

