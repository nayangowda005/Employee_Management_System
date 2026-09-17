import { useEffect, useState } from 'react'
import { IndianRupee, Plus } from 'lucide-react'
import api from './services/api'

const emptyForm = { employee: '', pay_period_start: '', pay_period_end: '', basic_salary: '', allowances: '0', deductions: '0' }
const formatINR = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(Number(amount))

export default function AdminPayrollPage() {
  const [payroll, setPayroll] = useState([])
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [open, setOpen] = useState(false)
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function load() {
    setState('loading')
    Promise.all([api.get('/payroll/'), api.get('/employees/')]).then(([payrollResponse, employeeResponse]) => { setPayroll(payrollResponse.data); setEmployees(employeeResponse.data); setState('ready') }).catch(() => { setError('Unable to load payroll management data.'); setState('error') })
  }

  useEffect(() => { load() }, [])

  async function create(event) {
    event.preventDefault()
    setError('')
    try { await api.post('/payroll/', { ...form, employee: Number(form.employee) }); setForm(emptyForm); setOpen(false); setMessage('Payroll record created.'); load() } catch (requestError) { setError(requestError.response?.data?.detail || requestError.response?.data?.pay_period_end?.[0] || 'Unable to create payroll record.') }
  }

  async function process(id) {
    try { await api.post(`/payroll/${id}/process/`); setMessage('Payroll marked as paid.'); load() } catch (requestError) { setError(requestError.response?.data?.detail || 'Unable to process payroll.') }
  }

  return <><div className="page-heading"><div><p className="eyebrow">Compensation operations</p><h1>Payroll management</h1><p className="muted">Create and process employee payroll records in Indian rupees (₹).</p></div><button className="primary-button" onClick={() => setOpen(!open)}><Plus size={15} /> Create payroll</button></div>{message && <p className="success-message">{message}</p>}{error && <p className="error-message">{error}</p>}{open && <section className="panel payroll-form"><h2>New payroll record</h2><form onSubmit={create}><label>Employee<select value={form.employee} onChange={event => setForm({ ...form, employee: event.target.value })} required><option value="">Select employee</option>{employees.map(employee => <option value={employee.id} key={employee.id}>{employee.first_name} {employee.last_name} ({employee.username})</option>)}</select></label><label>Pay period start<input type="date" value={form.pay_period_start} onChange={event => setForm({ ...form, pay_period_start: event.target.value })} required /></label><label>Pay period end<input type="date" value={form.pay_period_end} onChange={event => setForm({ ...form, pay_period_end: event.target.value })} required /></label><label>Basic salary (₹)<input type="number" min="0" step="0.01" value={form.basic_salary} onChange={event => setForm({ ...form, basic_salary: event.target.value })} required /></label><label>Allowances (₹)<input type="number" min="0" step="0.01" value={form.allowances} onChange={event => setForm({ ...form, allowances: event.target.value })} /></label><label>Deductions (₹)<input type="number" min="0" step="0.01" value={form.deductions} onChange={event => setForm({ ...form, deductions: event.target.value })} /></label><button className="primary-button">Save payroll</button></form></section>}<section className="panel table-panel"><div className="panel-heading"><div><h2>Payroll records</h2><p className="muted">Manage employee payment status</p></div><IndianRupee size={22} color="#167c78" /></div>{state === 'loading' && <p className="muted">Loading payroll...</p>}{state === 'ready' && <div className="table-wrap"><table><thead><tr><th>Employee</th><th>Pay period</th><th>Net salary</th><th>Status</th><th>Action</th></tr></thead><tbody>{payroll.map(item => <tr key={item.id}><td>{item.employee_name}</td><td>{item.pay_period_start} to {item.pay_period_end}</td><td><strong>{formatINR(item.net_salary)}</strong></td><td><span className={`badge ${item.status === 'PAID' ? 'active-badge' : 'pending'}`}>{item.status}</span></td><td>{item.status === 'PENDING' ? <button className="quiet-button" onClick={() => process(item.id)}>Process payment</button> : <span className="muted">Processed</span>}</td></tr>)}</tbody></table></div>}</section></>
}
