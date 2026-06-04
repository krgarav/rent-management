'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useData } from '@/providers/data-provider'
import { Tenant } from '@/types'
import { X, AlertCircle } from 'lucide-react'
import { Property } from '@/types'

const tenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  propertyId: z.string().min(1, 'Please select a property'),
  rentAmount: z.coerce.number().min(0, 'Rent amount must be positive'),
  leaseStartDate: z.string().min(1, 'Lease start date is required'),
  leaseEndDate: z.string().min(1, 'Lease end date is required'),
})

type TenantFormData = z.infer<typeof tenantSchema>

interface AddTenantModalProps {
  isOpen: boolean
  onClose: () => void
  properties: Property[]
}

export function AddTenantModal({ isOpen, onClose, properties }: AddTenantModalProps) {
  const { addTenant } = useData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
  })

  const onSubmit = async (data: TenantFormData) => {
    setIsSubmitting(true)
    setError('')
    try {
      addTenant({
        name: data.name,
        email: data.email,
        phone: data.phone,
        propertyId: data.propertyId,
        rentAmount: data.rentAmount,
        leaseStartDate: new Date(data.leaseStartDate),
        leaseEndDate: new Date(data.leaseEndDate),
        avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=400&h=400&fit=crop`,
      })
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tenant')
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
          <h2 className="text-xl font-semibold text-foreground">Register New Tenant</h2>
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
            <label className="text-sm font-medium text-foreground">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Email Address</label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Phone Number</label>
            <input
              type="tel"
              placeholder="(555) 123-4567"
              {...register('phone')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* Property */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Property</label>
            <select
              {...register('propertyId')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a property</option>
              {properties.map((prop) => (
                <option key={prop.id} value={prop.id}>
                  {prop.name}
                </option>
              ))}
            </select>
            {errors.propertyId && (
              <p className="text-xs text-destructive">{errors.propertyId.message}</p>
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

          {/* Lease Start Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Lease Start Date</label>
            <input
              type="date"
              {...register('leaseStartDate')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.leaseStartDate && (
              <p className="text-xs text-destructive">{errors.leaseStartDate.message}</p>
            )}
          </div>

          {/* Lease End Date */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">Lease End Date</label>
            <input
              type="date"
              {...register('leaseEndDate')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.leaseEndDate && (
              <p className="text-xs text-destructive">{errors.leaseEndDate.message}</p>
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
            {isSubmitting ? 'Adding...' : 'Add Tenant'}
          </button>
        </div>
      </div>
    </>
  )
}
