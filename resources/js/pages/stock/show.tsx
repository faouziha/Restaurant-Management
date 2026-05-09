import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit2, Trash2, Package, Clock, Info, AlertTriangle, Box } from "lucide-react";

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
    stock: StockItem;
}

export default function Show({ stock }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Stock Management', href: '/stock' },
        { title: `${stock.ingredient}`, href: `/stock/${stock.id}` }
    ];

    const formattedCreatedAt = new Date(stock.created_at).toLocaleString();
    const formattedUpdatedAt = new Date(stock.updated_at).toLocaleString();
    const isLowStock = Number(stock.quantity) <= Number(stock.min_threshold);

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this stock item? This action cannot be undone.")) {
            router.delete(`/stock/${stock.id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${stock.ingredient} - Stock Details`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-5xl mx-auto w-full">
                
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="rounded-full">
                            <Link href="/stock"><ArrowLeft className="h-5 w-5" /></Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                {stock.ingredient}
                                {isLowStock ? (
                                    <Badge variant="destructive" className="ml-2 font-normal">
                                        Low Stock
                                    </Badge>
                                ) : (
                                    <Badge variant="secondary" className="ml-2 font-normal text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400">
                                        In Stock
                                    </Badge>
                                )}
                            </h1>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3.5 h-3.5" /> Added on {formattedCreatedAt}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/stock/${stock.id}/edit`}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Item
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Details */}
                    <Card className="md:col-span-2 overflow-hidden border-sidebar-border/70 shadow-sm">
                        <div className="bg-muted/30 p-4 border-b border-sidebar-border/50">
                            <h2 className="font-semibold text-lg flex items-center gap-2">
                                <Package className="w-5 h-5 text-primary" /> Item Details
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                                        <Box className="w-4 h-4" /> Ingredient Name
                                    </h3>
                                    <p className="text-lg font-semibold">{stock.ingredient}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                                        <AlertTriangle className="w-4 h-4" /> Min Threshold
                                    </h3>
                                    <p className="text-lg font-semibold">{Number(stock.min_threshold).toFixed(2)} {stock.unit}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-2">
                                    <Info className="w-4 h-4" /> Description
                                </h3>
                                {stock.description ? (
                                    <p className="text-sm leading-relaxed text-foreground bg-muted/20 p-4 rounded-md border border-sidebar-border/50">
                                        {stock.description}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No description provided.</p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Stock Level Sidebar */}
                    <div className="space-y-6">
                        <Card className="p-5 border-sidebar-border/70 shadow-sm space-y-4">
                            <h3 className="font-semibold text-lg border-b border-sidebar-border/50 pb-2">Current Level</h3>
                            
                            <div className="space-y-3">
                                <div className="text-center py-4">
                                    <span className={`text-5xl font-bold ${isLowStock ? 'text-red-500' : 'text-green-500'}`}>
                                        {Number(stock.quantity).toFixed(2)}
                                    </span>
                                    <span className="text-xl text-muted-foreground ml-2 font-medium">
                                        {stock.unit}
                                    </span>
                                </div>
                                
                                {isLowStock && (
                                    <div className="bg-red-500/10 text-red-500 text-sm p-3 rounded-md border border-red-500/20 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                        <span>This item is currently below the minimum threshold of {Number(stock.min_threshold).toFixed(2)} {stock.unit}. Restock recommended.</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        <Card className="p-5 border-sidebar-border/70 shadow-sm space-y-4 bg-muted/10">
                            <h3 className="font-semibold text-lg border-b border-sidebar-border/50 pb-2">Record Info</h3>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">ID</span>
                                    <span className="font-medium">#{stock.id}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground">Last Updated</span>
                                    <span className="font-medium">{formattedUpdatedAt}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
