import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { CheckCircle } from "lucide-react";
import { FormEventHandler, useState } from "react";

interface Menu {
    id: number;
    name: string;
    price: number | string;
    category: string;
    image_url: File | string | null;
    description: string;
    sold_out: boolean;
}

interface Props {
    menu: Menu;
}

export default function Edit({ menu }: Props) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

    if (!menu) return <div>Loading...</div>;

    const { data, setData, put, processing, errors } = useForm({
        name: menu.name || '',
        price: menu.price || '',
        category: menu.category || '',
        image_url: menu.image_url || null,
        description: menu.description || '',
        sold_out: menu.sold_out || false,
    });

    const breadcrumbs = [
        { title: 'Menu', href: '/menu' },
        { title: 'Edit Menu', href: `/menu/${menu.id}/edit` },
    ];

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        put('/menu/' + menu.id, {
            onSuccess: () => {
                setIsSuccess(true);
                const id = setTimeout(() => {
                    router.visit('/menu');
                }, 3000);
                setTimerId(id); // Store the ID
            },
        });
    };

    const handleManualReturn = () => {
        if (timerId) {
            clearTimeout(timerId); // Stop the 3s timer
        }
        router.visit('/menu');
    };

    if (isSuccess) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Success" />
            <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                <h1 className="text-3xl font-bold tracking-tight text-center">
                    Menu Updated Successfully!
                </h1>
                <p className="text-muted-foreground">
                    {data.name} has been updated. Redirecting in 3 seconds...
                </p>
                {/* Manual Return Button */}
                <Button onClick={handleManualReturn} className="mt-6 w-fit">
                    Return to Menu List Now
                </Button>
            </div>
        </AppLayout>
    );
}

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Menu" />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Edit Menu</h1>

                <form className="space-y-8 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border" onSubmit={submit}>
                    <h2 className="text-lg font-semibold">Menu Item Details</h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Item Name</Label>
                            <Input
                                id="name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <Label htmlFor="price">Price</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                required
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-950"
                            >
                                <option value="">Select a category</option>
                                <option value="appetizer">Appetizer</option>
                                <option value="main">Main Course</option>
                                <option value="dessert">Dessert</option>
                                <option value="drink">Drink</option>
                            </select>
                            {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="image_url">Item Image</Label>
                            <Input
                                id="image_url"
                                type="file"
                                onChange={(e) => setData('image_url', e.target.files ? e.target.files[0] : null)}
                            />
                            {errors.image_url && (
                                <p className="text-sm text-red-500">{errors.image_url}</p>
                            )}                        </div>

                        {/* Description */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                rows={3}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-950"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                        </div>

                        {/* Sold Out Toggle */}
                        <div className="flex items-center space-x-2">
                            <input
                                id="sold_out"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={data.sold_out}
                                onChange={(e) => setData('sold_out', e.target.checked)}
                            />
                            <Label htmlFor="sold_out" className="cursor-pointer">Mark as Sold Out</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 border-t pt-6">
                        <Button variant="outline" type="button" onClick={() => router.visit('/menu')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Menu Item'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}