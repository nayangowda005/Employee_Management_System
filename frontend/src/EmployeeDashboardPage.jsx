import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, ClipboardCheck, FileText, Megaphone, WalletCards } from 'lucide-react'
import api from './services/api'

const cards = [
  ['pending_leave_requests', 'Pending leave', 'gold', CalendarDays, '/leave'],
  ['approved_leaves', 'Approved leaves', 'teal', ClipboardCheck, '/leave'],
  ['attendance_this_month', 'Attendance this month', 'blue', ClipboardCheck, '/attendance'],
  ['announcements', 'Announcements', 'coral', Megaphone, '/announcements'],
]

export default function EmployeeDashboardPage() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/dashboard/employee/').then(response => setStats(response.data)).catch(() => setError('Unable to load your employee dashboard.'))
  }, [])

  return <><div className="page-heading"><div><p className="eyebrow">Your workspace</p><h1>Welcome back</h1><p className="muted">Here is your personal work and time-away summary.</p></div><WalletCards size={25} color="#167c78" /></div>{error && <p className="error-message">{error}</p>}<section className="metric-grid">{cards.map(([key, label, tone, Icon, path]) => <Link className={`metric-card ${tone} metric-card-link`} to={path} key={key}><div className="metric-top"><span className="metric-icon"><Icon size={22} /></span><span className="metric-arrow">↗</span></div><strong>{stats ? stats[key] : '--'}</strong><span>{label}</span><small>{stats ? 'Open details' : 'Loading summary...'}</small></Link>)}</section><section className="dashboard-grid"><article className="panel"><div className="panel-heading"><div><h2>Leave summary</h2><p className="muted">Your requests stay private to you</p></div></div><div className="stat-list"><div className="stat-row"><span>Pending requests</span><strong>{stats ? stats.pending_leave_requests : '--'}</strong></div><div className="stat-row"><span>Approved leaves</span><strong>{stats ? stats.approved_leaves : '--'}</strong></div><div className="stat-row"><span>Rejected leaves</span><strong>{stats ? stats.rejected_leaves : '--'}</strong></div></div></article><Link className="panel panel-link" to="/payroll"><div className="panel-heading"><div><h2>Your payslips</h2><p className="muted">Payroll records available to you</p></div></div><div className="employee-summary"><FileText size={22} color="#167c78" /><div><strong>{stats ? stats.payslips : '--'} payslips available</strong><small>Open Payroll to view your records.</small></div></div></Link></section></>
}
