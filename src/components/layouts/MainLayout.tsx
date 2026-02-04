import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
    LayoutDashboard,
    Package,
    Boxes,
    Wrench,
    Factory,
    FileText,
    Truck,
    ArrowLeftRight,
    Building2,
    Settings,
    ChevronLeft,
    Menu,
    Receipt,
    FileCheck,
    Cog,
    Users,
    Tags,
    Ruler,
    Calculator,
    BarChart3,
    ShoppingCart,
    ClipboardList,
} from 'lucide-react'

interface NavItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
}

interface NavGroup {
    title: string
    items: NavItem[]
}

const navigation: NavGroup[] = [
    {
        title: 'Overview',
        items: [
            { title: 'Dashboard', href: '/', icon: LayoutDashboard },
        ],
    },
    {
        title: 'Inventory',
        items: [
            { title: 'Spare Parts', href: '/spare-parts', icon: Package },
            { title: 'Stock Levels', href: '/stock-levels', icon: Boxes },
            { title: 'Stock Transfer', href: '/stock-transfer', icon: ArrowLeftRight },
            { title: 'Locations', href: '/locations', icon: Building2 },
        ],
    },
    {
        title: 'Transactions',
        items: [
            { title: 'Production Issues', href: '/production-issues', icon: Factory },
            { title: 'Rework', href: '/rework', icon: Wrench },
            { title: 'Indents', href: '/indents', icon: ClipboardList },
            { title: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
            { title: 'GRN', href: '/grn', icon: FileCheck },
            { title: 'Delivery Challans', href: '/delivery-challans', icon: Truck },
        ],
    },
    {
        title: 'Sales',
        items: [
            { title: 'Sale Invoices', href: '/sale-invoices', icon: Receipt },
            { title: 'Credit Notes', href: '/credit-notes', icon: FileText },
        ],
    },
    {
        title: 'Assets',
        items: [
            { title: 'Machines', href: '/machines', icon: Cog },
        ],
    },
    {
        title: 'Reports',
        items: [
            { title: 'Reports', href: '/reports', icon: BarChart3 },
        ],
    },
    {
        title: 'Master Data',
        items: [
            { title: 'Categories', href: '/categories', icon: Tags },
            { title: 'Units', href: '/units', icon: Ruler },
            { title: 'Suppliers', href: '/suppliers', icon: Users },
            { title: 'Taxes (GST)', href: '/taxes', icon: Calculator },
        ],
    },
    {
        title: 'System',
        items: [
            { title: 'Settings', href: '/settings', icon: Settings },
        ],
    },
]

export default function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 lg:static",
                    collapsed ? "w-16" : "w-64",
                    mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div className={cn(
                    "flex h-16 items-center border-b px-4",
                    collapsed ? "justify-center" : "justify-between"
                )}>
                    {!collapsed && (
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                                S
                            </div>
                            <div>
                                <h1 className="text-sm font-semibold">Sungwoo</h1>
                                <p className="text-xs text-muted-foreground">Warehouse Mgmt</p>
                            </div>
                        </div>
                    )}
                    {collapsed && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                            S
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden lg:flex"
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <ChevronLeft className={cn(
                            "h-4 w-4 transition-transform",
                            collapsed && "rotate-180"
                        )} />
                    </Button>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-6 px-2">
                        {navigation.map((group) => (
                            <div key={group.title}>
                                {!collapsed && (
                                    <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {group.title}
                                    </h2>
                                )}
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const isActive = location.pathname === item.href
                                        return (
                                            <Link
                                                key={item.href}
                                                to={item.href}
                                                onClick={() => setMobileOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                                    isActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                                    collapsed && "justify-center px-2"
                                                )}
                                                title={collapsed ? item.title : undefined}
                                            >
                                                <item.icon className="h-4 w-4 shrink-0" />
                                                {!collapsed && <span>{item.title}</span>}
                                                {!collapsed && item.badge && (
                                                    <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </ScrollArea>

                {/* Footer */}
                <div className="border-t p-4">
                    {!collapsed ? (
                        <div className="text-xs text-muted-foreground">
                            <p>Warehouse POC</p>
                            <p>v0.1.0</p>
                        </div>
                    ) : (
                        <div className="text-center text-xs text-muted-foreground">v0.1</div>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
