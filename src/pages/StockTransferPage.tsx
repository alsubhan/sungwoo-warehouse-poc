import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeftRight, Plus, Eye } from 'lucide-react'
import { stockTransfers } from '@/data/mock-transactions'
import { locations } from '@/data/mock-data'
import { formatDate } from '@/lib/utils'

const statusConfig = {
    draft: { label: 'Draft', variant: 'secondary' as const },
    pending: { label: 'Pending', variant: 'warning' as const },
    in_transit: { label: 'In Transit', variant: 'info' as const },
    received: { label: 'Received', variant: 'success' as const },
    completed: { label: 'Completed', variant: 'success' as const },
}

export default function StockTransferPage() {
    const getLocationName = (id: string) => locations.find(l => l.id === id)?.name || '-'

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Stock Transfer</h1><p className="text-muted-foreground">Move material between locations</p></div>
                <Button><Plus className="h-4 w-4 mr-2" />New Transfer</Button>
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
        </div>
    )
}
