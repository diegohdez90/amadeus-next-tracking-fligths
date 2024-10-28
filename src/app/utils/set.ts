import { cookies } from 'next/headers'

export default async function setCookie(jwt: string) {
  (await cookies()).set('token', jwt as string)
}
