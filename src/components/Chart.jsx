import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import '../styles/Chart.scss'

function Chart({ ventas, gastos, periodo }) {
  // Agrupar datos por fecha
  const groupByDate = (transactions) => {
    const grouped = {}
    transactions.forEach(t => {
      const fecha = new Date(t.fecha).toLocaleDateString('es-AR')
      if (!grouped[fecha]) {
        grouped[fecha] = 0
      }
      grouped[fecha] += parseFloat(t.monto)
    })
    return grouped
  }

  const ventasAgrupadas = groupByDate(ventas)
  const gastosAgrupados = groupByDate(gastos)

  // Combinar todas las fechas
  const todasFechas = new Set([
    ...Object.keys(ventasAgrupadas),
    ...Object.keys(gastosAgrupados)
  ])

  const chartData = Array.from(todasFechas).sort().map(fecha => ({
    fecha,
    ventas: ventasAgrupadas[fecha] || 0,
    gastos: gastosAgrupados[fecha] || 0
  }))

  return (
    <div className="chart-container">
      <h2>Evolución de Ventas y Gastos</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha" />
          <YAxis />
          <Tooltip 
            formatter={(value) => `$${value.toFixed(2)}`}
            labelStyle={{ color: '#333' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="ventas" 
            stroke="#10b981" 
            strokeWidth={2}
            name="Ventas"
          />
          <Line 
            type="monotone" 
            dataKey="gastos" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Gastos"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart
