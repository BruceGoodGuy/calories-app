import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

interface NutritionData {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
}

interface FoodFormProps {
    onsubmit: (data: any) => void;
    initialData?: any;
    meal?: string;
    errors?: any;
    resultss?: any[];
    date: string;
}

const FoodForm: React.FC<FoodFormProps> = (props) => {
    const [nutritionData, setNutritionData] = useState<NutritionData | {}>({});
    const [showOptions, setShowOptions] = useState(false);
    const [query, setQuery] = useState('');
    const [debouncedQuery] = useDebounce(query, 300);
    const [results, setResults] = useState([]);
    console.log('props', props.meal ? ['breakfast', 'lunch', 'dinner', 'snacks'].indexOf(props.meal) : '');
    const { data, setData, post, processing, errors } = useForm<any>({
        food: {},
        weight: '',
        meal: props.meal ? ['breakfast', 'lunch', 'dinner', 'snacks'].indexOf(props.meal).toString() : '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const date = props.date || new Date().toISOString();
        setData({ ...data, date });
        axios
            .post(route('meals.store'), { ...data, date: props.date })
            .then(() => {
                setData({ food: {}, weight: '', meal: '' });
                setNutritionData({});
                setQuery('');
                setResults([]);
                setShowOptions(false);
                props.onsubmit(data);
            })
            .catch((error) => {
                console.error(error.response?.data || error.message);
            });
    };

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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="food-name">Food Name</Label>
                <div className="relative">
                    <Input
                        type="text"
                        value={data?.food?.text || ''}
                        onClick={() => setShowOptions(true)}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setData({ ...data, food: { text: e.target.value } });
                        }}
                        placeholder="Find food..."
                        className="w-full rounded-lg border p-3"
                    />
                    {results.length > 0 && showOptions && (
                        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border bg-white shadow-lg" tabIndex={0}>
                            {results.map((food: any) => (
                                <li
                                    key={food?.value}
                                    className="cursor-pointer p-3 hover:bg-gray-100"
                                    onClick={() => {
                                        setShowOptions(false);
                                        setData({ ...data, food: food?.data, weight: 100 });
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
                            const weight = parseFloat(e.target.value);
                            setData({ ...data, weight: e.target.value });
                            if (nutritionData && Object.keys(nutritionData).length > 0) {
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
                    <Select value={data.meal} onValueChange={(value) => setData({ ...data, meal: value })}>
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
    );
};

export default FoodForm;
