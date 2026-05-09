import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, Edit2, Trash2, Plus, AlertTriangle, Package, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface StockItem {
    id: number;
    ingredient: string;
    quantity: number;
    unit: string;
    min_threshold: number;
    description: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    stocks: StockItem[];
    totalItems: number;
    lowItemsCount: number;
    latestItem: StockItem | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Stock', href: '/stock' }
];

export default function Index({ stocks = [], totalItems = 0, lowItemsCount = 0, latestItem = null }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Management" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Stock Management</h1>
                        <p className="text-muted-foreground text-sm">Manage your restaurant's inventory and stock levels.</p>
                    </div>
                    <Button asChild>
                        <Link href="/stock/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Item
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col justify-center border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2 mb-1">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium text-muted-foreground">Total Stock Items</p>
                        </div>
                        <p className="text-3xl font-bold">{totalItems}</p>
                    </Card>

                    <Card className="p-4 flex flex-col justify-center border-l-4 border-l-red-500">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                        </div>
                        <p className="text-3xl font-bold text-red-600 dark:text-red-500">{lowItemsCount}</p>
                    </Card>

                    <Card className="p-4 flex flex-col justify-center border-l-4 border-l-green-500">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-green-500" />
                            <p className="text-sm font-medium text-muted-foreground">Latest Item Added</p>
                        </div>
                        <p className="text-xl font-bold text-green-600 dark:text-green-500 truncate">
                            {latestItem ? latestItem.ingredient : 'N/A'}
                        </p>
                    </Card>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-card overflow-x-auto mt-4">
                    <table className="w-full text-left text-sm min-w-[800px]">
                        <thead className="bg-muted/50 border-b border-sidebar-border/70 text-muted-foreground font-medium whitespace-nowrap">
                            <tr>
                                <th className="p-4">Item ID</th>
                                <th className="p-4">Ingredient</th>
                                <th className="p-4">Quantity</th>
                                <th className="p-4">Unit</th>
                                <th className="p-4">Min Threshold</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {stocks.length > 0 ? (
                                stocks.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-medium">#{item.id}</td>
                                        <td className="p-4 font-semibold">{item.ingredient}</td>
                                        <td className="p-4 font-medium">{Number(item.quantity).toFixed(2)}</td>
                                        <td className="p-4 text-muted-foreground">{item.unit}</td>
                                        <td className="p-4 text-muted-foreground">{Number(item.min_threshold).toFixed(2)}</td>
                                        <td className="p-4">
                                            {Number(item.quantity) <= Number(item.min_threshold) ? (
                                                <Badge variant="destructive" className="font-normal">
                                                    Low Stock
                                                </Badge>
                                            ) : (
                                                <Badge variant="secondary" className="font-normal text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30">
                                                    In Stock
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                                                <Link href={`/stock/${item.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                                                <Link href={`/stock/${item.id}/edit`}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => router.delete(`/stock/${item.id}`)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                        No stock items found. Click 'Add Item' to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
