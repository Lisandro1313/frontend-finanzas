import { useState } from 'react'
import '../styles/Login.scss'

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register'
      const response = await fetch(`${import.meta.env.VITE_API_AUTH_URL || 'http://localhost:3002'}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        if (!isLogin) {
          setSuccess('Usuario creado exitosamente!')
          setTimeout(() => {
            onLoginSuccess(data.token)
          }, 1500)
        } else {
          onLoginSuccess(data.token)
        }
      } else {
        setError(data.error || 'Error al procesar la solicitud')
      }
    } catch (err) {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">DF</div>
          <h1>Dashboard Finanzas</h1>
          <p>Gestiona tus ventas y gastos de manera eficiente</p>
        </div>

        <div className="login-tabs">
          <button 
            className={isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(true)}
          >
            Iniciar Sesión
          </button>
          <button 
            className={!isLogin ? 'active' : ''} 
            onClick={() => setIsLogin(false)}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Juan Pérez"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Procesando...' : (isLogin ? 'Entrar' : 'Crear cuenta')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
