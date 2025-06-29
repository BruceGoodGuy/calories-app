import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, Clock, Target, TrendingDown, TrendingUp, Utensils } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'History',
        href: '/history',
    },
];

export default function History() {
    const [selectedPeriod, setSelectedPeriod] = useState('7days');
    const [selectedMetric, setSelectedMetric] = useState('calories');

    // Mock historical data
    const weeklyData = [
        { date: '2024-01-15', calories: 1850, protein: 120, carbs: 200, fat: 65, weight: 70.2 },
        { date: '2024-01-16', calories: 2100, protein: 140, carbs: 250, fat: 75, weight: 70.1 },
        { date: '2024-01-17', calories: 1950, protein: 130, carbs: 220, fat: 68, weight: 70.0 },
        { date: '2024-01-18', calories: 2200, protein: 150, carbs: 280, fat: 80, weight: 69.9 },
        { date: '2024-01-19', calories: 1800, protein: 110, carbs: 190, fat: 60, weight: 69.8 },
        { date: '2024-01-20', calories: 2050, protein: 135, carbs: 240, fat: 72, weight: 69.7 },
        { date: '2024-01-21', calories: 1900, protein: 125, carbs: 210, fat: 65, weight: 69.6 },
    ];

    const monthlyStats = {
        avgCalories: 0,
        avgProtein: 0,
        avgCarbs: 0,
        avgFat: 0,
        totalDays: 0,
        goalDays: 0,
        weightChange: 0,
        streakDays: 0,
    };

    const achievements = [
        { title: '7-Day Streak', description: 'Logged food for 7 consecutive days', date: '2024-01-21', type: 'streak' },
        { title: 'Protein Goal', description: 'Hit protein target 5 days in a row', date: '2024-01-20', type: 'nutrition' },
        {
            title: 'Calorie Balance',
            description: 'Stayed within calorie range for a week',
            date: '2024-01-19',
            type: 'calories',
        },
        { title: 'Weight Milestone', description: 'Lost 1kg this month', date: '2024-01-18', type: 'weight' },
    ];

    const recentMeals = [
        { date: '2024-01-21', meal: 'Breakfast', foods: ['Oatmeal with Berries', 'Greek Yogurt'], calories: 380 },
        { date: '2024-01-21', meal: 'Lunch', foods: ['Grilled Chicken Salad', 'Quinoa'], calories: 450 },
        { date: '2024-01-20', meal: 'Dinner', foods: ['Salmon', 'Sweet Potato', 'Broccoli'], calories: 520 },
        { date: '2024-01-20', meal: 'Snack', foods: ['Apple', 'Almonds'], calories: 180 },
    ];

    const SimpleChart = ({ data, metric }: { data: any[]; metric: string }) => {
        const maxValue = Math.max(...data.map((d) => d[metric]));
        const minValue = Math.min(...data.map((d) => d[metric]));

        return (
            <div className="flex h-32 items-end justify-between gap-1 p-4">
                {data.map((day, index) => {
                    const height = ((day[metric] - minValue) / (maxValue - minValue)) * 100;
                    return (
                        <div key={index} className="flex flex-1 flex-col items-center gap-1">
                            <div
                                className="min-h-[4px] w-full rounded-t bg-primary transition-all duration-300"
                                style={{ height: `${Math.max(height, 10)}%` }}
                            />
                            <span className="text-xs text-muted-foreground">{new Date(day.date).toLocaleDateString('en', { weekday: 'short' })}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const StatCard = ({ title, value, change, icon: Icon, trend }: any) => (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">{title}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        {change && (
                            <div
                                className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}
                            >
                                {trend === 'up' && <TrendingUp className="h-3 w-3" />}
                                {trend === 'down' && <TrendingDown className="h-3 w-3" />}
                                <span>{change}</span>
                            </div>
                        )}
                    </div>
                    <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="History" />
            <div className="space-y-6 p-6">
                {/* Development Notice */}
                <div className="rounded-lg bg-yellow-100 p-4 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    <p className="text-sm font-medium">
                        🚧 This feature is currently under development. Some data may be incomplete or subject to change.
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">History & Analytics</h1>
                        <p className="text-muted-foreground">Track your progress and analyze your nutrition patterns</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="7days">7 Days</SelectItem>
                                <SelectItem value="30days">30 Days</SelectItem>
                                <SelectItem value="90days">90 Days</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Avg Daily Calories"
                        value={`${monthlyStats.avgCalories}`}
                        change="-0 from last month"
                        icon={Target}
                        trend="down"
                    />
                    <StatCard
                        title="Goal Achievement"
                        // value={`${Math.round((monthlyStats.goalDays / monthlyStats.totalDays) * 100)}%`}
                        value="0%"
                        change="+0% from last month"
                        icon={Activity}
                        trend="up"
                    />
                    <StatCard title="Current Streak" value={`${monthlyStats.streakDays} days`} change="Personal best!" icon={Calendar} trend="up" />
                    <StatCard title="Weight Change" value={`${monthlyStats.weightChange}kg`} change="This month" icon={TrendingDown} trend="down" />
                </div>

                <Tabs defaultValue="charts" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="charts">Charts</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                        <TabsTrigger value="meals">Recent Meals</TabsTrigger>
                    </TabsList>

                    <TabsContent value="charts" className="space-y-4">
                        {/* Nutrition Charts */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Nutrition Trends</CardTitle>
                                        <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="calories">Calories</SelectItem>
                                                <SelectItem value="protein">Protein</SelectItem>
                                                <SelectItem value="carbs">Carbs</SelectItem>
                                                <SelectItem value="fat">Fat</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <CardDescription>Daily {selectedMetric} intake over the past week</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SimpleChart data={weeklyData} metric={selectedMetric} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Weight Progress</CardTitle>
                                    <CardDescription>Weight tracking over time</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <SimpleChart data={weeklyData} metric="weight" />
                                    <div className="mt-4 rounded-lg bg-muted/50 p-3">
                                        <div className="flex justify-between text-sm">
                                            <span>Starting Weight:</span>
                                            <span className="font-medium">70.2 kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Current Weight:</span>
                                            <span className="font-medium">69.6 kg</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-semibold text-green-600">
                                            <span>Total Loss:</span>
                                            <span>-0.6 kg</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Macro Distribution */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Average Macro Distribution</CardTitle>
                                <CardDescription>Your typical daily macronutrient breakdown</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="rounded-lg bg-blue-50 p-4 text-center dark:bg-blue-950">
                                        <div className="text-2xl font-bold text-blue-600">{monthlyStats.avgProtein}g</div>
                                        <div className="text-sm text-muted-foreground">Protein</div>
                                        <div className="text-xs text-muted-foreground">
                                            {Math.round(((monthlyStats.avgProtein * 4) / monthlyStats.avgCalories) * 100)}% of calories
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-950">
                                        <div className="text-2xl font-bold text-green-600">{monthlyStats.avgCarbs}g</div>
                                        <div className="text-sm text-muted-foreground">Carbs</div>
                                        <div className="text-xs text-muted-foreground">
                                            {Math.round(((monthlyStats.avgCarbs * 4) / monthlyStats.avgCalories) * 100)}% of calories
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-orange-50 p-4 text-center dark:bg-orange-950">
                                        <div className="text-2xl font-bold text-orange-600">{monthlyStats.avgFat}g</div>
                                        <div className="text-sm text-muted-foreground">Fat</div>
                                        <div className="text-xs text-muted-foreground">
                                            {Math.round(((monthlyStats.avgFat * 9) / monthlyStats.avgCalories) * 100)}% of calories
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="achievements" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Achievements</CardTitle>
                                <CardDescription>Celebrate your nutrition and fitness milestones</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {achievements.map((achievement, index) => (
                                        <div key={index} className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                                            <div
                                                className={`rounded-full p-2 ${
                                                    achievement.type === 'streak'
                                                        ? 'bg-purple-100 dark:bg-purple-900'
                                                        : achievement.type === 'nutrition'
                                                          ? 'bg-green-100 dark:bg-green-900'
                                                          : achievement.type === 'calories'
                                                            ? 'bg-blue-100 dark:bg-blue-900'
                                                            : 'bg-orange-100 dark:bg-orange-900'
                                                }`}
                                            >
                                                {achievement.type === 'streak' && <Calendar className="h-4 w-4 text-purple-600" />}
                                                {achievement.type === 'nutrition' && <Utensils className="h-4 w-4 text-green-600" />}
                                                {achievement.type === 'calories' && <Target className="h-4 w-4 text-blue-600" />}
                                                {achievement.type === 'weight' && <TrendingDown className="h-4 w-4 text-orange-600" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold">{achievement.title}</div>
                                                <div className="text-sm text-muted-foreground">{achievement.description}</div>
                                            </div>
                                            <div className="text-sm text-muted-foreground">{new Date(achievement.date).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="meals" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Meals</CardTitle>
                                <CardDescription>Your latest food entries and meal patterns</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentMeals.map((entry, index) => (
                                        <div key={index} className="flex items-center gap-4 rounded-lg bg-muted/50 p-4">
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <div className="text-sm text-muted-foreground">{new Date(entry.date).toLocaleDateString()}</div>
                                            </div>
                                            <Badge variant="outline">{entry.meal}</Badge>
                                            <div className="flex-1">
                                                <div className="font-medium">{entry.foods.join(', ')}</div>
                                            </div>
                                            <div className="font-semibold">{entry.calories} kcal</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
