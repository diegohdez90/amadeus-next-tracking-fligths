import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { JwtPayload } from 'jsonwebtoken';
import HTTPStatus from 'http-status-codes'
import * as jwt from '../../utils/jwt'

export async function GET() {
  try {
    const headersInstance = headers()
    const authHeader = (await headersInstance).get('authorization')
    const token = authHeader?.split(' ')[1] || ''
    const decoded = jwt.verify(token)
    if (!decoded) {
      return NextResponse.json({
        message: 'Token expired'
      }, {
        status: HTTPStatus.NOT_ACCEPTABLE
      })
    } else if (((decoded as unknown as JwtPayload).exp as number) < Math.floor(Date.now() / 1000)) {
      return NextResponse.json({
        message: 'Token expired'
      }, {
        status: HTTPStatus.NOT_ACCEPTABLE
      })
    } else {
      return NextResponse.json({
        message: 'User accepted',
        user: ((decoded as unknown as JwtPayload).userId as unknown as string)
      }, {
        status: HTTPStatus.OK
      })
    }
  } catch (e) {
    console.error(e)
    return NextResponse.json({
        message: 'Unauthorized'
      }, {
        status: HTTPStatus.UNAUTHORIZED
      })
  }
}