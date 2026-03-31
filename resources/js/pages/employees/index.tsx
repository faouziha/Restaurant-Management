import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Edit2, UserPlus, Eye, Trash2 } from 'lucide-react';

interface Employee {
    id: number;
    staff_id: string;
    name: string;
    email: string;
    type: string;
    hire_date: string;
    hourly_rate: string;
}

interface Props {
    employees: Employee[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Employees', href: '/employees' },
];

export default function Index({ employees }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee Directory" />

            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Staff Directory</h1>
                        <p className="text-muted-foreground text-sm">Manage your team members and their account types.</p>
                    </div>
                    <Button asChild>
                        <Link href="/employees/create">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Add Employee
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-card overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/50 border-b border-sidebar-border/70 text-muted-foreground font-medium">
                            <tr>
                                <th className="p-4">Staff ID</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Hire Date</th>
                                <th className="p-4">Rate</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-sidebar-border/70">
                            {employees.length > 0 ? (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-mono text-xs text-blue-600 dark:text-blue-400">
                                            {employee.staff_id}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium text-foreground">{employee.name}</div>
                                            <div className="text-xs text-muted-foreground">{employee.email}</div>
                                        </td>
                                        <td className="p-4 capitalize">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${employee.type === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                }`}>
                                                {employee.type}
                                            </span>
                                        </td>
                                        <td className="p-4 text-muted-foreground">{employee.hire_date}</td>
                                        <td className="p-4 font-medium">${employee.hourly_rate}/hr</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/employees/${employee.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/employees/${employee.id}/edit`}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon"
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this employee?')) {
                                                            router.delete(`/employees/${employee.id}`);
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No employees found. Click "Add Employee" to get started.
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