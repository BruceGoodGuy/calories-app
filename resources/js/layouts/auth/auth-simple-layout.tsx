import { Activity } from 'lucide-react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 dark:from-gray-900 dark:to-gray-800">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
                            <Activity className="h-6 w-6 text-primary-foreground" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold">CalorieTracker Pro</h1>
                    <p className="text-muted-foreground">Your personal nutrition companion</p>
                </div>
                {children}
                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <p>© 2025 CalorieTracker Pro. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
