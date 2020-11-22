import { createContext, useEffect, useState } from 'react'
import { STATUS } from '../types/common'

const authContext = createContext<any>({})
const { Provider } = authContext

interface User {
  role: string
  authenticated: boolean
  id: string
}

const AuthService = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [authStatus, setStatus] = useState<STATUS>(STATUS.LOADING)

  // Load initial auth data
  useEffect(() => {
    authenticate()
  }, [])

  // authenticate validates a token/email set and returns permissions
  const authenticate = async () => {
    setStatus(STATUS.LOADING)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/authenticate`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      })
      const data = await res.json()

      if (data.status === 'Success') {
        setUser(data.user)
        setStatus(STATUS.DEFAULT)
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      console.log(e)
      setStatus(STATUS.ERROR)
    }
  }

  const signup = async (req: { name: string; email: string; password: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
      })
      const data = await res.json()
      if (data.status === 'Success') {
        setUser(data.user)
        return data.status
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      return e.message
    }
  }

  const login = async (req: { email: string; password: string }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(req),
      })

      const data = await res.json()
      if (data.status === 'Success') {
        setUser(data.user)
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
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({}),
      })
    } catch (e) {
      console.error(e.message)
    } finally {
      setUser(null)
    }
  }

  const updatePassword = async ({ password, currPassword }) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/updatePassword`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ password, currPassword }),
      })
      const data = await res.json()

      if (data.status === 'Success') {
        return data.status
      } else {
        throw new Error(data.message)
      }
    } catch (e) {
      return e.message
    }
  }

  return (
    <Provider
      value={{
        // Methods
        signup,
        login,
        logout,
        updatePassword,
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
