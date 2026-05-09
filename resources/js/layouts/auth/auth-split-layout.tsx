import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { ChefHat } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;

    return (
        <div className="dark relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0 bg-black text-zinc-100 font-sans selection:bg-zinc-100 selection:text-black overflow-hidden">
            
            {/* Left Side - Brand & Graphics */}
            <div className="relative hidden h-full flex-col p-10 text-white lg:flex border-r border-zinc-900 overflow-hidden">
                {/* Background Effects matching landing page */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-zinc-500/20 opacity-20 blur-[120px]"></div>
                </div>

                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity w-fit"
                >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                        <ChefHat strokeWidth={2.5} size={18} />
                    </div>
                    Olio
                </Link>

                <div className="relative z-20 mt-auto">
                    <blockquote className="space-y-4">
                        <p className="text-xl leading-relaxed text-zinc-300 font-medium">
                            "Orchestrate your restaurant with precision. Spend less time managing, and more time perfecting the dining experience."
                        </p>
                        <footer className="text-sm font-semibold tracking-wider text-zinc-500 uppercase">
                            The Olio Team
                        </footer>
                    </blockquote>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:p-8 bg-black relative z-10">
                {/* Mobile Background Effect (optional but keeps it consistent) */}
                <div className="absolute inset-0 z-0 lg:hidden pointer-events-none">
                    <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[300px] w-[300px] rounded-full bg-zinc-500/10 opacity-20 blur-[100px]"></div>
                </div>

                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] relative z-20">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center lg:hidden gap-2 text-xl font-bold tracking-tight text-white mb-4"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                            <ChefHat strokeWidth={2.5} size={18} />
                        </div>
                        Olio
                    </Link>

                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">{title}</h1>
                        <p className="text-sm text-balance text-zinc-400">
                            {description}
                        </p>
                    </div>
                    
                    {/* The form elements (children) will inherit dark mode styling if shadcn UI is configured correctly */}
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
