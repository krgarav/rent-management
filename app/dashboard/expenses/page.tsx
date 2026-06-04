'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { UserRole, ExpenseCategory } from '@/types'
import { DataTable } from '@/components/tables/data-table'
import { SearchBar } from '@/components/inputs/search-bar'
import { MOCK_EXPENSES, MOCK_PROPERTIES } from '@/lib/mock-data'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

export default function ExpensesPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | 'all'>('all')

  if (!user || (user.role !== UserRole.ADMIN && user.role !== UserRole.PROPERTY_MANAGER)) {
    return <div className="text-center py-12">Access denied</div>
  }

  const filteredExpenses = MOCK_EXPENSES.filter((expense) => {
    const property = MOCK_PROPERTIES.find(p => p.id === expense.propertyId)
    return (
      (property?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (categoryFilter === 'all' || expense.category === categoryFilter)
    )
  })

  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0)

  const columns = [
    {
      key: 'propertyId',
      label: 'Property',
      className: 'font-medium',
      render: (propertyId: string) => {
        const property = MOCK_PROPERTIES.find(p => p.id === propertyId)
        return property?.name || '-'
      },
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'category',
      label: 'Category',
      render: (value: ExpenseCategory) => (
        <span className="capitalize">{value.replace('_', ' ')}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number) => (
        <span className="font-semibold text-foreground">${value.toLocaleString()}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
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
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground">Track and manage property expenses</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5" />
          Add Expense
        </button>
      </div>

      {/* Stats */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm text-muted-foreground">Total Expenses</p>
        <p className="text-3xl font-bold text-foreground">${totalExpenses.toLocaleString()}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ExpenseCategory | 'all')}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <option value="all">All Categories</option>
          <option value={ExpenseCategory.MAINTENANCE}>Maintenance</option>
          <option value={ExpenseCategory.UTILITIES}>Utilities</option>
          <option value={ExpenseCategory.PROPERTY_TAX}>Property Tax</option>
          <option value={ExpenseCategory.INSURANCE}>Insurance</option>
          <option value={ExpenseCategory.MANAGEMENT}>Management</option>
          <option value={ExpenseCategory.OTHER}>Other</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        data={filteredExpenses}
        columns={columns}
        itemsPerPage={10}
      />
    </div>
  )
}
