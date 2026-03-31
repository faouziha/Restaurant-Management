import { useState, type FormEventHandler } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { CheckCircle, AlertCircle } from 'lucide-react'; 

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Employees', href: '/employees' },
    { title: 'Add New Employee', href: '/employees/create' },
];

export default function Create() {
    const [isSuccess, setIsSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        type: 'staff', 
        staff_id_number: '',
        date_of_birth: '',
        hire_date: '',
        phone_number: '',
        emergency_contact: '',
        hourly_rate: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        
        post('/employees', {
            preserveScroll: true, 
            onSuccess: () => setIsSuccess(true),
        });
    };

    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Success" />
                <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                    <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                    <h1 className="text-3xl font-bold tracking-tight text-center">
                        Employee Added Successfully!
                    </h1>
                    <p className="text-muted-foreground">
                        {data.name}'s account and HR profile have been created.
                    </p>
                    <Button asChild className="mt-6 w-fit">
                        <Link href="/employees">Return to Employee Directory</Link>
                    </Button>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Employee" />
            
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Hire New Staff</h1>
                    <Button variant="outline" asChild>
                        <Link href="/employees">Cancel</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="space-y-8 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    
                    {Object.keys(errors).length > 0 && (
                        <div className="flex items-center gap-3 p-4 text-red-600 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p className="font-medium text-sm">Please fix the highlighted errors below before continuing.</p>
                        </div>
                    )}

                    {/* --- Account Information --- */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Account Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                            </div>

                            {/* 2. Added the Role/Type Dropdown */}
                            <div className="space-y-2">
                                <Label htmlFor="type">Account Role</Label>
                                <select 
                                    id="type" 
                                    value={data.type} 
                                    onChange={(e) => setData('type', e.target.value)} 
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950"
                                >
                                    <option value="staff">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {/* @ts-ignore - Inertia error typing occasionally flags custom fields */}
                                {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                            </div>

                            {/* Empty div just to keep the grid perfectly aligned for the passwords on the next row */}
                            <div className="hidden md:block"></div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    {/* --- HR Profile Information --- */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">HR & Payroll Information</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            
                            <div className="space-y-2">
                                <Label htmlFor="staff_id_number">Staff ID Number</Label>
                                <Input id="staff_id_number" value={data.staff_id_number} onChange={(e) => setData('staff_id_number', e.target.value)} required />
                                {errors.staff_id_number && <p className="text-sm text-red-500">{errors.staff_id_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                                <Input id="hourly_rate" type="number" step="0.01" value={data.hourly_rate} onChange={(e) => setData('hourly_rate', e.target.value)} required />
                                {errors.hourly_rate && <p className="text-sm text-red-500">{errors.hourly_rate}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth">Date of Birth</Label>
                                <Input id="date_of_birth" type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} required />
                                {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hire_date">Hire Date</Label>
                                <Input id="hire_date" type="date" value={data.hire_date} onChange={(e) => setData('hire_date', e.target.value)} required />
                                {errors.hire_date && <p className="text-sm text-red-500">{errors.hire_date}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone_number">Phone Number</Label>
                                <Input id="phone_number" type="tel" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} />
                                {errors.phone_number && <p className="text-sm text-red-500">{errors.phone_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                                <Input id="emergency_contact" value={data.emergency_contact} onChange={(e) => setData('emergency_contact', e.target.value)} />
                                {errors.emergency_contact && <p className="text-sm text-red-500">{errors.emergency_contact}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={processing} className="w-full md:w-auto">
                            {processing ? 'Saving...' : 'Hire Employee'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}