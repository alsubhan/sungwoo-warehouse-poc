import type {
    SparePart,
    Location,
    StockLevel,
    Category,
    Unit,
    Supplier,
    Tax,
    Machine,
    MachinePartLink
} from '@/types/core'

// Categories
export const categories: Category[] = [
    { id: 'cat-1', name: 'Electrical', description: 'Motors, sensors, drives', isActive: true },
    { id: 'cat-2', name: 'Mechanical', description: 'Bearings, gears, shafts', isActive: true },
    { id: 'cat-3', name: 'Hydraulic', description: 'Cylinders, pumps, valves', isActive: true },
    { id: 'cat-4', name: 'Pneumatic', description: 'Air cylinders, FRL units', isActive: true },
    { id: 'cat-5', name: 'Tooling', description: 'Dies, punches, fixtures', isActive: true },
    { id: 'cat-6', name: 'Welding', description: 'Tips, guns, consumables', isActive: true },
    { id: 'cat-7', name: 'Safety', description: 'Guards, sensors, switches', isActive: true },
    { id: 'cat-8', name: 'Automation', description: 'PLC, HMI, robots', isActive: true },
]

// Units
export const units: Unit[] = [
    { id: 'unit-1', name: 'Piece', abbreviation: 'Pcs', isActive: true },
    { id: 'unit-2', name: 'Set', abbreviation: 'Set', isActive: true },
    { id: 'unit-3', name: 'Kilogram', abbreviation: 'Kg', isActive: true },
    { id: 'unit-4', name: 'Meter', abbreviation: 'Mtr', isActive: true },
    { id: 'unit-5', name: 'Liter', abbreviation: 'Ltr', isActive: true },
    { id: 'unit-6', name: 'Box', abbreviation: 'Box', isActive: true },
    { id: 'unit-7', name: 'Pair', abbreviation: 'Pair', isActive: true },
]

// Locations
export const locations: Location[] = [
    { id: 'loc-1', code: 'MWH', name: 'Main Warehouse', type: 'main_warehouse', isActive: true, createdAt: new Date() },
    { id: 'loc-2', code: 'L1-SS', name: 'Line-1 Sub Store', type: 'sub_store', parentId: 'loc-1', isActive: true, createdAt: new Date() },
    { id: 'loc-3', code: 'L2-SS', name: 'Line-2 Sub Store', type: 'sub_store', parentId: 'loc-1', isActive: true, createdAt: new Date() },
    { id: 'loc-4', code: 'TR', name: 'Tool Room', type: 'tool_room', isActive: true, createdAt: new Date() },
    { id: 'loc-5', code: 'L1-PROD', name: 'Line-1 Production', type: 'production_line', isActive: true, createdAt: new Date() },
    { id: 'loc-6', code: 'L2-PROD', name: 'Line-2 Production', type: 'production_line', isActive: true, createdAt: new Date() },
]

// Suppliers
export const suppliers: Supplier[] = [
    { id: 'sup-1', code: 'SUP001', name: 'Hyundai Motors Spares', type: 'supplier', gstin: '29AABCH1234A1ZH', state: 'Karnataka', city: 'Bangalore', isActive: true, createdAt: new Date() },
    { id: 'sup-2', code: 'SUP002', name: 'Korea Automation Ltd', type: 'supplier', gstin: '27AABCK5678B2ZK', state: 'Maharashtra', city: 'Pune', isActive: true, createdAt: new Date() },
    { id: 'sup-3', code: 'SUP003', name: 'Siemens India', type: 'supplier', gstin: '33AABCS9012C3ZL', state: 'Tamil Nadu', city: 'Chennai', isActive: true, createdAt: new Date() },
    { id: 'sup-4', code: 'SVC001', name: 'Precision Repairs', type: 'service_vendor', gstin: '29AABCP3456D4ZM', state: 'Karnataka', city: 'Bangalore', isActive: true, createdAt: new Date() },
    { id: 'sup-5', code: 'SVC002', name: 'Servo Solutions', type: 'service_vendor', gstin: '27AABCS7890E5ZN', state: 'Maharashtra', city: 'Mumbai', isActive: true, createdAt: new Date() },
]

// Taxes (GST)
export const taxes: Tax[] = [
    { id: 'tax-1', name: 'GST 5%', rate: 5, cgstRate: 2.5, sgstRate: 2.5, igstRate: 5, isActive: true },
    { id: 'tax-2', name: 'GST 12%', rate: 12, cgstRate: 6, sgstRate: 6, igstRate: 12, isActive: true },
    { id: 'tax-3', name: 'GST 18%', rate: 18, cgstRate: 9, sgstRate: 9, igstRate: 18, isActive: true },
    { id: 'tax-4', name: 'GST 28%', rate: 28, cgstRate: 14, sgstRate: 14, igstRate: 28, isActive: true },
]

// Spare Parts
export const spareParts: SparePart[] = [
    { id: 'sp-1', partNumber: 'SW-SM-001', name: 'Servo Motor 5kW', description: 'AC Servo Motor for stamping press', categoryId: 'cat-1', categoryName: 'Electrical', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '85013110', gstRate: 18, minStockLevel: 2, maxStockLevel: 10, reorderPoint: 3, unitCost: 125000, sellingPrice: 150000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-2', partNumber: 'SW-HC-002', name: 'Hydraulic Cylinder 300T', description: 'Main press cylinder', categoryId: 'cat-3', categoryName: 'Hydraulic', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '84123100', gstRate: 18, minStockLevel: 1, maxStockLevel: 5, reorderPoint: 2, unitCost: 85000, sellingPrice: 102000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-3', partNumber: 'SW-WT-003', name: 'Welding Tips Cu 6mm', description: 'Spot welding tips copper', categoryId: 'cat-6', categoryName: 'Welding', unitId: 'unit-6', unitName: 'Box', hsnCode: '83119000', gstRate: 18, minStockLevel: 50, maxStockLevel: 200, reorderPoint: 75, unitCost: 450, sellingPrice: 550, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-4', partNumber: 'SW-DS-004', name: 'Die Set Door LH', description: 'Press die for left door panel', categoryId: 'cat-5', categoryName: 'Tooling', unitId: 'unit-2', unitName: 'Set', hsnCode: '82075000', gstRate: 18, minStockLevel: 1, maxStockLevel: 2, reorderPoint: 1, unitCost: 450000, sellingPrice: 540000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-5', partNumber: 'SW-BR-005', name: 'Ball Bearing 6205', description: 'Deep groove ball bearing', categoryId: 'cat-2', categoryName: 'Mechanical', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '84821010', gstRate: 18, minStockLevel: 20, maxStockLevel: 100, reorderPoint: 30, unitCost: 350, sellingPrice: 425, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-6', partNumber: 'SW-PLC-006', name: 'PLC CPU Module S7-1500', description: 'Siemens S7-1500 CPU 1516-3', categoryId: 'cat-8', categoryName: 'Automation', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '85371000', gstRate: 18, minStockLevel: 1, maxStockLevel: 3, reorderPoint: 1, unitCost: 285000, sellingPrice: 340000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-7', partNumber: 'SW-PS-007', name: 'Proximity Sensor M18', description: 'Inductive proximity sensor NPN', categoryId: 'cat-7', categoryName: 'Safety', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '85365090', gstRate: 18, minStockLevel: 10, maxStockLevel: 50, reorderPoint: 15, unitCost: 1200, sellingPrice: 1450, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-8', partNumber: 'SW-FRL-008', name: 'FRL Unit 1/2"', description: 'Filter regulator lubricator unit', categoryId: 'cat-4', categoryName: 'Pneumatic', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '84814090', gstRate: 18, minStockLevel: 5, maxStockLevel: 20, reorderPoint: 8, unitCost: 4500, sellingPrice: 5400, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-9', partNumber: 'SW-WG-009', name: 'Welding Gun Assembly', description: 'Robot spot welding gun', categoryId: 'cat-6', categoryName: 'Welding', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '85152100', gstRate: 18, minStockLevel: 2, maxStockLevel: 8, reorderPoint: 3, unitCost: 95000, sellingPrice: 115000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: 'sp-10', partNumber: 'SW-HV-010', name: 'Hydraulic Valve 4/3', description: 'Directional control valve', categoryId: 'cat-3', categoryName: 'Hydraulic', unitId: 'unit-1', unitName: 'Pcs', hsnCode: '84812090', gstRate: 18, minStockLevel: 3, maxStockLevel: 15, reorderPoint: 5, unitCost: 18000, sellingPrice: 22000, isActive: true, createdAt: new Date(), updatedAt: new Date() },
]

// Stock Levels
export const stockLevels: StockLevel[] = [
    { id: 'sl-1', sparePartId: 'sp-1', locationId: 'loc-1', quantityOnHand: 5, quantityReserved: 1, quantityAvailable: 4, lastUpdated: new Date() },
    { id: 'sl-2', sparePartId: 'sp-2', locationId: 'loc-1', quantityOnHand: 3, quantityReserved: 0, quantityAvailable: 3, lastUpdated: new Date() },
    { id: 'sl-3', sparePartId: 'sp-3', locationId: 'loc-1', quantityOnHand: 120, quantityReserved: 20, quantityAvailable: 100, lastUpdated: new Date() },
    { id: 'sl-4', sparePartId: 'sp-3', locationId: 'loc-2', quantityOnHand: 30, quantityReserved: 0, quantityAvailable: 30, lastUpdated: new Date() },
    { id: 'sl-5', sparePartId: 'sp-4', locationId: 'loc-4', quantityOnHand: 2, quantityReserved: 0, quantityAvailable: 2, lastUpdated: new Date() },
    { id: 'sl-6', sparePartId: 'sp-5', locationId: 'loc-1', quantityOnHand: 45, quantityReserved: 5, quantityAvailable: 40, lastUpdated: new Date() },
    { id: 'sl-7', sparePartId: 'sp-5', locationId: 'loc-2', quantityOnHand: 15, quantityReserved: 0, quantityAvailable: 15, lastUpdated: new Date() },
    { id: 'sl-8', sparePartId: 'sp-6', locationId: 'loc-1', quantityOnHand: 2, quantityReserved: 0, quantityAvailable: 2, lastUpdated: new Date() },
    { id: 'sl-9', sparePartId: 'sp-7', locationId: 'loc-1', quantityOnHand: 25, quantityReserved: 3, quantityAvailable: 22, lastUpdated: new Date() },
    { id: 'sl-10', sparePartId: 'sp-8', locationId: 'loc-1', quantityOnHand: 12, quantityReserved: 0, quantityAvailable: 12, lastUpdated: new Date() },
    { id: 'sl-11', sparePartId: 'sp-9', locationId: 'loc-1', quantityOnHand: 4, quantityReserved: 1, quantityAvailable: 3, lastUpdated: new Date() },
    { id: 'sl-12', sparePartId: 'sp-10', locationId: 'loc-1', quantityOnHand: 8, quantityReserved: 0, quantityAvailable: 8, lastUpdated: new Date() },
]

// Machines
export const machines: Machine[] = [
    { id: 'mch-1', machineCode: 'SP-001', name: 'Stamping Press 500T', type: 'stamping_press', locationId: 'loc-5', manufacturer: 'Schuler', model: 'MSD-500', status: 'operational', isActive: true, createdAt: new Date() },
    { id: 'mch-2', machineCode: 'SP-002', name: 'Stamping Press 800T', type: 'stamping_press', locationId: 'loc-5', manufacturer: 'Komatsu', model: 'H2F800', status: 'operational', isActive: true, createdAt: new Date() },
    { id: 'mch-3', machineCode: 'WR-001', name: 'Welding Robot #1', type: 'welding_robot', locationId: 'loc-5', manufacturer: 'FANUC', model: 'R-2000iC', status: 'operational', isActive: true, createdAt: new Date() },
    { id: 'mch-4', machineCode: 'WR-002', name: 'Welding Robot #2', type: 'welding_robot', locationId: 'loc-5', manufacturer: 'FANUC', model: 'R-2000iC', status: 'under_maintenance', isActive: true, createdAt: new Date() },
    { id: 'mch-5', machineCode: 'WR-003', name: 'Welding Robot #3', type: 'welding_robot', locationId: 'loc-6', manufacturer: 'ABB', model: 'IRB 6700', status: 'operational', isActive: true, createdAt: new Date() },
    { id: 'mch-6', machineCode: 'CV-001', name: 'Conveyor Line A', type: 'conveyor', locationId: 'loc-5', manufacturer: 'Daifuku', status: 'operational', isActive: true, createdAt: new Date() },
    { id: 'mch-7', machineCode: 'PB-001', name: 'Paint Booth #1', type: 'paint_booth', locationId: 'loc-6', manufacturer: 'Durr', model: 'EcoBooth', status: 'operational', isActive: true, createdAt: new Date() },
    { id: 'mch-8', machineCode: 'AS-001', name: 'Assembly Station #1', type: 'assembly', locationId: 'loc-6', status: 'operational', isActive: true, createdAt: new Date() },
]

// Machine Part Links
export const machinePartLinks: MachinePartLink[] = [
    { id: 'mpl-1', machineId: 'mch-1', sparePartId: 'sp-1', installedDate: new Date('2024-01-15'), installedBy: 'Tech-A', reason: 'replacement', isActive: true },
    { id: 'mpl-2', machineId: 'mch-1', sparePartId: 'sp-2', installedDate: new Date('2024-02-20'), installedBy: 'Tech-B', reason: 'preventive_maintenance', isActive: true },
    { id: 'mpl-3', machineId: 'mch-3', sparePartId: 'sp-9', installedDate: new Date('2024-03-10'), installedBy: 'Tech-A', reason: 'breakdown', isActive: true },
    { id: 'mpl-4', machineId: 'mch-3', sparePartId: 'sp-3', installedDate: new Date('2024-03-15'), installedBy: 'Tech-C', reason: 'replacement', isActive: true },
]
