import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Ruler, Plus, Edit } from 'lucide-react'
import { units } from '@/data/mock-data'

export default function UnitsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Units</h1><p className="text-muted-foreground">Units of measurement</p></div>
                <Button><Plus className="h-4 w-4 mr-2" />Add Unit</Button>
            </div>
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Ruler className="h-5 w-5" />Units ({units.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Abbreviation</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {units.map((unit) => (
                                <TableRow key={unit.id}>
                                    <TableCell className="font-medium">{unit.name}</TableCell>
                                    <TableCell><Badge variant="outline">{unit.abbreviation}</Badge></TableCell>
                                    <TableCell><Badge variant={unit.isActive ? 'success' : 'secondary'}>{unit.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                                    <TableCell className="text-right"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
