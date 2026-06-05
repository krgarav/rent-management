'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getTenantById, getTenantTransactions, getRentPayments } from '@/features/tenants/api/tenant.service'
import { useAuth } from '@/providers/auth-provider'
import { Tenant, PaymentStatus } from '@/types'
import { ArrowLeft, Mail, Phone, Home, Calendar, DollarSign, AlertCircle } from 'lucide-react'
import { StatusBadge } from '@/components/badges/status-badge'

interface Transaction {
  id: string
  type: 'rent' | 'electricity' | 'water' | 'maintenance' | 'other'
  description: string
  amount: number
  date: Date
  status: 'pending' | 'paid' | 'overdue'
  dueDate?: Date
  paidDate?: Date
}

export default function TenantDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const tenantId = params.id as string

  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [rentPayments, setRentPayments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch tenant details
        const tenantData = await getTenantById(tenantId)
        setTenant(tenantData)

        // Fetch transactions and rent payments in parallel
        const [transactionsData, rentPaymentsData] = await Promise.all([
          getTenantTransactions(tenantId).catch(() => []),
          getRentPayments(tenantId).catch(() => [])
        ])

        setTransactions(transactionsData || [])
        setRentPayments(rentPaymentsData || [])
      } catch (err) {
        console.error('[v0] Error fetching tenant data:', err)
        setError('Failed to load tenant details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (tenantId) {
      fetchTenantData()
    }
  }, [tenantId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-12 w-24 rounded-lg bg-muted animate-pulse"></div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1 h-96 rounded-lg bg-muted animate-pulse"></div>
          <div className="lg:col-span-2 h-96 rounded-lg bg-muted animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Error Loading Tenant</h2>
        <p className="text-muted-foreground mb-6">{error || 'Tenant not found'}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    )
  }

  const totalRentCollected = rentPayments
    .filter((p) => p.status === PaymentStatus.PAID)
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const totalRentDue = rentPayments.reduce((sum, p) => sum + (p.amount || 0), 0)

  const overduePayments = rentPayments.filter((p) => p.status === PaymentStatus.OVERDUE).length

  const allTransactions = [
    ...rentPayments.map((payment) => ({
      id: payment.id,
      type: 'rent' as const,
      description: `Rent Payment - ${new Date(payment.dueDate).toLocaleDateString()}`,
      amount: payment.amount,
      date: new Date(payment.dueDate),
      status: payment.status as 'pending' | 'paid' | 'overdue',
      dueDate: new Date(payment.dueDate),
      paidDate: payment.paidDate ? new Date(payment.paidDate) : undefined
    })),
    ...(transactions || [])
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tenants
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tenant Information Card */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Tenant Information</h2>

            {/* Tenant Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-primary-foreground mb-4">
                {tenant.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{tenant.name}</h3>
            </div>

            {/* Tenant Details */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground break-all">{tenant.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{tenant.phone}</p>
                </div>
              </div>

              {/* Lease Start Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Lease Start</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(tenant.leaseStartDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Lease End Date */}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Lease End</p>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(tenant.leaseEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Rent Amount */}
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Rent</p>
                  <p className="text-lg font-bold text-foreground">${tenant.rentAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-border"></div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm">Payment Summary</h3>

              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Collected</p>
                <p className="text-xl font-bold text-foreground">${totalRentCollected.toLocaleString()}</p>
              </div>

              <div className="rounded-lg bg-secondary/50 p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Due</p>
                <p className="text-xl font-bold text-foreground">${totalRentDue.toLocaleString()}</p>
              </div>

              {overduePayments > 0 && (
                <div className="rounded-lg bg-destructive/10 p-4 border border-destructive/20">
                  <p className="text-xs text-destructive mb-1">Overdue Payments</p>
                  <p className="text-xl font-bold text-destructive">{overduePayments}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transactions and Payments Card */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Transaction History</h2>

            {allTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">${transaction.amount.toLocaleString()}</p>
                        <StatusBadge status={transaction.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
