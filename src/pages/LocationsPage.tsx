import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Building2, Plus, Edit } from 'lucide-react'
import { locations } from '@/data/mock-data'

const typeLabels: Record<string, string> = {
    main_warehouse: 'Main Warehouse', sub_store: 'Sub Store', tool_room: 'Tool Room', production_line: 'Production Line'
}

export default function LocationsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Locations</h1><p className="text-muted-foreground">Manage warehouse and sub-locations</p></div>
                <Button><Plus className="h-4 w-4 mr-2" />Add Location</Button>
            </div>
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building2 className="h-5 w-5" />Locations ({locations.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Parent</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {locations.map((loc) => {
                                const parent = locations.find(l => l.id === loc.parentId)
                                return (
                                    <TableRow key={loc.id}>
                                        <TableCell className="font-mono font-medium">{loc.code}</TableCell>
                                        <TableCell>{loc.name}</TableCell>
                                        <TableCell><Badge variant="secondary">{typeLabels[loc.type]}</Badge></TableCell>
                                        <TableCell>{parent?.name || '-'}</TableCell>
                                        <TableCell><Badge variant={loc.isActive ? 'success' : 'secondary'}>{loc.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
