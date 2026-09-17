import { useEffect, useState } from 'react'
import { CalendarDays, ClipboardCheck, FileText, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from './services/api'

const cards = [
  ['total_employees', 'Total employees', 'coral', Users, '/people'],
  ['employees_on_leave_today', 'On leave today', 'teal', CalendarDays, '/leave'],
  ['present_today', 'Present today', 'blue', ClipboardCheck, '/attendance'],
  ['pending_leave_approvals', 'Pending approvals', 'gold', FileText, '/leave'],
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const currentUser = JSON.parse(localStorage.getItem('peopleos_user') || 'null')
  const name = currentUser?.first_name?.trim() || currentUser?.username || 'there'
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(now).toUpperCase()

  useEffect(() => {
    api.get('/dashboard/admin/')
      .then(response => setStats(response.data))
      .catch(() => setError('Sign in as an admin to load live dashboard statistics.'))
  }, [])

  return <>
    <div className="page-heading">
      <div>
        <p className="eyebrow">{currentDate}</p>
        <h1>{greeting}, {name}</h1>
        <p className="muted">Here is what is happening across your workspace.</p>
      </div>
      <button className="primary-button" onClick={() => navigate('/leave')}>+ Create workflow</button>
    </div>

    {error && <p className="error-message">{error}</p>}

    <section className="metric-grid">
      {cards.map(([key, label, tone, Icon, path]) => <button
        className={`metric-card ${tone} metric-card-button`}
        key={key}
        onClick={() => navigate(path)}
      >
        <div className="metric-top"><span className="metric-icon"><Icon size={19} /></span><span className="metric-arrow">↗</span></div>
        <strong>{stats ? stats[key] : '--'}</strong>
        <span>{label}</span>
        <small>{stats ? 'View details' : 'Loading statistics...'}</small>
      </button>)}
    </section>

    <section className="dashboard-grid">
      <article className="panel">
        <div className="panel-heading"><div><h2>Workspace pulse</h2><p className="muted">Current operational totals</p></div></div>
        <div className="stat-list">
          {[['total_departments', 'Departments'], ['pending_employee_approvals', 'Employee approvals'], ['approved_leaves', 'Approved leaves'], ['pending_payrolls', 'Pending payrolls'], ['total_announcements', 'Announcements']].map(([key, label]) => <div className="stat-row" key={key}><span>{label}</span><strong>{stats ? stats[key] : '--'}</strong></div>)}
        </div>
      </article>
      <article className="panel">
        <div className="panel-heading"><div><h2>Next actions</h2><p className="muted">Keep the team moving</p></div></div>
        <button className="approval-item action-row" onClick={() => navigate('/leave')}><div className="avatar peach">LV</div><div><strong>Review leave requests</strong><small>{stats ? stats.pending_leave_approvals : '--'} pending requests</small></div></button>
        <button className="approval-item action-row" onClick={() => navigate('/payroll')}><div className="avatar mint">PY</div><div><strong>Check payroll queue</strong><small>{stats ? stats.pending_payrolls : '--'} payroll records pending</small></div></button>
        <button className="approval-item action-row" onClick={() => navigate('/announcements')}><div className="avatar sky">AN</div><div><strong>Share the latest update</strong><small>{stats ? stats.total_announcements : '--'} announcements published</small></div></button>
      </article>
    </section>
  </>
}
