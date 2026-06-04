'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: 'active' | 'inactive' | 'pending' | 'paid' | 'overdue' | 'maintenance' | 'partial'
  variant?: 'solid' | 'outline'
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, variant = 'solid', className, ...props }, ref) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Active' },
      inactive: { bg: 'bg-muted', text: 'text-muted-foreground', label: 'Inactive' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pending' },
      paid: { bg: 'bg-success/10', text: 'text-success', label: 'Paid' },
      overdue: { bg: 'bg-destructive/10', text: 'text-destructive', label: 'Overdue' },
      maintenance: { bg: 'bg-info/10', text: 'text-info', label: 'Maintenance' },
      partial: { bg: 'bg-warning/10', text: 'text-warning', label: 'Partial' },
    }

    const config = statusConfig[status]

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          variant === 'solid' ? config.bg : `border ${config.text}`,
          config.text,
          className
        )}
        {...props}
      >
        {config.label}
      </span>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'
