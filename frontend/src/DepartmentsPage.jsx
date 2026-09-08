import { useEffect, useState } from 'react'
import { BriefcaseBusiness, Plus, Trash2 } from 'lucide-react'
import api from './services/api'

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [state, setState] = useState('loading')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function load() {
    setState('loading')
    api.get('/departments/').then(response => { setDepartments(response.data); setState('ready') }).catch(() => { setError('Sign in as an admin to manage departments.'); setState('error') })
  }

  useEffect(() => { load() }, [])

  async function create(event) {
    event.preventDefault()
    setError('')
    try {
      await api.post('/departments/', form)
      setForm({ name: '', description: '' })
      setFormOpen(false)
      setMessage('Department created.')
      load()
    } catch (requestError) {
      setError(requestError.response?.data?.name?.[0] || requestError.response?.data?.detail || 'Unable to create department.')
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this department?')) return
    try {
      await api.delete(`/departments/${id}/`)
      setMessage('Department deleted.')
      load()
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to delete department.')
    }
  }

  return <><div className="page-heading"><div><p className="eyebrow">Team structure</p><h1>Departments</h1><p className="muted">Organize people into clear areas of ownership.</p></div><button className="primary-button" onClick={() => setFormOpen(!formOpen)}><Plus size={15} /> Add department</button></div>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}{formOpen && <section className="panel department-form"><h2>New department</h2><form onSubmit={create}><label>Name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></label><label>Description<textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label><button className="primary-button">Create department</button></form></section>}<section className="department-grid">{state === 'loading' && <p className="muted">Loading departments...</p>}{state === 'ready' && departments.length === 0 && <div className="panel empty-state"><BriefcaseBusiness size={28} /><h2>No departments yet</h2><p className="muted">Create the first department for your workspace.</p></div>}{state === 'ready' && departments.map(department => <article className="panel department-card" key={department.id}><div className="department-icon"><BriefcaseBusiness size={19} /></div><div><h2>{department.name}</h2><p>{department.description || 'No description provided.'}</p><small>{department.employee_count || 0} employees</small></div><button className="delete-button" onClick={() => remove(department.id)} title="Delete department"><Trash2 size={16} /></button></article>)}</section></>
}
