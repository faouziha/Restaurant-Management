import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

interface Table {
    id: number;
    number: number;
    waiter_id: number | null;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Props {
    table: Table;
}

export default function ShowTable({ table }: Props) {
    const breadcrumbs = [
        { title: 'Tables', href: '/tables' },
        { title: `Table ${table.number}`, href: `/tables/${table.id}` }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Table ${table.number}`} />
            
            <div className="flex h-full flex-1 flex-col items-center justify-center p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" asChild>
                            <Link href="/tables">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight">Table {table.number}</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Table Information</CardTitle>
                            <CardDescription>View the current status and assignment for this table.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                                    <Badge 
                                        variant={
                                            table.status === 'AVAILABLE' ? 'default' : 
                                            table.status === 'OCCUPIED' ? 'destructive' : 
                                            'secondary'
                                        }
                                    >
                                        {table.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Assigned Waiter</p>
                                    <div className="text-base font-medium">
                                        {table.waiter_id ? `Waiter ID: ${table.waiter_id}` : <span className="text-muted-foreground italic">Not Assigned</span>}
                                    </div>
                                </div>
                                
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Created At</p>
                                    <p className="text-sm">{new Date(table.created_at).toLocaleDateString()}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Last Updated</p>
                                    <p className="text-sm">{new Date(table.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2 border-t pt-6">
                            <Button variant="outline" asChild>
                                <Link href={`/tables/${table.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Table
                                </Link>
                            </Button>
                            <Button variant="destructive" asChild>
                                <Link href={`/tables/${table.id}`} method="delete" as="button">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Table
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
