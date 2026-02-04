import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ReceiptText, Plus, Eye, Trash2, Search } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { creditNotes, grns } from '@/data/mock-transactions'
import { suppliers } from '@/data/mock-data'
import { formatDate, formatCurrency, generateId } from '@/lib/utils'
import { toast } from 'sonner'

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    issued: { label: 'Issued', variant: 'info' as const },
    accepted: { label: 'Accepted', variant: 'success' as const },
    rejected: { label: 'Rejected', variant: 'destructive' as const },
    settled: { label: 'Settled', variant: 'success' as const },
    adjusted: { label: 'Adjusted', variant: 'info' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
}

const reasonLabels: Record<string, string> = {
    damaged_goods: 'Damaged Goods',
    quality_rejection: 'Quality Rejection',
    short_supply: 'Short Supply',
    price_difference: 'Price Difference',
    other: 'Other',
}

interface CNItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    quantity: number
    unitCost: number
}

export default function CreditNotesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [grnId, setGrnId] = useState('')
    const [reason, setReason] = useState<'damaged_goods' | 'quality_rejection' | 'short_supply' | 'price_difference' | 'other'>('damaged_goods')
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<CNItem[]>([])

    const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || '-'

    const resetForm = () => {
        setGrnId('')
        setReason('damaged_goods')
        setNotes('')
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

    const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.unitCost), 0)
    const gstAmount = subtotal * 0.18
    const totalAmount = subtotal + gstAmount

    const handleSubmit = () => {
        if (!grnId || items.length === 0) {
            toast.error('Please select GRN and add at least one item')
            return
        }
        const grn = grns.find(g => g.id === grnId)
        toast.success(`Credit Note created for GRN ${grn?.grnNumber} - ${formatCurrency(totalAmount)}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Credit Notes</h1><p className="text-muted-foreground">Manage debit/credit notes against GRNs</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New Credit Note</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total CNs</p><p className="text-2xl font-bold">{creditNotes.length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Value</p><p className="text-2xl font-bold">{formatCurrency(creditNotes.reduce((s, c) => s + c.totalAmount, 0))}</p></CardContent></Card>
                <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Issued</p><p className="text-2xl font-bold text-blue-600">{creditNotes.filter(c => c.status === 'issued').length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Settled</p><p className="text-2xl font-bold text-green-600">{creditNotes.filter(c => c.status === 'settled').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><ReceiptText className="h-5 w-5" />Credit Notes</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>CN #</TableHead><TableHead>Date</TableHead><TableHead>GRN Ref</TableHead><TableHead>Supplier</TableHead><TableHead>Reason</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {creditNotes.map((cn) => (
                                <TableRow key={cn.id}>
                                    <TableCell className="font-mono font-medium">{cn.creditNoteNumber}</TableCell>
                                    <TableCell>{formatDate(cn.creditNoteDate)}</TableCell>
                                    <TableCell><Badge variant="outline">{cn.grnNumber}</Badge></TableCell>
                                    <TableCell>{getSupplierName(cn.supplierId)}</TableCell>
                                    <TableCell>{reasonLabels[cn.reason] || cn.reason}</TableCell>
                                    <TableCell>{cn.items.length} item(s)</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(cn.totalAmount)}</TableCell>
                                    <TableCell><Badge variant={statusConfig[cn.status].variant}>{statusConfig[cn.status].label}</Badge></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New Credit Note Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Credit Note</DialogTitle>
                        <DialogDescription>Issue credit note against a GRN for quality/quantity issues</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>GRN Reference *</Label>
                                <Select value={grnId} onValueChange={setGrnId}>
                                    <SelectTrigger><SelectValue placeholder="Select GRN" /></SelectTrigger>
                                    <SelectContent>
                                        {grns.map(g => (<SelectItem key={g.id} value={g.id}>{g.grnNumber} - {formatDate(g.grnDate)}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason *</Label>
                                <Select value={reason} onValueChange={(v: any) => setReason(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="damaged_goods">Damaged Goods</SelectItem>
                                        <SelectItem value="quality_rejection">Quality Rejection</SelectItem>
                                        <SelectItem value="short_supply">Short Supply</SelectItem>
                                        <SelectItem value="price_difference">Price Difference</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional details..." />
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
                                <p className="text-sm font-medium">Credit Note Items ({items.length})</p>
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
                                <div className="pt-2 space-y-1 text-sm text-right">
                                    <p>Subtotal: {formatCurrency(subtotal)}</p>
                                    <p>GST (18%): {formatCurrency(gstAmount)}</p>
                                    <p className="font-bold text-base">Total Credit: {formatCurrency(totalAmount)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Issue Credit Note</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="purchase"
                title="Add Part to Credit Note"
            />
        </div>
    )
}
