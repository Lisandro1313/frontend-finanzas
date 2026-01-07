import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import './styles/App.scss'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      fetchUserData()
    } else {
      localStorage.removeItem('token')
      setUser(null)
    }
  }, [token])

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_AUTH_URL || 'http://localhost:3002'}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.usuario)
      } else {
        setToken(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      setToken(null)
    }
  }

  const handleLogout = () => {
    setToken(null)
    setUser(null)
  }

  if (!token) {
    return <Login onLoginSuccess={setToken} />
  }

  return (
    <div className="app">
      <Dashboard user={user} onLogout={handleLogout} />
    </div>
  )
}

export default App
