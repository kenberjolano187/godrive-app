import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0" style={{ backgroundColor: 'oklch(44.4% 0.177 26.899)' }} />
                <Link
                    href={home()}
                    className="relative z-20 flex items-center gap-2 text-lg font-medium"
                >
                    <AppLogoIcon className="size-8 text-white fill-white" />
                    Go Drive
                </Link>
                <div className="relative z-20 flex flex-col items-center justify-center flex-1">
                    <img 
                        src="/images/godrive.png" 
                        alt="Go Drive" 
                        className="w-full max-w-md object-contain"
                    />
                </div>
            </div>
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                    <Link
                        href={home()}
                        className="relative z-20 flex items-center justify-center gap-2 lg:hidden"
                    >
                        <AppLogoIcon className="h-10 sm:h-12 text-black fill-black" />
                        <span className="text-xl font-medium">Go Drive</span>
                    </Link>
                    <div className="flex flex-col items-start gap-2 text-left sm:items-center sm:text-center">
                        <h1 className="text-xl font-medium">{title}</h1>
                        <p className="text-sm text-balance text-muted-foreground">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}