import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'
import useAuth from '../services/useAuth'
import { STATUS } from '../types/common'

interface AuthGuardProps {
  level?: string
}

const AuthGuard: FunctionComponent<AuthGuardProps> = ({ level, children }) => {
  const { user, status: authStatus } = useAuth()
  const router = useRouter()

  const [status, setStatus] = useState<STATUS>(STATUS.DEFAULT)
  // TODO: Handle level
  // TODO: Fix this redirecting before authentication is done being validated
  useEffect(() => {
    if (!user?.authenticated && authStatus !== STATUS.LOADING) {
      console.log('Redirecting from auth Guard')
      console.log('user', user)
      router.replace('/login')
    } else {
      console.log('Logged in')
    }
  }, [user, authStatus])

  if (status === STATUS.LOADING) {
    return <div></div>
  }

  if (status === STATUS.ERROR) {
    return <div>Error</div>
  }

  return <>{children}</>
}

export default AuthGuard
