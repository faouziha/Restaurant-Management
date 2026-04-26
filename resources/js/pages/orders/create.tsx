import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { AlertCircle, CheckCircle, Plus, Minus, Trash2, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Waiter { id: number; name: string; }
interface Table { id: number; number: number; }
interface OrderType { value: string; label: string; }
interface MenuItem { id: number; name: string; price: number; category: string; sold_out: boolean; }
interface CartItem { menu_id: number; name: string; price: number; quantity: number; notes: string; }

interface Props {
    waiters: Waiter[];
    tables: Table[];
    orderTypes: OrderType[];
    menuItems: MenuItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/orders' },
    { title: 'Create POS Order', href: '/orders/create' }
];

export default function Create({ waiters, tables, orderTypes, menuItems }: Props) {
    const [isSuccess, setIsSuccess] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        waiter_id: '',
        type: 'dine_in',
        table_id: '',
        items: [] as { menu_id: number; quantity: number; notes: string }[],
    });

    const [cart, setCart] = useState<CartItem[]>([]);

    const updateCartAndSync = (newCart: CartItem[]) => {
        setCart(newCart);
        setData('items', newCart.map(item => ({
            menu_id: item.menu_id,
            quantity: item.quantity,
            notes: item.notes
        })));
    };

    const addToCart = (menu: MenuItem) => {
        if (menu.sold_out) return;
        const newCart = [...cart];
        const existing = newCart.find(i => i.menu_id === menu.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            newCart.push({ menu_id: menu.id, name: menu.name, price: Number(menu.price), quantity: 1, notes: '' });
        }
        updateCartAndSync(newCart);
    };

    const updateQuantity = (menuId: number, delta: number) => {
        const newCart = cart.map(item => {
            if (item.menu_id === menuId) {
                return { ...item, quantity: Math.max(1, item.quantity + delta) };
            }
            return item;
        });
        updateCartAndSync(newCart);
    };

    const updateNotes = (menuId: number, notes: string) => {
        const newCart = cart.map(item => item.menu_id === menuId ? { ...item, notes } : item);
        updateCartAndSync(newCart);
    };

    const removeFromCart = (menuId: number) => {
        const newCart = cart.filter(item => item.menu_id !== menuId);
        updateCartAndSync(newCart);
    };

    const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

    const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/orders', {
            onSuccess: () => {
                setIsSuccess(true);
                const id = setTimeout(() => {
                    router.visit('/orders');
                }, 3000);
                setTimerId(id);
            }
        });
    }

    const handleManualReturn = () => {
        if (timerId) clearTimeout(timerId);
        router.visit('/orders');
    };

    if (isSuccess) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Success" />
                <div className="flex flex-col items-center justify-center flex-1 h-full gap-6 mt-20 md:mt-32">
                    <CheckCircle className="w-32 h-32 text-green-500 animate-in zoom-in duration-500" />
                    <h1 className="text-3xl font-bold tracking-tight text-center">
                        Order Created Successfully!
                    </h1>
                    <p className="text-muted-foreground">
                        The new POS order has been registered and is now pending. Redirecting in 3 seconds...
                    </p>
                    <Button onClick={handleManualReturn} className="mt-6 w-fit">
                        Return to Orders Dashboard Now
                    </Button>
                </div>
            </AppLayout>
        );
    }

    // Categories derived from unique menu item categories
    const categories = Array.from(new Set(menuItems.map(m => m.category)));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Point of Sale" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:p-8 max-w-[1400px] mx-auto w-full h-[calc(100vh-6rem)]">

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <ShoppingCart className="h-6 w-6" /> Point of Sale
                        </h1>
                        <p className="text-sm text-muted-foreground">Create a new order and add items to the cart.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 flex-1 h-full overflow-hidden">
                    {/* LEFT COLUMN: Setup & Menu Browser */}
                    <div className="flex flex-col flex-1 gap-6 overflow-hidden min-h-0">
                        {/* Order Header Info */}
                        <Card className="p-4 border-sidebar-border/70 shrink-0">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="type">Order Type</Label>
                                    <select
                                        id="type"
                                        value={data.type}
                                        onChange={(e) => {
                                            setData('type', e.target.value);
                                            if (e.target.value === 'takeaway') setData('table_id', '');
                                        }}
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-zinc-950"
                                    >
                                        {orderTypes?.map((type) => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    {errors.type && <p className="text-xs text-red-500 font-medium">{errors.type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="waiter_id">Assigned Waiter</Label>
                                    <select
                                        id="waiter_id"
                                        value={data.waiter_id}
                                        onChange={(e) => setData('waiter_id', e.target.value)}
                                        required
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-zinc-950"
                                    >
                                        <option value="" disabled>Select a Waiter</option>
                                        {waiters?.map((waiter) => (
                                            <option key={waiter.id} value={waiter.id}>{waiter.name}</option>
                                        ))}
                                    </select>
                                    {errors.waiter_id && <p className="text-xs text-red-500 font-medium">{errors.waiter_id}</p>}
                                </div>

                                {data.type === 'dine_in' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="table_id">Table Assignment</Label>
                                        <select
                                            id="table_id"
                                            value={data.table_id}
                                            onChange={(e) => setData('table_id', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring dark:bg-zinc-950"
                                        >
                                            <option value="">No Table Assigned</option>
                                            {tables?.map((table) => (
                                                <option key={table.id} value={table.id}>Table {table.number}</option>
                                            ))}
                                        </select>
                                        {errors.table_id && <p className="text-xs text-red-500 font-medium">{errors.table_id}</p>}
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Menu Items Browser */}
                        <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-6 min-h-0">
                            {categories.map(category => {
                                const items = menuItems.filter(m => m.category === category);
                                return (
                                    <div key={category} className="space-y-3">
                                        <h3 className="text-lg font-bold capitalize flex items-center gap-2">
                                            <UtensilsCrossed className="w-5 h-5 text-primary" /> {category}
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                                            {items.map(menu => (
                                                <button
                                                    key={menu.id}
                                                    type="button"
                                                    disabled={menu.sold_out}
                                                    onClick={() => addToCart(menu)}
                                                    className={`relative flex flex-col items-start p-3 text-left transition-all border rounded-xl 
                                                        ${menu.sold_out ? 'opacity-50 cursor-not-allowed bg-muted/30 border-dashed' : 'hover:border-primary hover:shadow-md bg-card active:scale-[0.98]'}`}
                                                >
                                                    <div className="font-semibold text-sm line-clamp-1">{menu.name}</div>
                                                    <div className="text-muted-foreground text-xs font-bold mt-1">${Number(menu.price).toFixed(2)}</div>

                                                    {menu.sold_out && (
                                                        <Badge variant="destructive" className="absolute top-2 right-2 text-[10px] px-1.5 py-0">Sold Out</Badge>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: The Cart */}
                    <Card className="flex flex-col w-full lg:w-[400px] xl:w-[450px] shrink-0 border-sidebar-border/70 overflow-hidden h-full">
                        <div className="bg-muted/50 p-4 border-b border-sidebar-border/50">
                            <h2 className="text-lg font-bold flex items-center justify-between">
                                Current Order
                                <Badge variant="secondary" className="font-mono">{cart.reduce((sum, item) => sum + item.quantity, 0)} Items</Badge>
                            </h2>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                    <ShoppingCart className="w-16 h-16 mb-4 opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <p className="text-sm">Click menu items to add them.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.menu_id} className="p-3 border rounded-lg bg-background shadow-sm space-y-3">
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="font-medium text-sm leading-tight">{item.name}</div>
                                            <div className="font-bold text-sm shrink-0">${(item.price * item.quantity).toFixed(2)}</div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center border rounded-md overflow-hidden bg-muted/30">
                                                <button type="button" onClick={() => updateQuantity(item.menu_id, -1)} className="p-1.5 hover:bg-muted transition-colors"><Minus className="w-4 h-4" /></button>
                                                <div className="w-8 text-center text-sm font-semibold">{item.quantity}</div>
                                                <button type="button" onClick={() => updateQuantity(item.menu_id, 1)} className="p-1.5 hover:bg-muted transition-colors"><Plus className="w-4 h-4" /></button>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-600" onClick={() => removeFromCart(item.menu_id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        <Input
                                            placeholder="Add note (e.g. No onions)"
                                            className="h-8 text-xs bg-muted/20"
                                            value={item.notes}
                                            onChange={(e) => updateNotes(item.menu_id, e.target.value)}
                                        />
                                    </div>
                                ))
                            )}

                            {errors.items && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-sm font-medium text-center">
                                    {errors.items}
                                </div>
                            )}
                        </div>

                        <div className="p-4 bg-muted/30 border-t border-sidebar-border/50 space-y-4">
                            <div className="flex items-center justify-between text-lg font-bold">
                                <span>Total</span>
                                <span className="text-green-600 dark:text-green-400">${totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" variant="outline" className="w-full" asChild>
                                    <Link href="/orders">Cancel</Link>
                                </Button>
                                <Button type="submit" className="w-full" disabled={processing || cart.length === 0}>
                                    {processing ? 'Processing...' : 'Place Order'}
                                </Button>
                            </div>
                        </div>
                    </Card>
                </form>
            </div>
        </AppLayout>
    )
}
