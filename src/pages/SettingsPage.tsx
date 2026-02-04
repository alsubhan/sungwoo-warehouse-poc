import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Settings, Building, User, FileText } from 'lucide-react'

export default function SettingsPage() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Application configuration</p></div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Building className="h-5 w-5" />Company Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="Sungwoo Automotive India Pvt Ltd" /></div>
                        <div className="space-y-2"><Label>GSTIN</Label><Input defaultValue="29AABCS1234A1ZK" /></div>
                        <div className="space-y-2"><Label>Address</Label><Input defaultValue="Plot 45, KIADB Industrial Area, Bangalore" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label>State</Label><Input defaultValue="Karnataka" /></div>
                            <div className="space-y-2"><Label>PIN Code</Label><Input defaultValue="560100" /></div>
                        </div>
                        <Button>Save Company Details</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><FileText className="h-5 w-5" />Document Settings</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>PO Prefix</Label><Input defaultValue="PO-2024-" /></div>
                        <div className="space-y-2"><Label>GRN Prefix</Label><Input defaultValue="GRN-2024-" /></div>
                        <div className="space-y-2"><Label>DC Prefix</Label><Input defaultValue="DC-2024-" /></div>
                        <div className="space-y-2"><Label>Invoice Prefix</Label><Input defaultValue="INV-2024-" /></div>
                        <Button>Save Document Settings</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><User className="h-5 w-5" />User Preferences</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2"><Label>Default Location</Label><Input defaultValue="Main Warehouse" /></div>
                        <div className="space-y-2"><Label>Date Format</Label><Input defaultValue="DD/MM/YYYY" /></div>
                        <div className="space-y-2"><Label>Currency</Label><Input defaultValue="INR (₹)" disabled /></div>
                        <Button>Save Preferences</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Settings className="h-5 w-5" />System</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                            <p className="text-sm font-medium">POC Version</p>
                            <p className="text-2xl font-bold">1.0.0</p>
                            <p className="text-xs text-muted-foreground">Industrial Warehouse Management System</p>
                        </div>
                        <Separator />
                        <p className="text-sm text-muted-foreground">This is a frontend-only POC for demonstration purposes. Backend integration pending.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
