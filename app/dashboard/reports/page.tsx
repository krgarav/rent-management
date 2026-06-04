'use client'

import { useAuth } from '@/providers/auth-provider'
import { UserRole } from '@/types'
import { MOCK_RENT_PAYMENTS, MOCK_EXPENSES, MOCK_PROPERTIES } from '@/lib/mock-data'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download } from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAuth()

  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.PROPERTY_MANAGER)) {
    return <div className="text-center py-12">Access denied</div>
  }

  const paidPayments = MOCK_RENT_PAYMENTS.filter(p => p.status === 'paid').length
  const pendingPayments = MOCK_RENT_PAYMENTS.filter(p => p.status === 'pending').length
  const overduePayments = MOCK_RENT_PAYMENTS.filter(p => p.status === 'overdue').length

  const paymentStatusData = [
    { name: 'Paid', value: paidPayments, fill: 'var(--chart-1)' },
    { name: 'Pending', value: pendingPayments, fill: 'var(--chart-3)' },
    { name: 'Overdue', value: overduePayments, fill: 'var(--chart-2)' },
  ]

  const expensesByCategory = [
    { category: 'Maintenance', amount: MOCK_EXPENSES.filter(e => e.category === 'maintenance').reduce((sum, e) => sum + e.amount, 0) },
    { category: 'Utilities', amount: MOCK_EXPENSES.filter(e => e.category === 'utilities').reduce((sum, e) => sum + e.amount, 0) },
    { category: 'Property Tax', amount: MOCK_EXPENSES.filter(e => e.category === 'property_tax').reduce((sum, e) => sum + e.amount, 0) },
    { category: 'Insurance', amount: MOCK_EXPENSES.filter(e => e.category === 'insurance').reduce((sum, e) => sum + e.amount, 0) },
  ]

  const monthlyData = [
    { month: 'Jan', revenue: 8000, expenses: 3000, profit: 5000 },
    { month: 'Feb', revenue: 8500, expenses: 3200, profit: 5300 },
    { month: 'Mar', revenue: 8200, expenses: 3100, profit: 5100 },
    { month: 'Apr', revenue: 9000, expenses: 3500, profit: 5500 },
    { month: 'May', revenue: 8800, expenses: 3300, profit: 5500 },
    { month: 'Jun', revenue: 9200, expenses: 3400, profit: 5800 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Analytics and insights for your properties</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 font-semibold text-foreground hover:bg-secondary transition-colors">
          <Download className="h-5 w-5" />
          Export
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Properties</p>
          <p className="text-2xl font-bold text-foreground">{MOCK_PROPERTIES.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold text-success">$52,700</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Expenses</p>
          <p className="text-2xl font-bold text-warning">${MOCK_EXPENSES.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Monthly Trend */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Monthly Revenue & Expenses
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
              }} />
              <Legend />
              <Bar dataKey="revenue" fill="var(--chart-1)" />
              <Bar dataKey="expenses" fill="var(--chart-3)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status */}
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Payment Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Category */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Expenses by Category
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={expensesByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="category" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
            }} />
            <Bar dataKey="amount" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
