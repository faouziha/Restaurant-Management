import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import { ChefHat, ArrowRight, Activity, Users, Utensils, Package, CheckCircle2, Store, Coffee, Truck, MapPin, Mail, Phone, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Home', href: '#home' },
        { name: 'Features', href: '#features' },
        { name: 'About', href: '#about' },
        { name: 'Contact', href: '#contact' },
    ];

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="scroll-smooth">
            <Head title="Welcome to Olio POS" />
            
            <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-100 selection:text-black overflow-x-hidden relative">
                
                {/* Background Effects */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-zinc-500/20 opacity-20 blur-[120px]"></div>
                </div>

                {/* Sticky Navbar */}
                <header className="fixed top-0 w-full z-50 border-b border-zinc-800/60 bg-black/70 backdrop-blur-xl">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                                <ChefHat strokeWidth={2.5} size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">Olio</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href}
                                    className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </nav>

                        {/* Auth / Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-9 items-center justify-center rounded-full bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button 
                            className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-xl px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                            {navLinks.map((link) => (
                                <a 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-base font-medium text-zinc-300 hover:text-white py-2"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="h-px w-full bg-zinc-800 my-2"></div>
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={login()}
                                        className="inline-flex h-10 w-full items-center justify-center rounded-lg border border-zinc-800 bg-transparent px-5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-900"
                                    >
                                        Log in
                                    </Link>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </header>

                <main className="relative z-10 pt-16">
                    
                    {/* Hero Section */}
                    <section id="home" className="min-h-[90vh] flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
                        <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs sm:text-sm font-medium text-zinc-300 backdrop-blur-md mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                            Olio v2.0 is now live
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                            Orchestrate your restaurant with precision.
                        </h1>
                        
                        <p className="max-w-2xl text-lg sm:text-xl text-zinc-400 mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 leading-relaxed">
                            A modern, unified platform to seamlessly manage your tables, staff, orders, and inventory. Spend less time managing, and more time perfecting the dining experience.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-100 px-8 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                                >
                                    Open Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-100 px-8 text-base font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
                                        >
                                            Start for free <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/50 px-8 text-base font-medium text-zinc-100 transition-colors hover:bg-zinc-800 backdrop-blur-sm"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </div>
                    </section>

                    {/* Features / What is Olio Section */}
                    <section id="features" className="py-24 px-6 border-t border-zinc-900 bg-black/40">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">What is Olio?</h2>
                                <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                                    Olio is an all-in-one Point of Sale (POS) and Restaurant Management System designed to eliminate the chaos of the hospitality industry.
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 lg:gap-24 items-center mb-24">
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-semibold text-white">Built for any dining experience</h3>
                                    <p className="text-zinc-400 leading-relaxed">
                                        Whether you run a bustling fast-casual spot or a multi-course fine dining establishment, Olio adapts to your workflow. From table mapping to instant kitchen ticketing, we streamline the entire process from the moment a guest walks in.
                                    </p>
                                    <ul className="space-y-4 pt-2">
                                        <li className="flex items-center gap-3 text-zinc-300">
                                            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800"><Store className="h-4 w-4 text-zinc-100" /></div>
                                            Fine Dining & Restaurants
                                        </li>
                                        <li className="flex items-center gap-3 text-zinc-300">
                                            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800"><Coffee className="h-4 w-4 text-zinc-100" /></div>
                                            Cafes & Coffee Shops
                                        </li>
                                        <li className="flex items-center gap-3 text-zinc-300">
                                            <div className="p-2 rounded-full bg-zinc-900 border border-zinc-800"><Truck className="h-4 w-4 text-zinc-100" /></div>
                                            Food Trucks & Pop-ups
                                        </li>
                                    </ul>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                                        <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center"><Utensils className="h-5 w-5" /></div>
                                        <div>
                                            <h4 className="font-semibold text-zinc-100">Order Management</h4>
                                            <p className="text-sm text-zinc-500 mt-1">Real-time ticketing to kitchen.</p>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                                        <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center"><Activity className="h-5 w-5" /></div>
                                        <div>
                                            <h4 className="font-semibold text-zinc-100">Sales Analytics</h4>
                                            <p className="text-sm text-zinc-500 mt-1">Track daily revenue easily.</p>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                                        <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center"><Users className="h-5 w-5" /></div>
                                        <div>
                                            <h4 className="font-semibold text-zinc-100">Staff Control</h4>
                                            <p className="text-sm text-zinc-500 mt-1">Manage shifts and roles.</p>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex flex-col gap-4">
                                        <div className="h-10 w-10 bg-zinc-800 rounded-lg flex items-center justify-center"><Package className="h-5 w-5" /></div>
                                        <div>
                                            <h4 className="font-semibold text-zinc-100">Stock Inventory</h4>
                                            <p className="text-sm text-zinc-500 mt-1">Never run out of ingredients.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* About Us Section */}
                    <section id="about" className="py-24 px-6 border-t border-zinc-900">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-white">About Us</h2>
                            <p className="text-lg text-zinc-400 leading-relaxed mb-6">
                                We are a team of former hospitality veterans and passionate software engineers. We built Olio because we were tired of fighting with clunky, outdated POS systems that slowed down service and frustrated staff.
                            </p>
                            <p className="text-lg text-zinc-400 leading-relaxed">
                                Our mission is simple: To provide restaurant owners with beautiful, incredibly fast, and deeply powerful tools that get out of the way, allowing you to focus on what matters most—your guests and your food.
                            </p>
                            <div className="mt-12 flex justify-center gap-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-zinc-100 mb-2">99%</div>
                                    <div className="text-sm text-zinc-500 uppercase tracking-widest">Uptime</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-zinc-100 mb-2">24/7</div>
                                    <div className="text-sm text-zinc-500 uppercase tracking-widest">Support</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-zinc-100 mb-2">Zero</div>
                                    <div className="text-sm text-zinc-500 uppercase tracking-widest">Hidden Fees</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact Us Section */}
                    <section id="contact" className="py-24 px-6 border-t border-zinc-900 bg-black/40">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">Get in touch</h2>
                                <p className="text-zinc-400 mb-8 text-lg">
                                    Interested in upgrading your restaurant's technology? Send us a message and we'll schedule a personalized demo.
                                </p>
                                
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><Mail className="h-5 w-5 text-zinc-100" /></div>
                                        <div>
                                            <h4 className="font-medium text-zinc-100">Email us</h4>
                                            <p className="text-zinc-500">hello@oliopos.com</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><Phone className="h-5 w-5 text-zinc-100" /></div>
                                        <div>
                                            <h4 className="font-medium text-zinc-100">Call us</h4>
                                            <p className="text-zinc-500">+1 (555) 123-4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800"><MapPin className="h-5 w-5 text-zinc-100" /></div>
                                        <div>
                                            <h4 className="font-medium text-zinc-100">Visit us</h4>
                                            <p className="text-zinc-500">123 Tech Avenue, Suite 400<br/>San Francisco, CA 94105</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form (Visual) */}
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8">
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">First Name</label>
                                            <input type="text" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors" placeholder="John" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-zinc-300">Last Name</label>
                                            <input type="text" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors" placeholder="Doe" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Email Address</label>
                                        <input type="email" className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors" placeholder="john@restaurant.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-zinc-300">Message</label>
                                        <textarea rows={4} className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors resize-none" placeholder="Tell us about your restaurant..."></textarea>
                                    </div>
                                    <button type="button" className="w-full h-11 bg-zinc-100 text-zinc-900 font-medium rounded-lg hover:bg-zinc-200 transition-colors mt-2">
                                        Send Message
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>

                </main>

                {/* Footer */}
                <footer className="border-t border-zinc-900 py-8 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ChefHat strokeWidth={2.5} size={20} className="text-zinc-600" />
                        <span className="text-lg font-bold tracking-tight text-zinc-600">Olio</span>
                    </div>
                    <p className="text-sm text-zinc-600">
                        &copy; {new Date().getFullYear()} Olio POS Inc. All rights reserved.
                    </p>
                </footer>

            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                html {
                    scroll-behavior: smooth;
                }
            `}} />
        </div>
    );
}
