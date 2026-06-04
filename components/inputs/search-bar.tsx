'use client'

import { forwardRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {icon || <Search className="h-4 w-4 text-muted-foreground" />}
        </div>
        <input
          ref={ref}
          type="search"
          placeholder="Search..."
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2 text-sm',
            'placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
SearchBar.displayName = 'SearchBar'
