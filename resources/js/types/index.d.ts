import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export type UserType = 'admin' | 'owner' | 'customer';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    firstname: string;
    middlename?: string;
    lastname: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    gender?: string;
    phone_number?: string;
    address?: string;
    photo?: string;
    user_type: UserType;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    appearance: 'light' | 'dark' | 'system';
    [key: string]: unknown;
}