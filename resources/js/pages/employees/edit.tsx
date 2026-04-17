import { Head, Link, router, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormEventHandler, useState } from "react";
import { CheckCircle } from "lucide-react";

interface Employee {
    id: number;
    staff_id_number: string;
    user: {
        name: string;
        email: string;
        type: string;
    }
    hire_date: string;
    hourly_rate: string | number;
    date_of_birth: string;
    phone_number: string;
    emergency_contact: string;
}
interface Props {
    employee: Employee;
}

export default function Edit({ employee }: Props) {
    const [isSuccess, setIsSuccess] = useState(false);
    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);
    
    if (!employee) return <div>Loading...</div>;

    const { data, setData, put, processing, errors } = useForm({
        name: employee.user.name || '',
        email: employee.user.email || '',
        password: '',
        password_confirmation: '',
        type: employee.user.type || 'staff',
        staff_id_number: employee.staff_id_number || '',
        date_of_birth: employee.date_of_birth || '',
        hire_date: employee.hire_date || '',
        phone_number: employee.phone_number || '',
        emergency_contact: employee.emergency_contact || '',
        hourly_rate: employee.hourly_rate || '',
    });

    const breadcrumbs = [
        { title: 'Employees', href: '/employees' },
        { title: employee.user.name, href: `/employees/${employee.id}` },
    ];

    const submit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        put('/employees/' + employee.id, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSuccess(true);
                const id = setTimeout(() => {
                    router.visit('/employees');
                }, 3000);
                setTimerId(id); // Store the ID
            },
        });
    };

    const handleManualReturn = () => {
        if (timerId) {
            clearTimeout(timerId); // Stop the 3s timer
        }
        router.visit('/employees');
    };

    // Render Success State
    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Success" />
                <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                    <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                    <h1 className="text-3xl font-bold tracking-tight text-center">
                        Employee Updated Successfully!
                    </h1>
                    <p className="text-muted-foreground">
                        {data.name}'s account and HR profile have been updated.
                    </p>
                    <Button onClick={handleManualReturn} className="mt-6 w-fit">
                        Return to Employee Directory
                    </Button>
                </div>
            </AppLayout>
        );
    }

    // Render Form State
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Employee - ${employee.user.name}`} />

            <h1 className="text-2xl font-bold tracking-tight m-2">Edit Employee</h1>

            <form className="space-y-8 rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border"
                onSubmit={submit}>

                {/* --- Account Information --- */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Account Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" required value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Account Role</Label>
                            <select
                                id="type"
                                required
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-zinc-950"
                            >
                                <option value="staff">Staff</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>

                        <div className="hidden md:block"></div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password (Leave blank to keep current)</Label>
                            <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                            <Input id="password_confirmation" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* --- HR Profile Information --- */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">HR & Payroll Information</h2>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="staff_id_number">Staff ID Number</Label>
                            <Input id="staff_id_number" required value={data.staff_id_number} onChange={(e) => setData('staff_id_number', e.target.value)} />
                            {errors.staff_id_number && <p className="text-sm text-red-500">{errors.staff_id_number}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                            <Input id="hourly_rate" type="number" step="0.01" required value={data.hourly_rate} onChange={(e) => setData('hourly_rate', e.target.value)} />
                            {errors.hourly_rate && <p className="text-sm text-red-500">{errors.hourly_rate}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_of_birth">Date of Birth</Label>
                            <Input id="date_of_birth" type="date" required value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} />
                            {errors.date_of_birth && <p className="text-sm text-red-500">{errors.date_of_birth}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="hire_date">Hire Date</Label>
                            <Input id="hire_date" type="date" required value={data.hire_date} onChange={(e) => setData('hire_date', e.target.value)} />
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

                <div className="flex justify-end pt-4 space-x-2">
                    <Button variant="outline" asChild>
                        <Link href="/employees">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={processing} className="w-full md:w-auto">
                        {processing ? 'Saving...' : 'Update Employee'}
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
}