import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Boxes, Search, AlertTriangle } from 'lucide-react'
import { spareParts, stockLevels, locations } from '@/data/mock-data'
import { formatCurrency } from '@/lib/utils'

export default function StockLevelsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedLocation, setSelectedLocation] = useState<string>('all')

    // Join stock levels with spare parts and locations
    const enrichedStockLevels = stockLevels.map((sl) => {
        const part = spareParts.find((sp) => sp.id === sl.sparePartId)
        const location = locations.find((loc) => loc.id === sl.locationId)
        return {
            ...sl,
            partNumber: part?.partNumber || '',
            partName: part?.name || '',
            categoryName: part?.categoryName || '',
            unitCost: part?.unitCost || 0,
            reorderPoint: part?.reorderPoint || 0,
            locationName: location?.name || '',
            locationCode: location?.code || '',
        }
    })

    // Filter stock levels
    const filteredStock = enrichedStockLevels.filter((sl) => {
        const matchesSearch =
            sl.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sl.partName.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesLocation = selectedLocation === 'all' || sl.locationId === selectedLocation
        return matchesSearch && matchesLocation
    })

    // Sort by low stock first
    const sortedStock = [...filteredStock].sort((a, b) => {
        const aLow = a.quantityAvailable <= a.reorderPoint
        const bLow = b.quantityAvailable <= b.reorderPoint
        if (aLow && !bLow) return -1
        if (!aLow && bLow) return 1
        return 0
    })

    // Calculate totals
    const totalValue = filteredStock.reduce((sum, sl) => sum + sl.quantityOnHand * sl.unitCost, 0)
    const lowStockCount = filteredStock.filter((sl) => sl.quantityAvailable <= sl.reorderPoint).length

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Stock Levels</h1>
                    <p className="text-muted-foreground">Location-wise inventory status</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total Stock Value</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Total SKU-Locations</p>
                        <p className="text-2xl font-bold">{filteredStock.length}</p>
                    </CardContent>
                </Card>
                <Card className={lowStockCount > 0 ? 'border-amber-300 bg-amber-50 dark:bg-amber-950/20' : ''}>
                    <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">Low Stock Items</p>
                        <p className="text-2xl font-bold flex items-center gap-2">
                            {lowStockCount}
                            {lowStockCount > 0 && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by part number or name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="All Locations" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                {locations.map((loc) => (
                                    <SelectItem key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Stock Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Boxes className="h-5 w-5" />
                        Inventory ({sortedStock.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Part Number</TableHead>
                                <TableHead>Part Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="text-right">On Hand</TableHead>
                                <TableHead className="text-right">Reserved</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                                <TableHead className="text-right">Reorder Pt</TableHead>
                                <TableHead className="text-right">Value</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedStock.map((sl) => {
                                const isLow = sl.quantityAvailable <= sl.reorderPoint
                                const value = sl.quantityOnHand * sl.unitCost
                                return (
                                    <TableRow key={sl.id} className={isLow ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}>
                                        <TableCell className="font-mono font-medium">{sl.partNumber}</TableCell>
                                        <TableCell>{sl.partName}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{sl.locationCode}</Badge>
                                            <span className="ml-2 text-sm text-muted-foreground">{sl.locationName}</span>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">{sl.quantityOnHand}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{sl.quantityReserved}</TableCell>
                                        <TableCell className="text-right font-medium">{sl.quantityAvailable}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{sl.reorderPoint}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(value)}</TableCell>
                                        <TableCell>
                                            {isLow ? (
                                                <Badge variant="warning" className="gap-1">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="success">OK</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
