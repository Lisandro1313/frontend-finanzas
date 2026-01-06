import { useState, useEffect } from 'react'
import Chart from './Chart'
import TransactionForm from './TransactionForm'
import TransactionList from './TransactionList'
import '../styles/Dashboard.scss'

function Dashboard({ user, onLogout }) {
  const [ventas, setVentas] = useState([])
  const [gastos, setGastos] = useState([])
  const [periodo, setPeriodo] = useState('mes')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [periodo])

  const fetchData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const headers = {
        'Authorization': `Bearer ${token}`
      }

      const [ventasRes, gastosRes] = await Promise.all([
        fetch(`http://localhost:3001/ventas?periodo=${periodo}`, { headers }),
        fetch(`http://localhost:3001/gastos?periodo=${periodo}`, { headers })
      ])

      if (ventasRes.ok && gastosRes.ok) {
        const ventasData = await ventasRes.json()
        const gastosData = await gastosRes.json()
        setVentas(ventasData)
        setGastos(gastosData)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.monto), 0)
  const totalGastos = gastos.reduce((sum, g) => sum + parseFloat(g.monto), 0)
  const balance = totalVentas - totalGastos

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-small">DF</div>
          <div>
            <h1>Dashboard Finanzas</h1>
            {user && <span className="user-name">Hola, {user.nombre}</span>}
          </div>
        </div>
        <div className="header-right">
          <select 
            value={periodo} 
            onChange={(e) => setPeriodo(e.target.value)}
            className="period-select"
          >
            <option value="dia">Hoy</option>
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
            <option value="año">Este año</option>
          </select>
          <button onClick={onLogout} className="logout-btn">Salir</button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          <span className="nav-icon">▣</span>
          Resumen
        </button>
        <button 
          className={activeTab === 'ventas' ? 'active' : ''} 
          onClick={() => setActiveTab('ventas')}
        >
          <span className="nav-icon">↗</span>
          Ventas
        </button>
        <button 
          className={activeTab === 'gastos' ? 'active' : ''} 
          onClick={() => setActiveTab('gastos')}
        >
          <span className="nav-icon">↘</span>
          Gastos
        </button>
      </nav>

      <div className="dashboard-content">
        {loading ? (
          <div className="loading">Cargando datos...</div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <div className="dashboard-view">
                <div className="stats-cards">
                  <div className="stat-card ventas">
                    <h3>Ventas</h3>
                    <p className="amount">${totalVentas.toFixed(2)}</p>
                    <span className="count">{ventas.length} registros</span>
                  </div>
                  <div className="stat-card gastos">
                    <h3>Gastos</h3>
                    <p className="amount">${totalGastos.toFixed(2)}</p>
                    <span className="count">{gastos.length} registros</span>
                  </div>
                  <div className={`stat-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
                    <h3>Balance</h3>
                    <p className="amount">${balance.toFixed(2)}</p>
                    <span className="status">{balance >= 0 ? '✓ Positivo' : '✗ Negativo'}</span>
                  </div>
                </div>

                <div className="charts-container">
                  <Chart ventas={ventas} gastos={gastos} periodo={periodo} />
                </div>
              </div>
            )}

            {activeTab === 'ventas' && (
              <div className="transactions-view">
                <TransactionForm type="venta" onSuccess={fetchData} />
                <TransactionList 
                  transactions={ventas} 
                  type="venta" 
                  onUpdate={fetchData}
                />
              </div>
            )}

            {activeTab === 'gastos' && (
              <div className="transactions-view">
                <TransactionForm type="gasto" onSuccess={fetchData} />
                <TransactionList 
                  transactions={gastos} 
                  type="gasto" 
                  onUpdate={fetchData}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Dashboard
