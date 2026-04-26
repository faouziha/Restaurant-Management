import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, Edit2, Trash2, ShoppingBasket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
    id: number;
    user_id: number;
    waiter_id: number;
    type: string;
    table_id: number | null;
    status: string;
    total_price: number;
    created_at: string;
}

interface Props {
    orders: Order[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders' }
];

export default function Index({ orders = [] }: Props) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_price), 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Orders" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
                        <p className="text-muted-foreground text-sm">Manage incoming and past orders.</p>
                    </div>
                    <Button asChild>
                        <Link href="/orders/create">
                            <ShoppingBasket className="mr-2 h-4 w-4" />
                            Create Order
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                        <p className="text-3xl font-bold">{totalOrders}</p>
                    </Card>

                    <Card className="p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Pending Orders</p>
                        <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-500">{pendingOrders}</p>
                    </Card>

                    <Card className="p-4 flex flex-col justify-center">
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-500">
                            ${totalRevenue.toFixed(2)}
                        </p>
                    </Card>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-card overflow-x-auto">
                    <table className="w-full text-left text-sm min-w-[800px]">
                        <thead className="bg-muted/50 border-b border-sidebar-border/70 text-muted-foreground font-medium whitespace-nowrap">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Table</th>
                                <th className="p-4">Waiter</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4 font-medium">#{order.id}</td>
                                            <td className="p-4">
                                                <Badge variant="outline" className="capitalize font-normal">
                                                    {order.type.replace('_', ' ')}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-muted-foreground">{order.table_id ? `Table ${order.table_id}` : '-'}</td>
                                            <td className="p-4 text-muted-foreground">{order.waiter_id || '-'}</td>
                                            <td className="p-4 font-medium">${Number(order.total_price).toFixed(2)}</td>
                                            <td className="p-4">
                                                <Badge variant="secondary" className="capitalize font-normal">
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                                                    <Link href={`/orders/${order.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" asChild>
                                                    <Link href={`/orders/${order.id}/edit`}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => router.delete(`/orders/${order.id}`)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                            No orders found. Click 'Create Order' to start.
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
