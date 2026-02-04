import type { SparePart, Location, Supplier } from './core'

// Production Issue types
export type IssueType = 'breakdown' | 'planned_maintenance'
export type IssueStatus = 'draft' | 'issued' | 'partially_returned' | 'closed'

// Production Issue (issuing spare to production)
export interface ProductionIssue {
    id: string
    issueNumber: string // e.g., ISS-2024-0001
    issueDate: Date
    issueType: IssueType
    machineId: string
    machineName?: string
    locationId: string // Production location
    locationName?: string
    requestedBy: string
    approvedBy?: string
    status: IssueStatus
    notes?: string
    items: ProductionIssueItem[]
    createdAt: Date
    updatedAt: Date
}

export interface ProductionIssueItem {
    id: string
    productionIssueId: string
    sparePartId: string
    sparePart?: SparePart
    fromLocationId: string // Warehouse location
    fromLocationName?: string
    quantityIssued: number
    quantityReturned: number
    unitCost: number
    notes?: string
}

// Production Return
export interface ProductionReturn {
    id: string
    returnNumber: string // e.g., RET-2024-0001
    returnDate: Date
    productionIssueId: string
    productionIssueNumber?: string
    returnedBy: string
    receivedBy?: string
    status: 'draft' | 'received' | 'inspected' | 'completed'
    notes?: string
    items: ProductionReturnItem[]
    createdAt: Date
}

export interface ProductionReturnItem {
    id: string
    productionReturnId: string
    productionIssueItemId: string
    sparePartId: string
    sparePart?: SparePart
    toLocationId: string // Return to warehouse
    toLocationName?: string
    quantityReturned: number
    condition: 'good' | 'damaged' | 'repairable'
    notes?: string
}

// Rework (send faulty spare for external repair)
export type ReworkStatus = 'draft' | 'dc_generated' | 'sent' | 'in_service' | 'received' | 'completed'

export interface Rework {
    id: string
    reworkNumber: string // e.g., RW-2024-0001
    reworkDate: Date
    serviceVendorId: string
    serviceVendor?: Supplier
    status: ReworkStatus
    deliveryChallanId?: string // Returnable DC
    deliveryChallanNumber?: string
    vendorInvoiceNumber?: string
    vendorInvoiceDate?: Date
    receivedDate?: Date
    receivedBy?: string
    notes?: string
    items: ReworkItem[]
    createdAt: Date
    updatedAt: Date
}

export interface ReworkItem {
    id: string
    reworkId: string
    sparePartId: string
    sparePart?: SparePart
    serialNumber?: string
    faultDescription: string
    quantitySent: number
    quantityReceived: number
    quantityRejected: number
    repairCost?: number
    repairNotes?: string
}

// Purchase Indent (request)
export type IndentStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'converted_to_po' | 'cancelled'

export interface Indent {
    id: string
    indentNumber: string // e.g., IND-2024-0001
    indentDate: Date
    requestedBy: string
    department?: string
    priority: 'low' | 'medium' | 'high' | 'urgent'
    status: IndentStatus
    approvedBy?: string
    approvedDate?: Date
    rejectionReason?: string
    purchaseOrderId?: string
    purchaseOrderNumber?: string
    notes?: string
    items: IndentItem[]
    createdAt: Date
    updatedAt: Date
}

export interface IndentItem {
    id: string
    indentId: string
    sparePartId: string
    sparePart?: SparePart
    quantityRequested: number
    quantityApproved?: number
    requiredDate?: Date
    justification?: string
}

// Stock Transfer
export type TransferStatus = 'draft' | 'pending' | 'in_transit' | 'received' | 'completed'

export interface StockTransfer {
    id: string
    transferNumber: string // e.g., TRF-2024-0001
    transferDate: Date
    fromLocationId: string
    fromLocation?: Location
    toLocationId: string
    toLocation?: Location
    status: TransferStatus
    requestedBy: string
    approvedBy?: string
    receivedBy?: string
    receivedDate?: Date
    notes?: string
    items: StockTransferItem[]
    createdAt: Date
    updatedAt: Date
}

export interface StockTransferItem {
    id: string
    stockTransferId: string
    sparePartId: string
    sparePart?: SparePart
    quantityRequested: number
    quantitySent: number
    quantityReceived: number
}
