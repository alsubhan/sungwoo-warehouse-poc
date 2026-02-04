import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
// import { Input } from '@/components/ui/input'
import { ArrowLeftRight, Plus, Eye, Search, Trash2 } from 'lucide-react'
import { stockTransfers } from '@/data/mock-transactions'
import { locations } from '@/data/mock-data'
import { formatDate, generateId } from '@/lib/utils'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { toast } from 'sonner'

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    in_transit: { label: 'In Transit', variant: 'info' as const },
    received: { label: 'Received', variant: 'success' as const },
    completed: { label: 'Completed', variant: 'success' as const },
}

interface TransferItem {
    id: string
    sparePartId: string
    sparePartName: string
    quantity: number
    quantityAvailable: number
}

export default function StockTransferPage() {
    const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || '-'
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [fromLocationId, setFromLocationId] = useState('')
    const [toLocationId, setToLocationId] = useState('')
    const [items, setItems] = useState<TransferItem[]>([])

    const availableLocations = locations.filter(l => l.isActive)

    const resetForm = () => {
        setFromLocationId('')
        setToLocationId('')
        setItems([])
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            quantity: selected.quantity,
            quantityAvailable: selected.sparePart.currentStock || 0
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const handleSubmit = () => {
        if (!fromLocationId || !toLocationId || items.length === 0) {
            toast.error('Please select locations and add at least one item')
            return
        }
        if (fromLocationId === toLocationId) {
            toast.error('Source and Destination locations cannot be same')
            return
        }
        toast.success(`Stock Transfer initiated to ${getLocationName(toLocationId)}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Stock Transfer</h1><p className="text-muted-foreground">Move material between locations</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New Transfer</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Transfers</p><p className="text-2xl font-bold">{stockTransfers.length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Transit</p><p className="text-2xl font-bold text-amber-600">{stockTransfers.filter(t => t.status === 'in_transit').length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{stockTransfers.filter(t => t.status === 'completed').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ArrowLeftRight className="h-5 w-5" />Stock Transfers</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Transfer #</TableHead><TableHead>Date</TableHead><TableHead>From</TableHead><TableHead>To</TableHead><TableHead>Items</TableHead><TableHead>Requested By</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {stockTransfers.map((transfer) => (
                                <TableRow key={transfer.id}>
                                    <TableCell className="font-mono font-medium">{transfer.transferNumber}</TableCell>
                                    <TableCell>{formatDate(transfer.transferDate)}</TableCell>
                                    <TableCell><Badge variant="outline">{getLocationName(transfer.fromLocationId)}</Badge></TableCell>
                                    <TableCell><Badge variant="outline">{getLocationName(transfer.toLocationId)}</Badge></TableCell>
                                    <TableCell>{transfer.items.length} item(s)</TableCell>
                                    <TableCell>{transfer.requestedBy}</TableCell>
                                    <TableCell><Badge variant={statusConfig[transfer.status].variant}>{statusConfig[transfer.status].label}</Badge></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New Transfer Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Stock Transfer</DialogTitle>
                        <DialogDescription>Move items from one location to another</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>From Location *</Label>
                                <Select value={fromLocationId} onValueChange={setFromLocationId}>
                                    <SelectTrigger><SelectValue placeholder="Select Source" /></SelectTrigger>
                                    <SelectContent>
                                        {availableLocations.map(l => (
                                            <SelectItem key={l.id} value={l.id} disabled={l.id === toLocationId}>{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>To Location *</Label>
                                <Select value={toLocationId} onValueChange={setToLocationId}>
                                    <SelectTrigger><SelectValue placeholder="Select Destination" /></SelectTrigger>
                                    <SelectContent>
                                        {availableLocations.map(l => (
                                            <SelectItem key={l.id} value={l.id} disabled={l.id === fromLocationId}>{l.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Add Items *</Label>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full gap-2"
                                onClick={() => {
                                    if (!fromLocationId) {
                                        toast.error('Please select From Location first')
                                        return
                                    }
                                    setIsSearchOpen(true)
                                }}
                            >
                                <Search className="h-4 w-4" />
                                Search Items from Source Location
                            </Button>
                        </div>

                        {items.length > 0 && (
                            <div className="border rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium">Items to Transfer ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <p className="text-xs text-muted-foreground">Available: {item.quantityAvailable}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline">Qty: {item.quantity}</Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create Transfer</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="issue"
                locationId={fromLocationId} // Filter stock by source location
                title={`Select Items from ${getLocationName(fromLocationId)}`}
            />
        </div>
    )
}
