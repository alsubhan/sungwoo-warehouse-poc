import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Truck, Plus, Eye, RotateCcw, Trash2, Search } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { deliveryChallans } from '@/data/mock-transactions'
import { suppliers } from '@/data/mock-data'
import { formatDate, generateId } from '@/lib/utils'
import { toast } from 'sonner'

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    dispatched: { label: 'Dispatched', variant: 'info' },
    received: { label: 'Received', variant: 'success' },
    partial_return: { label: 'Partial Return', variant: 'warning' },
    returned: { label: 'Returned', variant: 'success' },
    cancelled: { label: 'Cancelled', variant: 'destructive' },
}

interface DCItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    quantity: number
    serialNumber?: string
}

export default function DeliveryChallansPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [dcType, setDcType] = useState<'returnable' | 'non_returnable'>('non_returnable')
    const [vendorId, setVendorId] = useState('')
    const [vehicleNumber, setVehicleNumber] = useState('')
    const [reason, setReason] = useState('')
    const [items, setItems] = useState<DCItem[]>([])

    const serviceVendors = suppliers.filter(s => s.type === 'service_vendor')
    const getVendorName = (id: string) => suppliers.find(s => s.id === id)?.name || '-'

    const isReturnable = (dc: typeof deliveryChallans[0]) => dc.dcType === 'returnable'

    const resetForm = () => {
        setDcType('non_returnable')
        setVendorId('')
        setVehicleNumber('')
        setReason('')
        setItems([])
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            partNumber: selected.sparePart.partNumber,
            quantity: selected.quantity,
            serialNumber: selected.serialNumber
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const handleSubmit = () => {
        if (!vendorId || items.length === 0) {
            toast.error('Please select vendor and add at least one item')
            return
        }
        const vendor = suppliers.find(v => v.id === vendorId)
        toast.success(`${dcType === 'returnable' ? 'Returnable' : ''} DC created for ${vendor?.name}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Delivery Challans</h1><p className="text-muted-foreground">Track outgoing material with returnable DCs</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New DC</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total DCs</p><p className="text-2xl font-bold">{deliveryChallans.length}</p></CardContent></Card>
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Returnable</p><p className="text-2xl font-bold text-blue-600">{deliveryChallans.filter(dc => dc.dcType === 'returnable').length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Return</p><p className="text-2xl font-bold text-amber-600">{deliveryChallans.filter(dc => dc.dcType === 'returnable' && dc.status === 'dispatched').length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Returned</p><p className="text-2xl font-bold text-green-600">{deliveryChallans.filter(dc => dc.status === 'returned').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Truck className="h-5 w-5" />Delivery Challans</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>DC #</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Party</TableHead><TableHead>Vehicle</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {deliveryChallans.map((dc) => {
                                const statusInfo = statusConfig[dc.status] || statusConfig.draft
                                return (
                                    <TableRow key={dc.id}>
                                        <TableCell className="font-mono font-medium">{dc.dcNumber}</TableCell>
                                        <TableCell>{formatDate(dc.dcDate)}</TableCell>
                                        <TableCell><Badge variant={isReturnable(dc) ? 'info' : 'secondary'}>{isReturnable(dc) ? 'Returnable' : 'Non-Returnable'}</Badge></TableCell>
                                        <TableCell>{dc.partyName || getVendorName(dc.partyId || '')}</TableCell>
                                        <TableCell>{dc.vehicleNumber || '-'}</TableCell>
                                        <TableCell>{dc.items.length} item(s)</TableCell>
                                        <TableCell><Badge variant={statusInfo.variant}>{statusInfo.label}</Badge></TableCell>
                                        <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>{isReturnable(dc) && dc.status === 'dispatched' && <Button variant="outline" size="sm" className="gap-1"><RotateCcw className="h-3 w-3" />Return</Button>}</div></TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New DC Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Delivery Challan</DialogTitle>
                        <DialogDescription>Send material to vendor with optional returnable tracking</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>DC Type *</Label>
                                <Select value={dcType} onValueChange={(v: 'returnable' | 'non_returnable') => setDcType(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="non_returnable">Non-Returnable</SelectItem>
                                        <SelectItem value="returnable">Returnable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Vendor *</Label>
                                <Select value={vendorId} onValueChange={setVendorId}>
                                    <SelectTrigger><SelectValue placeholder="Select vendor" /></SelectTrigger>
                                    <SelectContent>
                                        {serviceVendors.map(v => (<SelectItem key={v.id} value={v.id}>{v.code} - {v.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Vehicle Number</Label>
                                <Input value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="e.g. KA-01-AB-1234" />
                            </div>
                            <div className="space-y-2">
                                <Label>Reason/Purpose</Label>
                                <Input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g. Rework, Calibration" />
                            </div>
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
                                <p className="text-sm font-medium">DC Items ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <span className="text-muted-foreground ml-2 text-xs">({item.partNumber})</span>
                                            {item.serialNumber && <span className="text-muted-foreground ml-2">SN: {item.serialNumber}</span>}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">Qty: {item.quantity}</Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create DC</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="issue"
                title="Add Part to Delivery Challan"
            />
        </div>
    )
}
