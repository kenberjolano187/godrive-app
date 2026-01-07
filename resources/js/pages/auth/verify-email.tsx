import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface VerifyEmailProps {
    status?: string;
    auth?: {
        user: {
            email: string;
        };
    };
}

export default function VerifyEmail({ status, auth }: VerifyEmailProps) {
    const [processing, setProcessing] = useState(false);

    const handleResend = (e: FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.post('/verification/account/resend', {
            email: auth?.user?.email
        }, {
            onFinish: () => setProcessing(false),
            preserveScroll: true,
        });
    };

    return (
        <AuthLayout
            title="Verify email"
            description="Please verify your email address by clicking on the link we just emailed to you."
        >
            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={handleResend} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary" type="submit">
                    {processing && <Spinner />}
                    Resend verification email
                </Button>

                <TextLink
                    href={logout()}
                    className="mx-auto block text-sm"
                >
                    Log out
                </TextLink>
            </form>
        </AuthLayout>
    );
}