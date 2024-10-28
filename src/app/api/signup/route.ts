import HTTPStatus from 'http-status-codes';
import client from '../../../prisma/client'
import * as pwd from '../../utils/password'
import * as jwt from '../../utils/jwt';
import { NextRequest, NextResponse } from 'next/server';
import setCookie from '@/app/utils/set';


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
    const hash = pwd.encrypt(password)
    const result = await client.user.create({
      data: {
        username: username,
        password: hash
      }
    })
    const token = jwt.sign(result.id)
    await setCookie(token)
    return NextResponse.json({
      message: 'User created',
      data: result.id,
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