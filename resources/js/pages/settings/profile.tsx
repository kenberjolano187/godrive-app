import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import HeaderLayout from '@/layouts/header-layout';
import SidebarLayout from '@/layouts/sidebar-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { getImageUrl, getUserInitials } from '@/lib/image-helpers';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;
    const userType = auth.user.user_type;
    
    const [photoPreview, setPhotoPreview] = useState<string | null>(
        getImageUrl(auth.user.photo)
    );
    
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setPhotoPreview(previewUrl);
        }
    };
    
    useEffect(() => {
        return () => {
            if (photoPreview && photoPreview.startsWith('blob:')) {
                URL.revokeObjectURL(photoPreview);
            }
        };
    }, [photoPreview]);
    
    const isAdminOrOwner = userType === 'admin' || userType === 'owner';
    const AppLayout = isAdminOrOwner ? SidebarLayout : HeaderLayout;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your profile photo, name and email address"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-4">
                                    <Label htmlFor="photo">Profile Photo</Label>
                                    
                                    <div className="flex items-center gap-4">
                                        {photoPreview ? (
                                            <img 
                                                src={photoPreview} 
                                                alt="Profile preview" 
                                                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                                            />
                                        ) : (
                                            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-2xl font-semibold">
                                                    {getUserInitials(auth.user.firstname, auth.user.lastname)}
                                                </span>
                                            </div>
                                        )}
                                        
                                        <div className="flex-1">
                                            <Input
                                                id="photo"
                                                type="file"
                                                name="photo"
                                                accept="image/*"
                                                onChange={handlePhotoChange}
                                                className="mt-1"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                JPG, PNG (MAX. 3MB)
                                            </p>
                                        </div>
                                    </div>

                                    <InputError
                                        className="mt-2"
                                        message={errors.photo}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="firstname">First Name</Label>

                                    <Input
                                        id="firstname"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.firstname}
                                        name="firstname"
                                        required
                                        autoComplete="given-name"
                                        placeholder="First name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.firstname}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="lastname">Last Name</Label>

                                    <Input
                                        id="lastname"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.lastname}
                                        name="lastname"
                                        required
                                        autoComplete="family-name"
                                        placeholder="Last name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.lastname}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center justify-end gap-4">
                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Saved
                                        </p>
                                    </Transition>

                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Save
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}