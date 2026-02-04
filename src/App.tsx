import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import MainLayout from '@/components/layouts/MainLayout'
import {
    Dashboard,
    SparePartsPage,
    StockLevelsPage,
    MachinesPage,
    ReworkPage,
    IndentsPage,
    ProductionIssuesPage,
    DeliveryChallansPage,
    StockTransferPage,
    PurchaseOrdersPage,
    GRNPage,
    SaleInvoicesPage,
    CreditNotesPage,
    LocationsPage,
    CategoriesPage,
    UnitsPage,
    SuppliersPage,
    ReportsPage,
    SettingsPage,
    TaxesPage,
} from '@/pages'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
        },
    },
})

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout />}>
                        {/* Dashboard */}
                        <Route index element={<Dashboard />} />

                        {/* Inventory */}
                        <Route path="spare-parts" element={<SparePartsPage />} />
                        <Route path="stock-levels" element={<StockLevelsPage />} />
                        <Route path="locations" element={<LocationsPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        <Route path="units" element={<UnitsPage />} />
                        <Route path="suppliers" element={<SuppliersPage />} />

                        {/* Transactions */}
                        <Route path="production-issues" element={<ProductionIssuesPage />} />
                        <Route path="rework" element={<ReworkPage />} />
                        <Route path="indents" element={<IndentsPage />} />
                        <Route path="stock-transfer" element={<StockTransferPage />} />

                        {/* Documents */}
                        <Route path="purchase-orders" element={<PurchaseOrdersPage />} />
                        <Route path="grn" element={<GRNPage />} />
                        <Route path="delivery-challans" element={<DeliveryChallansPage />} />
                        <Route path="sale-invoices" element={<SaleInvoicesPage />} />
                        <Route path="credit-notes" element={<CreditNotesPage />} />

                        {/* Machines */}
                        <Route path="machines" element={<MachinesPage />} />

                        {/* Reports & Settings */}
                        <Route path="reports" element={<ReportsPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="taxes" element={<TaxesPage />} />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Toaster position="top-right" />
        </QueryClientProvider>
    )
}
