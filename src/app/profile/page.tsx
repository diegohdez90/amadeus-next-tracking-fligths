'use client'
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
export default function Page() {
  const router = useRouter()

  const [loading, setLoading ]= useState(true)

  useEffect(() => {
    const token = Cookies.get('token')
    if (!token) {
      router.replace('/')
      return;
    }

    const validateToken = async () => {
      try {
        const res = await fetch('/api/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Token validation failed')

        setLoading(false)
      } catch(e) {
        console.error(e)
        router.replace('/')
      }
    }
    validateToken()
  }, [router])

  if (loading) {
    return <h1>Loading page</h1>
  }
  return <h1>My profile</h1>
}