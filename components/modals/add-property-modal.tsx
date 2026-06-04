'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useData } from '@/providers/data-provider'
import { useAuth } from '@/providers/auth-provider'
import { PropertyStatus } from '@/types'
import { X, AlertCircle } from 'lucide-react'

const propertySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  type: z.enum(['residential', 'commercial']),
  units: z.coerce.number().min(1, 'Must have at least 1 unit'),
  rentAmount: z.coerce.number().min(0, 'Rent amount must be positive'),
})

type PropertyFormData = z.infer<typeof propertySchema>

interface AddPropertyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPropertyModal({ isOpen, onClose }: AddPropertyModalProps) {
  const { addProperty } = useData()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
  })

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true)
    setError('')
    try {
      addProperty({
        name: data.name,
        address: data.address,
        type: data.type,
        units: data.units,
        rentAmount: data.rentAmount,
        status: PropertyStatus.ACTIVE,
        managerId: user?.id || '2',
        image: `https://images.unsplash.com/photo-1545324418-cc4dc30f37b5?w=800&h=600&fit=crop`,
      })
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add property')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">Add New Property</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">
          {error && (
            <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Property Name</label>
            <input
              type="text"
              placeholder="Downtown Apartments"
              {...register('name')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Address</label>
            <input
              type="text"
              placeholder="123 Main St, New York, NY 10001"
              {...register('address')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Property Type</label>
            <select
              {...register('type')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            {errors.type && (
              <p className="text-xs text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Units */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Number of Units</label>
            <input
              type="number"
              placeholder="12"
              {...register('units')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.units && (
              <p className="text-xs text-destructive">{errors.units.message}</p>
            )}
          </div>

          {/* Rent Amount */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Monthly Rent Amount</label>
            <input
              type="number"
              placeholder="2500"
              {...register('rentAmount')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.rentAmount && (
              <p className="text-xs text-destructive">{errors.rentAmount.message}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add Property'}
          </button>
        </div>
      </div>
    </>
  )
}
