import { useEffect, useState } from 'react'
import { FileText, IndianRupee } from 'lucide-react'
import api from './services/api'

const formatINR = (amount) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
}).format(Number(amount))

export default function PayrollPage() {
  const [payroll, setPayroll] = useState([])
  const [state, setState] = useState('loading')
  const [error, setError] = useState('')

  async function downloadPayslip(id) {
    try {
      const response = await api.get(`/payroll/${id}/pdf/`, { responseType: 'blob' })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `payslip-${id}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError('Unable to download this payslip.')
    }
  }

  useEffect(() => {
    api.get('/payroll/mine/')
      .then(response => { setPayroll(response.data); setState('ready') })
      .catch(() => { setError('Sign in as an employee to view your payslips.'); setState('error') })
  }, [])

  return <><div className="page-heading"><div><p className="eyebrow">Compensation</p><h1>My payslips</h1><p className="muted">A clear record of your payroll history.</p></div><IndianRupee size={25} color="#167c78" /></div>{error && <p className="error-message">{error}</p>}<section className="panel table-panel">{state === 'loading' && <p className="muted table-message">Loading payslips...</p>}{state === 'ready' && payroll.length === 0 && <div className="empty-state"><FileText size={28} /><h2>No payslips yet</h2><p className="muted">Your payslips will appear here after payroll is processed.</p></div>}{state === 'ready' && payroll.length > 0 && <div className="table-wrap"><table><thead><tr><th>Pay period</th><th>Gross salary</th><th>Net salary</th><th>Status</th><th>Action</th></tr></thead><tbody>{payroll.map(item => <tr key={item.id}><td>{new Date(`${item.pay_period_start}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} to {new Date(`${item.pay_period_end}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td><td>{formatINR(Number(item.basic_salary) + Number(item.allowances))}</td><td><strong>{formatINR(item.net_salary)}</strong></td><td><span className={`badge ${item.status === 'PAID' ? 'active-badge' : 'pending'}`}>{item.status}</span></td><td><button className="text-link" onClick={() => downloadPayslip(item.id)}>Download PDF</button></td></tr>)}</tbody></table></div>}</section></>
}
