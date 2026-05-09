import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, DollarSign, Utensils, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

interface DashboardProps {
    metrics: {
        totalEmployees: number;
        totalOrders: number;
        totalSales: number;
        totalMenuItems: number;
        lowStockCount: number;
    };
    salesTrend: { name: string; total: number }[];
    orderStatusDistribution: { name: string; value: number }[];
    topMenuItems: { name: string; orders_count: number }[];
    recentOrders: any[];
    lowStockItems: any[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFE'];

export default function Dashboard({ metrics, salesTrend, orderStatusDistribution, topMenuItems, recentOrders, lowStockItems }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-y-auto p-6 bg-background dark:bg-background/95">
                
                {/* Header section */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                        <p className="text-muted-foreground mt-1">Here is the briefing of your restaurant's performance.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <div className="h-10 w-10 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                                <DollarSign className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${metrics.totalSales.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-green-500 font-medium inline-flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/>+20.1%</span> from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                            <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">+{metrics.totalOrders}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                <span className="text-blue-500 font-medium inline-flex items-center"><ArrowUpRight className="h-3 w-3 mr-1"/>+10.5%</span> from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                            <div className="h-10 w-10 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
                                <Users className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.totalEmployees}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Staff members currently registered
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Menu Items</CardTitle>
                            <div className="h-10 w-10 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center">
                                <Utensils className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.totalMenuItems}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Dishes available to order
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                            <div className="h-10 w-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.lowStockCount}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Ingredients needing restock
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                    <Card className="col-span-1 lg:col-span-4 border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
                            <CardDescription>Daily revenue performance for completed orders</CardDescription>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={salesTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-20" />
                                        <XAxis dataKey="name" stroke="currentColor" className="text-xs opacity-50" tickLine={false} axisLine={false} />
                                        <YAxis stroke="currentColor" className="text-xs opacity-50" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [`$${value}`, 'Revenue']}
                                        />
                                        <Bar dataKey="total" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 lg:col-span-3 border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Order Status Distribution</CardTitle>
                            <CardDescription>Current ratio of all order statuses</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full flex items-center justify-center">
                                {orderStatusDistribution && orderStatusDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={orderStatusDistribution}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                                label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                                labelLine={false}
                                            >
                                                {orderStatusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="text-muted-foreground flex flex-col items-center justify-center">
                                        <PieChart className="opacity-20 h-20 w-20 mb-2" />
                                        No order data available
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Bottom row: Top Items, Low Stock & Recent Orders */}
                <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
                    <Card className="col-span-1 lg:col-span-2 border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Top Selling Items</CardTitle>
                            <CardDescription>Most frequently ordered menu items</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {topMenuItems && topMenuItems.length > 0 ? (
                                    topMenuItems.map((item, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                {i + 1}
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{item.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {item.orders_count} orders
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium text-sm">
                                                Hot
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground py-4">No top items data found.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 lg:col-span-2 border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Low Stock Alerts</CardTitle>
                            <CardDescription>Items below threshold</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {lowStockItems && lowStockItems.length > 0 ? (
                                    lowStockItems.map((item, i) => (
                                        <div key={i} className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 font-semibold text-sm">
                                                <AlertTriangle className="h-4 w-4" />
                                            </div>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{item.ingredient}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {Number(item.quantity)} {item.unit} left
                                                </p>
                                            </div>
                                            <div className="ml-auto font-medium text-xs text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
                                                Restock
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground py-4 flex flex-col items-center">
                                        All stock levels are optimal.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="col-span-1 lg:col-span-3 border-sidebar-border/70 dark:border-sidebar-border shadow-sm">
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                            <CardDescription>Latest orders placed by customers</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-muted-foreground bg-muted/50 uppercase rounded-lg">
                                        <tr>
                                            <th className="px-4 py-3 font-medium rounded-l-lg">Order ID</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                            <th className="px-4 py-3 font-medium">Type</th>
                                            <th className="px-4 py-3 font-medium text-right rounded-r-lg">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders && recentOrders.length > 0 ? (
                                            recentOrders.map((order, i) => (
                                                <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                                                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize
                                                            ${order.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' : 
                                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400' : 
                                                            'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 capitalize">{order.type}</td>
                                                    <td className="px-4 py-3 text-right font-medium">${Number(order.total_price).toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                    No recent orders.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </AppLayout>
    );
}
