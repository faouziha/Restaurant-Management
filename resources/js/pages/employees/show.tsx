import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, Mail, Calendar, Hash, DollarSign, Cake, User, ShieldCheck } from "lucide-react";

interface Employee {
    id: number;
    staff_id: string;
    name: string;
    email: string;
    type: string;
    hire_date: string;
    hourly_rate: string | number;
    date_of_birth?: string;
}

interface Props {
    employee: Employee;
}

export default function Show({ employee }: Props) {
    // Formatting the breadcrumbs for the starter kit
    const breadcrumbs = [
        { title: 'Employees', href: '/employees' },
        { title: employee.name, href: `/employees/${employee.id}` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Employee Details - ${employee.name}`} />

            {/* Max width set to 1600px with massive padding for a "Premium" feel */}
            <div className="p-6 max-w-[1600px] mx-auto space-y-12">
                
                {/* Top Navigation Row */}
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="lg" asChild className="rounded-full shadow-sm">
                        <Link href="/employees">
                            <ChevronLeft className="mr-2 h-5 w-5" />
                            Directory
                        </Link>
                    </Button>
                    <Button size="lg" className="rounded-full px-8 shadow-md" asChild>
                        <Link href={`/employees/${employee.id}/edit`}>Edit Profile</Link>
                    </Button>
                </div>

                {/* Header Section: Hero Style */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-12">
                    <div className="h-32 w-32 md:h-48 md:w-48 rounded-3xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
                        <User className="h-16 w-16 md:h-24 md:w-24 text-primary" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left space-y-4">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                                {employee.name}
                            </h1>
                            <Badge variant="secondary" className="text-lg px-4 py-1 rounded-lg">
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                {employee.type}
                            </Badge>
                        </div>
                        <p className="text-xl md:text-2xl text-muted-foreground font-medium flex items-center justify-center md:justify-start">
                            <Mail className="mr-3 h-6 w-6" /> {employee.email}
                        </p>
                    </div>
                </div>

                {/* Data Grid: Using a 4-column layout on large screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card className="border-none shadow-none bg-muted/20">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Staff Identification</p>
                            <div className="flex items-center gap-3">
                                <Hash className="h-6 w-6 text-blue-500" />
                                <p className="text-3xl font-mono font-bold text-blue-600">{employee.staff_id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none bg-muted/20">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Hourly Rate</p>
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-6 w-6 text-green-600" />
                                <p className="text-3xl font-bold text-green-700">${Number(employee.hourly_rate).toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none bg-muted/20">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Onboarding Date</p>
                            <div className="flex items-center gap-3">
                                <Calendar className="h-6 w-6 text-primary" />
                                <p className="text-3xl font-bold">{employee.hire_date}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-none bg-muted/20">
                        <CardContent className="p-8">
                            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-3">Birthday</p>
                            <div className="flex items-center gap-3">
                                <Cake className="h-6 w-6 text-pink-500" />
                                <p className="text-3xl font-bold">{employee.date_of_birth || '—'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Separator />

                {/* Footer Note */}
                <p className="text-center text-muted-foreground font-medium">
                    Internal personnel record: {employee.id} — Authorized Access Only
                </p>
            </div>
        </AppLayout>
    );
}