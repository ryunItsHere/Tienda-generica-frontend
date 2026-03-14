import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

function getRolFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.rol ?? null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser  = localStorage.getItem('user')
    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser)
      // Si no tiene rol guardado, lo lee del token
      if (!parsedUser.rol) {
        parsedUser.rol = getRolFromToken(storedToken)
        localStorage.setItem('user', JSON.stringify(parsedUser))
      }
      setToken(storedToken)
      setUser(parsedUser)
    }
    setLoading(false)
  }, [])

  const login = (tokenVal, username, rol) => {
    // Si el backend no devuelve rol, lo lee del token
    const rolFinal = rol ?? getRolFromToken(tokenVal)
    const userData = { username, rol: rolFinal }
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(tokenVal)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = () => user?.rol === 'ADMIN'

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)