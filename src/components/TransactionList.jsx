import { useState } from 'react'
import '../styles/TransactionList.scss'

function TransactionList({ transactions, type, onUpdate }) {
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este registro?')) return

    try {
      const token = localStorage.getItem('token')
      const endpoint = type === 'venta' ? '/ventas' : '/gastos'
      
      const response = await fetch(`http://localhost:3001${endpoint}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const startEdit = (transaction) => {
    setEditingId(transaction.id)
    setEditData({
      fecha: transaction.fecha.split('T')[0],
      categoria: transaction.categoria,
      monto: transaction.monto,
      descripcion: transaction.descripcion || ''
    })
  }

  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token')
      const endpoint = type === 'venta' ? '/ventas' : '/gastos'
      
      const response = await fetch(`http://localhost:3001${endpoint}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      })

      if (response.ok) {
        setEditingId(null)
        setEditData({})
        onUpdate()
      }
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="transaction-list">
      <h2>Listado de {type === 'venta' ? 'Ventas' : 'Gastos'}</h2>
      
      {transactions.length === 0 ? (
        <p className="empty-message">No hay registros para mostrar</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Monto</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  {editingId === transaction.id ? (
                    <>
                      <td>
                        <input
                          type="date"
                          value={editData.fecha}
                          onChange={(e) => setEditData({...editData, fecha: e.target.value})}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editData.categoria}
                          onChange={(e) => setEditData({...editData, categoria: e.target.value})}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editData.monto}
                          onChange={(e) => setEditData({...editData, monto: e.target.value})}
                          step="0.01"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editData.descripcion}
                          onChange={(e) => setEditData({...editData, descripcion: e.target.value})}
                        />
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="save-btn" 
                            onClick={() => handleUpdate(transaction.id)}
                          >
                            💾
                          </button>
                          <button 
                            className="cancel-btn" 
                            onClick={cancelEdit}
                          >
                            ✖️
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{new Date(transaction.fecha).toLocaleDateString('es-AR')}</td>
                      <td>{transaction.categoria}</td>
                      <td className="amount">${parseFloat(transaction.monto).toFixed(2)}</td>
                      <td>{transaction.descripcion || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="edit-btn" 
                            onClick={() => startEdit(transaction)}
                          >
                            ✏️
                          </button>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDelete(transaction.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransactionList
