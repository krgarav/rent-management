'use client'

import { useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useUploadMedia } from '@/features/tenants/hooks/mediaHooks'
import { useGenerateBill } from '@/features/tenants/hooks/billhooks'

/* ---------------- SCHEMA ---------------- */

export const billSchema = z.object({
    userId: z.string().min(1, "User is required"),
    month: z.string().min(1, "Month is required"),

    electricBill: z.object({
        usage: z.object({
            previousUnit: z.coerce.number().min(0),
            currentUnit: z.coerce.number().min(0),
        }),
        billPhotoUrl: z.string().min(1, "Bill photo is required"),
        amount: z.coerce.number().min(0),
        status: z.enum(["pending", "paid", "overdue"]),
    }),

    rent: z.object({
        dueAmount: z.coerce.number().min(0),
        amount: z.coerce.number().min(0),
        status: z.enum(["pending", "paid", "overdue"]),
    }),

    meta: z.object({
        note: z.string().optional(),
        generatedBy: z.string().min(1),
    }),
})

export type BillFormData = z.infer<typeof billSchema>

/* ---------------- COMPONENT ---------------- */

export function CreateBillModal({
    isOpen,
    onClose,
    tenantId
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [error, setError] = useState('')
    const [preview, setPreview] = useState<string | null>(null)

    const { mutateAsync: uploadMedia, isPending: uploading } = useUploadMedia()
    const { mutateAsync: generateBill, isPending } = useGenerateBill()

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<BillFormData>({
        resolver: zodResolver(billSchema),
        defaultValues: {
            electricBill: {
                usage: {
                    previousUnit: 0,
                    currentUnit: 0,
                },
                status: 'pending',
                billPhotoUrl: '',
                amount: 0,
            },
            rent: {
                dueAmount: 0,
                amount: 0,
                status: 'pending',
            },
            meta: {
                generatedBy: '',
                note: '',
            },
            userId: tenantId,
            month: '',
        },
    })

    /* ---------------- SUBMIT ---------------- */

    const onSubmit = async (data: BillFormData) => {
        try {
            setError('')
            await generateBill(data)
            reset()
            setPreview(null)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate bill')
        }
    }

    /* ---------------- FILE UPLOAD ---------------- */

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const localUrl = URL.createObjectURL(file)
            setPreview(localUrl)

            const uploadedUrl = await uploadMedia(file)
            setValue('electricBill.billPhotoUrl', uploadedUrl, {
                shouldValidate: true,
            })
        } catch {
            setError('Failed to upload file')
        }
    }

    /* cleanup preview URL */
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview)
        }
    }, [preview])

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-50 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 max-h-[90vh] overflow-hidden rounded-xl border bg-card shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <h2 className="text-xl font-semibold">Generate Bill</h2>
                    <button
                        onClick={onClose}
                        className="text-lg font-semibold hover:text-red-500"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6 overflow-y-auto max-h-[70vh] px-6 py-5"
                >
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
                            {error}
                        </p>
                    )}

                    {/* USER */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">User ID</label>
                        <input
                            placeholder="Enter user ID"
                            {...register('userId')}
                            className="w-full rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-black"
                        />
                        {errors.userId && (
                            <p className="text-xs text-red-500">{errors.userId.message}</p>
                        )}
                    </div>

                    {/* MONTH */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Billing Month</label>
                        <input
                            type="month"
                            {...register('month')}
                            className="w-full rounded-lg border px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* ELECTRIC BILL */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold border-b pb-1">
                            Electric Bill
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm">Previous Unit</label>
                                <input
                                    type="number"
                                    {...register('electricBill.usage.previousUnit')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Current Unit</label>
                                <input
                                    type="number"
                                    {...register('electricBill.usage.currentUnit')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Amount</label>
                                <input
                                    type="number"
                                    {...register('electricBill.amount')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Status</label>
                                <select
                                    {...register('electricBill.status')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* FILE UPLOAD */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Bill Receipt</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm border rounded-lg p-2"
                        />

                        {uploading && (
                            <p className="text-xs text-blue-500">Uploading...</p>
                        )}

                        {preview && (
                            <img
                                src={preview}
                                className="h-24 w-24 object-cover rounded border"
                            />
                        )}
                    </div>

                    {/* RENT */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold border-b pb-1">Rent</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-sm">Due Amount</label>
                                <input
                                    type="number"
                                    {...register('rent.dueAmount')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Amount</label>
                                <input
                                    type="number"
                                    {...register('rent.amount')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm">Status</label>
                                <select
                                    {...register('rent.status')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* META */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold border-b pb-1">Meta</h3>

                        <div className="space-y-2">
                            <div>
                                <label className="text-sm">Generated By</label>
                                <input
                                    {...register('meta.generatedBy')}
                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                                />
                            </div>

                            <div>
                                <label className="text-sm">Note</label>
                                <textarea
                                    {...register('meta.note')}

                                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground min-h-[80px]"
                                />
                            </div>
                        </div>
                    </div>
                </form>

                {/* Footer */}
                <div className="flex gap-3 border-t px-6 py-4 bg-background">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 border rounded-lg py-2 hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isPending}
                        className="flex-1 bg-black text-white rounded-lg py-2 hover:opacity-90 disabled:opacity-50"
                    >
                        {isPending ? 'Generating...' : 'Generate Bill'}
                    </button>
                </div>
            </div>

            {/* shared input style (Tailwind shortcut idea) */}
            <style jsx>{`
      .input {
        width: 100%;
        border: 1px solid #e5e7eb;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 14px;
        background: white;
      }
      .input:focus {
        outline: none;
        ring: 2px solid black;
      }
    `}</style>
        </>
    );
}