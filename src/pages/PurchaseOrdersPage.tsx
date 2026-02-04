import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
// import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ShoppingCart, Plus, Eye, FileCheck, Trash2, Search } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { purchaseOrders } from '@/data/mock-transactions'
import { suppliers, locations } from '@/data/mock-data'
import { formatDate, formatCurrency, generateId } from '@/lib/utils'
import { toast } from 'sonner'

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    sent: { label: 'Sent', variant: 'info' as const },
    acknowledged: { label: 'Acknowledged', variant: 'info' as const },
    partial: { label: 'Partial', variant: 'warning' as const },
    completed: { label: 'Completed', variant: 'success' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
}

interface POItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    quantity: number
    unitCost: number
}

export default function PurchaseOrdersPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [supplierId, setSupplierId] = useState('')
    const [locationId, setLocationId] = useState('')
    const [paymentTerms, setPaymentTerms] = useState('Net 30')
    const [items, setItems] = useState<POItem[]>([])

    const partsSuppliers = suppliers.filter(s => s.type === 'supplier')
    const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || '-'

    const resetForm = () => {
        setSupplierId('')
        setLocationId('')
        setPaymentTerms('Net 30')
        setItems([])
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            partNumber: selected.sparePart.partNumber,
            quantity: selected.quantity,
            unitCost: selected.unitCost
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const totalAmount = items.reduce((sum, i) => sum + (i.quantity * i.unitCost * 1.18), 0) // Including 18% GST

    const handleSubmit = () => {
        if (!supplierId || !locationId || items.length === 0) {
            toast.error('Please fill all required fields and add at least one item')
            return
        }
        const supplier = suppliers.find(s => s.id === supplierId)
        toast.success(`Purchase Order created for ${supplier?.name}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Purchase Orders</h1><p className="text-muted-foreground">Manage supplier purchase orders</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New PO</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total POs</p><p className="text-2xl font-bold">{purchaseOrders.length}</p></CardContent></Card>
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open POs</p><p className="text-2xl font-bold text-blue-600">{purchaseOrders.filter(p => !['completed', 'cancelled'].includes(p.status)).length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold">{formatCurrency(purchaseOrders.reduce((s, p) => s + p.totalAmount, 0))}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{purchaseOrders.filter(p => p.status === 'completed').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ShoppingCart className="h-5 w-5" />Purchase Orders</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>PO #</TableHead><TableHead>Date</TableHead><TableHead>Supplier</TableHead><TableHead>Indent Ref</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {purchaseOrders.map((po) => (
                                <TableRow key={po.id}>
                                    <TableCell className="font-mono font-medium">{po.poNumber}</TableCell>
                                    <TableCell>{formatDate(po.poDate)}</TableCell>
                                    <TableCell>{getSupplierName(po.supplierId)}</TableCell>
                                    <TableCell>{po.indentNumber ? <Badge variant="outline">{po.indentNumber}</Badge> : '-'}</TableCell>
                                    <TableCell>{po.items.length} item(s)</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(po.totalAmount)}</TableCell>
                                    <TableCell><Badge variant={statusConfig[po.status].variant}>{statusConfig[po.status].label}</Badge></TableCell>
                                    <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>{po.status !== 'completed' && po.status !== 'cancelled' && <Button variant="outline" size="sm" className="gap-1"><FileCheck className="h-3 w-3" />GRN</Button>}</div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New PO Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Purchase Order</DialogTitle>
                        <DialogDescription>Create a new purchase order for supplier</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Supplier *</Label>
                                <Select value={supplierId} onValueChange={setSupplierId}>
                                    <SelectTrigger><SelectValue placeholder="Select supplier" /></SelectTrigger>
                                    <SelectContent>
                                        {partsSuppliers.map(s => (<SelectItem key={s.id} value={s.id}>{s.code} - {s.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Delivery Location *</Label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                    <SelectContent>
                                        {locations.filter(l => l.isActive && l.type !== 'production_line').map(l => (<SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Payment Terms</Label>
                            <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Advance">Advance</SelectItem>
                                    <SelectItem value="Net 15">Net 15</SelectItem>
                                    <SelectItem value="Net 30">Net 30</SelectItem>
                                    <SelectItem value="Net 45">Net 45</SelectItem>
                                    <SelectItem value="Net 60">Net 60</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Add Items *</Label>
                            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setIsSearchOpen(true)}>
                                <Search className="h-4 w-4" />
                                Search and Add Spare Parts
                            </Button>
                        </div>

                        {items.length > 0 && (
                            <div className="border rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium">PO Items ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <span className="text-muted-foreground ml-2 text-xs">({item.partNumber})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">Qty: {item.quantity}</Badge>
                                            <span className="text-muted-foreground">@ {formatCurrency(item.unitCost)}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 text-right font-medium">Total (incl. 18% GST): {formatCurrency(totalAmount)}</div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create PO</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="purchase"
                title="Add Part to Purchase Order"
            />
        </div>
    )
}
