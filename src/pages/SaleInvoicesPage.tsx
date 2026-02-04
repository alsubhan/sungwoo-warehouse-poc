import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Plus, Eye, Trash2, Search, CheckCircle } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { saleInvoices } from '@/data/mock-transactions'
import { formatDate, formatCurrency, generateId } from '@/lib/utils'
import { toast } from 'sonner'

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    irn_generated: { label: 'IRN Generated', variant: 'success' as const },
    paid: { label: 'Paid', variant: 'success' as const },
    partial: { label: 'Partial', variant: 'warning' as const },
    cancelled: { label: 'Cancelled', variant: 'destructive' as const },
}

interface InvoiceItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    hsnCode: string
    quantity: number
    unitPrice: number
}

export default function SaleInvoicesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [customerName, setCustomerName] = useState('')
    const [customerGstin, setCustomerGstin] = useState('')
    const [billingAddress, setBillingAddress] = useState('')
    const [paymentTerms, setPaymentTerms] = useState('Net 30')
    const [items, setItems] = useState<InvoiceItem[]>([])

    const resetForm = () => {
        setCustomerName('')
        setCustomerGstin('')
        setBillingAddress('')
        setPaymentTerms('Net 30')
        setItems([])
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            partNumber: selected.sparePart.partNumber,
            hsnCode: selected.sparePart.hsnCode || '84839000',
            quantity: selected.quantity,
            unitPrice: selected.unitCost
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const subtotal = items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0)
    const gstAmount = subtotal * 0.18
    const totalAmount = subtotal + gstAmount

    const handleSubmit = () => {
        if (!customerName || !customerGstin || items.length === 0) {
            toast.error('Please fill all required fields and add at least one item')
            return
        }
        toast.success(`Invoice created for ${customerName} - ${formatCurrency(totalAmount)}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Sale Invoices</h1><p className="text-muted-foreground">GST compliant sale invoices with IRN</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New Invoice</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Invoices</p><p className="text-2xl font-bold">{saleInvoices.length}</p></CardContent></Card>
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Revenue</p><p className="text-2xl font-bold">{formatCurrency(saleInvoices.reduce((s, i) => s + i.totalAmount, 0))}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">IRN Generated</p><p className="text-2xl font-bold text-green-600">{saleInvoices.filter(i => i.status === 'irn_generated').length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Pending Payment</p><p className="text-2xl font-bold text-amber-600">{saleInvoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" />Invoices</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>GSTIN</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {saleInvoices.map((inv) => (
                                <TableRow key={inv.id}>
                                    <TableCell className="font-mono font-medium">{inv.invoiceNumber}</TableCell>
                                    <TableCell>{formatDate(inv.invoiceDate)}</TableCell>
                                    <TableCell>{inv.customerName}</TableCell>
                                    <TableCell className="font-mono text-xs">{inv.customerGstin}</TableCell>
                                    <TableCell>{inv.items.length} item(s)</TableCell>
                                    <TableCell className="text-right font-medium">{formatCurrency(inv.totalAmount)}</TableCell>
                                    <TableCell><Badge variant={statusConfig[inv.status as keyof typeof statusConfig].variant}>{statusConfig[inv.status as keyof typeof statusConfig].label}</Badge></TableCell>
                                    <TableCell className="text-right"><div className="flex justify-end gap-2"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>{inv.status === 'draft' && <Button variant="outline" size="sm" className="gap-1"><CheckCircle className="h-3 w-3" />Generate IRN</Button>}</div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New Invoice Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Sale Invoice</DialogTitle>
                        <DialogDescription>Create GST compliant invoice with IRN generation</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Customer Name *</Label>
                                <Input value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="e.g. ABC Motors Pvt Ltd" />
                            </div>
                            <div className="space-y-2">
                                <Label>GSTIN *</Label>
                                <Input value={customerGstin} onChange={e => setCustomerGstin(e.target.value)} placeholder="e.g. 29AABCP3456D4ZM" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Billing Address</Label>
                                <Input value={billingAddress} onChange={e => setBillingAddress(e.target.value)} placeholder="Full address" />
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Terms</Label>
                                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Immediate">Immediate</SelectItem>
                                        <SelectItem value="Net 15">Net 15</SelectItem>
                                        <SelectItem value="Net 30">Net 30</SelectItem>
                                        <SelectItem value="Net 45">Net 45</SelectItem>
                                    </SelectContent>
                                </Select>
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
                                <p className="text-sm font-medium">Invoice Items ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <span className="text-muted-foreground ml-2 text-xs">HSN: {item.hsnCode}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">Qty: {item.quantity}</Badge>
                                            <span className="text-muted-foreground">@ {formatCurrency(item.unitPrice)}</span>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem(item.id)}><Trash2 className="h-3 w-3" /></Button>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 space-y-1 text-sm text-right">
                                    <p>Subtotal: {formatCurrency(subtotal)}</p>
                                    <p>GST (18%): {formatCurrency(gstAmount)}</p>
                                    <p className="font-bold text-base">Total: {formatCurrency(totalAmount)}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Create Invoice</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="sale"
                title="Add Part to Invoice"
            />
        </div>
    )
}
