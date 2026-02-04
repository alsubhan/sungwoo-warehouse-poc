import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Wrench, Plus, Eye, Truck, FileText, CheckCircle, Trash2, Search } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { reworks } from '@/data/mock-transactions'
import { suppliers } from '@/data/mock-data'
import { formatDate, generateId } from '@/lib/utils'
import { toast } from 'sonner'
import type { ReworkStatus } from '@/types/transactions'

const statusConfig: Record<ReworkStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'info' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    dc_generated: { label: 'DC Generated', variant: 'info' },
    sent: { label: 'Sent', variant: 'warning' },
    in_service: { label: 'In Service', variant: 'warning' },
    received: { label: 'Received', variant: 'info' },
    completed: { label: 'Completed', variant: 'success' },
}

interface ReworkItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    serialNumber: string
    faultDescription: string
}

export default function ReworkPage() {
    const [activeTab, setActiveTab] = useState('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [vendorId, setVendorId] = useState('')
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<ReworkItem[]>([])
    const [faultDesc, setFaultDesc] = useState('')

    const serviceVendors = suppliers.filter(s => s.type === 'service_vendor')

    const filterReworks = (status: string) => {
        if (status === 'all') return reworks
        if (status === 'active') return reworks.filter((r) => r.status !== 'completed')
        return reworks.filter((r) => r.status === status)
    }

    const filteredReworks = filterReworks(activeTab)
    const getVendorName = (vendorId: string) => suppliers.find((s) => s.id === vendorId)?.name || '-'

    const resetForm = () => {
        setVendorId('')
        setNotes('')
        setItems([])
        setFaultDesc('')
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            partNumber: selected.sparePart.partNumber,
            serialNumber: selected.serialNumber || '',
            faultDescription: selected.notes || faultDesc || 'Needs repair'
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const handleSubmit = () => {
        if (!vendorId || items.length === 0) {
            toast.error('Please select vendor and add at least one item')
            return
        }
        const vendor = suppliers.find(v => v.id === vendorId)
        toast.success(`Rework request created for ${vendor?.name}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Rework</h1><p className="text-muted-foreground">Send faulty spares for external repair</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New Rework Request</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Reworks</p><p className="text-2xl font-bold">{reworks.length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">In Service</p><p className="text-2xl font-bold text-amber-600">{reworks.filter((r) => r.status === 'in_service' || r.status === 'sent').length}</p></CardContent></Card>
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Receipt</p><p className="text-2xl font-bold text-blue-600">{reworks.filter((r) => r.status === 'in_service').length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Completed</p><p className="text-2xl font-bold text-green-600">{reworks.filter((r) => r.status === 'completed').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Wrench className="h-5 w-5" />Rework Requests</CardTitle></CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-4">
                            <TabsTrigger value="all">All</TabsTrigger>
                            <TabsTrigger value="active">Active</TabsTrigger>
                            <TabsTrigger value="in_service">In Service</TabsTrigger>
                            <TabsTrigger value="completed">Completed</TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeTab}>
                            <Table>
                                <TableHeader><TableRow><TableHead>Rework #</TableHead><TableHead>Date</TableHead><TableHead>Service Vendor</TableHead><TableHead>DC Number</TableHead><TableHead>Items</TableHead><TableHead>Vendor Invoice</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {filteredReworks.map((rework) => {
                                        const config = statusConfig[rework.status]
                                        return (
                                            <TableRow key={rework.id}>
                                                <TableCell className="font-mono font-medium">{rework.reworkNumber}</TableCell>
                                                <TableCell>{formatDate(rework.reworkDate)}</TableCell>
                                                <TableCell>{getVendorName(rework.serviceVendorId)}</TableCell>
                                                <TableCell>{rework.deliveryChallanNumber ? <Badge variant="outline" className="gap-1"><Truck className="h-3 w-3" />{rework.deliveryChallanNumber}</Badge> : '-'}</TableCell>
                                                <TableCell>{rework.items.length} item(s)</TableCell>
                                                <TableCell>{rework.vendorInvoiceNumber ? <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{rework.vendorInvoiceNumber}</span> : '-'}</TableCell>
                                                <TableCell><Badge variant={config.variant}>{config.label}</Badge></TableCell>
                                                <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>{rework.status === 'in_service' && <Button variant="outline" size="sm" className="gap-1"><CheckCircle className="h-3 w-3" />Receive</Button>}</div></TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* New Rework Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Rework Request</DialogTitle>
                        <DialogDescription>Send faulty spare parts to service vendor for repair</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Service Vendor *</Label>
                            <Select value={vendorId} onValueChange={setVendorId}>
                                <SelectTrigger><SelectValue placeholder="Select service vendor" /></SelectTrigger>
                                <SelectContent>
                                    {serviceVendors.map(v => (<SelectItem key={v.id} value={v.id}>{v.code} - {v.name}</SelectItem>))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Default Fault Description</Label>
                            <Input value={faultDesc} onChange={e => setFaultDesc(e.target.value)} placeholder="e.g. Bearing noise, Overheating" />
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional notes" />
                        </div>

                        <div className="space-y-2">
                            <Label>Add Faulty Parts *</Label>
                            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setIsSearchOpen(true)}>
                                <Search className="h-4 w-4" />
                                Search and Add Faulty Parts
                            </Button>
                        </div>

                        {items.length > 0 && (
                            <div className="border rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium">Items for Rework ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <span className="text-muted-foreground ml-2 text-xs">({item.partNumber})</span>
                                            {item.serialNumber && <span className="text-muted-foreground ml-2">SN: {item.serialNumber}</span>}
                                            <p className="text-xs text-muted-foreground">{item.faultDescription}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create Rework</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="issue"
                title="Add Faulty Part for Rework"
            />
        </div>
    )
}
