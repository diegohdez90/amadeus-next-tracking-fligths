import { cookies } from 'next/headers'
import { JwtPayload } from 'jsonwebtoken'
import * as jwt from '../utils/jwt'
import client from '../../prisma/client'

export default async function validateUser() {
  try {
    const token = (await cookies()).get('token')?.value

    if (!token) return null
    const decoded = jwt.verify(token)

    if (!decoded) return null

    const payload = decoded as unknown as JwtPayload
    console.log(payload)
    const { userId } = payload
    const user = await client.user.findFirst({
      where: {
        id: userId
      }
    })
    return user?.username
  } catch(e) {
    console.error(e)
    return null
  }
}