'use client';

import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Activity, AlertCircleIcon, Calculator, CheckCircle, Info, Minus, Target, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tdee Calculator',
        href: '/tdee-calculator',
    },
];

interface TDEEFormData {
    // Personal Info
    age: string;
    gender: string;
    height: string;
    weight: string;

    // Activity Level
    activityLevel: string;

    // Goals
    goal: string;
    weeklyGoal: string;

    // Macro Preferences
    macroDistribution: string;

    // Index signature to satisfy FormDataType constraint
    [key: string]: string;
}

interface TDEEResults {
    bmr: number;
    tdee: number;
    goalCalories: number;
    macros: {
        protein: number;
        carbs: number;
        fat: number;
    };
    weeklyWeightChange: number;
    timeToGoal: number;
}

const calculateMacrosAndGoals = (response: any, formData: TDEEFormData) => {
    let { bmr, tdee, target_calories, macros, weeklyWeightChange } = response;
    let weightInKg = Number.parseFloat(formData.weight);
    if (formData.goal === 'lose') {
        const weeklyGoalKg = Number.parseFloat(formData.weeklyGoal);
        const dailyDeficit = (weeklyGoalKg * 7700) / 7; // 7700 kcal per kg of fat
        target_calories = tdee - dailyDeficit;
        weeklyWeightChange = -weeklyGoalKg;
    } else if (formData.goal === 'gain') {
        const weeklyGoalKg = Number.parseFloat(formData.weeklyGoal);
        const dailySurplus = (weeklyGoalKg * 7700) / 7;
        target_calories = tdee + dailySurplus;
        weeklyWeightChange = weeklyGoalKg;
    }

    // Calculate time to goal
    let timeToGoal = 0;
    if (formData.targetWeight && formData.goal !== 'maintain') {
        let targetWeightKg = Number.parseFloat(formData.targetWeight);
        if (formData.targetWeightUnit === 'lbs') {
            targetWeightKg = targetWeightKg * 0.453592;
        }

        const weightDifference = Math.abs(targetWeightKg - weightInKg);
        if (weeklyWeightChange > 0) {
            timeToGoal = Math.ceil(weightDifference / weeklyWeightChange);
        }
    }

    return {
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        goalCalories: Math.round(target_calories),
        macros,
        weeklyWeightChange,
        timeToGoal,
    };
};

const defaultFormData: TDEEFormData = {
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: '',
    goal: '',
    macroDistribution: '',
    weeklyGoal: '',
};

export default function TDEEPage(props: { macros: any; tdee: any }) {
    const [results, setResults] = useState<TDEEResults | null>(null);
    const { data, setData, post, processing, errors } = useForm<TDEEFormData>(defaultFormData);

    useEffect(() => {
        if (props.tdee && Object.keys(props.tdee).length > 0) {
            const resultsData = calculateMacrosAndGoals(props.macros, props.tdee);
            if (typeof resultsData.macros === 'string') {
                resultsData.macros = JSON.parse(resultsData.macros);
            }
            setData(props.tdee);
            setResults(resultsData);
        }
    }, [props.tdee]);

    const submit: FormEventHandler = async (e: any) => {
        e.preventDefault();
        const clickedButton = e.nativeEvent.submitter;
        if (clickedButton) {
            post(
                route('tdee.calculate', {
                    isCalculation: clickedButton.name === 'calculate',
                }),
                {
                    onSuccess: (response) => {
                        if (clickedButton.name === 'apply') {
                            toast('Saved!', {
                                description: 'Your TDEE and goals have been applied to the dashboard.',
                                action: {
                                    label: 'Go to Dasboard',
                                    onClick: () => {
                                        router.get('/dashboard');
                                    },
                                },
                            });
                        } else {
                            toast('Success!', {
                                description: 'Your TDEE and goals have been calculated.',
                            });
                        }
                    },
                },
            );
        }
    };

    const activityLevels = [
        {
            value: 'sedentary',
            label: 'Sedentary',
            multiplier: 1.2,
            description: 'Little or no exercise, desk job',
        },
        {
            value: 'light',
            label: 'Lightly Active',
            multiplier: 1.375,
            description: 'Light exercise 1-3 days per week',
        },
        {
            value: 'moderate',
            label: 'Moderately Active',
            multiplier: 1.55,
            description: 'Moderate exercise 3-5 days per week',
        },
        {
            value: 'active',
            label: 'Very Active',
            multiplier: 1.725,
            description: 'Hard exercise 6-7 days per week',
        },
        {
            value: 'very_active',
            label: 'Extremely Active',
            multiplier: 1.9,
            description: 'Very hard exercise, physical job, or training twice a day',
        },
    ];

    const macroDistributions = [
        {
            value: 'balanced',
            label: 'Balanced',
            protein: 30,
            carbs: 40,
            fat: 30,
            description: 'Good for general health and fitness',
        },
        {
            value: 'high-protein',
            label: 'High Protein',
            protein: 35,
            carbs: 35,
            fat: 30,
            description: 'Ideal for muscle building and weight loss',
        },
        {
            value: 'low-carb',
            label: 'Low Carb',
            protein: 30,
            carbs: 20,
            fat: 50,
            description: 'Good for weight loss and blood sugar control',
        },
        {
            value: 'keto',
            label: 'Ketogenic',
            protein: 25,
            carbs: 5,
            fat: 70,
            description: 'Very low carb, high fat for ketosis',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="TDEE calculator" />
            <div className="space-y-6 p-6">
                {!props.tdee && (
                    <Alert>
                        <AlertCircleIcon />
                        <AlertTitle>Caution!</AlertTitle>
                        <AlertDescription>
                            Please calculate your Total Daily Energy Expenditure (TDEE) to unlock the full functionality of this tool.
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="flex items-center gap-2 text-3xl font-bold">
                            <Calculator className="h-8 w-8" />
                            TDEE Calculator
                        </h1>
                        <p className="text-muted-foreground">Calculate your Total Daily Energy Expenditure and set personalized nutrition goals</p>
                    </div>
                </div>
                <form onSubmit={submit} className="w-full">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Form Section */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Personal Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Info className="h-5 w-5" />
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription>Basic information needed for accurate TDEE calculation</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age *</Label>
                                            <Input
                                                id="age"
                                                type="number"
                                                placeholder="25"
                                                value={data.age}
                                                onChange={(e) => setData('age', e.target.value)}
                                                disabled={processing}
                                            />
                                            <InputError message={errors.age} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Biological Sex *</Label>
                                            <RadioGroup
                                                id="gender"
                                                value={data.gender}
                                                onValueChange={(e) => setData('gender', e)}
                                                className="flex gap-6"
                                                disabled={processing}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="male" id="male" />
                                                    <Label htmlFor="male">Male</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="female" id="female" />
                                                    <Label htmlFor="female">Female</Label>
                                                </div>
                                            </RadioGroup>
                                            <InputError message={errors.gender} />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="height">Height (cm) *</Label>
                                            <div className="align-center flex gap-2">
                                                <Input
                                                    id="height"
                                                    type="number"
                                                    placeholder="175"
                                                    value={data.height}
                                                    onChange={(e) => setData('height', e.target.value)}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <InputError message={errors.height} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Current Weight (kg) *</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="weight"
                                                    type="number"
                                                    placeholder="70"
                                                    value={data.weight}
                                                    onChange={(e) => setData('weight', e.target.value)}
                                                    disabled={processing}
                                                />
                                            </div>
                                            <InputError message={errors.weight} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Activity Level */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Activity Level
                                    </CardTitle>
                                    <CardDescription>Select the option that best describes your typical weekly activity</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={data.activityLevel}
                                        onValueChange={(e) => setData('activityLevel', e)}
                                        className="space-y-3"
                                        disabled={processing}
                                    >
                                        {activityLevels.map((level) => (
                                            <div key={level.value} className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-muted/50">
                                                <RadioGroupItem value={level.value} id={level.value} className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor={level.value} className="cursor-pointer font-medium">
                                                        {level.label}
                                                        <Badge variant="secondary" className="ml-2">
                                                            BMR × {level.multiplier}
                                                        </Badge>
                                                    </Label>
                                                    <p className="mt-1 text-sm text-muted-foreground">{level.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    <InputError className="mt-2" message={errors.activityLevel} />
                                </CardContent>
                            </Card>

                            {/* Goals */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Target className="h-5 w-5" />
                                        Goals & Preferences
                                    </CardTitle>
                                    <CardDescription>Define your fitness goals and target outcomes</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Primary Goal *</Label>
                                        <RadioGroup
                                            value={data.goal}
                                            onValueChange={(e) => setData('goal', e)}
                                            className="grid grid-cols-1 gap-3 md:grid-cols-3"
                                            disabled={processing}
                                        >
                                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                                                <RadioGroupItem value="lose" id="lose" />
                                                <div>
                                                    <Label htmlFor="lose" className="flex cursor-pointer items-center gap-2 font-medium">
                                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                                        Lose Weight
                                                    </Label>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                                                <RadioGroupItem value="maintain" id="maintain" />
                                                <div>
                                                    <Label htmlFor="maintain" className="flex cursor-pointer items-center gap-2 font-medium">
                                                        <Minus className="h-4 w-4 text-blue-500" />
                                                        Maintain Weight
                                                    </Label>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50">
                                                <RadioGroupItem value="gain" id="gain" />
                                                <div>
                                                    <Label htmlFor="gain" className="flex cursor-pointer items-center gap-2 font-medium">
                                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                                        Gain Weight
                                                    </Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                        <InputError message={errors.goal} />
                                    </div>

                                    {(data.goal === 'lose' || data.goal === 'gain') && (
                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="weekly-goal">Weekly {data.goal === 'lose' ? 'Loss' : 'Gain'} Goal</Label>
                                                <Select value={data.weeklyGoal} onValueChange={(e) => setData('weeklyGoal', e)} disabled={processing}>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0.25">0.25 kg/week (Conservative)</SelectItem>
                                                        <SelectItem value="0.5">0.5 kg/week (Moderate)</SelectItem>
                                                        <SelectItem value="0.75">0.75 kg/week (Aggressive)</SelectItem>
                                                        <SelectItem value="1">1 kg/week (Very Aggressive)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <InputError message={errors.weeklyGoal} />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Macro Distribution */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Zap className="h-5 w-5" />
                                        Macro Distribution
                                    </CardTitle>
                                    <CardDescription>Choose how you want to distribute your daily calories across macronutrients</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <RadioGroup
                                        value={data.macroDistribution}
                                        onValueChange={(value) => setData('macroDistribution', value)}
                                        className="space-y-3"
                                        disabled={processing}
                                    >
                                        {macroDistributions.map((distribution) => (
                                            <div
                                                key={distribution.value}
                                                className="flex items-start space-x-3 rounded-lg border p-3 hover:bg-muted/50"
                                            >
                                                <RadioGroupItem value={distribution.value} id={distribution.value} className="mt-1" />
                                                <div className="flex-1">
                                                    <Label htmlFor={distribution.value} className="cursor-pointer font-medium">
                                                        {distribution.label}
                                                        {distribution.value !== 'custom' && (
                                                            <div className="mt-1 flex gap-2">
                                                                <Badge variant="outline">P: {distribution.protein}%</Badge>
                                                                <Badge variant="outline">C: {distribution.carbs}%</Badge>
                                                                <Badge variant="outline">F: {distribution.fat}%</Badge>
                                                            </div>
                                                        )}
                                                    </Label>
                                                    <p className="mt-1 text-sm text-muted-foreground">{distribution.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                    <InputError message={errors.macroDistribution} />
                                </CardContent>
                            </Card>

                            {/* Calculate Button */}
                            <Button name="calculate" size="lg" className="w-full" disabled={processing}>
                                <Calculator className="mr-2 h-4 w-4" />
                                Calculate My TDEE & Goals
                            </Button>
                        </div>

                        {/* Results Section */}
                        <div className="space-y-6">
                            {results ? (
                                <>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                Your Results
                                            </CardTitle>
                                            <CardDescription>Based on your information and goals</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 gap-4">
                                                <div className="rounded-lg bg-muted/50 p-3">
                                                    <div className="text-sm text-muted-foreground">Basal Metabolic Rate (BMR)</div>
                                                    <div className="text-2xl font-bold">{results.bmr.toLocaleString()} kcal/day</div>
                                                    <div className="text-xs text-muted-foreground">Calories burned at rest</div>
                                                </div>

                                                <div className="rounded-lg bg-primary/10 p-3">
                                                    <div className="text-sm text-muted-foreground">Total Daily Energy Expenditure</div>
                                                    <div className="text-2xl font-bold text-primary">{results.tdee.toLocaleString()} kcal/day</div>
                                                    <div className="text-xs text-muted-foreground">Maintenance calories</div>
                                                </div>

                                                <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950">
                                                    <div className="text-sm text-muted-foreground">Goal Calories</div>
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {results.goalCalories.toLocaleString()} kcal/day
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {results.goalCalories < results.tdee
                                                            ? 'Deficit'
                                                            : results.goalCalories > results.tdee
                                                              ? 'Surplus'
                                                              : 'Maintenance'}
                                                    </div>
                                                </div>
                                            </div>

                                            <Separator />

                                            <div>
                                                <div className="mb-2 text-sm font-medium">Daily Macro Targets</div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Protein</span>
                                                        <span className="font-semibold">{results.macros.protein}g</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Carbohydrates</span>
                                                        <span className="font-semibold">{results.macros.carbs}g</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Fat</span>
                                                        <span className="font-semibold">{results.macros.fat}g</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {results.weeklyWeightChange && results.weeklyWeightChange !== 0 && (
                                                <>
                                                    <Separator />
                                                    <div>
                                                        <div className="mb-2 text-sm font-medium">Weight Change Projection</div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm">Weekly Change</span>
                                                            <span
                                                                className={`font-semibold ${results.weeklyWeightChange > 0 ? 'text-green-600' : 'text-red-600'}`}
                                                            >
                                                                {results.weeklyWeightChange > 0 ? '+' : ''}
                                                                {results.weeklyWeightChange} kg/week
                                                            </span>
                                                        </div>
                                                        {results.timeToGoal > 0 && (
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm">Time to Goal</span>
                                                                <span className="font-semibold">{results.timeToGoal} weeks</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>

                                    {props?.tdee?.status !== 'draft' ? (
                                        <p className="text-sm text-muted-foreground">
                                            You have already applied your goals to the dashboard. Further modifications are not allowed.{' '}
                                            {props?.tdee?.status}
                                        </p>
                                    ) : (
                                        <Button name="apply" type="submit" variant="outline" className="w-full" disabled={processing}>
                                            Apply Goals to Dashboard
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Your Results</CardTitle>
                                        <CardDescription>Fill out the form to calculate your TDEE and nutrition goals</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="py-8 text-center text-muted-foreground">
                                            <Calculator className="mx-auto mb-4 h-12 w-12 opacity-50" />
                                            <p>Complete the form and click calculate to see your personalized results</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Information Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-sm">About TDEE</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2 text-xs">
                                    <p>
                                        <strong>BMR (Basal Metabolic Rate):</strong> The number of calories your body needs to maintain basic
                                        physiological functions at rest.
                                    </p>
                                    <p>
                                        <strong>TDEE (Total Daily Energy Expenditure):</strong> Your BMR multiplied by your activity level factor.
                                    </p>
                                    <p>
                                        <strong>Goal Calories:</strong> Adjusted calories based on your weight goal (deficit for loss, surplus for
                                        gain).
                                    </p>
                                    <p className="text-muted-foreground">
                                        This calculator uses the Mifflin-St Jeor equation, which is considered one of the most accurate for most
                                        people.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
