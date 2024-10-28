import HTTPStatus from 'http-status-codes';
import client from '../../../prisma/client'
import * as pwd from '../../utils/password'
import * as jwt from '../../utils/jwt';
import { NextRequest, NextResponse } from 'next/server';


type Body = {
  username: string
  password: string
}

export async function POST(
  req: NextRequest,
) {
  const body: Body = await req.json()
  
  const {
    username,
    password
  } = body
  try {

    const user = await client.user.findFirst({
      where: {
        username: username
      }
    })

    if (!user) {
      return NextResponse.json({
        message: 'User not found',
      }, {
        status: HTTPStatus.NOT_FOUND
      })
    }
    const matched = pwd.decrypt(user.password, password)

    if (!matched) {
      return NextResponse.json({
        message: 'Authentication falied. Password did not match',
      }, {
        status: HTTPStatus.FORBIDDEN
      })
    }
    const token = jwt.sign(user.id as string)
    return NextResponse.json({
      message: 'User created',
      data: user?.id,
      jwt: token
    }, {
      status: HTTPStatus.CREATED
    })
  } catch (e) {
    return NextResponse.json({
      message: new String(e),
    }, {
      status: HTTPStatus.BAD_REQUEST
    })
  }
}