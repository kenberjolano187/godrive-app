import AuthLayoutTemplate from '@/layouts/auth/auth-split-layout';
import { Toaster } from '@/components/ui/sonner';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface PageProps {
    flash: {
        success?: string;
        error?: string;
        message?: string;
    };
    [key: string]: any;
}

export default function AuthLayout({
    children,
    title,
    description,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
}) {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success('Success', {
                description: flash.success,
                id: flash.success,
            });
        }
        if (flash?.error) {
            toast.error('Error', {
                description: flash.error,
                id: flash.error,
            });
        }
        if (flash?.message) {
            toast.message('Message', {
                description: flash.message,
                id: flash.message,
            });
        }
    }, [flash]);

    return (
        <>
            <AuthLayoutTemplate title={title} description={description} {...props}>
                {children}
            </AuthLayoutTemplate>
            
            <Toaster 
                position="top-right"
                toastOptions={{
                    classNames: {
                        toast: '!bg-gray-900 dark:!bg-white !border-gray-800 dark:!border-gray-200',
                        title: '!text-white dark:!text-gray-900',
                        description: '!text-white/90 dark:!text-gray-900/90',
                        icon: '!text-white dark:!text-gray-900',
                    },
                }}
            />
        </>
    );
}