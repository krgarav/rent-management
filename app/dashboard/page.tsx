'use client'

import { useMemo } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { UserRole } from '@/types'
import { StatsCard } from '@/components/cards/stats-card'
import { getDashboardStats, MOCK_RENT_PAYMENTS, MOCK_PROPERTIES, MOCK_TENANTS, MOCK_EXPENSES } from '@/lib/mock-data'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Building2, Users, CreditCard, DollarSign } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) return null

  const stats = getDashboardStats()

  const chartData = [
    { month: 'Jan', rent: 8000, expenses: 3000 },
    { month: 'Feb', rent: 8500, expenses: 3200 },
    { month: 'Mar', rent: 8200, expenses: 3100 },
    { month: 'Apr', rent: 9000, expenses: 3500 },
    { month: 'May', rent: 8800, expenses: 3300 },
    { month: 'Jun', rent: 9200, expenses: 3400 },
  ]

  const paymentData = [
    { date: 'Week 1', paid: 15000, pending: 2000 },
    { date: 'Week 2', paid: 14500, pending: 2500 },
    { date: 'Week 3', paid: 16000, pending: 1000 },
    { date: 'Week 4', paid: 17000, pending: 500 },
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {user.role === UserRole.ADMIN || user.role === UserRole.PROPERTY_MANAGER ? (
          <>
            <StatsCard
              label="Total Properties"
              value={stats.totalProperties}
              icon={<Building2 className="h-6 w-6" />}
              color="primary"
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              label="Total Tenants"
              value={stats.totalTenants}
              icon={<Users className="h-6 w-6" />}
              color="success"
              trend={{ value: 8, isPositive: true }}
            />
            <StatsCard
              label="Rent Collected"
              value={`$${stats.totalRentCollected.toLocaleString()}`}
              icon={<CreditCard className="h-6 w-6" />}
              color="info"
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              label="Total Expenses"
              value={`$${stats.totalExpenses.toLocaleString()}`}
              icon={<DollarSign className="h-6 w-6" />}
              color="warning"
              trend={{ value: 3, isPositive: false }}
            />
          </>
        ) : (
          <>
            <StatsCard
              label="Leased Properties"
              value={MOCK_TENANTS.length}
              icon={<Building2 className="h-6 w-6" />}
              color="primary"
            />
            <StatsCard
              label="Monthly Rent"
              value="$2,500"
              icon={<CreditCard className="h-6 w-6" />}
              color="success"
            />
            <StatsCard
              label="Paid Payments"
              value="12/13"
              icon={<CreditCard className="h-6 w-6" />}
              color="info"
            />
            <StatsCard
              label="Next Due"
              value="Jul 1"
              icon={<DollarSign className="h-6 w-6" />}
              color="warning"
            />
          </>
        )}
      </div>

      {/* Charts */}
      {(user.role === UserRole.ADMIN || user.role === UserRole.PROPERTY_MANAGER) && (
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {/* Revenue Chart */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Monthly Revenue vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }} />
                <Legend />
                <Bar dataKey="rent" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Payment Trend */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Payment Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={paymentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                }} />
                <Legend />
                <Line type="monotone" dataKey="paid" stroke="var(--chart-1)" strokeWidth={2} />
                <Line type="monotone" dataKey="pending" stroke="var(--chart-3)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {(user.role === UserRole.ADMIN || user.role === UserRole.PROPERTY_MANAGER) && (
        <div className="rounded-lg border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Recent Payments
          </h3>
          <div className="space-y-3">
            {MOCK_RENT_PAYMENTS.slice(0, 5).map((payment) => {
              const tenant = MOCK_TENANTS.find(t => t.id === payment.tenantId)
              const statusColor = {
                paid: 'text-success',
                pending: 'text-warning',
                overdue: 'text-destructive',
                partial: 'text-info',
              }
              return (
                <div key={payment.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-foreground">{tenant?.name}</p>
                    <p className="text-sm text-muted-foreground">{payment.dueDate.toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${payment.amount}</p>
                    <p className={`text-sm capitalize font-medium ${statusColor[payment.status]}`}>
                      {payment.status}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
