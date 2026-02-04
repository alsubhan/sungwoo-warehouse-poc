import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Plus, Edit, Eye } from 'lucide-react'
import { suppliers } from '@/data/mock-data'

export default function SuppliersPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Suppliers</h1><p className="text-muted-foreground">Suppliers and service vendors</p></div>
                <Button><Plus className="h-4 w-4 mr-2" />Add Supplier</Button>
            </div>
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Users className="h-5 w-5" />Suppliers ({suppliers.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>GSTIN</TableHead><TableHead>City</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {suppliers.map((sup) => (
                                <TableRow key={sup.id}>
                                    <TableCell className="font-mono font-medium">{sup.code}</TableCell>
                                    <TableCell>{sup.name}</TableCell>
                                    <TableCell><Badge variant={sup.type === 'service_vendor' ? 'info' : 'secondary'}>{sup.type === 'service_vendor' ? 'Service Vendor' : 'Supplier'}</Badge></TableCell>
                                    <TableCell className="font-mono text-xs">{sup.gstin || '-'}</TableCell>
                                    <TableCell>{sup.city || '-'}</TableCell>
                                    <TableCell><Badge variant={sup.isActive ? 'success' : 'secondary'}>{sup.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                                    <TableCell className="text-right"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></div></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
