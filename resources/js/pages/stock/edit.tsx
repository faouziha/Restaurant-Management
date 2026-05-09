import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CheckCircle, Save } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface StockItem {
    id: number;
    ingredient: string;
    quantity: number;
    unit: string;
    min_threshold: number;
    description: string | null;
}

interface Props {
    stock: StockItem;
}

export default function Edit({ stock }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Stock Management', href: '/stock' },
        { title: `${stock.ingredient}`, href: `/stock/${stock.id}` },
        { title: 'Edit', href: `/stock/${stock.id}/edit` }
    ];

    const [isSuccess, setIsSuccess] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        ingredient: stock.ingredient,
        quantity: stock.quantity.toString(),
        unit: stock.unit,
        min_threshold: stock.min_threshold.toString(),
        description: stock.description || '',
    });
    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

    const handleManualReturn = () => {
        if (timerId) {
            clearTimeout(timerId);
        }
        router.visit('/stock');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/stock/${stock.id}`, {
            onSuccess: () => {
                setIsSuccess(true);
                const id = setTimeout(() => {
                    router.visit('/stock');
                }, 3000);
                setTimerId(id);
            },
        });
    };

    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Success" />
                <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                    <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                    <h1 className="text-3xl font-bold tracking-tight text-center">
                        Stock Item Updated Successfully!
                    </h1>
                    <p className="text-muted-foreground">
                        {data.ingredient} has been updated. Redirecting in 3 seconds...
                    </p>
                    <Button onClick={handleManualReturn} className="mt-6 w-fit">
                        Return to Stock List Now
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${stock.ingredient}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-3xl mx-auto w-full">
                <div className="flex items-center gap-4 mb-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/stock">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Stock Item</h1>
                        <p className="text-muted-foreground text-sm">Update details for {stock.ingredient}.</p>
                    </div>
                </div>

                <Card>
                    <form onSubmit={submit}>
                        <CardHeader>
                            <CardTitle>Item Details</CardTitle>
                            <CardDescription>Modify the information and stock levels for this item.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="ingredient">Ingredient Name *</Label>
                                    <Input
                                        id="ingredient"
                                        value={data.ingredient}
                                        onChange={(e) => setData('ingredient', e.target.value)}
                                        placeholder="e.g. Flour, Tomatoes, etc."
                                        required
                                    />
                                    {errors.ingredient && <p className="text-sm text-red-500">{errors.ingredient}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit of Measurement *</Label>
                                    <Input
                                        id="unit"
                                        value={data.unit}
                                        onChange={(e) => setData('unit', e.target.value)}
                                        placeholder="e.g. kg, lbs, units, liters"
                                        required
                                    />
                                    {errors.unit && <p className="text-sm text-red-500">{errors.unit}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Current Quantity *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.quantity}
                                        onChange={(e) => setData('quantity', e.target.value)}
                                        placeholder="0.00"
                                        required
                                    />
                                    {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="min_threshold">Minimum Threshold *</Label>
                                    <Input
                                        id="min_threshold"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.min_threshold}
                                        onChange={(e) => setData('min_threshold', e.target.value)}
                                        placeholder="Amount to trigger low stock alert"
                                        required
                                    />
                                    {errors.min_threshold && <p className="text-sm text-red-500">{errors.min_threshold}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <textarea
                                    id="description"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Add any additional details about this stock item..."
                                />
                                {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end border-t border-sidebar-border/70 p-6">
                            <Button type="button" variant="outline" className="mr-2" asChild>
                                <Link href={`/stock/${stock.id}`}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}
