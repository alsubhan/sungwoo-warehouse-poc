import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Plus, Search, Edit, Eye, Package } from 'lucide-react'
import { spareParts, stockLevels, categories } from '@/data/mock-data'
import { formatCurrency } from '@/lib/utils'
import type { SparePart } from '@/types'

export default function SparePartsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedPart, setSelectedPart] = useState<SparePart | null>(null)
    const [isViewOpen, setIsViewOpen] = useState(false)

    // Filter spare parts based on search
    const filteredParts = spareParts.filter(
        (part) =>
            part.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            part.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Get total stock for a part across locations
    const getTotalStock = (partId: string) => {
        return stockLevels
            .filter((sl) => sl.sparePartId === partId)
            .reduce((sum, sl) => sum + sl.quantityAvailable, 0)
    }

    const handleViewPart = (part: SparePart) => {
        setSelectedPart(part)
        setIsViewOpen(true)
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Spare Parts</h1>
                    <p className="text-muted-foreground">Manage spare parts catalog</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Spare Part
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by part number, name, or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Parts Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Spare Parts ({filteredParts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Part Number</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>HSN Code</TableHead>
                                <TableHead className="text-right">Stock</TableHead>
                                <TableHead className="text-right">Unit Cost</TableHead>
                                <TableHead className="text-right">GST</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParts.map((part) => {
                                const totalStock = getTotalStock(part.id)
                                const isLowStock = totalStock <= part.reorderPoint
                                return (
                                    <TableRow key={part.id}>
                                        <TableCell className="font-mono font-medium">{part.partNumber}</TableCell>
                                        <TableCell>{part.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{part.categoryName}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono">{part.hsnCode}</TableCell>
                                        <TableCell className="text-right">
                                            <span className={isLowStock ? 'text-amber-600 font-medium' : ''}>
                                                {totalStock}
                                            </span>
                                            {isLowStock && (
                                                <span className="ml-1 text-xs text-amber-600">(Low)</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">{formatCurrency(part.unitCost)}</TableCell>
                                        <TableCell className="text-right">{part.gstRate}%</TableCell>
                                        <TableCell>
                                            <Badge variant={part.isActive ? 'success' : 'secondary'}>
                                                {part.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => handleViewPart(part)}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Part Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Spare Part Details</DialogTitle>
                        <DialogDescription>View spare part information</DialogDescription>
                    </DialogHeader>
                    {selectedPart && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Part Number</p>
                                    <p className="font-mono font-medium">{selectedPart.partNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Name</p>
                                    <p className="font-medium">{selectedPart.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Category</p>
                                    <p>{selectedPart.categoryName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">HSN Code</p>
                                    <p className="font-mono">{selectedPart.hsnCode}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit Cost</p>
                                    <p>{formatCurrency(selectedPart.unitCost)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Selling Price</p>
                                    <p>{formatCurrency(selectedPart.sellingPrice)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">GST Rate</p>
                                    <p>{selectedPart.gstRate}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit</p>
                                    <p>{selectedPart.unitName}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-2">Stock Levels</p>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Min Level</p>
                                        <p className="font-medium">{selectedPart.minStockLevel}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Reorder Point</p>
                                        <p className="font-medium">{selectedPart.reorderPoint}</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-muted">
                                        <p className="text-xs text-muted-foreground">Max Level</p>
                                        <p className="font-medium">{selectedPart.maxStockLevel}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedPart.description && (
                                <div>
                                    <p className="text-sm text-muted-foreground">Description</p>
                                    <p>{selectedPart.description}</p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
