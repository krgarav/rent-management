'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number
}

export const LoadingSkeleton = forwardRef<HTMLDivElement, LoadingSkeletonProps>(
  ({ count = 1, className, ...props }, ref) => {
    return (
      <>
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? ref : undefined}
            className={cn(
              'h-12 rounded-lg bg-muted animate-pulse',
              className
            )}
            {...(i === 0 ? props : {})}
          />
        ))}
      </>
    )
  }
)
LoadingSkeleton.displayName = 'LoadingSkeleton'
