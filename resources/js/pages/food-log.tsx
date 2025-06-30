import DailyProgress from '@/components/calories/daily-progress';
import MealCard from '@/components/calories/meal-card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronDownIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Food Log',
        href: '/food-log',
    },
];

const dailyGoals = {
    calories: { current: 1450, target: 2000 },
    protein: { current: 85, target: 150 },
    carbs: { current: 180, target: 250 },
    fat: { current: 45, target: 67 },
};

export default function FoodLog(props: any) {
    const [selectedMeal, setSelectedMeal] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const dateParam = urlParams.get('date');
        const parsedDate = dateParam ? new Date(dateParam) : undefined;
        return parsedDate instanceof Date && !isNaN(parsedDate.getTime()) ? parsedDate : new Date();
    });

    useEffect(() => {
        if (date && router) {
            const formattedDate = date.toLocaleDateString('en-CA');
            requestAnimationFrame(() => {
                router.get('/food-log', { date: formattedDate }, { preserveState: true });
            });
        }
    }, [date]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Food log" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Food Log</h1>
                        <p className="text-muted-foreground">Track your daily meals and nutrition</p>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                    {date ? date.toLocaleDateString() : 'Select date'}
                                    <ChevronDownIcon />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date || new Date()}
                                    captionLayout="dropdown"
                                    disabled={(date) => date > new Date()}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setOpen(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Daily Progress Cards */}
                <DailyProgress dailyGoals={props.dailyGoals} />
                {/* Daily Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Summary</CardTitle>
                        <CardDescription>Overview of today's nutrition intake</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="font-semibold capitalize">Breakfast</div>
                                <div className="text-2xl font-bold text-primary">{isNaN(Math.round(props?.mealSummaries['0']?.calories)) ? 0 : Math.round(props?.mealSummaries['0']?.calories)}</div>
                                <div className="text-sm text-muted-foreground">kcal</div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="font-semibold capitalize">Lunch</div>
                                <div className="text-2xl font-bold text-primary">{isNaN(Math.round(props?.mealSummaries['1']?.calories)) ? 0 : Math.round(props?.mealSummaries['1']?.calories)}</div>
                                <div className="text-sm text-muted-foreground">kcal</div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="font-semibold capitalize">Dinner</div>
                                <div className="text-2xl font-bold text-primary">{isNaN(Math.round(props?.mealSummaries['2']?.calories)) ? 0 : Math.round(props?.mealSummaries['2']?.calories)}</div>
                                <div className="text-sm text-muted-foreground">kcal</div>
                            </div>
                            <div className="rounded-lg bg-muted/50 p-4 text-center">
                                <div className="font-semibold capitalize">Snacks</div>
                                <div className="text-2xl font-bold text-primary">{isNaN(Math.round(props?.mealSummaries['3']?.calories)) ? 0 : Math.round(props?.mealSummaries['3']?.calories)}</div>
                                <div className="text-sm text-muted-foreground">kcal</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Meal Timeline */}
                <div className="space-y-6">
                    <MealCard
                        addMeal={() => {
                            window.location.reload();
                        }}
                        mealName="breakfast"
                        date={date?.toLocaleDateString('en-CA') ?? ''}
                        items={props?.groupedMeals[0] ?? []}
                    />
                    <MealCard
                        addMeal={() => {
                            router.reload();
                        }}
                        mealName="lunch"
                        date={date?.toLocaleDateString('en-CA') ?? ''}
                        items={props?.groupedMeals[1] ?? []}
                    />
                    <MealCard
                        addMeal={() => {
                            router.reload();
                        }}
                        mealName="dinner"
                        date={date?.toLocaleDateString('en-CA') ?? ''}
                        items={props?.groupedMeals[2] ?? []}
                    />
                    <MealCard
                        addMeal={() => {
                            router.reload();
                        }}
                        mealName="snacks"
                        date={date?.toLocaleDateString('en-CA') ?? ''}
                        items={props?.groupedMeals[3] ?? []}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
