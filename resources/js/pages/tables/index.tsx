import { Head, Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { Card } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tables',
        href: '',
    },
];

export default function index() {
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
                    <Card className="md:col-span-2 p-4">
                        Total occupied tables
                    </Card>

                    {/* Second Card: Takes 2/10 columns (20%) on desktop */}
                    <Card className="md:col-span-2 p-4">
                        Avg turn time
                    </Card>

                    {/* Third Card: Takes 6/10 columns (60%) on desktop */}
                    <Card className="md:col-span-6 p-4">
                        <div className="flex flex-wrap justify-between items-center gap-2">
                            <p>Occupied:</p>
                            <p>Available:</p>
                            <p>Reserved:</p>
                            <Button asChild>
                                <Link href="/reservations/create">New Reservation</Link>
                            </Button>                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
