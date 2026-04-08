import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Menu', href: '/menu' },
    { title: 'Create Menu Item', href: '/menu/create' }
];

export default function Create() {
    const [isSuccess, setIsSuccess] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        category: '',
        image: null as File | null,
        description: '',
        sold_out: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/menu', {
            forceFormData: true,
            onSuccess: () => setIsSuccess(true),
        });
    }

    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Success" />
                <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                    <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                    <h1 className="text-3xl font-bold tracking-tight text-center">
                        Menu Item Created Successfully!
                    </h1>
                    <p className="text-muted-foreground">
                        {data.name} has been added to the menu.
                    </p>
                    <Button asChild className="mt-6 w-fit">
                        <Link href="/menu">Return to Menu Directory</Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Menu Item" />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Create Menu Item</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">

                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-center gap-3 p-4 text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium text-sm">Please fix the highlighted errors below before continuing.</p>
                        </div>
                    )}

                    {/* --- Basic Information --- */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Item Details</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} id="name" placeholder="e.g. Classic Margherita" required />
                                {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input value={data.price} onChange={(e) => setData('price', e.target.value)} id="price" type="number" step="0.01" placeholder="0.00" required />
                                {errors.price && <p className="text-xs text-red-500 font-medium">{errors.price}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <select
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    id="category"
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-950"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="appetizers">Appetizers</option>
                                    <option value="mains">Mains</option>
                                    <option value="desserts">Desserts</option>
                                    <option value="drinks">Drinks</option>
                                </select>
                                {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Item Image</Label>
                                <Input onChange={(e) => setData('image', e.target.files?.[0] || null)} type="file" id="image" className="cursor-pointer" />
                                {errors.image && <p className="text-xs text-red-500 font-medium">{errors.image}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input value={data.description} onChange={(e) => setData('description', e.target.value)} id="description" placeholder="Describe the ingredients or flavor profile..." required />
                            {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description}</p>}
                        </div>
                    </div>

                    {/* --- Availability --- */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Availability</h2>
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="sold_out"
                                checked={data.sold_out}
                                onChange={(e) => setData('sold_out', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-zinc-700 dark:bg-zinc-950"
                            />
                            <Label htmlFor="sold_out" className="cursor-pointer">Mark as Sold Out</Label>
                        </div>
                        {errors.sold_out && <p className="text-xs text-red-500 font-medium">{errors.sold_out}</p>}
                    </div>

                    {/* --- Actions --- */}
                    <div className="flex justify-end pt-4 space-x-2">
                        <Button variant="outline" asChild>
                            <Link href="/menu">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Menu Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}