import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';

import '../css/app.css';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme, applyTheme, Appearance } from './hooks/use-appearance';
import { SharedData } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

router.on('navigate', (event: any) => {
    const props = event.detail.page.props as SharedData;
    const user = props.auth?.user;

    if (user?.appearance) {
        applyTheme(user.appearance as Appearance);
        localStorage.setItem('appearance', user.appearance);
    } else {
        applyTheme('system');
        localStorage.removeItem('appearance');
    }
});

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();