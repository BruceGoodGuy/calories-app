'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, Droplets, Flame, Plus, User, Wheat, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';


interface Nut1ritionData1 {
    calories: { current: number; target: number };
    fat: { current: number; target: number };
    carbs: { current: number; target: number };
    protein: { current: number; target: number };
}

interface AuthenticatedMenubarProps {
    name?: string;
    dailyGoals?: Nut1ritionData1;
}

export default function AuthenticatedMenubar({
    name = 'John Doe',
    dailyGoals = {
        calories: { current: 1450, target: 2000 },
        fat: { current: 65, target: 80 },
        carbs: { current: 180, target: 250 },
        protein: { current: 95, target: 120 },
    },
}: AuthenticatedMenubarProps) {
    const [currentTime, setCurrentTime] = useState(new Date());

    console.log(dailyGoals);

    // Update time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
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

    const getProgressPercentage = (current: number, goal: number) => {
        return Math.min((current / goal) * 100, 100);
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-green-500';
        if (percentage >= 70) return 'bg-yellow-500';
        return 'bg-blue-500';
    };

    return (
        <div className="mx-auto w-full max-w-[600px] bg-background">
            {/* Main Menubar */}
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
        </div>
    );
}
