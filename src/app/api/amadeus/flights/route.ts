import amadeus from "@/app/utils/amadeus";
import HTTPStatus from 'http-status-codes';
import { NextResponse } from "next/server";

export async function GET() {
  const res = await amadeus.shopping.flightOffersSearch.get()
  
  if (res.statusCode == HTTPStatus.OK) {
    return NextResponse.json({
      message: 'offers',
      data: res.data
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