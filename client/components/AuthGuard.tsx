import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'

interface AuthGuardProps {
  level?: string
}

const AuthGuard: FunctionComponent<AuthGuardProps> = ({ level, children }) => {
  const router = useRouter()

  const [status, setStatus] = useState('DEFAULT')
  useEffect(() => {
    const validatePermissions = async () => {
      setStatus('LOADING')
      try {
        const token = localStorage.getItem('TOKEN')
        const email = localStorage.getItem('ACCOUNT')

        if (!token || !email) router.replace('/login')
        // 1. Check if token is valid and user has permissions
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/session`, {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            email,
            level: level ? level : null,
          }),
        })
        if (res.status !== 200) {
          router.replace('/login')
          return
        }
        setStatus('DEFAULT')
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message)
          router.replace('/login')
        }
        setStatus('ERROR')
      }
    }
    validatePermissions()
  }, [])

  if (status === 'LOADING') {
    return <div></div>
  }

  if (status === 'ERROR') {
    return <div>Error</div>
  }

  return <>{children}</>
}

export default AuthGuard
