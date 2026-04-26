import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Info, MapPin, Receipt, User, Utensils } from "lucide-react";

interface Order { 
    id: number; 
    type: string; 
    status: string; 
    total_price: number; 
    created_at: string;
    table: { id: number; number: number; } | null;
    waiter: { id: number; name: string; } | null;
    items: { 
        id: number; 
        quantity: number; 
        notes: string; 
        unit_price: number; 
        menu: { id: number; name: string; }; 
    }[];
}

interface Props { 
    order: Order; 
}

export default function Show({ order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Orders', href: '/orders' },
        { title: `Order #${order.id}`, href: `/orders/${order.id}` }
    ];

    const formattedDate = new Date(order.created_at).toLocaleString();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href="/orders"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                Order #{order.id}
                                <Badge variant="secondary" className="capitalize font-normal ml-2">
                                    {order.status}
                                </Badge>
                            </h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3.5 h-3.5" /> {formattedDate}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Items List */}
                    <Card className="md:col-span-2 overflow-hidden border-sidebar-border/70 shadow-sm">
                        <div className="bg-muted/30 p-4 border-b border-sidebar-border/50">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-primary" /> Order Items
                            </h2>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-left text-sm min-w-[500px]">
                                <thead className="bg-muted/10 border-b border-sidebar-border/50 text-muted-foreground">
                                    <tr>
                                        <th className="p-4 font-medium">Item</th>
                                        <th className="p-4 font-medium text-center">Qty</th>
                                        <th className="p-4 font-medium text-right">Price</th>
                                        <th className="p-4 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/50">
                                    {order.items?.map(item => (
                                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <div className="font-medium">{item.menu?.name}</div>
                                                {item.notes && (
                                                    <div className="text-xs text-muted-foreground mt-1 flex items-start gap-1">
                                                        <Info className="w-3 h-3 mt-0.5 shrink-0" /> {item.notes}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center font-semibold">{item.quantity}</td>
                                            <td className="p-4 text-right text-muted-foreground">${Number(item.unit_price).toFixed(2)}</td>
                                            <td className="p-4 text-right font-medium">${(item.quantity * item.unit_price).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {(!order.items || order.items.length === 0) && (
                                        <tr>
                                            <td colSpan={4} className="p-8 text-center text-muted-foreground">
                                                No items found in this order.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Order Details Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-5 border-sidebar-border/70 shadow-sm space-y-4">
                            <h3 className="font-semibold text-lg border-b border-sidebar-border/50 pb-2">Details</h3>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" /> Waiter</span>
                                    <span className="font-medium">{order.waiter?.name || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground flex items-center gap-2"><MapPin className="w-4 h-4" /> Type</span>
                                    <span className="font-medium capitalize">{order.type.replace('_', ' ')}</span>
                                </div>
                                {order.table && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground flex items-center gap-2"><Utensils className="w-4 h-4" /> Table</span>
                                        <span className="font-medium">Table {order.table.number}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-5 border-sidebar-border/70 shadow-sm space-y-4 bg-muted/10">
                            <h3 className="font-semibold text-lg border-b border-sidebar-border/50 pb-2">Summary</h3>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Items Subtotal</span>
                                    <span>${Number(order.total_price).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground border-b border-sidebar-border/50 pb-2">
                                    <span>Tax</span>
                                    <span>$0.00</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-green-600 dark:text-green-400">${Number(order.total_price).toFixed(2)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
