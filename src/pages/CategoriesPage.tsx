import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tags, Plus, Edit } from 'lucide-react'
import { categories } from '@/data/mock-data'

export default function CategoriesPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Categories</h1><p className="text-muted-foreground">Spare part categorization</p></div>
                <Button><Plus className="h-4 w-4 mr-2" />Add Category</Button>
            </div>
            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Tags className="h-5 w-5" />Categories ({categories.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell className="text-muted-foreground">{cat.description || '-'}</TableCell>
                                    <TableCell><Badge variant={cat.isActive ? 'success' : 'secondary'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge></TableCell>
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
