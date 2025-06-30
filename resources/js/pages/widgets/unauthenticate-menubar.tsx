'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Link } from '@inertiajs/react';
import { Calendar, Clock, LogIn, Quote } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Progress } from '@/components/ui/progress';
import { Droplets, Flame, Plus, User, Wheat, Zap } from 'lucide-react';

interface Nut1ritionData1 {
    calories: { current: number; target: number };
    fat: { current: number; target: number };
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
}

interface AuthenticatedMenubarProps {
    name?: string;
    dailyGoals?: Nut1ritionData1;
    authenticated: boolean;
}

interface QuoteData {
    content: string;
    author: string;
}

export default function Component({
    name = 'John Doe',
    dailyGoals = {
        calories: { current: 1450, target: 2000 },
        fat: { current: 65, target: 80 },
        carbs: { current: 180, target: 250 },
        protein: { current: 95, target: 120 },
    },
    authenticated = false,
}: AuthenticatedMenubarProps) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [quote, setQuote] = useState<QuoteData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        const eventName = 'App\\Events\\LoginSuccess';

        window.Native.on(eventName, () => {
            setIsAuthenticated(true);
        });

        return () => {
            clearInterval(timer);
        };
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

    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

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
            {(isAuthenticated || authenticated) ? (
                <Card className="rounded-none border-b shadow-sm">
                    <div className="px-4 py-3">
                        {/* Top Row - User Name and Add Meal */}
                        <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                <h1 className="text-xl font-bold text-primary">Welcome, {name}</h1>
                            </div>
                            <Link href={route('widget.add-meal')} className="flex items-center gap-2">
                                <Button size="sm" className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add Meal
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

                        {/* Nutrition Stats Section */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-foreground">Today's Nutrition</h3>

                            {/* Calories */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Flame className="h-4 w-4 text-orange-500" />
                                        <span className="font-medium">Calories</span>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {dailyGoals.calories.current} / {dailyGoals.calories.target}
                                    </span>
                                </div>
                                <Progress value={getProgressPercentage(dailyGoals.calories.current, dailyGoals.calories.target)} className="h-2" />
                            </div>

                            {/* Macros Row */}
                            <div className="grid grid-cols-3 gap-3">
                                {/* Fat */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs">
                                        <Droplets className="h-3 w-3 text-yellow-500" />
                                        <span className="font-medium">Fat</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {dailyGoals.fat.current}g / {dailyGoals.fat.target}g
                                    </div>
                                    <Progress value={getProgressPercentage(dailyGoals.fat.current, dailyGoals.fat.target)} className="h-1.5" />
                                </div>

                                {/* Carbs */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs">
                                        <Wheat className="h-3 w-3 text-amber-500" />
                                        <span className="font-medium">Carbs</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {dailyGoals.carbs.current}g / {dailyGoals.carbs.target}g
                                    </div>
                                    <Progress value={getProgressPercentage(dailyGoals.carbs.current, dailyGoals.carbs.target)} className="h-1.5" />
                                </div>

                                {/* Protein */}
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1 text-xs">
                                        <Zap className="h-3 w-3 text-blue-500" />
                                        <span className="font-medium">Protein</span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {dailyGoals.protein.current}g / {dailyGoals.protein.target}g
                                    </div>
                                    <Progress
                                        value={getProgressPercentage(dailyGoals.protein.current, dailyGoals.protein.target)}
                                        className="h-1.5"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            ) : (
                <>
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
                                <p className="mx-auto max-w-md text-sm">
                                    Please log in to start tracking your daily calories and reach your health goals.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
