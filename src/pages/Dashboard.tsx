import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Package,
    AlertTriangle,
    TrendingUp,
    Wrench,
    ArrowRight,
    Factory,
    Truck,
    FileText,
    ClipboardList,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { spareParts, stockLevels, machines, locations } from '@/data/mock-data'
import { productionIssues, reworks, indents, purchaseOrders } from '@/data/mock-transactions'
import { Link } from 'react-router-dom'

// KPI Card component
function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    variant = 'default',
}: {
    title: string
    value: string | number
    subtitle?: string
    icon: React.ComponentType<{ className?: string }>
    trend?: { value: number; label: string }
    variant?: 'default' | 'warning' | 'success' | 'info'
}) {
    const variants = {
        default: 'bg-card',
        warning: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800',
        success: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
        info: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
    }

    const iconVariants = {
        default: 'bg-primary/10 text-primary',
        warning: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
        success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
        info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    }

    return (
        <Card className={`${variants[variant]} card-hover`}>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <h3 className="text-2xl font-bold mt-1">{value}</h3>
                        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
                        {trend && (
                            <div className="flex items-center gap-1 mt-2">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span className="text-xs text-green-600">{trend.value}%</span>
                                <span className="text-xs text-muted-foreground">{trend.label}</span>
                            </div>
                        )}
                    </div>
                    <div className={`p-3 rounded-full ${iconVariants[variant]}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Quick Action component
function QuickAction({
    title,
    description,
    icon: Icon,
    href,
}: {
    title: string
    description: string
    icon: React.ComponentType<{ className?: string }>
    href: string
}) {
    return (
        <Link to={href}>
            <Card className="card-hover cursor-pointer group">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-medium text-sm">{title}</h4>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </CardContent>
            </Card>
        </Link>
    )
}

export default function Dashboard() {
    // Calculate KPIs from mock data
    const totalSpareParts = spareParts.length
    const totalStock = stockLevels.reduce((sum, sl) => sum + sl.quantityOnHand, 0)
    const lowStockItems = spareParts.filter((sp) => {
        const totalQty = stockLevels
            .filter((sl) => sl.sparePartId === sp.id)
            .reduce((sum, sl) => sum + sl.quantityAvailable, 0)
        return totalQty <= sp.reorderPoint
    }).length
    const machinesDown = machines.filter((m) => m.status === 'breakdown' || m.status === 'under_maintenance').length
    const pendingIndents = indents.filter((i) => i.status === 'pending_approval').length
    const activeReworks = reworks.filter((r) => r.status !== 'completed').length
    const openPOs = purchaseOrders.filter((po) => po.status !== 'completed' && po.status !== 'cancelled').length
    const activeIssues = productionIssues.filter((pi) => pi.status === 'issued').length

    const stockValue = stockLevels.reduce((sum, sl) => {
        const part = spareParts.find((sp) => sp.id === sl.sparePartId)
        return sum + (sl.quantityOnHand * (part?.unitCost || 0))
    }, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Industrial Warehouse Management Overview</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Spare Parts"
                    value={totalSpareParts}
                    subtitle={`${totalStock} units in stock`}
                    icon={Package}
                />
                <KPICard
                    title="Stock Value"
                    value={formatCurrency(stockValue)}
                    subtitle="Across all locations"
                    icon={TrendingUp}
                    variant="success"
                />
                <KPICard
                    title="Low Stock Alerts"
                    value={lowStockItems}
                    subtitle="Below reorder point"
                    icon={AlertTriangle}
                    variant={lowStockItems > 0 ? 'warning' : 'default'}
                />
                <KPICard
                    title="Machines Status"
                    value={`${machines.length - machinesDown}/${machines.length}`}
                    subtitle={machinesDown > 0 ? `${machinesDown} under maintenance` : 'All operational'}
                    icon={Factory}
                    variant={machinesDown > 0 ? 'warning' : 'success'}
                />
            </div>

            {/* Second Row KPIs */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Pending Indents"
                    value={pendingIndents}
                    subtitle="Awaiting HOD approval"
                    icon={ClipboardList}
                    variant={pendingIndents > 0 ? 'info' : 'default'}
                />
                <KPICard
                    title="Active Reworks"
                    value={activeReworks}
                    subtitle="Parts sent for repair"
                    icon={Wrench}
                    variant={activeReworks > 0 ? 'info' : 'default'}
                />
                <KPICard
                    title="Open POs"
                    value={openPOs}
                    subtitle="Pending delivery"
                    icon={FileText}
                />
                <KPICard
                    title="Production Issues"
                    value={activeIssues}
                    subtitle="Parts issued to production"
                    icon={Truck}
                />
            </div>

            {/* Quick Actions & Alerts */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <QuickAction
                            title="Issue Parts to Production"
                            description="Create a new production issue request"
                            icon={Factory}
                            href="/production-issues"
                        />
                        <QuickAction
                            title="Create Indent"
                            description="Request spare parts for purchase"
                            icon={ClipboardList}
                            href="/indents"
                        />
                        <QuickAction
                            title="Send for Rework"
                            description="Create returnable DC for repair"
                            icon={Wrench}
                            href="/rework"
                        />
                        <QuickAction
                            title="Stock Transfer"
                            description="Move parts between locations"
                            icon={Truck}
                            href="/stock-transfer"
                        />
                    </CardContent>
                </Card>

                {/* Recent Alerts */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {lowStockItems > 0 && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Low Stock Alert</p>
                                    <p className="text-xs text-muted-foreground">{lowStockItems} items below reorder point</p>
                                </div>
                                <Link to="/stock-levels" className="ml-auto">
                                    <Button variant="outline" size="sm">View</Button>
                                </Link>
                            </div>
                        )}
                        {pendingIndents > 0 && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                                <ClipboardList className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Pending Approvals</p>
                                    <p className="text-xs text-muted-foreground">{pendingIndents} indent(s) awaiting HOD approval</p>
                                </div>
                                <Link to="/indents" className="ml-auto">
                                    <Button variant="outline" size="sm">Review</Button>
                                </Link>
                            </div>
                        )}
                        {machinesDown > 0 && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                                <Factory className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Machine Status</p>
                                    <p className="text-xs text-muted-foreground">{machinesDown} machine(s) under maintenance/breakdown</p>
                                </div>
                                <Link to="/machines" className="ml-auto">
                                    <Button variant="outline" size="sm">Check</Button>
                                </Link>
                            </div>
                        )}
                        {activeReworks > 0 && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                                <Wrench className="h-5 w-5 text-purple-600 mt-0.5" />
                                <div>
                                    <p className="font-medium text-sm">Active Reworks</p>
                                    <p className="text-xs text-muted-foreground">{activeReworks} part(s) at service vendor</p>
                                </div>
                                <Link to="/rework" className="ml-auto">
                                    <Button variant="outline" size="sm">Track</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Locations Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Warehouse Locations</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {locations.filter(l => l.type !== 'production_line').map((location) => {
                            const locationStock = stockLevels.filter((sl) => sl.locationId === location.id)
                            const itemCount = locationStock.length
                            const totalQty = locationStock.reduce((sum, sl) => sum + sl.quantityOnHand, 0)
                            return (
                                <div key={location.id} className="p-4 rounded-lg border bg-muted/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">{location.name}</h4>
                                        <Badge variant="secondary">{location.code}</Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        <p>{itemCount} SKUs • {totalQty} units</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
