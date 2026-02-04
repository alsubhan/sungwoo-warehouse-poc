import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount)
}

export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(d)
}

export function formatDateTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d)
}

export function generateId(): string {
    return Math.random().toString(36).substring(2, 11)
}

export function calculateGST(amount: number, gstRate: number, isInterState: boolean): {
    cgst: number
    sgst: number
    igst: number
    total: number
} {
    if (isInterState) {
        const igst = (amount * gstRate) / 100
        return { cgst: 0, sgst: 0, igst, total: amount + igst }
    } else {
        const halfRate = gstRate / 2
        const cgst = (amount * halfRate) / 100
        const sgst = (amount * halfRate) / 100
        return { cgst, sgst, igst: 0, total: amount + cgst + sgst }
    }
}
