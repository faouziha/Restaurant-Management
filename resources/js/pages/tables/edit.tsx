import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { useState } from "react";

interface Waiter {
    id: number;
    name: string;
}

interface Table {
    id: number;
    number: number;
    waiter_id: number | null;
    status: string;
}

interface Props {
    waiters: Waiter[];
    table: Table;
}

export default function Edit({ waiters, table }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tables', href: '/tables' },
        { title: `Table ${table.number}`, href: `/tables/${table.id}` },
        { title: 'Edit', href: `/tables/${table.id}/edit` }
    ];

    const [isSuccess, setIsSuccess] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        number: table.number.toString(),
        waiter_id: table.waiter_id ? table.waiter_id.toString() : '',
        status: table.status.toLowerCase(), // Ensure lowercase string match for select
    });
    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/tables/${table.id}`, {
            onSuccess: () => {
                setIsSuccess(true);
                const id = setTimeout(() => {
                    router.visit('/tables');
                }, 3000);
                setTimerId(id);
            }
        });
    }

    const handleManualReturn = () => {
        if (timerId) {
            clearTimeout(timerId); // Stop the 3s timer
        }
        router.visit('/tables');
    };

    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Success" />
                <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                    <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                    <h1 className="text-3xl font-bold tracking-tight text-center">
                        Table Updated Successfully!
                    </h1>
                    <p className="text-muted-foreground">
                        Table number {data.number} has been updated.
                    </p>
                    <Button onClick={handleManualReturn} className="mt-6 w-fit">
                        Return to Tables Directory
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Table ${table.number}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Table {table.number}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-center gap-3 p-4 text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium text-sm">Please fix the highlighted errors below before continuing.</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">Table Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="number">Table Number</Label>
                                <Input
                                    value={data.number}
                                    onChange={(e) => setData('number', e.target.value)}
                                    id="number"
                                    type="number"
                                    min="1"
                                    required
                                    placeholder="e.g. 5"
                                />
                                {errors.number && <p className="text-xs text-red-500 font-medium">{errors.number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-zinc-950"
                                >
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="reserved">Reserved</option>
                                </select>
                                {errors.status && <p className="text-xs text-red-500 font-medium">{errors.status}</p>}
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="waiter_id">Assigned Waiter (Optional)</Label>
                                <select
                                    value={data.waiter_id}
                                    onChange={(e) => setData('waiter_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-zinc-950"
                                >
                                    <option value="">No Waiter Assigned</option>
                                    {waiters?.map((waiter) => (
                                        <option key={waiter.id} value={waiter.id}>
                                            {waiter.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.waiter_id && <p className="text-xs text-red-500 font-medium">{errors.waiter_id}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 space-x-2 border-t border-sidebar-border/50">
                        <Button variant="outline" asChild type="button">
                            <Link href={`/tables/${table.id}`}>Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Table'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
