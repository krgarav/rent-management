'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useData } from '@/providers/data-provider'
import { UserRole, PropertyStatus } from '@/types'
import { DataTable } from '@/components/tables/data-table'
import { SearchBar } from '@/components/inputs/search-bar'
import { StatusBadge } from '@/components/badges/status-badge'
import { AddPropertyModal } from '@/components/modals/add-property-modal'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

export default function PropertiesPage() {
  const { user } = useAuth()
  const { properties, deleteProperty } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isAdmin = user?.role === UserRole.ADMIN
  const isManager = user?.role === UserRole.PROPERTY_MANAGER

  if (!user || (!isAdmin && !isManager)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold text-foreground">Access Denied</h2>
        <p className="text-muted-foreground">You don&apos;t have permission to view this page.</p>
      </div>
    )
  }

  // Filter properties based on role
  const accessibleProperties = isManager
    ? properties.filter((p) => p.managerId === user.id)
    : properties

  const filteredProperties = accessibleProperties.filter(
    (property) =>
      (property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || property.status === statusFilter)
  )

  const columns = [
    {
      key: 'name',
      label: 'Property Name',
      className: 'font-medium',
    },
    {
      key: 'address',
      label: 'Address',
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => <span className="capitalize">{value}</span>,
    },
    {
      key: 'units',
      label: 'Units',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: PropertyStatus) => <StatusBadge status={value} />,
    },
    {
      key: 'rentAmount',
      label: 'Monthly Rent',
      render: (value: number) => `$${value.toLocaleString()}`,
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="View">
            <Eye className="h-4 w-4" />
          </button>
          <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="Edit">
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteProperty(id)}
            className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
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
          <h1 className="text-3xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage all properties and their details</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'all')}
          className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-secondary transition-colors"
        >
          <option value="all">All Status</option>
          <option value={PropertyStatus.ACTIVE}>Active</option>
          <option value={PropertyStatus.INACTIVE}>Inactive</option>
          <option value={PropertyStatus.MAINTENANCE}>Maintenance</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Properties</p>
          <p className="text-2xl font-bold text-foreground">{accessibleProperties.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Units</p>
          <p className="text-2xl font-bold text-foreground">
            {accessibleProperties.reduce((sum, p) => sum + p.units, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Monthly Revenue</p>
          <p className="text-2xl font-bold text-foreground">
            ${(accessibleProperties.reduce((sum, p) => sum + p.rentAmount * p.units, 0)).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredProperties}
        columns={columns}
        itemsPerPage={10}
      />

      {/* Modal */}
      <AddPropertyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
