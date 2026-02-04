import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, ArrowLeft, Package, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'
import { spareParts, stockLevels, categories, units } from '@/data/mock-data'
import type { SparePart } from '@/types'

interface SparePartWithStock extends SparePart {
    currentStock?: number
    categoryName?: string
    unitName?: string
}

interface SelectedPart {
    sparePart: SparePart
    quantity: number
    unitCost: number
    notes?: string
    serialNumber?: string
}

interface SparePartSearchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onPartSelect: (part: SelectedPart) => void
    mode?: 'issue' | 'purchase' | 'receive' | 'sale'
    locationId?: string
    title?: string
}

export function SparePartSearchDialog({
    open,
    onOpenChange,
    onPartSelect,
    mode = 'issue',
    locationId,
    title = 'Add Spare Part'
}: SparePartSearchDialogProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<SparePartWithStock[]>([])
    const [selectedPart, setSelectedPart] = useState<SparePartWithStock | null>(null)
    const [quantity, setQuantity] = useState(1)
    const [unitCost, setUnitCost] = useState(0)
    const [serialNumber, setSerialNumber] = useState('')
    const [notes, setNotes] = useState('')
    const [error, setError] = useState<string | null>(null)

    // Enrich parts with stock and category info
    const enrichedParts: SparePartWithStock[] = spareParts
        .filter(p => p.isActive)
        .map(part => {
            const stock = locationId
                ? stockLevels.find(s => s.sparePartId === part.id && s.locationId === locationId)
                : stockLevels.filter(s => s.sparePartId === part.id).reduce((sum, s) => ({ ...s, currentStock: sum.currentStock + s.currentStock }), { currentStock: 0 } as any)
            const category = categories.find(c => c.id === part.categoryId)
            const unit = units.find(u => u.id === part.unitId)
            return {
                ...part,
                currentStock: stock?.currentStock || 0,
                categoryName: category?.name,
                unitName: unit?.abbreviation || unit?.name
            }
        })

    const searchParts = useCallback((term: string) => {
        if (!term.trim()) {
            setSearchResults([])
            return
        }
        const lowerTerm = term.toLowerCase().trim()
        const results = enrichedParts.filter(part =>
            part.name.toLowerCase().includes(lowerTerm) ||
            part.partNumber.toLowerCase().includes(lowerTerm) ||
            (part.hsnCode && part.hsnCode.toLowerCase().includes(lowerTerm)) ||
            (part.description && part.description.toLowerCase().includes(lowerTerm)) ||
            (part.categoryName && part.categoryName.toLowerCase().includes(lowerTerm))
        )
        setSearchResults(results.slice(0, 10))
    }, [enrichedParts])

    useEffect(() => {
        if (open) {
            setSearchTerm('')
            setSearchResults([])
            setSelectedPart(null)
            setQuantity(1)
            setUnitCost(0)
            setSerialNumber('')
            setNotes('')
            setError(null)
        }
    }, [open])

    useEffect(() => {
        searchParts(searchTerm)
    }, [searchTerm, searchParts])

    const openConfigure = (part: SparePartWithStock) => {
        setSelectedPart(part)
        setQuantity(1)
        setUnitCost(part.unitCost || 0)
        setSerialNumber('')
        setNotes('')
        setError(null)
    }

    const validateAndConfirm = () => {
        if (!selectedPart) return
        if (quantity <= 0) {
            setError('Quantity must be greater than 0')
            return
        }
        if (mode === 'issue' && quantity > (selectedPart.currentStock || 0)) {
            setError(`Insufficient stock. Available: ${selectedPart.currentStock}`)
            return
        }
        if ((mode === 'purchase' || mode === 'sale') && unitCost <= 0) {
            setError('Unit cost must be greater than 0')
            return
        }

        onPartSelect({
            sparePart: selectedPart,
            quantity,
            unitCost: unitCost || selectedPart.unitCost,
            notes: notes || undefined,
            serialNumber: serialNumber || undefined
        })
        onOpenChange(false)
    }

    const getPriceLabel = () => {
        switch (mode) {
            case 'sale': return 'Selling Price'
            case 'purchase': return 'Unit Cost'
            default: return 'Unit Cost'
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Search Input */}
                    {!selectedPart && (
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Part #, Name, HSN, or Category..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                                autoFocus
                            />
                        </div>
                    )}

                    {/* Empty State */}
                    {!selectedPart && !searchTerm && (
                        <div className="text-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                            <p className="text-muted-foreground font-medium">Search for spare parts</p>
                            <p className="text-muted-foreground/70 text-sm mt-1">Search by part number, name, HSN code, or category</p>
                        </div>
                    )}

                    {/* Search Results */}
                    {!selectedPart && searchTerm && (
                        <div>
                            <Label className="text-sm font-medium">
                                Results ({searchResults.length})
                            </Label>
                            <div className="grid gap-2 mt-2">
                                {searchResults.map((part) => (
                                    <div
                                        key={part.id}
                                        className="p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                                        onClick={() => openConfigure(part)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="font-medium">{part.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {part.partNumber}
                                                    {part.hsnCode && ` • HSN: ${part.hsnCode}`}
                                                    {part.unitName && ` • ${part.unitName}`}
                                                </div>
                                                {part.categoryName && (
                                                    <Badge variant="secondary" className="mt-1 text-xs">{part.categoryName}</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="text-right">
                                                    <div className="font-medium">{formatCurrency(part.unitCost)}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Stock: <span className={part.currentStock <= (part.reorderPoint || 0) ? 'text-amber-600 font-medium' : ''}>{part.currentStock}</span>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline" className="flex items-center gap-1">
                                                    <Plus className="h-4 w-4" />
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {searchResults.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No parts found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    )}

                    {/* Configure Panel */}
                    {selectedPart && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => { setSelectedPart(null); setError(null); }} className="flex items-center gap-1">
                                        <ArrowLeft className="h-4 w-4" /> Back
                                    </Button>
                                </div>
                            </div>

                            <div className="p-4 border rounded-lg bg-accent/30">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{selectedPart.name}</p>
                                        <p className="text-sm text-muted-foreground">{selectedPart.partNumber} {selectedPart.hsnCode && `• HSN: ${selectedPart.hsnCode}`}</p>
                                        {selectedPart.categoryName && <Badge variant="secondary" className="mt-1 text-xs">{selectedPart.categoryName}</Badge>}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">{formatCurrency(selectedPart.unitCost)}</p>
                                        <p className="text-xs text-muted-foreground">Stock: {selectedPart.currentStock}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantity *</Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={mode === 'issue' ? selectedPart.currentStock : undefined}
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    />
                                    {mode === 'issue' && (
                                        <p className="text-xs text-muted-foreground">Available: {selectedPart.currentStock}</p>
                                    )}
                                </div>
                                {(mode === 'purchase' || mode === 'sale') && (
                                    <div className="space-y-2">
                                        <Label>{getPriceLabel()} *</Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step={0.01}
                                            value={unitCost}
                                            onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                )}
                            </div>

                            {(mode === 'issue' || mode === 'receive') && (
                                <div className="space-y-2">
                                    <Label>Serial Number (optional)</Label>
                                    <Input
                                        value={serialNumber}
                                        onChange={(e) => setSerialNumber(e.target.value)}
                                        placeholder="e.g. SN-001-2024"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label>Notes (optional)</Label>
                                <Input
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Any additional notes..."
                                />
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-lg font-bold">{formatCurrency(quantity * (unitCost || selectedPart.unitCost))}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                                    <Button onClick={validateAndConfirm}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add to List
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
