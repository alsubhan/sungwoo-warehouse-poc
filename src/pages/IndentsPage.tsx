import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ClipboardList, Plus, Eye, Check, X, ShoppingCart, Trash2, Search } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { indents } from '@/data/mock-transactions'
import { formatDate, generateId } from '@/lib/utils'
import { toast } from 'sonner'
import type { IndentStatus } from '@/types/transactions'

const statusConfig: Record<IndentStatus, { label: string; variant: 'default' | 'secondary' | 'success' | 'warning' | 'info' | 'destructive' }> = {
    draft: { label: 'Draft', variant: 'secondary' },
    pending_approval: { label: 'Pending Approval', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'destructive' },
    converted_to_po: { label: 'Converted to PO', variant: 'info' },
    cancelled: { label: 'Cancelled', variant: 'secondary' },
}

const priorityConfig = {
    low: { label: 'Low', variant: 'secondary' as const },
    medium: { label: 'Medium', variant: 'default' as const },
    high: { label: 'High', variant: 'warning' as const },
    urgent: { label: 'Urgent', variant: 'destructive' as const },
}

interface IndentItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    quantity: number
    justification: string
}

export default function IndentsPage() {
    const [activeTab] = useState('all')
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [requestedBy, setRequestedBy] = useState('')
    const [department, setDepartment] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
    const [items, setItems] = useState<IndentItem[]>([])
    const [justification, setJustification] = useState('')

    const filterIndents = (status: string) => {
        if (status === 'all') return indents
        if (status === 'pending') return indents.filter((i) => i.status === 'pending_approval')
        return indents.filter((i) => i.status === status)
    }

    const filteredIndents = filterIndents(activeTab)

    const resetForm = () => {
        setRequestedBy('')
        setDepartment('')
        setPriority('medium')
        setItems([])
        setJustification('')
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            partNumber: selected.sparePart.partNumber,
            quantity: selected.quantity,
            justification: selected.notes || justification || 'Stock replenishment'
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const handleSubmit = () => {
        if (!requestedBy || !department || items.length === 0) {
            toast.error('Please fill all required fields and add at least one item')
            return
        }
        toast.success(`Indent created by ${requestedBy} - pending HOD approval`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Purchase Indents</h1><p className="text-muted-foreground">Request spare parts for purchase</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />Create Indent</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Indents</p><p className="text-2xl font-bold">{indents.length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Approval</p><p className="text-2xl font-bold text-amber-600">{indents.filter((i) => i.status === 'pending_approval').length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Approved</p><p className="text-2xl font-bold text-green-600">{indents.filter((i) => i.status === 'approved').length}</p></CardContent></Card>
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Converted to PO</p><p className="text-2xl font-bold text-blue-600">{indents.filter((i) => i.status === 'converted_to_po').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ClipboardList className="h-5 w-5" />Indents</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Indent #</TableHead><TableHead>Date</TableHead><TableHead>Requested By</TableHead><TableHead>Department</TableHead><TableHead>Items</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead>PO Reference</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {filteredIndents.map((indent) => {
                                const status = statusConfig[indent.status]
                                const prio = priorityConfig[indent.priority]
                                return (
                                    <TableRow key={indent.id}>
                                        <TableCell className="font-mono font-medium">{indent.indentNumber}</TableCell>
                                        <TableCell>{formatDate(indent.indentDate)}</TableCell>
                                        <TableCell>{indent.requestedBy}</TableCell>
                                        <TableCell>{indent.department || '-'}</TableCell>
                                        <TableCell>{indent.items.length} item(s)</TableCell>
                                        <TableCell><Badge variant={prio.variant}>{prio.label}</Badge></TableCell>
                                        <TableCell><Badge variant={status.variant}>{status.label}</Badge></TableCell>
                                        <TableCell>{indent.purchaseOrderNumber ? <Badge variant="outline" className="gap-1"><ShoppingCart className="h-3 w-3" />{indent.purchaseOrderNumber}</Badge> : '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                                                {indent.status === 'pending_approval' && (<><Button variant="outline" size="icon" className="text-green-600"><Check className="h-4 w-4" /></Button><Button variant="outline" size="icon" className="text-red-600"><X className="h-4 w-4" /></Button></>)}
                                                {indent.status === 'approved' && <Button variant="outline" size="sm" className="gap-1"><ShoppingCart className="h-3 w-3" />Create PO</Button>}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Indent Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Indent</DialogTitle>
                        <DialogDescription>Request spare parts for purchase - requires HOD approval</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Requested By *</Label>
                                <Input value={requestedBy} onChange={e => setRequestedBy(e.target.value)} placeholder="Your name" />
                            </div>
                            <div className="space-y-2">
                                <Label>Department *</Label>
                                <Select value={department} onValueChange={setDepartment}>
                                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                                        <SelectItem value="Production">Production</SelectItem>
                                        <SelectItem value="Quality">Quality</SelectItem>
                                        <SelectItem value="Engineering">Engineering</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select value={priority} onValueChange={(v: 'low' | 'medium' | 'high' | 'urgent') => setPriority(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Default Justification</Label>
                            <Input value={justification} onChange={e => setJustification(e.target.value)} placeholder="e.g. Stock replenishment, Breakdown repair" />
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
                                <p className="text-sm font-medium">Indent Items ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <span className="text-muted-foreground ml-2 text-xs">({item.partNumber})</span>
                                            <Badge variant="outline" className="ml-2">Qty: {item.quantity}</Badge>
                                            <p className="text-xs text-muted-foreground">{item.justification}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Submit for Approval</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="purchase"
                title="Add Part to Indent"
            />
        </div>
    )
}
