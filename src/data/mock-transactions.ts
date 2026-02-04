import type { ProductionIssue, Rework, Indent, StockTransfer } from '@/types/transactions'
import type { DeliveryChallan, PurchaseOrder, GRN, SaleInvoice, CreditNote } from '@/types/documents'

// Production Issues
export const productionIssues: ProductionIssue[] = [
    {
        id: 'pi-1',
        issueNumber: 'ISS-2024-0001',
        issueDate: new Date('2024-01-20'),
        issueType: 'breakdown',
        machineId: 'mch-3',
        machineName: 'Welding Robot #1',
        locationId: 'loc-5',
        locationName: 'Line-1 Production',
        requestedBy: 'Rajesh Kumar',
        approvedBy: 'Suresh Patel',
        status: 'closed',
        notes: 'Urgent breakdown - robot arm servo failure',
        items: [
            { id: 'pii-1', productionIssueId: 'pi-1', sparePartId: 'sp-1', fromLocationId: 'loc-1', fromLocationName: 'Main Warehouse', quantityIssued: 1, quantityReturned: 0, unitCost: 125000 },
        ],
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
    },
    {
        id: 'pi-2',
        issueNumber: 'ISS-2024-0002',
        issueDate: new Date('2024-02-05'),
        issueType: 'planned_maintenance',
        machineId: 'mch-4',
        machineName: 'Welding Robot #2',
        locationId: 'loc-5',
        locationName: 'Line-1 Production',
        requestedBy: 'Amit Singh',
        approvedBy: 'Suresh Patel',
        status: 'issued',
        notes: 'Scheduled PM - welding tips replacement',
        items: [
            { id: 'pii-2', productionIssueId: 'pi-2', sparePartId: 'sp-3', fromLocationId: 'loc-1', fromLocationName: 'Main Warehouse', quantityIssued: 20, quantityReturned: 5, unitCost: 450 },
        ],
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-10'),
    },
]

// Reworks
export const reworks: Rework[] = [
    {
        id: 'rw-1',
        reworkNumber: 'RW-2024-0001',
        reworkDate: new Date('2024-01-25'),
        serviceVendorId: 'sup-4',
        status: 'completed',
        deliveryChallanId: 'dc-1',
        deliveryChallanNumber: 'DC-2024-0001',
        vendorInvoiceNumber: 'PR/INV/2024/0045',
        vendorInvoiceDate: new Date('2024-02-01'),
        receivedDate: new Date('2024-02-05'),
        receivedBy: 'Vijay Kumar',
        notes: 'Servo motor bearing replacement',
        items: [
            { id: 'rwi-1', reworkId: 'rw-1', sparePartId: 'sp-1', serialNumber: 'SM-001-2023', faultDescription: 'Bearing noise, overheating', quantitySent: 1, quantityReceived: 1, quantityRejected: 0, repairCost: 15000 },
        ],
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-05'),
    },
    {
        id: 'rw-2',
        reworkNumber: 'RW-2024-0002',
        reworkDate: new Date('2024-02-10'),
        serviceVendorId: 'sup-5',
        status: 'in_service',
        deliveryChallanId: 'dc-2',
        deliveryChallanNumber: 'DC-2024-0002',
        notes: 'Hydraulic cylinder seal replacement',
        items: [
            { id: 'rwi-2', reworkId: 'rw-2', sparePartId: 'sp-2', faultDescription: 'Oil leakage from seals', quantitySent: 1, quantityReceived: 0, quantityRejected: 0 },
        ],
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
    },
]

// Indents
export const indents: Indent[] = [
    {
        id: 'ind-1',
        indentNumber: 'IND-2024-0001',
        indentDate: new Date('2024-02-01'),
        requestedBy: 'Maintenance Dept',
        department: 'Maintenance',
        priority: 'high',
        status: 'approved',
        approvedBy: 'HOD Maintenance',
        approvedDate: new Date('2024-02-02'),
        purchaseOrderId: 'po-1',
        purchaseOrderNumber: 'PO-2024-0001',
        items: [
            { id: 'indi-1', indentId: 'ind-1', sparePartId: 'sp-5', quantityRequested: 50, quantityApproved: 50, requiredDate: new Date('2024-02-15'), justification: 'Stock replenishment' },
            { id: 'indi-2', indentId: 'ind-1', sparePartId: 'sp-7', quantityRequested: 20, quantityApproved: 15, requiredDate: new Date('2024-02-15'), justification: 'Sensors failing frequently' },
        ],
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-03'),
    },
    {
        id: 'ind-2',
        indentNumber: 'IND-2024-0002',
        indentDate: new Date('2024-02-08'),
        requestedBy: 'Production Dept',
        department: 'Production',
        priority: 'urgent',
        status: 'pending_approval',
        items: [
            { id: 'indi-3', indentId: 'ind-2', sparePartId: 'sp-6', quantityRequested: 1, requiredDate: new Date('2024-02-12'), justification: 'PLC failure on Line-2' },
        ],
        createdAt: new Date('2024-02-08'),
        updatedAt: new Date('2024-02-08'),
    },
]

// Stock Transfers
export const stockTransfers: StockTransfer[] = [
    {
        id: 'trf-1',
        transferNumber: 'TRF-2024-0001',
        transferDate: new Date('2024-02-05'),
        fromLocationId: 'loc-1',
        toLocationId: 'loc-2',
        status: 'completed',
        requestedBy: 'Store Keeper',
        approvedBy: 'Store Manager',
        receivedBy: 'Line-1 Supervisor',
        receivedDate: new Date('2024-02-05'),
        items: [
            { id: 'trfi-1', stockTransferId: 'trf-1', sparePartId: 'sp-3', quantityRequested: 20, quantitySent: 20, quantityReceived: 20 },
            { id: 'trfi-2', stockTransferId: 'trf-1', sparePartId: 'sp-5', quantityRequested: 10, quantitySent: 10, quantityReceived: 10 },
        ],
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-05'),
    },
]

// Delivery Challans
export const deliveryChallans: DeliveryChallan[] = [
    {
        id: 'dc-1',
        dcNumber: 'DC-2024-0001',
        dcDate: new Date('2024-01-25'),
        dcType: 'returnable',
        partyId: 'sup-4',
        partyName: 'Precision Repairs',
        partyGstin: '29AABCP3456D4ZM',
        vehicleNumber: 'KA-01-AB-1234',
        status: 'returned',
        returnDueDate: new Date('2024-02-10'),
        returnedDate: new Date('2024-02-05'),
        referenceType: 'rework',
        referenceId: 'rw-1',
        items: [
            { id: 'dci-1', deliveryChallanId: 'dc-1', sparePartId: 'sp-1', hsnCode: '85013110', quantity: 1, unitId: 'unit-1', unitName: 'Pcs', quantityReturned: 1 },
        ],
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-05'),
    },
    {
        id: 'dc-2',
        dcNumber: 'DC-2024-0002',
        dcDate: new Date('2024-02-10'),
        dcType: 'returnable',
        partyId: 'sup-5',
        partyName: 'Servo Solutions',
        partyGstin: '27AABCS7890E5ZN',
        vehicleNumber: 'MH-12-CD-5678',
        status: 'dispatched',
        returnDueDate: new Date('2024-02-25'),
        referenceType: 'rework',
        referenceId: 'rw-2',
        items: [
            { id: 'dci-2', deliveryChallanId: 'dc-2', sparePartId: 'sp-2', hsnCode: '84123100', quantity: 1, unitId: 'unit-1', unitName: 'Pcs' },
        ],
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-02-10'),
    },
]

// Purchase Orders
export const purchaseOrders: PurchaseOrder[] = [
    {
        id: 'po-1',
        poNumber: 'PO-2024-0001',
        poDate: new Date('2024-02-03'),
        supplierId: 'sup-1',
        deliveryLocationId: 'loc-1',
        deliveryLocationName: 'Main Warehouse',
        expectedDeliveryDate: new Date('2024-02-15'),
        status: 'completed',
        indentId: 'ind-1',
        indentNumber: 'IND-2024-0001',
        paymentTerms: 'Net 30',
        items: [
            { id: 'poi-1', purchaseOrderId: 'po-1', sparePartId: 'sp-5', quantity: 50, receivedQuantity: 50, unitCost: 350, discount: 0, gstRate: 18, cgstAmount: 3150, sgstAmount: 3150, igstAmount: 0, totalAmount: 20650 },
            { id: 'poi-2', purchaseOrderId: 'po-1', sparePartId: 'sp-7', quantity: 15, receivedQuantity: 15, unitCost: 1200, discount: 0, gstRate: 18, cgstAmount: 1620, sgstAmount: 1620, igstAmount: 0, totalAmount: 21240 },
        ],
        subtotal: 35500,
        cgstAmount: 3195,
        sgstAmount: 3195,
        igstAmount: 0,
        totalAmount: 41890,
        createdAt: new Date('2024-02-03'),
        updatedAt: new Date('2024-02-15'),
    },
]

// GRNs
export const grns: GRN[] = [
    {
        id: 'grn-1',
        grnNumber: 'GRN-2024-0001',
        grnDate: new Date('2024-02-15'),
        purchaseOrderId: 'po-1',
        purchaseOrderNumber: 'PO-2024-0001',
        supplierId: 'sup-1',
        vendorInvoiceNumber: 'HMS/INV/2024/1234',
        vendorInvoiceDate: new Date('2024-02-14'),
        receivedLocationId: 'loc-1',
        receivedLocationName: 'Main Warehouse',
        receivedBy: 'Store Keeper',
        status: 'completed',
        qualityCheckStatus: 'passed',
        items: [
            { id: 'grni-1', grnId: 'grn-1', purchaseOrderItemId: 'poi-1', sparePartId: 'sp-5', orderedQuantity: 50, receivedQuantity: 50, acceptedQuantity: 50, rejectedQuantity: 0, unitCost: 350, gstRate: 18, cgstAmount: 3150, sgstAmount: 3150, igstAmount: 0, totalAmount: 20650 },
            { id: 'grni-2', grnId: 'grn-1', purchaseOrderItemId: 'poi-2', sparePartId: 'sp-7', orderedQuantity: 15, receivedQuantity: 15, acceptedQuantity: 15, rejectedQuantity: 0, unitCost: 1200, gstRate: 18, cgstAmount: 1620, sgstAmount: 1620, igstAmount: 0, totalAmount: 21240 },
        ],
        subtotal: 35500,
        cgstAmount: 3195,
        sgstAmount: 3195,
        igstAmount: 0,
        totalAmount: 41890,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15'),
    },
]

// Sale Invoices
export const saleInvoices: SaleInvoice[] = [
    {
        id: 'inv-1',
        invoiceNumber: 'INV-2024-0001',
        invoiceDate: new Date('2024-02-18'),
        customerId: 'cust-1',
        customerName: 'Hyundai Motor India',
        customerGstin: '33AAACH1234A1ZK',
        customerAddress: 'Plot 123, SIPCOT, Chennai',
        billingAddress: 'Plot 123, SIPCOT, Chennai',
        shippingAddress: 'Plot 123, SIPCOT, Chennai',
        status: 'irn_generated',
        irn: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
        irnGeneratedDate: new Date('2024-02-18'),
        acknowledgeNumber: 'ACK123456789',
        subtotal: 115000,
        discountAmount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 20700,
        roundingAdjustment: 0,
        totalAmount: 135700,
        paymentTerms: 'Net 45',
        dueDate: new Date('2024-04-04'),
        items: [
            { id: 'invi-1', saleInvoiceId: 'inv-1', sparePartId: 'sp-9', hsnCode: '85152100', quantity: 1, unitPrice: 115000, discount: 0, gstRate: 18, cgstAmount: 0, sgstAmount: 0, igstAmount: 20700, totalAmount: 135700 },
        ],
        createdAt: new Date('2024-02-18'),
        updatedAt: new Date('2024-02-18'),
    },
]

// Credit Notes
export const creditNotes: CreditNote[] = [
    {
        id: 'cn-1',
        creditNoteNumber: 'CN-2024-0001',
        creditNoteDate: new Date('2024-02-20'),
        supplierId: 'sup-2',
        grnId: 'grn-1',
        grnNumber: 'GRN-2024-0001',
        reason: 'price_difference',
        status: 'issued',
        notes: 'Price correction as per revised PO',
        items: [
            { id: 'cni-1', creditNoteId: 'cn-1', sparePartId: 'sp-5', quantity: 50, unitCost: 25, gstRate: 18, cgstAmount: 225, sgstAmount: 225, igstAmount: 0, totalAmount: 1700 },
        ],
        subtotal: 1250,
        cgstAmount: 225,
        sgstAmount: 225,
        igstAmount: 0,
        totalAmount: 1700,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2024-02-20'),
    },
]
