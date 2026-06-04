'use client'

import { forwardRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  itemsPerPage?: number
  onRowClick?: (row: T) => void
}

export const DataTable = forwardRef<
  HTMLDivElement,
  DataTableProps<any>
>(
  (
    {
      data,
      columns,
      isLoading = false,
      itemsPerPage = 10,
      onRowClick,
      className,
      ...props
    },
    ref
  ) => {
    const [currentPage, setCurrentPage] = useState(0)

    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = data.slice(startIndex, endIndex)
    const totalPages = Math.ceil(data.length / itemsPerPage)

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className="px-6 py-3 text-left text-sm font-semibold text-foreground"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-sm text-muted-foreground"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    onClick={() => onRowClick?.(row)}
                    className={cn(
                      'border-b border-border transition-colors',
                      onRowClick && 'cursor-pointer hover:bg-secondary'
                    )}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={cn(
                          'px-6 py-4 text-sm text-foreground',
                          column.className
                        )}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || '-')}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {currentPage + 1} of {totalPages} ({data.length} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  currentPage === 0
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                disabled={currentPage === totalPages - 1}
                className={cn(
                  'rounded-lg p-2 transition-colors',
                  currentPage === totalPages - 1
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
)
DataTable.displayName = 'DataTable'
