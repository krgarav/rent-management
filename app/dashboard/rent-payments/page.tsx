'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { UserRole, PaymentStatus } from '@/types'
import { DataTable } from '@/components/tables/data-table'
import { SearchBar } from '@/components/inputs/search-bar'
import { StatusBadge } from '@/components/badges/status-badge'
import { MOCK_RENT_PAYMENTS, MOCK_TENANTS, MOCK_PROPERTIES } from '@/lib/mock-data'
import { Eye, Edit, Trash2 } from 'lucide-react'

export default function RentPaymentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>('all')

  if (!user) {
    return <div className="text-center py-12">Access denied</div>
  }

  let payments = MOCK_RENT_PAYMENTS

  // Filter by tenant role
  if (user.role === UserRole.TENANT) {
    const tenant = MOCK_TENANTS.find(t => t.email === user.email)
    if (tenant) {
      payments = payments.filter(p => p.tenantId === tenant.id)
    }
  }

  const filteredPayments = payments.filter((payment) => {
    const tenant = MOCK_TENANTS.find(t => t.id === payment.tenantId)
    return (
      (!searchTerm ||
        tenant?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tenant?.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || payment.status === statusFilter)
    )
  })

  const columns = [
    {
      key: 'tenantId',
      label: 'Tenant Name',
      className: 'font-medium',
      render: (tenantId: string) => {
        const tenant = MOCK_TENANTS.find(t => t.id === tenantId)
        return tenant?.name || '-'
      },
    },
    {
      key: 'propertyId',
      label: 'Property',
      render: (propertyId: string) => {
        const property = MOCK_PROPERTIES.find(p => p.id === propertyId)
        return property?.name || '-'
      },
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'paidDate',
      label: 'Paid Date',
      render: (date: Date | undefined) => date ? new Date(date).toLocaleDateString() : '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: PaymentStatus) => <StatusBadge status={value} />,
    },
  ]

  if (user.role !== UserRole.TENANT) {
    columns.push({
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors">
            <Edit className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    } as any)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Rent Payments</h1>
        <p className="text-muted-foreground">Track and manage all rent payments</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search by tenant name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PaymentStatus | 'all')}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <option value="all">All Status</option>
          <option value={PaymentStatus.PAID}>Paid</option>
          <option value={PaymentStatus.PENDING}>Pending</option>
          <option value={PaymentStatus.OVERDUE}>Overdue</option>
          <option value={PaymentStatus.PARTIAL}>Partial</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredPayments}
        columns={columns}
        itemsPerPage={10}
      />
    </div>
  )
}
