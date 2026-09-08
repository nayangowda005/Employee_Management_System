import { useEffect, useState } from 'react'
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import api from './services/api'
import PublicPageView from './PublicPage'
import LeavePage from './LeavePage'
import AttendancePage from './AttendancePage'
import AnnouncementsPage from './AnnouncementsPage'
import PayrollPage from './PayrollPage'
import DashboardPage from './DashboardPage'
import EmployeeDashboardPage from './EmployeeDashboardPage'
import DepartmentsPage from './DepartmentsPage'
import SettingsPage from './SettingsPage'
import AdminPayrollPage from './AdminPayrollPage'
import { Bell, BriefcaseBusiness, CalendarDays, ChevronDown, ClipboardCheck, Clock3, DollarSign, FileText, LayoutDashboard, Menu, Megaphone, Search, Settings, Users, X } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'People', icon: Users, to: '/people', adminOnly: true },
  { label: 'Departments', icon: BriefcaseBusiness, to: '/departments', adminOnly: true },
  { label: 'Leave', icon: CalendarDays, to: '/leave' },
  { label: 'Attendance', icon: Clock3, to: '/attendance' },
  { label: 'Payroll', icon: DollarSign, to: '/payroll' },
  { label: 'Announcements', icon: Megaphone, to: '/announcements' },
]

const metrics = [
  { label: 'Total employees', value: '248', note: '+12 this quarter', tone: 'coral', icon: Users },
  { label: 'On leave today', value: '07', note: '3.2% of workforce', tone: 'teal', icon: CalendarDays },
  { label: 'Present today', value: '219', note: '88.3% attendance', tone: 'blue', icon: ClipboardCheck },
  { label: 'Pending approvals', value: '14', note: 'Needs your review', tone: 'gold', icon: FileText },
]

const employees = [
  { name: 'Mohan Kumar', role: 'Product Designer', department: 'Design', status: 'Active', initials: 'MK', color: 'peach' },
  { name: 'Sumit Verma', role: 'Backend Engineer', department: 'Engineering', status: 'Active', initials: 'SV', color: 'mint' },
  { name: 'Anika Shah', role: 'People Partner', department: 'People', status: 'On leave', initials: 'AS', color: 'lavender' },
  { name: 'Daniel Chen', role: 'Finance Analyst', department: 'Finance', status: 'Active', initials: 'DC', color: 'sky' },
]

function App() {
  return <Routes><Route path="*" element={<Application />} /></Routes>
}

function Application() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('peopleos_user') || 'null')
  const isPublic = ['/', '/about', '/contact', '/login', '/register'].includes(location.pathname)
  const authenticate = async ({ username, password }) => {
    const { data } = await api.post('/auth/login/', { username, password })
    localStorage.setItem('peopleos_access', data.access)
    localStorage.setItem('peopleos_refresh', data.refresh)
    localStorage.setItem('peopleos_user', JSON.stringify(data.user))
    navigate(data.user?.role === 'EMPLOYEE' ? '/employee/dashboard' : '/dashboard')
  }
  const register = async ({ username, email, full_name, password }) => {
    const [first_name = '', ...lastParts] = full_name.trim().split(/\s+/)
    await api.post('/auth/register/', { username, email, first_name, last_name: lastParts.join(' '), password, password_confirmation: password })
    navigate('/login')
  }
  const logout = () => {
    localStorage.removeItem('peopleos_access')
    localStorage.removeItem('peopleos_refresh')
    localStorage.removeItem('peopleos_user')
    navigate('/login')
  }

  if (isPublic) return <PublicPageView path={location.pathname} onLogin={() => navigate('/dashboard')} onAuthenticate={authenticate} onRegister={register} />

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><BriefcaseBusiness size={18} /></span><span>PeopleOS</span></div>
        <div className="workspace-switcher"><div><small>Workspace</small><strong>Northstar Labs</strong></div><ChevronDown size={16} /></div>
        <p className="nav-label">Workspace</p>
        <nav>{navItems.filter(item => !item.adminOnly || currentUser?.role === 'ADMIN').map(({ label, icon: Icon, to }) => { const target = currentUser?.role === 'EMPLOYEE' && to === '/dashboard' ? '/employee/dashboard' : to; return <NavLink key={target} to={target} onClick={() => setMobileOpen(false)} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}><Icon size={18} /><span>{label}</span>{label === 'Leave' && <span className="nav-count">4</span>}</NavLink> })}</nav>
        <div className="sidebar-bottom"><NavLink to="/settings" className="nav-link"><Settings size={18} /><span>Settings</span></NavLink><NavLink to="/settings" className="user-mini"><div className="avatar small">{currentUser?.first_name?.[0] || currentUser?.username?.[0] || 'U'}{currentUser?.last_name?.[0] || ''}</div><div><strong>{currentUser ? `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || currentUser.username : 'User'}</strong><small>{currentUser?.role === 'ADMIN' ? 'Administrator' : 'Employee'}</small></div><ChevronDown size={15} /></NavLink></div>
      </aside>
      {mobileOpen && <button className="scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
      <main className="main-area">
        <header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button><div className="topbar-spacer" /><div className="topbar-actions"><button className="icon-button" aria-label="Notifications" title="Notifications"><Bell size={19} /><span className="notification-dot" /></button><div className="avatar">{currentUser?.first_name?.[0] || currentUser?.username?.[0] || 'U'}</div><button className="logout-button" onClick={logout}>Log out</button></div></header>
        <div className="page-content"><Routes><Route path="/dashboard" element={<RoleRoute role="ADMIN"><DashboardPage /></RoleRoute>} /><Route path="/employee/dashboard" element={<RoleRoute role="EMPLOYEE"><EmployeeDashboardPage /></RoleRoute>} /><Route path="/people" element={<RoleRoute role="ADMIN"><People /></RoleRoute>} /><Route path="/departments" element={<RoleRoute role="ADMIN"><DepartmentsPage /></RoleRoute>} /><Route path="/leave" element={<RoleRoute roles={['ADMIN', 'EMPLOYEE']}><LeavePage /></RoleRoute>} /><Route path="/attendance" element={<RoleRoute roles={['ADMIN', 'EMPLOYEE']}><AttendancePage /></RoleRoute>} /><Route path="/announcements" element={<RoleRoute roles={['ADMIN', 'EMPLOYEE']}><AnnouncementsPage /></RoleRoute>} /><Route path="/payroll" element={currentUser?.role === 'ADMIN' ? <RoleRoute role="ADMIN"><AdminPayrollPage /></RoleRoute> : <RoleRoute role="EMPLOYEE"><PayrollPage /></RoleRoute>} /><Route path="/settings" element={<RoleRoute roles={['ADMIN', 'EMPLOYEE']}><SettingsPage /></RoleRoute>} /><Route path="*" element={<Placeholder />} /></Routes></div>
      </main>
    </div>
  )
}

function RoleRoute({ role, roles, children }) {
  const token = localStorage.getItem('peopleos_access')
  const user = JSON.parse(localStorage.getItem('peopleos_user') || 'null')
  const allowedRoles = roles || [role]
  if (!token || !user || !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />
  return children
}

function Dashboard() {
  return <><div className="page-heading"><div><p className="eyebrow">Tuesday, September 8, 2026</p><h1>Good morning, Alex</h1><p className="muted">Here is what is happening across your workspace.</p></div><button className="primary-button" onClick={() => alert('Create workflow coming next')}>＋ Create workflow</button></div><section className="metric-grid">{metrics.map(({ label, value, note, tone, icon: Icon }) => <article className={`metric-card ${tone}`} key={label}><div className="metric-top"><span className="metric-icon"><Icon size={19} /></span><span className="metric-arrow">↗</span></div><strong>{value}</strong><span>{label}</span><small>{note}</small></article>)}</section><section className="dashboard-grid"><article className="panel activity-panel"><div className="panel-heading"><div><h2>People overview</h2><p className="muted">Your team at a glance</p></div><Link to="/people" className="text-link">View directory →</Link></div><div className="chart"><div className="chart-y"><span>250</span><span>200</span><span>150</span><span>100</span></div><div className="bars">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'].map((month, index) => <div className="bar-group" key={month}><div className="bar" style={{ height: `${[54, 62, 59, 76, 71, 86][index]}%` }}><i /></div><small>{month}</small></div>)}</div></div></article><article className="panel approvals-panel"><div className="panel-heading"><div><h2>Needs your attention</h2><p className="muted">Requests waiting for review</p></div><span className="badge pending">4 open</span></div><div className="approval-item"><div className="avatar sky">MK</div><div><strong>Mohan requested leave</strong><small>Sep 14 – Sep 16 · Personal</small></div><button className="quiet-button">Review</button></div><div className="approval-item"><div className="avatar lavender">SV</div><div><strong>New profile to approve</strong><small>Sumit Verma · Engineering</small></div><button className="quiet-button">Review</button></div><div className="approval-item"><div className="avatar peach">AS</div><div><strong>Payroll is ready</strong><small>August 2026 · 248 payslips</small></div><button className="quiet-button">Review</button></div></article></section><section className="panel table-panel"><div className="panel-heading"><div><h2>Recently added people</h2><p className="muted">New members of the Northstar team</p></div><button className="quiet-button">View all</button></div><EmployeeTable compact /></section></>
}

function People() {
  const [people, setPeople] = useState([])
  const [state, setState] = useState('loading')

  useEffect(() => {
    api.get('/employees/')
      .then(response => { setPeople(response.data); setState('ready') })
      .catch(() => setState('error'))
  }, [])

  return <><div className="page-heading"><div><p className="eyebrow">Directory</p><h1>People</h1><p className="muted">Manage your team, roles, and access.</p></div><button className="primary-button" onClick={() => window.location.href = '/register'}>＋ Add person</button></div><section className="panel table-panel"><div className="toolbar"><div className="table-search"><Search size={17} /><input placeholder="Search people" /></div><button className="filter-button">All departments <ChevronDown size={16} /></button></div>{state === 'loading' && <p className="muted table-message">Loading people...</p>}{state === 'error' && <p className="error-message">Sign in as an admin to load the live directory.</p>}{state === 'ready' && <EmployeeTable data={people} />}</section></>
}

function EmployeeTable({ compact = false, data = employees }) { const rows = compact ? data.slice(0, 3) : data; return <div className="table-wrap"><table><thead><tr><th>Person</th><th>Department</th><th>Status</th><th>Last active</th><th></th></tr></thead><tbody>{rows.map(person => <tr key={person.id || person.name}><td><div className="person-cell"><div className="avatar sky">{person.initials || `${person.first_name?.[0] || ''}${person.last_name?.[0] || ''}`}</div><div><strong>{person.name || `${person.first_name} ${person.last_name}`}</strong><small>{person.role || 'Employee'}</small></div></div></td><td>{person.department || 'Unassigned'}</td><td><span className={`badge ${person.status === 'Active' || person.status === 'APPROVED' ? 'active-badge' : 'leave-badge'}`}>{person.status || 'Active'}</span></td><td>Today</td><td><button className="more-button">•••</button></td></tr>)}</tbody></table></div> }

function Placeholder() { return <div className="empty-state panel"><FileText size={28} /><h2>Module in progress</h2><p className="muted">This workspace is ready for the next management module.</p></div> }

function PublicPage({ path, onLogin }) { const titles = { '/': ['People operations, with more human clarity.', 'One calm workspace for your people, payroll, leave, and everyday work.'], '/about': ['A better rhythm for growing teams.', 'PeopleOS brings the operational details of work into one considered place.'], '/contact': ['Let’s make work easier to run.', 'Tell us what your team needs and we will help you find the right starting point.'], '/login': ['Welcome back.', 'Sign in to your workspace to continue.'], '/register': ['Create your workspace.', 'Bring your people operations into focus.'] }; const [title, subtitle] = titles[path] || titles['/']; const isForm = ['/login', '/register'].includes(path); return <div className="public-shell"><header className="public-nav"><Link to="/" className="brand"><span className="brand-mark"><BriefcaseBusiness size={18} /></span><span>PeopleOS</span></Link><nav><Link to="/about">About</Link><Link to="/contact">Contact</Link><button className="link-button" onClick={onLogin}>Log in</button><button className="primary-button small" onClick={() => window.location.href = '/register'}>Get started</button></nav></header><main className={`public-main ${isForm ? 'form-main' : ''}`}><div className="public-copy"><p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p><h1>{title}</h1><p>{subtitle}</p>{!isForm && <div className="public-actions"><button className="primary-button" onClick={() => window.location.href = '/register'}>Start building clarity <span>→</span></button><button className="secondary-button" onClick={onLogin}>Explore the workspace</button></div>}</div>{isForm ? <form className="auth-card" onSubmit={event => { event.preventDefault(); onLogin() }}><div className="form-orb"><Users size={22} /></div><h2>{path === '/login' ? 'Sign in to PeopleOS' : 'Join your team'}</h2><label>Email address<input type="email" placeholder="you@company.com" required /></label>{path === '/register' && <label>Full name<input placeholder="Alex Kim" required /></label>}<label>Password<input type="password" placeholder="••••••••" required /></label><button className="primary-button full">{path === '/login' ? 'Sign in' : 'Create account'} <span>→</span></button></form> : <div className="public-art"><div className="art-window"><div className="art-header"><span /><span /><span /></div><div className="art-content"><div className="art-sidebar" /><div className="art-lines"><i /><i /><i /><div className="art-cards"><b /><b /><b /></div><i /><i /></div></div></div><div className="art-note"><span>08</span><small>teams<br />aligned</small></div></div>}</main><footer><span>PeopleOS</span><span>© 2026 Northstar Labs</span></footer></div> }

export default App
