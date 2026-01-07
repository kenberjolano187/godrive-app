import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { home } from '@/routes';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn, isSameUrl } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Home, Menu, FilePenLine, LogIn, AppWindowMac } from 'lucide-react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';

const mainNavItems: NavItem[] = [
     {
        title: 'Home',
        href: '//welcome',
        icon: Home,
    },
     {
        title: 'Application',
        href: '/owner-application',
        icon: AppWindowMac,
    },
    {
        title: 'Login',
        href: '/login',
        icon: LogIn,
    },
    {
        title: 'Register',
        href: '/register',
        icon: FilePenLine,
    },
];

const activeItemStyles =
    'text-white';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();

    return (
        <>
            <div className="border-b border-sidebar-border/80" style={{ backgroundColor: 'oklch(44.4% 0.177 26.899)' }}>
                <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                    <Link
                        href={home()}
                        prefetch
                        className="flex items-center space-x-2 transition-colors hover:text-black"
                                        >
                    <AppLogo />
                    </Link>
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-[34px] w-[34px] text-white hover:bg-transparent"
                                >
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="right"
                                className="flex h-full w-64 flex-col items-stretch justify-between"
                                style={{ backgroundColor: 'oklch(44.4% 0.177 26.899)' }}
                            >
                                <SheetTitle className="sr-only">
                                    Navigation Menu
                                </SheetTitle>
                                <SheetHeader className="flex justify-start text-right">
                            <Link
                                href={home()}
                                prefetch
                                className="flex items-center space-x-2 transition-colors hover:text-black"
                            >
                                <AppLogoIcon className="h-6 w-6" />
                            </Link>
                                </SheetHeader>
                                <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                    <div className="flex h-full flex-col justify-between text-sm">
                                        <div className="flex flex-col space-y-4">
                                            {mainNavItems.map((item) => (
                                                <Link
                                                    key={item.title}
                                                    href={item.href}
                                                    className="flex items-center space-x-2 font-medium text-white transition-colors hover:text-black"
                                                >
                                                    {item.icon && (
                                                        <Icon
                                                            iconNode={item.icon}
                                                            className="h-5 w-5"
                                                        />
                                                    )}
                                                    <span>{item.title}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                    
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center rounded-md px-3 h-9 text-sm font-medium text-white transition-colors hover:text-black',
                                                isSameUrl(
                                                    page.url,
                                                    item.href,
                                                ) && activeItemStyles,
                                            )}
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="mr-2 h-4 w-4"
                                                />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isSameUrl(page.url, item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-white"></div>
                                        )}
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70" style={{ backgroundColor: 'oklch(44.4% 0.177 26.899)' }}>
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}