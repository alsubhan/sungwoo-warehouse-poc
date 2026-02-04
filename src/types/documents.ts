import type { SparePart, Supplier } from './core'

// Delivery Challan
export type DCType = 'returnable' | 'non_returnable'
export type DCStatus = 'draft' | 'generated' | 'dispatched' | 'delivered' | 'returned' | 'closed'

export interface DeliveryChallan {
    id: string
    dcNumber: string // e.g., DC-2024-0001
    dcDate: Date
    dcType: DCType
    partyId: string // Supplier/Customer
    partyName?: string
    partyGstin?: string
    partyAddress?: string
    vehicleNumber?: string
    transporterName?: string
    lrNumber?: string // Lorry Receipt
    status: DCStatus
    returnDueDate?: Date // For returnable DC
    returnedDate?: Date
    referenceType?: 'rework' | 'sale' | 'loan' | 'other'
    referenceId?: string
    notes?: string
    items: DeliveryChallanItem[]
    createdAt: Date
    updatedAt: Date
}

export interface DeliveryChallanItem {
    id: string
    deliveryChallanId: string
    sparePartId: string
    sparePart?: SparePart
    description?: string
    hsnCode: string
    quantity: number
    unitId: string
    unitName?: string
    rate?: number
    value?: number
    quantityReturned?: number // For returnable DC
}

// Purchase Order
export type POStatus = 'draft' | 'sent' | 'acknowledged' | 'partial' | 'completed' | 'cancelled'

export interface PurchaseOrder {
    id: string
    poNumber: string // e.g., PO-2024-0001
    poDate: Date
    supplierId: string
    supplier?: Supplier
    deliveryLocationId: string
    deliveryLocationName?: string
    expectedDeliveryDate?: Date
    status: POStatus
    indentId?: string // Link to indent
    indentNumber?: string
    paymentTerms?: string
    notes?: string
    items: PurchaseOrderItem[]
    subtotal: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
    createdAt: Date
    updatedAt: Date
}

export interface PurchaseOrderItem {
    id: string
    purchaseOrderId: string
    sparePartId: string
    sparePart?: SparePart
    quantity: number
    receivedQuantity: number
    unitCost: number
    discount: number
    gstRate: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
}

// GRN (Goods Received Note)
export type GRNStatus = 'draft' | 'partial' | 'completed' | 'rejected'

export interface GRN {
    id: string
    grnNumber: string // e.g., GRN-2024-0001
    grnDate: Date
    purchaseOrderId: string
    purchaseOrderNumber?: string
    supplierId: string
    supplier?: Supplier
    vendorInvoiceNumber?: string
    vendorInvoiceDate?: Date
    receivedLocationId: string
    receivedLocationName?: string
    receivedBy: string
    status: GRNStatus
    qualityCheckStatus?: 'pending' | 'passed' | 'failed'
    notes?: string
    items: GRNItem[]
    subtotal: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
    createdAt: Date
    updatedAt: Date
}

export interface GRNItem {
    id: string
    grnId: string
    purchaseOrderItemId?: string
    sparePartId: string
    sparePart?: SparePart
    orderedQuantity: number
    receivedQuantity: number
    acceptedQuantity: number
    rejectedQuantity: number
    unitCost: number
    gstRate: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
    batchNumber?: string
    serialNumbers?: string[]
    storageLocationId?: string
    storageLocationName?: string
}

// Sale Invoice (with E-Invoice)
export type InvoiceStatus = 'draft' | 'generated' | 'irn_pending' | 'irn_generated' | 'cancelled'

export interface SaleInvoice {
    id: string
    invoiceNumber: string // e.g., INV-2024-0001
    invoiceDate: Date
    customerId: string
    customerName?: string
    customerGstin?: string
    customerAddress?: string
    billingAddress?: string
    shippingAddress?: string
    status: InvoiceStatus
    // E-Invoice fields
    irn?: string // Invoice Reference Number
    irnGeneratedDate?: Date
    acknowledgeNumber?: string
    qrCode?: string
    // Amounts
    subtotal: number
    discountAmount: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    roundingAdjustment: number
    totalAmount: number
    // Additional
    paymentTerms?: string
    dueDate?: Date
    notes?: string
    items: SaleInvoiceItem[]
    createdAt: Date
    updatedAt: Date
}

export interface SaleInvoiceItem {
    id: string
    saleInvoiceId: string
    sparePartId: string
    sparePart?: SparePart
    description?: string
    hsnCode: string
    quantity: number
    unitPrice: number
    discount: number
    gstRate: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
}

// Credit Note
export type CreditNoteStatus = 'draft' | 'issued' | 'adjusted' | 'cancelled'

export interface CreditNote {
    id: string
    creditNoteNumber: string // e.g., CN-2024-0001
    creditNoteDate: Date
    supplierId: string
    supplier?: Supplier
    grnId?: string
    grnNumber?: string
    purchaseOrderId?: string
    purchaseOrderNumber?: string
    reason: 'quality_issue' | 'short_supply' | 'price_difference' | 'return' | 'other'
    status: CreditNoteStatus
    notes?: string
    items: CreditNoteItem[]
    subtotal: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
    createdAt: Date
    updatedAt: Date
}

export interface CreditNoteItem {
    id: string
    creditNoteId: string
    sparePartId: string
    sparePart?: SparePart
    grnItemId?: string
    quantity: number
    unitCost: number
    gstRate: number
    cgstAmount: number
    sgstAmount: number
    igstAmount: number
    totalAmount: number
    reason?: string
}
