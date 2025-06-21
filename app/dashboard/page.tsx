'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      router.push('/signin')
      return
    }

    const parsed = JSON.parse(user)
    if (parsed.role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/user')
    }
  }, [])

  return <p className="p-4">Redirecting...</p>
}
