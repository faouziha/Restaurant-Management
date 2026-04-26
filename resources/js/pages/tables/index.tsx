import { Head, Link, router } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit2, Eye, LayoutDashboard, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Table {
    id: number,
    number: number,
    waiter_id: number,
    status: string
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tables" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Tables</h1>
                        <p className="text-muted-foreground text-sm">Manage your tables and their details.</p>
                    </div>
                    <Button asChild>
                        <Link href="/tables/create">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Add Table
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-10 w-full gap-4">
                    {/* First Card: Takes 2/10 columns (20%) on desktop */}
                    <Card className="md:col-span-2 p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Total Occupied</p>
                        <p className="text-3xl font-bold">{occupiedCount}</p>
                    </Card>

                    {/* Second Card: Takes 2/10 columns (20%) on desktop */}
                    <Card className="md:col-span-2 p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Avg Turn Time</p>
                        <p className="text-3xl font-bold">45<span className="text-lg text-muted-foreground font-normal ml-1">min</span></p>
                    </Card>

                    {/* Third Card: Takes 6/10 columns (60%) on desktop */}
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

                <main className='grid space-y-1'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-1 space-y-1'>
                        <div>
                            <Card className='p-4 h-full'>
                                <h3 className="font-semibold mb-4 text-lg">Reserved Tables</h3>
                                <div className="flex gap-2 flex-wrap">
                                    {tables.filter(t => t.status.toLowerCase() === 'reserved').length > 0 ? (
                                        tables.filter(t => t.status.toLowerCase() === 'reserved').map(table => (
                                            <Link key={table.id} href={`/tables/${table.id}`}>
                                                <Badge variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-secondary/80 text-sm transition-colors border shadow-sm">
                                                    Table {table.number}
                                                </Badge>
                                            </Link>
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
                                            <Link key={table.id} href={`/tables/${table.id}`}>
                                                <Badge variant="default" className="px-3 py-1 cursor-pointer hover:bg-primary/90 text-sm transition-colors shadow-sm">
                                                    Table {table.number}
                                                </Badge>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic">No available tables right now.</p>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div>
                        <Card className='p-4'>
                            All Tables
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
                                                <td className="p-4">{table.number}</td>
                                                <td className="p-4">{table.waiter_id || 'N/A'}</td>
                                                <td className="p-4">{table.status}</td>
                                                <td className="p-4 text-right">
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/tables/${table.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
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
                                            <td colSpan={4} className="p-4 text-center text-muted-foreground">
                                                No tables found. Please add a table to get started.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
