import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Calculator, Plus, Edit } from 'lucide-react'
import { taxes } from '@/data/mock-data'

export default function TaxesPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Taxes (GST)</h1><p className="text-muted-foreground">Indian GST tax slabs with CGST, SGST, IGST</p></div>
                <Button><Plus className="h-4 w-4 mr-2" />Add Tax Slab</Button>
            </div>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Calculator className="h-5 w-5" />GST Tax Slabs ({taxes.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tax Name</TableHead>
                                <TableHead className="text-right">Total Rate</TableHead>
                                <TableHead className="text-right">CGST</TableHead>
                                <TableHead className="text-right">SGST</TableHead>
                                <TableHead className="text-right">IGST</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {taxes.map((tax) => (
                                <TableRow key={tax.id}>
                                    <TableCell className="font-medium">{tax.name}</TableCell>
                                    <TableCell className="text-right font-bold">{tax.rate}%</TableCell>
                                    <TableCell className="text-right">{tax.cgstRate}%</TableCell>
                                    <TableCell className="text-right">{tax.sgstRate}%</TableCell>
                                    <TableCell className="text-right">{tax.igstRate}%</TableCell>
                                    <TableCell><Badge variant={tax.isActive ? 'success' : 'secondary'}>{tax.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-lg">GST Information</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>Intra-State:</strong> CGST + SGST (Central + State GST) apply for transactions within the same state.</p>
                    <p><strong>Inter-State:</strong> IGST (Integrated GST) applies for transactions between different states.</p>
                    <p><strong>HSN Codes:</strong> Each spare part has an HSN code that determines the applicable GST rate.</p>
                </CardContent>
            </Card>
        </div>
    )
}
