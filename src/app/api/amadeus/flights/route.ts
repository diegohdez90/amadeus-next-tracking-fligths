import amadeus from "@/app/utils/amadeus";
import HTTPStatus from 'http-status-codes';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const originLocationCode = req.nextUrl.searchParams.get('originLocationCode') as string
    const destinationLocationCode = req.nextUrl.searchParams.get('destinationLocationCode') as string
    const departureDate = req.nextUrl.searchParams.get('departureDate') as string
    const adults = req.nextUrl.searchParams.get('adults') as unknown as number

  const res = await amadeus.shopping.flightOffersSearch.get({
    originLocationCode,
    destinationLocationCode,
    departureDate,
    adults
  })
  
  if (res.statusCode == HTTPStatus.OK) {
    return NextResponse.json({
      message: 'offers',
      data: res.data,
      dictionaries: res.data?.dictionaries
    }, {
      status: HTTPStatus.OK
    });  
  } else {
    return NextResponse.json({
      message: 'No flights found',
      data: []
    }, {
      status: HTTPStatus.FORBIDDEN
    });  
  }
}