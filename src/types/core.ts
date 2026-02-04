// Spare Part (SKU) type
export interface SparePart {
    id: string
    partNumber: string // Sungwoo part number (e.g., SW-SM-001)
    name: string
    description?: string
    categoryId: string
    categoryName?: string
    unitId: string
    unitName?: string
    hsnCode: string
    gstRate: number // GST percentage (5, 12, 18, 28)
    minStockLevel: number
    maxStockLevel: number
    reorderPoint: number
    unitCost: number
    sellingPrice: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

// Location type
export interface Location {
    id: string
    code: string
    name: string
    type: 'main_warehouse' | 'sub_store' | 'tool_room' | 'production_line'
    parentId?: string // For sub-locations
    address?: string
    isActive: boolean
    createdAt: Date
}

// Stock level per location
export interface StockLevel {
    id: string
    sparePartId: string
    sparePart?: SparePart
    locationId: string
    location?: Location
    quantityOnHand: number
    quantityReserved: number
    quantityAvailable: number // computed: onHand - reserved
    lastUpdated: Date
}

// Category
export interface Category {
    id: string
    name: string
    description?: string
    parentId?: string
    isActive: boolean
}

// Unit of Measurement
export interface Unit {
    id: string
    name: string
    abbreviation: string
    isActive: boolean
}

// Supplier / Vendor
export interface Supplier {
    id: string
    code: string
    name: string
    type: 'supplier' | 'service_vendor' // service_vendor for rework
    gstin?: string
    pan?: string
    address?: string
    city?: string
    state?: string
    pincode?: string
    phone?: string
    email?: string
    contactPerson?: string
    isActive: boolean
    createdAt: Date
}

// Tax (GST)
export interface Tax {
    id: string
    name: string // e.g., "GST 18%"
    rate: number // e.g., 18
    cgstRate: number // e.g., 9
    sgstRate: number // e.g., 9
    igstRate: number // e.g., 18
    hsnCodes?: string[] // Associated HSN codes
    isActive: boolean
}

// Machine
export interface Machine {
    id: string
    machineCode: string // e.g., SP-001, WR-042
    name: string
    type: 'stamping_press' | 'welding_robot' | 'conveyor' | 'paint_booth' | 'assembly' | 'other'
    locationId: string
    location?: Location
    manufacturer?: string
    model?: string
    serialNumber?: string
    installationDate?: Date
    lastMaintenanceDate?: Date
    status: 'operational' | 'under_maintenance' | 'breakdown' | 'decommissioned'
    isActive: boolean
    createdAt: Date
}

// Machine-Part Link (spare installed on machine)
export interface MachinePartLink {
    id: string
    machineId: string
    machine?: Machine
    sparePartId: string
    sparePart?: SparePart
    serialNumber?: string
    installedDate: Date
    installedBy: string
    removedDate?: Date
    removedBy?: string
    reason?: 'replacement' | 'preventive_maintenance' | 'breakdown' | 'upgrade'
    notes?: string
    isActive: boolean
}
