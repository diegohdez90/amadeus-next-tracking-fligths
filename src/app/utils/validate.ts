import { cookies } from 'next/headers'
import { JwtPayload } from 'jsonwebtoken'
import * as jwt from '../utils/jwt'
import client from '../../prisma/client'
import dotenv from 'dotenv'

dotenv.config()

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export default async function validateUser() {
  try {
    const myCookies = await cookies()
    const token = myCookies.get('token')
    
    if (!token) return null
    const decoded = jwt.verify(token.value)
    
    if (!decoded) {
      // Call the API to perform 
      try {
        const res = await fetch(`${baseUrl}/api/logout`, { method: 'GET' });
        
        return null

      } catch (error) {
        console.error('Error calling logout API:', error);
      }
    }
    const payload = decoded as unknown as JwtPayload
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