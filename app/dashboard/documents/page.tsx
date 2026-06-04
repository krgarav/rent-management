'use client'

import { useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { UserRole } from '@/types'
import { DataTable } from '@/components/tables/data-table'
import { SearchBar } from '@/components/inputs/search-bar'
import { MOCK_DOCUMENTS } from '@/lib/mock-data'
import { Plus, Download, Trash2 } from 'lucide-react'

export default function DocumentsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')

  if (!user) {
    return <div className="text-center py-12">Access denied</div>
  }

  const filteredDocuments = MOCK_DOCUMENTS.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      key: 'name',
      label: 'Document Name',
      className: 'font-medium',
    },
    {
      key: 'type',
      label: 'Type',
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Uploaded',
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      key: 'id',
      label: 'Actions',
      render: (id: string) => (
        <div className="flex gap-2">
          <button className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors">
            <Download className="h-4 w-4" />
          </button>
          {(user?.role === UserRole.ADMIN || user?.role === UserRole.PROPERTY_MANAGER) && (
            <button className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Manage leases, invoices, and documents</p>
        </div>
        {(user?.role === UserRole.ADMIN || user?.role === UserRole.PROPERTY_MANAGER) && (
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-5 w-5" />
            Upload Document
          </button>
        )}
      </div>

      {/* Search */}
      <div className="flex-1">
        <SearchBar
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <DataTable
        data={filteredDocuments}
        columns={columns}
        itemsPerPage={10}
      />
    </div>
  )
}
