import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Edit2, UtensilsCrossed, Eye, Trash2 } from 'lucide-react';


interface MenuItem {
    id: number;
    name: string;
    price: number;
    category: string;
    image_url: string;
    description: string;
    sold_out: boolean;
}

interface Props {
    menuItems: MenuItem[];
}



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '',
    },
];

export default function index({ menuItems }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Menu" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Menu Directory</h1>
                        <p className="text-muted-foreground text-sm">Manage your menu items and their details.</p>
                    </div>
                    <Button asChild>
                        <Link href="/menu/create">
                            <UtensilsCrossed className="mr-2 h-4 w-4" />
                            Add Menu Item
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b border-sidebar-border/70 text-muted-foreground font-medium">
                            <tr>
                                <th className="p-4">Item ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Description</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {menuItems.length > 0 ? (
                                menuItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                                            {item.id}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-foreground">{item.name}</div>
                                            <div className="text-xs text-muted-foreground">{item.category}</div>
                                        </td>
                                        <td className="p-4">{item.category}</td>
                                        <td className="p-4 font-medium">${item.price}</td>
                                        <td className="p-4 text-sm text-muted-foreground">{item.description.split(' ').length > 3
                                            ? item.description.split(' ').slice(0, 3).join(' ') + '...'
                                            : item.description
                                        }</td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/menu/${item.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" asChild className="ml-2">
                                                <Link href={`/menu/${item.id}/edit`}>
                                                    <Edit2 className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="sm" className="ml-2" onClick={() => router.delete(`/menu/${item.id}`)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No menu items found. Click "Add Menu Item" to get started.
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
