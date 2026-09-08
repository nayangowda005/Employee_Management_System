import { useEffect, useState } from 'react'
import { CalendarDays, Check, Plus, X } from 'lucide-react'
import api from './services/api'

const initialForm = { start_date: '', end_date: '', reason: '' }

export default function LeavePage() {
  const isAdmin = JSON.parse(localStorage.getItem('peopleos_user') || 'null')?.role === 'ADMIN'
  const [requests, setRequests] = useState([])
  const [form, setForm] = useState(initialForm)
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function loadRequests() {
    setState('loading')
    api.get('/leaves/')
      .then(response => { setRequests(response.data); setState('ready') })
      .catch(() => { setError('Sign in with an approved account to view leave requests.'); setState('error') })
  }

  useEffect(() => { loadRequests() }, [])

  async function submit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    try {
      await api.post('/leaves/', form)
      setForm(initialForm)
      setMessage('Leave request submitted for review.')
      loadRequests()
    } catch (requestError) {
      const details = requestError.response?.data
      setError(typeof details === 'string' ? details : details?.end_date || details?.detail || 'Unable to submit this request.')
    }
  }

  async function review(id, action) {
    setError('')
    try {
      await api.post(`/leaves/${id}/${action}/`)
      setMessage(`Leave request ${action}d.`)
      loadRequests()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to review this request.')
    }
  }

  return <>
    <div className="page-heading"><div><p className="eyebrow">Time away</p><h1>{isAdmin ? 'Leave requests' : 'Leave management'}</h1><p className="muted">{isAdmin ? 'Review leave requests from your employees.' : 'Keep time away visible, fair, and easy to review.'}</p></div>{!isAdmin && <button className="primary-button" onClick={() => document.getElementById('leave-form')?.scrollIntoView({ behavior: 'smooth' })}><Plus size={15} /> Apply for leave</button>}</div>
    {message && <p className="success-message">{message}</p>}
    {error && <p className="error-message">{error}</p>}
    <div className="leave-grid">
      {!isAdmin && <section className="panel" id="leave-form"><div className="panel-heading"><div><h2>Apply for leave</h2><p className="muted">Send a request to your people team.</p></div><CalendarDays size={20} color="#167c78" /></div><form onSubmit={submit} className="leave-form"><label>Start date<input type="date" value={form.start_date} onChange={event => setForm({ ...form, start_date: event.target.value })} required /></label><label>End date<input type="date" value={form.end_date} onChange={event => setForm({ ...form, end_date: event.target.value })} required /></label><label className="full-field">Reason<textarea value={form.reason} onChange={event => setForm({ ...form, reason: event.target.value })} placeholder="Tell us briefly why you are away" required /></label><button className="primary-button" type="submit">Submit request <span>→</span></button></form></section>}
      <section className="panel"><div className="panel-heading"><div><h2>Request history</h2><p className="muted">Your recent leave activity</p></div><span className="badge pending">{requests.length} total</span></div>{state === 'loading' && <p className="muted table-message">Loading requests...</p>}{state === 'ready' && requests.length === 0 && <p className="muted table-message">No leave requests yet.</p>}{state === 'ready' && requests.length > 0 && <div className="leave-list">{requests.map(request => <div className="leave-item" key={request.id}><div className="date-block"><strong>{new Date(`${request.start_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong><small>to {new Date(`${request.end_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</small></div><div className="leave-detail"><strong>{request.employee_name || 'My request'}</strong><small>{request.reason}</small></div><span className={`badge ${request.status === 'APPROVED' ? 'active-badge' : request.status === 'REJECTED' ? 'leave-badge rejected' : 'pending'}`}>{request.status}</span>{request.status === 'PENDING' && <div className="review-actions"><button title="Approve" onClick={() => review(request.id, 'approve')}><Check size={14} /></button><button title="Reject" onClick={() => review(request.id, 'reject')}><X size={14} /></button></div>}</div>)}</div>}</section>
    </div>
  </>
}
