import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'
import api from './services/api'

export default function AttendancePage() {
  const isAdmin = JSON.parse(localStorage.getItem('peopleos_user') || 'null')?.role === 'ADMIN'
  const [records, setRecords] = useState([])
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function loadRecords() {
    setState('loading')
    api.get('/attendance/')
      .then(response => { setRecords(response.data); setState('ready') })
      .catch(() => { setError('Sign in with an approved account to view attendance.'); setState('error') })
  }

  useEffect(() => { loadRecords() }, [])

  async function clock(action) {
    setError('')
    setMessage('')
    try {
      await api.post(`/attendance/clock-${action}/`)
      setMessage(action === 'in' ? 'Clocked in successfully.' : 'Clocked out successfully.')
      loadRecords()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to update attendance.')
    }
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Daily rhythm</p><h1>{isAdmin ? 'Employee attendance' : 'My attendance'}</h1><p className="muted">{isAdmin ? 'Review employee clock-in and clock-out history.' : 'Keep your working day accurate and up to date.'}</p></div><Clock3 size={25} color="#167c78" /></div>
    {message && <p className="success-message">{message}</p>}
    {error && <p className="error-message">{error}</p>}
    {!isAdmin && <section className="attendance-actions"><button className="primary-button clock-in" onClick={() => clock('in')}>Clock in</button><button className="secondary-button clock-out" onClick={() => clock('out')}>Clock out</button></section>}
    <section className="panel table-panel"><div className="panel-heading"><div><h2>Attendance history</h2><p className="muted">{isAdmin ? 'All employee attendance records' : 'Your recent clock activity'}</p></div></div>{state === 'loading' && <p className="muted table-message">Loading attendance...</p>}{state === 'ready' && records.length === 0 && <p className="muted table-message">No attendance records yet.</p>}{state === 'ready' && records.length > 0 && <div className="table-wrap"><table><thead><tr>{isAdmin && <th>Employee</th>}<th>Date</th><th>Clock in</th><th>Clock out</th></tr></thead><tbody>{records.map(record => <tr key={record.id}>{isAdmin && <td>{record.employee_name}</td>}<td>{new Date(`${record.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td><td>{record.clock_in ? new Date(record.clock_in).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '--'}</td><td>{record.clock_out ? new Date(record.clock_out).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : '--'}</td></tr>)}</tbody></table></div>}</section>
  </>
}
