import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Factory, Plus, Eye, Trash2, Search } from 'lucide-react'
import { SparePartSearchDialog } from '@/components/shared/SparePartSearchDialog'
import { productionIssues } from '@/data/mock-transactions'
import { machines, locations } from '@/data/mock-data'
import { formatDate, generateId } from '@/lib/utils'
import { toast } from 'sonner'

const issueTypeLabels = { breakdown: 'Breakdown', planned_maintenance: 'Planned Maintenance' }
const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    issued: { label: 'Issued', variant: 'warning' as const },
    partially_returned: { label: 'Partial Return', variant: 'info' as const },
    closed: { label: 'Closed', variant: 'success' as const },
}

interface IssueItem {
    id: string
    sparePartId: string
    sparePartName: string
    partNumber: string
    quantity: number
}

export default function ProductionIssuesPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [issueType, setIssueType] = useState<'breakdown' | 'planned_maintenance'>('breakdown')
    const [machineId, setMachineId] = useState('')
    const [locationId, setLocationId] = useState('')
    const [requestedBy, setRequestedBy] = useState('')
    const [notes, setNotes] = useState('')
    const [items, setItems] = useState<IssueItem[]>([])

    const resetForm = () => {
        setIssueType('breakdown')
        setMachineId('')
        setLocationId('')
        setRequestedBy('')
        setNotes('')
        setItems([])
    }

    const handlePartSelect = (selected: any) => {
        setItems([...items, {
            id: generateId(),
            sparePartId: selected.sparePart.id,
            sparePartName: selected.sparePart.name,
            partNumber: selected.sparePart.partNumber,
            quantity: selected.quantity
        }])
    }

    const removeItem = (id: string) => setItems(items.filter(i => i.id !== id))

    const handleSubmit = () => {
        if (!machineId || !locationId || !requestedBy || items.length === 0) {
            toast.error('Please fill all required fields and add at least one item')
            return
        }
        const machine = machines.find(m => m.id === machineId)
        toast.success(`Production Issue created for ${machine?.name}`)
        setIsDialogOpen(false)
        resetForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Production Issues</h1><p className="text-muted-foreground">Issue spare parts for machine breakdowns and maintenance</p></div>
                <Button onClick={() => setIsDialogOpen(true)}><Plus className="h-4 w-4 mr-2" />New Issue</Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Issues</p><p className="text-2xl font-bold">{productionIssues.length}</p></CardContent></Card>
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Breakdowns</p><p className="text-2xl font-bold text-red-600">{productionIssues.filter(i => i.issueType === 'breakdown').length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Open Issues</p><p className="text-2xl font-bold text-amber-600">{productionIssues.filter(i => i.status !== 'closed').length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Closed</p><p className="text-2xl font-bold text-green-600">{productionIssues.filter(i => i.status === 'closed').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Factory className="h-5 w-5" />Production Issues</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Issue #</TableHead><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead>Machine</TableHead><TableHead>Location</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {productionIssues.map((issue) => (
                                <TableRow key={issue.id}>
                                    <TableCell className="font-mono font-medium">{issue.issueNumber}</TableCell>
                                    <TableCell>{formatDate(issue.issueDate)}</TableCell>
                                    <TableCell><Badge variant={issue.issueType === 'breakdown' ? 'destructive' : 'secondary'}>{issueTypeLabels[issue.issueType]}</Badge></TableCell>
                                    <TableCell>{issue.machineName}</TableCell>
                                    <TableCell>{issue.locationName}</TableCell>
                                    <TableCell>{issue.items.length} item(s)</TableCell>
                                    <TableCell><Badge variant={statusConfig[issue.status].variant}>{statusConfig[issue.status].label}</Badge></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* New Issue Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Create Production Issue</DialogTitle>
                        <DialogDescription>Issue spare parts for machine maintenance or breakdown</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Issue Type *</Label>
                                <Select value={issueType} onValueChange={(v: 'breakdown' | 'planned_maintenance') => setIssueType(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="breakdown">Breakdown</SelectItem>
                                        <SelectItem value="planned_maintenance">Planned Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Requested By *</Label>
                                <Input value={requestedBy} onChange={e => setRequestedBy(e.target.value)} placeholder="Your name" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Machine *</Label>
                                <Select value={machineId} onValueChange={setMachineId}>
                                    <SelectTrigger><SelectValue placeholder="Select machine" /></SelectTrigger>
                                    <SelectContent>
                                        {machines.filter(m => m.status !== 'decommissioned').map(m => (<SelectItem key={m.id} value={m.id}>{m.machineCode} - {m.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Issue Location *</Label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                    <SelectContent>
                                        {locations.filter(l => l.isActive).map(l => (<SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Problem description or work notes" />
                        </div>

                        <div className="space-y-2">
                            <Label>Add Spare Parts *</Label>
                            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setIsSearchOpen(true)}>
                                <Search className="h-4 w-4" />
                                Search and Add Spare Parts
                            </Button>
                        </div>

                        {items.length > 0 && (
                            <div className="border rounded-lg p-3 space-y-2">
                                <p className="text-sm font-medium">Issue Items ({items.length})</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                                        <div>
                                            <span className="font-medium">{item.sparePartName}</span>
                                            <span className="text-muted-foreground ml-2 text-xs">({item.partNumber})</span>
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
                        <Button onClick={handleSubmit}>Create Issue</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Spare Part Search Dialog */}
            <SparePartSearchDialog
                open={isSearchOpen}
                onOpenChange={setIsSearchOpen}
                onPartSelect={handlePartSelect}
                mode="issue"
                locationId={locationId}
                title="Add Spare Part to Issue"
            />
        </div>
    )
}
