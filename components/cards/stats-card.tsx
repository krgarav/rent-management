'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
}

export const StatsCard = forwardRef<HTMLDivElement, StatsCardProps>(
  ({ label, value, icon, trend, color = 'primary', className, ...props }, ref) => {
    const colorClasses = {
      primary: 'text-blue-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
      danger: 'text-red-500',
      info: 'text-cyan-500',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border border-border bg-card p-6 shadow-sm',
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
            {trend && (
              <p
                className={cn(
                  'mt-2 text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive'
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </p>
            )}
          </div>
          {icon && (
            <div className={cn('rounded-lg bg-secondary p-3', colorClasses[color])}>
              {icon}
            </div>
          )}
        </div>
      </div>
    )
  }
)
StatsCard.displayName = 'StatsCard'
