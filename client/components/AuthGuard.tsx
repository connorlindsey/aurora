import { useRouter } from 'next/router'
import React, { FunctionComponent } from 'react'
import useAuth from '../services/useAuth'
import { STATUS } from '../types/common'

interface AuthGuardProps {
  requiredRole?: string
}

const AuthGuard: FunctionComponent<AuthGuardProps> = ({ requiredRole, children }) => {
  const { user, authStatus } = useAuth()
  const router = useRouter()

  if (authStatus === STATUS.LOADING) {
    return <div>Loading...</div>
  }
  if (!user || user.authenticated === false) {
    typeof window !== 'undefined' && router.replace('/login')
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log('Auth guard insufficient permissions')
    return (
      <div>
        <h2>You don't have access to this page.</h2>
        <span onClick={() => router.back()} style={{ cursor: 'pointer' }}>
          Click here to go back
        </span>
      </div>
    )
  }

  if (user?.authenticated) {
    return <>{children}</>
  }

  return <div>Error</div>
}

export default AuthGuard
