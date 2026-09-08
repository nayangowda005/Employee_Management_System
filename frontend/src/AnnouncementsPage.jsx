import { useEffect, useState } from 'react'
import { Megaphone, Plus, Trash2 } from 'lucide-react'
import api from './services/api'

export default function AnnouncementsPage() {
  const currentUser = JSON.parse(localStorage.getItem('peopleos_user') || 'null')
  const isAdmin = currentUser?.role === 'ADMIN'
  const [items, setItems] = useState([])
  const [state, setState] = useState('loading')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', announcement_date: new Date().toISOString().slice(0, 10) })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function load() {
    setState('loading')
    api.get('/announcements/').then(response => { setItems(response.data); setState('ready') }).catch(() => { setError('Sign in to view announcements.'); setState('error') })
  }

  useEffect(() => { load() }, [])

  async function create(event) {
    event.preventDefault()
    try {
      await api.post('/announcements/', form)
      setForm({ title: '', content: '', announcement_date: new Date().toISOString().slice(0, 10) })
      setFormOpen(false)
      setMessage('Announcement published.')
      load()
    } catch (requestError) { setError(requestError.response?.data?.detail || 'Only admins can publish announcements.') }
  }

  async function remove(id) {
    if (!window.confirm('Delete this announcement?')) return
    try { await api.delete(`/announcements/${id}/`); setMessage('Announcement deleted.'); load() } catch { setError('Only admins can delete announcements.') }
  }

  return <><div className="page-heading"><div><p className="eyebrow">Keep everyone aligned</p><h1>Announcements</h1><p className="muted">A shared channel for the updates that matter.</p></div>{isAdmin && <button className="primary-button" onClick={() => setFormOpen(!formOpen)}><Plus size={15} /> New announcement</button>}</div>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}{isAdmin && formOpen && <section className="panel announcement-form"><div className="panel-heading"><div><h2>New announcement</h2><p className="muted">Share an update with your whole team.</p></div></div><form onSubmit={create}><label>Title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required /></label><label>Announcement date<input type="date" value={form.announcement_date} onChange={event => setForm({ ...form, announcement_date: event.target.value })} required /></label><label>Content<textarea value={form.content} onChange={event => setForm({ ...form, content: event.target.value })} required /></label><button className="primary-button">Publish update</button></form></section>}<section className="announcement-feed">{state === 'loading' && <p className="muted table-message">Loading announcements...</p>}{state === 'ready' && items.length === 0 && <div className="panel empty-state"><Megaphone size={28} /><h2>No announcements yet</h2><p className="muted">Team updates will appear here.</p></div>}{state === 'ready' && items.map(item => <article className="panel announcement-item" key={item.id}><div className="announcement-icon"><Megaphone size={18} /></div><div className="announcement-body"><div className="announcement-meta"><span>{new Date(`${item.announcement_date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><span>By {item.created_by_name}</span></div><h2>{item.title}</h2><p>{item.content}</p></div>{isAdmin && <button className="delete-button" title="Delete announcement" onClick={() => remove(item.id)}><Trash2 size={16} /></button>}</article>)}</section></>
}
