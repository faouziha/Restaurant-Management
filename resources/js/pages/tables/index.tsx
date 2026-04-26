import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit2, Eye, LayoutDashboard, Trash2, List, Map } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';

interface Table {
    id: number;
    number: number;
    waiter_id: number;
    status: string;
    position_x?: number;
    position_y?: number;
}

interface Props {
    tables: Table[]
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tables',
        href: '',
    },
];

export default function index({ tables }: Props) {
    const occupiedCount = tables.filter(t => t.status.toLowerCase() === 'occupied').length;
    const availableCount = tables.filter(t => t.status.toLowerCase() === 'available').length;
    const reservedCount = tables.filter(t => t.status.toLowerCase() === 'reserved').length;

    const [localTables, setLocalTables] = useState<Table[]>(tables);
    const [selectedTable, setSelectedTable] = useState<Table | null>(null);
    const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');

    useEffect(() => {
        setLocalTables(tables);
    }, [tables]);

    const handleDragEnd = (event: any, info: any, table: Table) => {
        // Compute the new absolute position based on the drag offset
        const newX = (table.position_x || 0) + info.offset.x;
        const newY = (table.position_y || 0) + info.offset.y;
        
        // Optimistically update the UI so it doesn't snap back before server confirms
        setLocalTables(prev => 
            prev.map(t => t.id === table.id ? {...t, position_x: newX, position_y: newY} : t)
        );

        // Send a partial update to the backend saving the coordinates quietly
        router.patch(`/tables/${table.id}`, {
            position_x: Math.round(newX),
            position_y: Math.round(newY),
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tables" />
            
            {/* Table Details Sidebar (Sheet) */}
            <Sheet open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle className="text-2xl font-bold">Table {selectedTable?.number}</SheetTitle>
                        <SheetDescription>
                            Review the details and manage this table.
                        </SheetDescription>
                    </SheetHeader>
                    
                    {selectedTable && (
                        <div className="space-y-6 mt-6 p-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                                <Badge 
                                    className="px-3 py-1 text-sm border shadow-sm"
                                    variant={
                                        selectedTable.status.toLowerCase() === 'available' ? 'default' : 
                                        selectedTable.status.toLowerCase() === 'reserved' ? 'secondary' : 'destructive'
                                    }
                                >
                                    {selectedTable.status.toUpperCase()}
                                </Badge>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Assigned Waiter</p>
                                <p className="text-base font-medium">{selectedTable.waiter_id ? `ID: ${selectedTable.waiter_id}` : 'Not assigned'}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Coordinates</p>
                                <p className="text-sm font-mono text-muted-foreground">X: {Math.round(selectedTable.position_x || 0)}, Y: {Math.round(selectedTable.position_y || 0)}</p>
                            </div>
                        </div>
                    )}

                    <SheetFooter className="mt-8 flex flex-col sm:flex-row gap-2 w-full sm:justify-start">
                        {selectedTable && (
                            <>
                                <Button asChild className="w-full">
                                    <Link href={`/tables/${selectedTable.id}/edit`}>
                                        <Edit2 className="mr-2 h-4 w-4" /> Edit
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={`/tables/${selectedTable.id}`}>
                                        <Eye className="mr-2 h-4 w-4" /> Full Details
                                    </Link>
                                </Button>
                                <div className="flex-1" />
                                <Button variant="destructive" onClick={() => router.delete(`/tables/${selectedTable.id}`)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </>
                        )}
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tables</h1>
                        <p className="text-muted-foreground text-sm">Manage your tables and their details.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'canvas' ? 'list' : 'canvas')}>
                            {viewMode === 'canvas' ? <List className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                        </Button>
                        <Button asChild>
                            <Link href="/tables/create">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                Add Table
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Metrics Dashboard */}
                <div className="grid grid-cols-1 md:grid-cols-10 w-full gap-4">
                    <Card className="md:col-span-2 p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Total Occupied</p>
                        <p className="text-3xl font-bold">{occupiedCount}</p>
                    </Card>

                    <Card className="md:col-span-2 p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Avg Turn Time</p>
                        <p className="text-3xl font-bold">45<span className="text-lg text-muted-foreground font-normal ml-1">min</span></p>
                    </Card>

                    <Card className="md:col-span-6 p-4 flex items-center">
                        <div className="flex w-full flex-wrap justify-between items-center gap-4 md:mt-4">
                            <div className="flex gap-6 md:gap-10">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Occupied</p>
                                    <p className="text-2xl font-bold">{occupiedCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Available</p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-500">{availableCount}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Reserved</p>
                                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-500">{reservedCount}</p>
                                </div>
                            </div>
                            <Button asChild>
                                <Link href="/reservations/create">New Reservation</Link>
                            </Button>
                        </div>
                    </Card>
                </div>

                <main className='mt-2 space-y-4 flex-1 flex flex-col h-full'>
                    {viewMode === 'canvas' ? (
                        <Card className="relative flex-1 min-h-[600px] w-full bg-slate-100 dark:bg-zinc-900 border-2 border-dashed overflow-hidden rounded-xl shadow-inner">
                            <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                <h3 className="font-semibold text-lg opacity-50">Floor Plan Canvas</h3>
                                <p className="text-sm text-muted-foreground opacity-50">Drag tables to position them. Click for details.</p>
                            </div>
                            
                            {localTables.map(table => {
                                const isAvailable = table.status.toLowerCase() === 'available';
                                const isReserved = table.status.toLowerCase() === 'reserved';
                                
                                return (
                                    <motion.div
                                        key={table.id}
                                        drag
                                        dragMomentum={false}
                                        onDragEnd={(e, info) => handleDragEnd(e, info, table)}
                                        initial={{ x: table.position_x || 0, y: table.position_y || 0 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileDrag={{ scale: 1.1, zIndex: 50, cursor: 'grabbing' }}
                                        onClick={() => setSelectedTable(table)}
                                        className={`absolute w-28 h-28 rounded-2xl flex flex-col items-center justify-center cursor-pointer active:cursor-grabbing border-4 shadow-md transition-shadow
                                            ${isAvailable ? 'bg-green-100 border-green-500 text-green-900 dark:bg-green-950 dark:text-green-300' :
                                            isReserved ? 'bg-blue-100 border-blue-500 text-blue-900 dark:bg-blue-950 dark:text-blue-300' :
                                            'bg-red-100 border-red-500 text-red-900 dark:bg-red-950 dark:text-red-300'}`}
                                        style={{ zIndex: selectedTable?.id === table.id ? 40 : 10 }}
                                    >
                                        <div className="text-2xl font-black drop-shadow-sm">{table.number}</div>
                                        <div className="text-[10px] font-bold tracking-widest uppercase mt-1 opacity-80">{table.status}</div>
                                        {table.waiter_id && <div className="text-[10px] mt-1 font-medium bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded-full">Waiter {table.waiter_id}</div>}
                                    </motion.div>
                                );
                            })}
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <Card className='p-4 h-full'>
                                        <h3 className="font-semibold mb-4 text-lg">Reserved Tables</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {tables.filter(t => t.status.toLowerCase() === 'reserved').length > 0 ? (
                                                tables.filter(t => t.status.toLowerCase() === 'reserved').map(table => (
                                                    <Badge key={table.id} variant="secondary" onClick={() => setSelectedTable(table)} className="px-3 py-1 cursor-pointer hover:bg-secondary/80 text-sm transition-colors border shadow-sm">
                                                        Table {table.number}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No reserved tables right now.</p>
                                            )}
                                        </div>
                                    </Card>
                                </div>

                                <div>
                                    <Card className='p-4 h-full'>
                                        <h3 className="font-semibold mb-4 text-lg">Available Tables</h3>
                                        <div className="flex gap-2 flex-wrap">
                                            {tables.filter(t => t.status.toLowerCase() === 'available').length > 0 ? (
                                                tables.filter(t => t.status.toLowerCase() === 'available').map(table => (
                                                    <Badge key={table.id} variant="default" onClick={() => setSelectedTable(table)} className="px-3 py-1 cursor-pointer hover:bg-primary/90 text-sm transition-colors shadow-sm">
                                                        Table {table.number}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No available tables right now.</p>
                                            )}
                                        </div>
                                    </Card>
                                </div>
                            </div>
                            <Card className='p-4'>
                                <h3 className="font-semibold mb-4 text-lg">All Tables</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-muted/50 border-b border-sidebar-border/70 text-muted-foreground font-medium">
                                            <tr>
                                                <th className="p-4">Table Id</th>
                                                <th className="p-4">Table Number</th>
                                                <th className="p-4">Waiter Id</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tables.length > 0 ? (
                                                tables.map((table) => (
                                                    <tr key={table.id} className="hover:bg-muted/30 transition-colors">
                                                        <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400">{table.id}</td>
                                                        <td className="p-4 font-bold">{table.number}</td>
                                                        <td className="p-4">{table.waiter_id || <span className="text-muted-foreground italic">Unassigned</span>}</td>
                                                        <td className="p-4">
                                                            <Badge variant="outline">{table.status}</Badge>
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <Button variant="ghost" size="sm" onClick={() => setSelectedTable(table)}>
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="sm" asChild className="ml-2">
                                                                <Link href={`/tables/${table.id}/edit`}>
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Link>
                                                            </Button>
                                                            <Button variant="ghost" size="sm" className="ml-2" onClick={() => router.delete(`/tables/${table.id}`)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                                        No tables found. Please add a table to get started.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </AppLayout>
    );
}
