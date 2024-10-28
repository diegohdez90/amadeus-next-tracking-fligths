'use client'
import { useRouter } from "next/navigation"
import React, { useState } from "react"

export default function Page() {

  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      })

      if (!response.ok) throw new Error('Failed')

      const {
        jwt
      } = await response.json()

      document.cookie = `token=${jwt}; path=/`
      router.push('/home')
    } catch(e) {
      console.error(e)
    }
  }

  return (<div>
      <form onSubmit={handleSignUp}>
        <label>
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <label>
          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={e => setPassword(e.target.value)}/>
        </label>
        <input type="submit" value='Login' disabled={submitted} />
      </form>
    </div>)
}

