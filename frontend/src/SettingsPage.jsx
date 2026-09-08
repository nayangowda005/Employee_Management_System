import { useEffect, useState } from 'react'
import { Check, Settings } from 'lucide-react'
import api from './services/api'

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/auth/me/').then(response => setUser(response.data)).catch(() => setError('Unable to load account settings.'))
  }, [])

  return <><div className="page-heading"><div><p className="eyebrow">Workspace preferences</p><h1>Settings</h1><p className="muted">Review your PeopleOS account details.</p></div><Settings size={25} color="#167c78" /></div>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}<section className="panel settings-card"><div className="settings-icon"><Settings size={20} /></div><div><h2>Account profile</h2><p className="muted">Your signed-in account information</p></div><div className="settings-list"><div><span>Name</span><strong>{user ? `${user.first_name} ${user.last_name}`.trim() || user.username : 'Loading...'}</strong></div><div><span>Username</span><strong>{user?.username || 'Loading...'}</strong></div><div><span>Email</span><strong>{user?.email || 'Loading...'}</strong></div><div><span>Role</span><strong>{user?.role || 'Loading...'}</strong></div><div><span>Approval</span><strong className="settings-approved"><Check size={14} /> {user?.approval_status || 'Loading...'}</strong></div></div></section></>
}
