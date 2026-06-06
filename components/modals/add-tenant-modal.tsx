'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import { useRegisterUser } from '@/features/tenants/hooks/userHooks'
import toast from 'react-hot-toast'

const tenantSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z
    .string()
    .min(1, 'Phone is required')
    .regex(/^\d+$/, 'Phone must contain only numbers'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'tenant'], {
    message: 'Please select a role',
  }),
})

type TenantFormData = z.infer<typeof tenantSchema>

interface AddTenantModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTenantModal({
  isOpen,
  onClose,
}: AddTenantModalProps) {
  const { mutateAsync: registerUser, isPending } = useRegisterUser()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
  })

  const onSubmit = async (data: TenantFormData) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        phone: Number(data.phone),
        password: data.password,
        role: data.role,
      })

      toast.success('User registered successfully')

      reset()
      onClose()
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Failed to register user'
      )
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
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-lg max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-xl font-semibold text-foreground">
            Register New Tenant
          </h2>

          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 px-6 py-4 overflow-y-auto flex-1"
        >

          {/* Name */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register('name')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            {errors.name && (
              <p className="text-xs text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <input
              type="email"
              placeholder="john@example.com"
              {...register('email')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            {errors.email && (
              <p className="text-xs text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              {...register('phone')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            {errors.phone && (
              <p className="text-xs text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Role
            </label>

            <select
              {...register('role')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="tenant">Tenant</option>
            </select>

            {errors.role && (
              <p className="text-xs text-destructive">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

        </form>

        {/* Footer */}
        <div className="flex gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isPending}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Adding...' : 'Add Tenant'}
          </button>
        </div>

      </div>
    </>
  )
}
