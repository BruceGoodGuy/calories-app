import DailyProgress from '@/components/calories/daily-progress';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig } from '@/components/ui/chart';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Plus, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { router } from '@inertiajs/react';


interface DailyGoals {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const chartData = [
    { month: 'January', desktop: 186, mobile: 80 },
    { month: 'February', desktop: 305, mobile: 200 },
    { month: 'March', desktop: 237, mobile: 120 },
    { month: 'April', desktop: 73, mobile: 190 },
    { month: 'May', desktop: 209, mobile: 130 },
    { month: 'June', desktop: 214, mobile: 140 },
];
const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: '#2563eb',
    },
    mobile: {
        label: 'Mobile',
        color: '#60a5fa',
    },
} satisfies ChartConfig;

export default function Dashboard(props: { dailyGoals: DailyGoals; meals: any[] }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [debouncedQuery] = useDebounce(query, 300);
    const [nutritionData, setNutritionData] = useState<any>({});
    const { data, setData, post, processing, errors } = useForm<any>({});

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            axios
                .get(route('foods.search'), {
                    params: { q: debouncedQuery },
                })
                .then((res) => {
                    setResults(
                        res.data.results.map((food: any) => ({
                            value: food.id,
                            label: `${food.text}`,
                            name: food.name,
                            data: food,
                        })),
                    );
                });
        }
    }, [debouncedQuery]);

    const submitData = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.food || !data.weight || !data.meal) {
            return;
        }
        post(route('meals.store'), {
            onSuccess: () => {
                setData({ food: {}, weight: '', meal: '' });
                setNutritionData({});
                setQuery('');
                setResults([]);
                setShowOptions(false);
            },
            onError: (errors) => {
                console.error(errors);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-muted-foreground">Track your daily nutrition goals</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Today</p>
                        <p className="text-lg font-semibold">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                {/* Daily Progress Cards */}
                <DailyProgress dailyGoals={props.dailyGoals} />

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Quick Add Food */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Quick Add Food
                            </CardTitle>
                            <CardDescription>Quickly log food items to your daily intake</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <form onSubmit={submitData} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="food-name">Food Name</Label>
                                    <div className="relative">
                                        <Input
                                            type="text"
                                            value={data?.food?.text || ''}
                                            onClick={() => setShowOptions(true)}
                                            onChange={(e) => {
                                                setQuery(e.target.value);
                                                setData('food', { text: e.target.value });
                                            }}
                                            placeholder="Find food..."
                                            className="w-full rounded-lg border p-3"
                                        />
                                        {results.length > 0 && showOptions && (
                                            <ul
                                                className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg"
                                                tabIndex={0}
                                            >
                                                {results.map((food: any) => (
                                                    <li
                                                        key={food?.value}
                                                        className="cursor-pointer p-3 hover:bg-gray-100"
                                                        onClick={() => {
                                                            setShowOptions(false);
                                                            setData('food', food?.data);
                                                            setData('weight', 100);
                                                            setNutritionData(food?.data.data);
                                                        }}
                                                    >
                                                        <div className="font-medium">{food?.label}</div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <InputError message={errors.food} />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (g)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="0"
                                            value={data.weight || ''}
                                            onChange={(e) => {
                                                setData('weight', e.target.value);
                                                if (nutritionData && Object.keys(nutritionData).length > 0) {
                                                    const weight = parseFloat(e.target.value);
                                                    if (isNaN(weight) || weight <= 0) {
                                                        setNutritionData({});
                                                        return;
                                                    }
                                                    setNutritionData({
                                                        ...nutritionData,
                                                        calories: Math.round((data?.food?.data.calories * weight) / 100),
                                                        protein: Math.round((data?.food?.data.protein * weight) / 100),
                                                        carbs: Math.round((data?.food?.data.carbs * weight) / 100),
                                                        fat: Math.round((data?.food?.data.fat * weight) / 100),
                                                    });
                                                }
                                            }}
                                        />
                                        <InputError message={errors.weight} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meal">Meal</Label>
                                        <Select onValueChange={(value) => setData('meal', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select meal" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">Breakfast</SelectItem>
                                                <SelectItem value="1">Lunch</SelectItem>
                                                <SelectItem value="2">Dinner</SelectItem>
                                                <SelectItem value="3">Snacks</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.meal} />
                                    </div>
                                </div>
                                {Object.keys(nutritionData).length > 0 && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Calories: {nutritionData?.calories}g</Label>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Carbs: {nutritionData?.carbs}g</Label>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Fat: {nutritionData?.fat}g</Label>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Protein: {nutritionData?.protein}g</Label>
                                        </div>
                                    </div>
                                )}

                                <Button type="submit" className="w-full">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Food
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                    {/* Enhanced TDEE Calculator */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Weight Target: Coming Soon
                                    </CardTitle>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center text-muted-foreground">This feature is under development. Stay tuned for updates!</div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest food entries and activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {props.meals.length === 0 ? (
                                <div className="text-center text-muted-foreground">No records found.</div>
                            ) : (
                                props.meals.map((entry, index) => (
                                    <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                        <div className="flex items-center gap-3">
                                            <div className="font-medium">{entry.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                ({['Breakfast', 'Lunch', 'Dinner', 'Snack'][entry.meal]})
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="font-semibold">{entry.calories} kcal</div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    axios
                                                        .post(route('meals.destroy'), {
                                                            id: entry.id,
                                                        })
                                                        .then(() => {
                                                            router.reload();
                                                        })
                                                        .catch((error) => {
                                                            console.error('Error deleting entry:', error);
                                                        });
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
