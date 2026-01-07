import { usePage } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, type SharedData } from '@/types';

import HeaderLayout from '@/layouts/header-layout';
import SidebarLayout from '@/layouts/sidebar-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    const { auth } = usePage<SharedData>().props;
    const userType = auth.user.user_type;
    
    const isAdminOrOwner = userType === 'admin' || userType === 'owner';
    const AppLayout = isAdminOrOwner ? SidebarLayout : HeaderLayout;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Appearance settings"
                        description="Update your account's appearance settings"
                    />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}