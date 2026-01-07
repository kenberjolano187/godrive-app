import { AppHeader } from '@/components/app-page';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <div className="min-h-screen w-full font-sans text-[#ffffff]" style={{ backgroundColor: 'oklch(44.4% 0.177 26.899)' }}>
                <AppHeader />
                <main className="relative flex min-h-[calc(100vh-64px)] flex-col justify-center">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between gap-8">
                            <div className="w-1/2 flex items-center justify-center">
                                <h1 className="text-6xl font-bold">Go Drive</h1>
                            </div>
                            
                            <div className="w-1/2">
                                <img 
                                    src="/images/godrive.png" 
                                    alt="Drive" 
                                    className="w-full h-auto"
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}