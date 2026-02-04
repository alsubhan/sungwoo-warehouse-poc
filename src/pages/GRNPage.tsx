import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileCheck, Plus, Eye, Trash2 } from 'lucide-react'
import { grns, purchaseOrders } from '@/data/mock-transactions'
import { suppliers, spareParts, locations } from '@/data/mock-data'
import { formatDate, formatCurrency, generateId } from '@/lib/utils'
import { toast } from 'sonner'

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    partial: { label: 'Partial', variant: 'warning' as const },
    completed: { label: 'Completed', variant: 'success' as const },
    rejected: { label: 'Rejected', variant: 'destructive' as const },
}

interface GRNItem {
    id: string
    sparePartId: string
    sparePartName: string
    orderedQty: number
    receivedQty: number
    unitCost: number
}

export default function GRNPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [poNumber, setPoNumber] = useState('')
    const [vendorInvoice, setVendorInvoice] = useState('')
    const [locationId, setLocationId] = useState('')
    const [receivedBy, setReceivedBy] = useState('')
    const [items, setItems] = useState<GRNItem[]>([])

    const openPOs = purchaseOrders.filter(po => po.status !== 'completed' && po.status !== 'cancelled')
    const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || '-'

    const resetForm = () => {
        setPoNumber('')
        setVendorInvoice('')
        setLocationId('')
        setReceivedBy('')
        setItems([])
    }

    const handlePOSelect = (poId: string) => {
        setPoNumber(poId)
        const po = purchaseOrders.find(p => p.id === poId)
        if (po) {
            setItems(po.items.map(item => {
                const part = spareParts.find(p => p.id === item.sparePartId)
                return { id: generateId(), sparePartId: item.sparePartId, sparePartName: part?.name || '', orderedQty: item.quantity, receivedQty: item.quantity, unitCost: item.unitCost }
            }))
        }
    }

    const updateReceivedQty = (id: string, qty: number) => {
        setItems(items.map(i => i.id === id ? { ...i, receivedQty: qty } : i))
    }

    const totalAmount = items.reduce((sum, i) => sum + (i.receivedQty * i.unitCost * 1.18), 0)

    const handleSubmit = () => {
        if (!poNumber || !vendorInvoice || !locationId || !receivedBy) {
            toast.error('Please fill all required fields')
            return
        }
        toast.success('GRN created successfully - stock updated')
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Goods Received Notes</h1><p className="text-muted-foreground">Receive goods against purchase orders</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New GRN</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total GRNs</p><p className="text-2xl font-bold">{grns.length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Received Value</p><p className="text-2xl font-bold">{formatCurrency(grns.reduce((s, g) => s + g.totalAmount, 0))}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">QC Passed</p><p className="text-2xl font-bold text-green-600">{grns.filter(g => g.qualityCheckStatus === 'passed').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileCheck className="h-5 w-5" />Goods Received Notes</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>GRN #</TableHead><TableHead>Date</TableHead><TableHead>PO Reference</TableHead><TableHead>Supplier</TableHead><TableHead>Invoice #</TableHead><TableHead>Location</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {grns.map((grn) => (
                                <TableRow key={grn.id}>
                                    <TableCell className="font-mono font-medium">{grn.grnNumber}</TableCell>
                                    <TableCell>{formatDate(grn.grnDate)}</TableCell>
                                    <TableCell><Badge variant="outline">{grn.purchaseOrderNumber}</Badge></TableCell>
                                    <TableCell>{getSupplierName(grn.supplierId)}</TableCell>
                                    <TableCell>{grn.vendorInvoiceNumber || '-'}</TableCell>
                                    <TableCell>{grn.receivedLocationName}</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(grn.totalAmount)}</TableCell>
                                    <TableCell><Badge variant={statusConfig[grn.status].variant}>{statusConfig[grn.status].label}</Badge></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New GRN Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create GRN</DialogTitle>
                        <DialogDescription>Receive goods against a purchase order</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Purchase Order *</Label>
                                <Select value={poNumber} onValueChange={handlePOSelect}>
                                    <SelectTrigger><SelectValue placeholder="Select PO" /></SelectTrigger>
                                    <SelectContent>{openPOs.map(po => (<SelectItem key={po.id} value={po.id}>{po.poNumber}</SelectItem>))}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Vendor Invoice # *</Label>
                                <Input value={vendorInvoice} onChange={e => setVendorInvoice(e.target.value)} placeholder="e.g. INV/2024/001" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Receive to Location *</Label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                    <SelectContent>{locations.filter(l => l.isActive && l.type !== 'production_line').map(l => (<SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>))}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Received By *</Label>
                                <Input value={receivedBy} onChange={e => setReceivedBy(e.target.value)} placeholder="Store Keeper name" />
                            </div>
                        </div>

                        {items.length > 0 && (
                            <div className="border rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium">Items to Receive ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <span className="flex-1">{item.sparePartName}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-muted-foreground">Ordered: {item.orderedQty}</span>
                                            <div className="flex items-center gap-1">
                                                <Label className="text-xs">Recv:</Label>
                                                <Input type="number" min={0} max={item.orderedQty} value={item.receivedQty} onChange={e => updateReceivedQty(item.id, Number(e.target.value))} className="w-16 h-8" />
                                            </div>
                                            <span className="text-muted-foreground">@ {formatCurrency(item.unitCost)}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 text-right font-medium">Total (incl. GST): {formatCurrency(totalAmount)}</div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create GRN</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
