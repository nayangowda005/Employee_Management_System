import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BriefcaseBusiness, Users } from 'lucide-react'

const copy = {
  '/': ['People operations, with more human clarity.', 'One calm workspace for your people, payroll, leave, and everyday work.'],
  '/about': ['A better rhythm for growing teams.', 'PeopleOS brings the operational details of work into one considered place.'],
  '/contact': ['Let us make work easier to run.', 'Tell us what your team needs and we will help you find the right starting point.'],
  '/login': ['Welcome back.', 'Sign in to your workspace to continue.'],
  '/register': ['Create your workspace.', 'Bring your people operations into focus.'],
}

export default function PublicPage({ path, onLogin, onAuthenticate, onRegister }) {
  const [error, setError] = useState('')
  const isLogin = path === '/login'
  const isForm = isLogin || path === '/register'
  const [title, subtitle] = copy[path] || copy['/']

  async function submit(event) {
    event.preventDefault()
    setError('')
    const formData = new FormData(event.currentTarget)
    try {
      if (isLogin) {
        await onAuthenticate({ username: formData.get('username'), password: formData.get('password') })
      } else {
        await onRegister({ username: formData.get('username'), email: formData.get('email'), full_name: formData.get('full_name'), password: formData.get('password') })
      }
    } catch (requestError) {
      setError(requestError.response?.data?.detail || 'Unable to sign in. Check your credentials.')
    }
  }

  return <div className="public-shell">
    <header className="public-nav">
      <Link to="/" className="brand"><span className="brand-mark"><BriefcaseBusiness size={18} /></span><span>PeopleOS</span></Link>
      <nav><Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/login" className="link-button">Log in</Link><Link to="/register" className="primary-button small">Get started</Link></nav>
    </header>
    <main className={`public-main ${isForm ? 'form-main' : ''}`}>
      <div className="public-copy"><p className="eyebrow">EMPLOYEE MANAGEMENT SYSTEM</p><h1>{title}</h1><p>{subtitle}</p>{!isForm && <div className="public-actions"><Link className="primary-button" to="/register">Start building clarity <span>→</span></Link><Link className="secondary-button" to="/login">Explore the workspace</Link></div>}</div>
      {isForm ? <form className="auth-card" onSubmit={submit}><div className="form-orb"><Users size={22} /></div><h2>{isLogin ? 'Sign in to PeopleOS' : 'Join your team'}</h2>{!isLogin && <><label>Full name<input name="full_name" placeholder="Alex Kim" required /></label><label>Username<input name="username" placeholder="alex.kim" required /></label><label>Email address<input name="email" type="email" placeholder="you@company.com" required /></label></>}{isLogin && <label>Username<input name="username" placeholder="your username" required /></label>}<label>Password<input name="password" type="password" placeholder="Your password" required /></label>{error && <p className="error-message">{error}</p>}<button className="primary-button full">{isLogin ? 'Sign in' : 'Create account'} <span>→</span></button></form> : <div className="public-art"><div className="art-window"><div className="art-header"><span /><span /><span /></div><div className="art-content"><div className="art-sidebar" /><div className="art-lines"><i /><i /><i /><div className="art-cards"><b /><b /><b /></div><i /><i /></div></div></div><div className="art-note"><span>08</span><small>teams<br />aligned</small></div></div>}
    </main>
    <footer><span>PeopleOS</span><span>© 2026 Northstar Labs</span></footer>
  </div>
}
