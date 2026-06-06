'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { UserRole } from '@/types'
import { DataTable } from '@/components/tables/data-table'
import { SearchBar } from '@/components/inputs/search-bar'
import { AddTenantModal } from '@/components/modals/add-tenant-modal'
import { Plus, Eye, Edit, Trash2 } from 'lucide-react'

// hooks
import { useTenant } from '@/features/tenants/hooks/tenantHooks'
import { useProperties } from '@/features/tenants/hooks/propertyHooks'

export default function TenantsPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  // ✅ API DATA
  const { data: tenants = [] } = useTenant()
  const { data: properties = [] } = useProperties()
  // const { mutate: deleteTenant } = useDeleteTenant()

  const isAdmin = user?.role === UserRole.ADMIN
  const isManager = user?.role === UserRole.PROPERTY_MANAGER

  if (!user || (!isAdmin && !isManager)) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-semibold text-foreground">
          Access Denied
        </h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to view this page.
        </p>
      </div>
    )
  }
console.log(tenants)
  // Filter tenants by manager
  const accessibleTenants = isManager
    ? tenants.filter((t: any) =>
        properties.some(
          (p: any) =>
            p.id === t.propertyId && p.managerId === user.id
        )
      )
    : tenants

  const filteredTenants = accessibleTenants.filter(
    (tenant: any) =>
      tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tenant.phone.includes(searchTerm)
  )

  const columns = [
    {
      key: 'name',
      label: 'Tenant Name',
      className: 'font-medium',
    },
    {
      key: 'email',
      label: 'Email',
    },
    {
      key: 'phone',
      label: 'Phone',
    },
    // {
    //   key: 'propertyId',
    //   label: 'Property',
    //   render: (propertyId: string) => {
    //     const property = properties.find(
    //       (p: any) => p.id === propertyId
    //     )
    //     return property?.name || '-'
    //   },
    // },
    // {
    //   key: 'rentAmount',
    //   label: 'Rent Amount',
    //   render: (value: number) =>
    //     `$${value.toLocaleString()}`,
    // },
    // {
    //   key: 'leaseEndDate',
    //   label: 'Lease End',
    //   render: (date: Date) =>
    //     new Date(date).toLocaleDateString(),
    // },
    {
      key: '_id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button
            onClick={() =>
              router.push(`/dashboard/tenants/${id}`)
            }
            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </button>

          <button
            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>

          <button
            // onClick={() => deleteTenant(id)}
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
          <h1 className="text-3xl font-bold text-foreground">
            Tenants
          </h1>
          <p className="text-muted-foreground">
            Manage all tenants and their information
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Tenant
        </button>
      </div>

      {/* Search */}
      <SearchBar
        placeholder="Search tenants by name, email, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Total Tenants
          </p>
          <p className="text-2xl font-bold text-foreground">
            {accessibleTenants.length}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Active Leases
          </p>
          <p className="text-2xl font-bold text-foreground">
            {
              accessibleTenants.filter(
                (t: any) =>
                  new Date(t.leaseEndDate) > new Date()
              ).length
            }
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Total Monthly Rent
          </p>
          <p className="text-2xl font-bold text-foreground">
            $
            {accessibleTenants
              .reduce(
                (sum: number, t: any) =>
                  sum + t.rentAmount,
                0
              )
              .toLocaleString()}
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        data={filteredTenants}
        columns={columns}
        itemsPerPage={10}
      />

      {/* Modal */}
      <AddTenantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        properties={properties}
      />
    </div>
  )
}