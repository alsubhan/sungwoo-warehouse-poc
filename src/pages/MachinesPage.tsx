import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Cog, Search, Eye, Link2, History, Plus } from 'lucide-react'
import { machines, locations, machinePartLinks, spareParts } from '@/data/mock-data'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import type { Machine } from '@/types'

const machineTypeLabels: Record<string, string> = {
    stamping_press: 'Stamping Press',
    welding_robot: 'Welding Robot',
    conveyor: 'Conveyor',
    paint_booth: 'Paint Booth',
    assembly: 'Assembly Station',
    other: 'Other',
}

const statusVariants: Record<string, 'success' | 'warning' | 'destructive' | 'secondary'> = {
    operational: 'success',
    under_maintenance: 'warning',
    breakdown: 'destructive',
    decommissioned: 'secondary',
}

export default function MachinesPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
    const [isViewOpen, setIsViewOpen] = useState(false)
    const [isAddOpen, setIsAddOpen] = useState(false)

    // Add Machine Form State
    const [machineCode, setMachineCode] = useState('')
    const [machineName, setMachineName] = useState('')
    const [machineType, setMachineType] = useState<'stamping_press' | 'welding_robot' | 'conveyor' | 'paint_booth' | 'assembly' | 'other'>('stamping_press')
    const [locationId, setLocationId] = useState('')
    const [manufacturer, setManufacturer] = useState('')
    const [model, setModel] = useState('')
    const [serialNumber, setSerialNumber] = useState('')

    const filteredMachines = machines.filter(
        (machine) =>
            machine.machineCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
            machine.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const getLinkedParts = (machineId: string) => {
        return machinePartLinks
            .filter((link) => link.machineId === machineId && link.isActive)
            .map((link) => {
                const part = spareParts.find((sp) => sp.id === link.sparePartId)
                return { ...link, partNumber: part?.partNumber, partName: part?.name }
            })
    }

    const handleViewMachine = (machine: Machine) => {
        setSelectedMachine(machine)
        setIsViewOpen(true)
    }

    const resetAddForm = () => {
        setMachineCode('')
        setMachineName('')
        setMachineType('stamping_press')
        setLocationId('')
        setManufacturer('')
        setModel('')
        setSerialNumber('')
    }

    const handleAddMachine = () => {
        if (!machineCode || !machineName || !locationId) {
            toast.error('Please fill all required fields')
            return
        }
        toast.success(`Machine ${machineCode} - ${machineName} added successfully`)
        setIsAddOpen(false)
        resetAddForm()
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Machines</h1>
                    <p className="text-muted-foreground">Machine master and spare part linkage</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Machine
                </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
                <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Total Machines</p><p className="text-2xl font-bold">{machines.length}</p></CardContent></Card>
                <Card className="border-green-200 bg-green-50 dark:bg-green-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Operational</p><p className="text-2xl font-bold text-green-600">{machines.filter((m) => m.status === 'operational').length}</p></CardContent></Card>
                <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Under Maintenance</p><p className="text-2xl font-bold text-amber-600">{machines.filter((m) => m.status === 'under_maintenance').length}</p></CardContent></Card>
                <Card className="border-red-200 bg-red-50 dark:bg-red-950/20"><CardContent className="p-4"><p className="text-sm text-muted-foreground">Breakdown</p><p className="text-2xl font-bold text-red-600">{machines.filter((m) => m.status === 'breakdown').length}</p></CardContent></Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by machine code or name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Cog className="h-5 w-5" />Machines ({filteredMachines.length})</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Machine Code</TableHead><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Location</TableHead><TableHead>Manufacturer</TableHead><TableHead>Linked Parts</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredMachines.map((machine) => {
                                const location = locations.find((l) => l.id === machine.locationId)
                                const linkedParts = getLinkedParts(machine.id)
                                return (
                                    <TableRow key={machine.id}>
                                        <TableCell className="font-mono font-medium">{machine.machineCode}</TableCell>
                                        <TableCell>{machine.name}</TableCell>
                                        <TableCell>{machineTypeLabels[machine.type]}</TableCell>
                                        <TableCell>{location?.name || '-'}</TableCell>
                                        <TableCell>{machine.manufacturer || '-'}</TableCell>
                                        <TableCell><Badge variant="outline" className="gap-1"><Link2 className="h-3 w-3" />{linkedParts.length}</Badge></TableCell>
                                        <TableCell><Badge variant={statusVariants[machine.status]}>{machine.status.replace('_', ' ')}</Badge></TableCell>
                                        <TableCell className="text-right"><Button variant="ghost" size="icon" onClick={() => handleViewMachine(machine)}><Eye className="h-4 w-4" /></Button></TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* View Machine Dialog */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Machine Details</DialogTitle>
                        <DialogDescription>View machine information and linked spare parts</DialogDescription>
                    </DialogHeader>
                    {selectedMachine && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-muted-foreground">Machine Code</p><p className="font-mono font-medium">{selectedMachine.machineCode}</p></div>
                                <div><p className="text-sm text-muted-foreground">Name</p><p className="font-medium">{selectedMachine.name}</p></div>
                                <div><p className="text-sm text-muted-foreground">Type</p><p>{machineTypeLabels[selectedMachine.type]}</p></div>
                                <div><p className="text-sm text-muted-foreground">Status</p><Badge variant={statusVariants[selectedMachine.status]}>{selectedMachine.status.replace('_', ' ')}</Badge></div>
                                <div><p className="text-sm text-muted-foreground">Manufacturer</p><p>{selectedMachine.manufacturer || '-'}</p></div>
                                <div><p className="text-sm text-muted-foreground">Model</p><p>{selectedMachine.model || '-'}</p></div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-3"><History className="h-4 w-4" /><p className="font-medium">Linked Spare Parts</p></div>
                                <Table>
                                    <TableHeader><TableRow><TableHead>Part Number</TableHead><TableHead>Part Name</TableHead><TableHead>Installed Date</TableHead><TableHead>Installed By</TableHead><TableHead>Reason</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {getLinkedParts(selectedMachine.id).map((link) => (
                                            <TableRow key={link.id}>
                                                <TableCell className="font-mono">{link.partNumber}</TableCell>
                                                <TableCell>{link.partName}</TableCell>
                                                <TableCell>{formatDate(link.installedDate)}</TableCell>
                                                <TableCell>{link.installedBy}</TableCell>
                                                <TableCell><Badge variant="secondary">{link.reason?.replace('_', ' ')}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                        {getLinkedParts(selectedMachine.id).length === 0 && (
                                            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No parts linked to this machine</TableCell></TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex justify-end"><Button><Link2 className="h-4 w-4 mr-2" />Link Spare Part</Button></div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Machine Dialog */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Add Machine</DialogTitle>
                        <DialogDescription>Add a new machine to the system</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Machine Code *</Label>
                                <Input value={machineCode} onChange={e => setMachineCode(e.target.value)} placeholder="e.g. SW-MCH-009" />
                            </div>
                            <div className="space-y-2">
                                <Label>Machine Name *</Label>
                                <Input value={machineName} onChange={e => setMachineName(e.target.value)} placeholder="e.g. Stamping Press #5" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Machine Type *</Label>
                                <Select value={machineType} onValueChange={(v: any) => setMachineType(v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="stamping_press">Stamping Press</SelectItem>
                                        <SelectItem value="welding_robot">Welding Robot</SelectItem>
                                        <SelectItem value="conveyor">Conveyor</SelectItem>
                                        <SelectItem value="paint_booth">Paint Booth</SelectItem>
                                        <SelectItem value="assembly">Assembly Station</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Location *</Label>
                                <Select value={locationId} onValueChange={setLocationId}>
                                    <SelectTrigger><SelectValue placeholder="Select location" /></SelectTrigger>
                                    <SelectContent>
                                        {locations.filter(l => l.isActive).map(l => (<SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Manufacturer</Label>
                                <Input value={manufacturer} onChange={e => setManufacturer(e.target.value)} placeholder="e.g. Komatsu" />
                            </div>
                            <div className="space-y-2">
                                <Label>Model</Label>
                                <Input value={model} onChange={e => setModel(e.target.value)} placeholder="e.g. H2W-500T" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Serial Number</Label>
                            <Input value={serialNumber} onChange={e => setSerialNumber(e.target.value)} placeholder="Optional" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddMachine}>Add Machine</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
