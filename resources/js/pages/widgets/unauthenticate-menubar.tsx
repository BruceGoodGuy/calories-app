'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { Calendar, Clock, LogIn, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuoteData {
    content: string;
    author: string;
}

export default function Component() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Fetch random quote
    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch('http://api.quotable.io/random?minLength=50&maxLength=120');
                const data = await response.json();
                setQuote({ content: data.content, author: data.author });
            } catch (error) {
                // Fallback quote if API fails
                setQuote({
                    content: 'The groundwork for all happiness is good health.',
                    author: 'Leigh Hunt',
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuote();
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <div className="mx-auto w-full max-w-[600px] bg-background">
            {/* Main Menubar */}
            <Card className="rounded-none border-b shadow-sm">
                <div className="px-4 py-3">
                    {/* Top Row - App Name and Login */}
                    <div className="mb-3 flex items-center justify-between">
                        <h1 className="text-xl font-bold text-primary">Calorie Pro Tracker</h1>
                        <Link href={route('widget.login')} className="flex items-center text-sm text-primary hover:underline">
                            <Button size="sm" className="gap-2">
                                <LogIn className="h-4 w-4" />
                                Login
                            </Button>
                        </Link>
                    </div>

                    <Separator className="mb-3" />

                    {/* Date and Time Row */}
                    <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(currentTime)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-mono">{formatTime(currentTime)}</span>
                        </div>
                    </div>

                    <Separator className="mb-3" />

                    {/* Quote Section */}
                    <div className="flex items-start gap-2">
                        <Quote className="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                        <div className="min-w-0 flex-1">
                            {isLoading ? (
                                <div className="animate-pulse">
                                    <div className="mb-2 h-4 w-3/4 rounded bg-muted"></div>
                                    <div className="h-3 w-1/2 rounded bg-muted"></div>
                                </div>
                            ) : quote ? (
                                <div>
                                    <p className="mb-1 text-sm leading-relaxed text-foreground italic">"{quote.content}"</p>
                                    <p className="text-xs text-muted-foreground">— {quote.author}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Loading inspiration...</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Demo Content Area */}
            <div className="p-6 text-center text-muted-foreground">
                <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-8 w-8" />
                    </div>
                    <div>
                        <h2 className="mb-2 text-lg font-semibold text-foreground">Welcome to Calorie Pro Tracker</h2>
                        <p className="mx-auto max-w-md text-sm">Please log in to start tracking your daily calories and reach your health goals.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
