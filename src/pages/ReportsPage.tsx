import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, FileSpreadsheet, Activity, Package, ArrowLeftRight } from 'lucide-react'

export default function ReportsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground">Inventory and transaction reports</p></div>
                <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export All</Button>
            </div>

            <Tabs defaultValue="inventory">
                <TabsList className="mb-4">
                    <TabsTrigger value="inventory" className="gap-2"><Package className="h-4 w-4" />Inventory</TabsTrigger>
                    <TabsTrigger value="movement" className="gap-2"><ArrowLeftRight className="h-4 w-4" />Movement</TabsTrigger>
                    <TabsTrigger value="rework" className="gap-2"><Activity className="h-4 w-4" />Rework</TabsTrigger>
                </TabsList>

                <TabsContent value="inventory" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Stock Summary</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Current stock levels across all locations</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Low Stock Report</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Items below reorder point</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Stock Valuation</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Inventory value by category/location</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Dead Stock</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Non-moving items analysis</p></CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="movement" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />GRN Register</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">All goods received with details</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Issue Register</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Production issues log</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Transfer Log</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Inter-location transfers</p></CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="rework" className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Rework Summary</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">All rework requests with status</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Pending Returns</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Parts pending from vendors</p></CardContent>
                        </Card>
                        <Card className="card-hover cursor-pointer">
                            <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><FileSpreadsheet className="h-4 w-4" />Repair Cost Analysis</CardTitle></CardHeader>
                            <CardContent><p className="text-sm text-muted-foreground">Rework costs by part/vendor</p></CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BarChart3 className="h-5 w-5" />Sample Chart Area</CardTitle></CardHeader>
                <CardContent className="h-64 flex items-center justify-center bg-muted/30 rounded-lg"><p className="text-muted-foreground">Charts would be rendered here with actual data</p></CardContent>
            </Card>
        </div>
    )
}
