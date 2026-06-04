'use client'

import { forwardRef, useState } from 'react'
import { AlertCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  isDestructive?: boolean
}

export const ConfirmDialog = forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title,
      description,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      onConfirm,
      onCancel,
      isDestructive = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(open)
    const [isLoading, setIsLoading] = useState(false)

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    }

    const handleConfirm = async () => {
      setIsLoading(true)
      try {
        await onConfirm()
        handleOpenChange(false)
      } finally {
        setIsLoading(false)
      }
    }

    const handleCancel = () => {
      onCancel?.()
      handleOpenChange(false)
    }

    if (!isOpen) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="fixed inset-0 bg-black/50"
          onClick={handleCancel}
        />
        <div
          ref={ref}
          className="relative z-50 w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg"
        >
          <button
            onClick={handleCancel}
            className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-4">
            <div className={cn(
              'mt-1 rounded-full p-2',
              isDestructive ? 'bg-destructive/10' : 'bg-warning/10'
            )}>
              <AlertCircle className={cn(
                'h-5 w-5',
                isDestructive ? 'text-destructive' : 'text-warning'
              )} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
          </div>

          <div className="mt-6 flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                'border border-border bg-background text-foreground',
                'hover:bg-secondary disabled:opacity-50',
                'transition-colors'
              )}
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium',
                'text-primary-foreground transition-colors',
                isDestructive
                  ? 'bg-destructive hover:bg-destructive/90'
                  : 'bg-primary hover:bg-primary/90',
                'disabled:opacity-50'
              )}
            >
              {isLoading ? 'Loading...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    )
  }
)
ConfirmDialog.displayName = 'ConfirmDialog'
