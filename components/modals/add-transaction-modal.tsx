'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, AlertCircle } from 'lucide-react'


import { z } from 'zod'
import { useUploadMedia } from '@/features/tenants/hooks/mediaHooks'

export const transactionSchema = z.object({
    type: z.enum(['rent', 'electricity', 'water', 'maintenance', 'other']),
    description: z.string().min(2, 'Description is required'),
    amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
    status: z.enum(['pending', 'paid', 'overdue']),
    dueDate: z.string().optional(),
    attachmentUrl: z.string().optional(),

})

export type TransactionFormData = z.infer<typeof transactionSchema>

interface CreateTransactionModalProps {
    isOpen: boolean
    onClose: () => void
    onCreate: (data: TransactionFormData) => Promise<void> | void
}

export function CreateTransactionModal({
    isOpen,
    onClose,
    onCreate,
}: CreateTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [preview, setPreview] = useState<string | null>(null)
    const { mutateAsync: uploadMedia, isPending: uploading } = useUploadMedia()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TransactionFormData>({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: 'rent',
            status: 'pending',
        },
    })

    const onSubmit = async (data: TransactionFormData) => {
        setIsSubmitting(true)
        setError('')

        try {
            await onCreate(data)
            reset()
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create transaction')
        } finally {
            setIsSubmitting(false)
        }
    }



    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            // preview locally
            setPreview(URL.createObjectURL(file))

            // upload using your hook 🔥
            const url = await uploadMedia(file)

            // set form value
            // setValue('attachmentUrl', url)

        } catch (err) {
            setError('Failed to upload file')
        }
    }

    if (!isOpen) return null

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-card shadow-lg">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <h2 className="text-xl font-semibold text-foreground">
                        Create Transaction
                    </h2>

                    <button onClick={onClose}>
                        <X className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-4">

                    {error && (
                        <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                            <AlertCircle className="h-4 w-4 mt-0.5" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Type */}
                    <div>
                        <label className="text-sm font-medium">Type</label>
                        <select
                            {...register('type')}
                            className="w-full mt-1 rounded-lg border px-3 py-2"
                        >
                            <option value="rent">Rent</option>
                            <option value="electricity">Electricity</option>
                            <option value="water">Water</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-sm font-medium">Description</label>
                        <input
                            {...register('description')}
                            placeholder="Monthly rent payment"
                            className="w-full mt-1 rounded-lg border px-3 py-2"
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium">Attachment</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full mt-1 rounded-lg border px-3 py-2"
                        />

                        {uploading && (
                            <p className="text-xs text-muted-foreground mt-1">
                                Uploading...
                            </p>
                        )}

                        {preview && (
                            <img
                                src={preview}
                                className="mt-2 h-24 w-24 rounded-md object-cover border"
                            />
                        )}
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="text-sm font-medium">Amount</label>
                        <input
                            type="number"
                            {...register('amount')}
                            placeholder="5000"
                            className="w-full mt-1 rounded-lg border px-3 py-2"
                        />
                        {errors.amount && (
                            <p className="text-xs text-destructive">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div>
                        <label className="text-sm font-medium">Status</label>
                        <select
                            {...register('status')}
                            className="w-full mt-1 rounded-lg border px-3 py-2"
                        >
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="text-sm font-medium">Due Date</label>
                        <input
                            type="date"
                            {...register('dueDate')}
                            className="w-full mt-1 rounded-lg border px-3 py-2"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 border-t border-border px-6 py-4">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-lg border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
        </>
    )
}