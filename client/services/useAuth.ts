import { useContext } from 'react'
import { authContext } from './AuthService'

const useAuth = () => {
  const ctxt = useContext(authContext)

  if (!ctxt) {
    throw Error('The `useAuth` hook must be called from a descendent of the `AuthService`.')
  }

  return ctxt
}

export default useAuth
