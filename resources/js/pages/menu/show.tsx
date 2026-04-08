import { Badge } from "@/components/ui/badge"; // Ensure this exists in ui/
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head, Link } from "@inertiajs/react";
import { ChevronLeft, Edit, Utensils, DollarSign, Tag } from "lucide-react";

interface Menu {
    id: number;
    name: string;
    price: number;
    category: string;
    image_url: string;
    description: string;
    sold_out: boolean;
}

interface Props {
    menu: Menu;
}

export default function Show({ menu }: Props) {
    const breadcrumbs = [
        { title: 'Menu', href: '/menu' },
        { title: menu.name, href: `/menu/${menu.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${menu.name} - Details`} />

            <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <Button variant="ghost" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
                        <Link href="/menu">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Menu
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/menu/${menu.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Item
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column: Image Card */}
                    <div className="md:col-span-5">
                        <Card className="overflow-hidden border-sidebar-border/70 shadow-sm">
                            <div className="aspect-square relative">
                                <img 
                                    src={`/storage/${menu.image_url}`} 
                                    alt={menu.name} 
                                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-500" 
                                />
                                {menu.sold_out && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Badge variant="destructive" className="text-lg px-6 py-1 uppercase tracking-wider">
                                            Sold Out
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Details */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize">
                                    <Tag className="mr-1 h-3 w-3" />
                                    {menu.category}
                                </Badge>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">{menu.name}</h1>
                        </div>

                        <Card className="border-sidebar-border/70 bg-sidebar/10">
                            <CardContent className="p-6 space-y-6">
                                {/* Price and Meta Info */}
                                <div className="grid grid-cols-2 gap-4 border-b border-sidebar-border/70 pb-6">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <DollarSign className="mr-1 h-3 w-3" /> Price
                                        </p>
                                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ${Number(menu.price).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center">
                                            <Utensils className="mr-1 h-3 w-3" /> Status
                                        </p>
                                        <p className="text-lg font-medium">
                                            {menu.sold_out ? (
                                                <span className="text-red-500">Unavailable</span>
                                            ) : (
                                                <span className="text-blue-500">Active on Menu</span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-foreground underline decoration-sidebar-border underline-offset-4">
                                        Description
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed italic">
                                        "{menu.description}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}