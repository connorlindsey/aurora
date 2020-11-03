import { createContext, useEffect, useState } from 'react'
import { STATUS } from '../types/common'

const authContext = createContext<any>({})
const { Provider } = authContext

interface User {
  role: string
  authenticated: boolean
}

const AuthService = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [authStatus, setStatus] = useState<STATUS>(STATUS.DEFAULT)

  // Load initial auth data
  useEffect(() => {
    authenticate()
  }, [])

  // authenticate validates a token/email set and returns permissions
  const authenticate = async () => {
    console.log('Authenticating')
    setStatus(STATUS.LOADING)
    // 1. Get ACCOUNT and TOKEN
    const token = localStorage.getItem('TOKEN')
    const email = localStorage.getItem('ACCOUNT')

    // 2. Validate with backend
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      })
      const data = await res.json()

      if (data.status === 'Success') {
        console.log('data', data)
        setUser(data.user)
        console.log('Done authenticating')
        console.log('user in service', user)
        setStatus(STATUS.DEFAULT)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      console.error(e)
      setStatus(STATUS.ERROR)
    }
  }

  // signup creates a new user account
  const signup = async (req: { name: string; email: string; password: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
      const data = await res.json()
      if (data.status === 'Success') {
        localStorage.setItem('TOKEN', data.token)
        localStorage.setItem('ACCOUNT', req.email)
        await authenticate()
        return data.status
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      return e.message
    }
  }

  const login = async (req: { email: string; password: string }) => {
    console.log('Login')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
      const data = await res.json()
      if (data.status === 'Success') {
        localStorage.setItem('TOKEN', data.token)
        localStorage.setItem('ACCOUNT', req.email)
        await authenticate()
        return data.status
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      return e.message
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('TOKEN')
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      localStorage.removeItem('TOKEN')
      localStorage.removeItem('ACCOUNT')
      setUser(null)
    } catch (e) {
      console.error(e.message)

      // Just log them out of the client anyways. The token will be cleaned up later
      localStorage.removeItem('TOKEN')
      localStorage.removeItem('ACCOUNT')
      setUser(null)
    }
  }

  return (
    <Provider
      value={{
        // Methods
        signup,
        login,
        logout,
        //Data
        user,
        authStatus,
      }}
    >
      {children}
    </Provider>
  )
}

export { authContext, AuthService }
