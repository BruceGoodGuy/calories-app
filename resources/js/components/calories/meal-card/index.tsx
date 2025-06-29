import FoodForm from '@/components/calories/meal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Plus, Utensils } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';


const MealCard = ({ mealName, items, date, addMeal }: { mealName: string; items: any[]; date: string | null; addMeal: any }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMeal, setSelectedMeal] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const total = {
        calories: Math.round(items.reduce((sum, item) => sum + parseFloat(item.calories), 0)),
        protein: Math.round(items.reduce((sum, item) => sum + parseFloat(item.protein), 0)),
        carbs: Math.round(items.reduce((sum, item) => sum + parseFloat(item.carbs), 0)),
        fat: Math.round(items.reduce((sum, item) => sum + parseFloat(item.fat), 0)),
    };

    const submitData = (data: any) => {
        setOpenDialog(false);
        addMeal(data);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Utensils className="h-5 w-5" />
                            <CardTitle className="capitalize">{mealName}</CardTitle>
                            <Badge variant="secondary">{items.length} items</Badge>
                        </div>
                        <Dialog open={openDialog}>
                            <DialogTrigger asChild>
                                <Button size="sm" onClick={() => setOpenDialog(true)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Food
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Food to {mealName}</DialogTitle>
                                    <DialogDescription>Search for foods or add custom entries</DialogDescription>
                                </DialogHeader>
                                <FoodForm onsubmit={(data) => submitData(data)} date={date || ''} meal={mealName} />
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                                <div className="text-left">
                                    <div className="font-semibold">{item.name} - {item.calories} kcal</div>
                                    <div className="text-xs text-muted-foreground">
                                        P: {item.protein}g • C: {item.carbs}g • F: {item.fat}g
                                    </div>
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        axios
                                            .post(route('meals.destroy'), {
                                                id: item.id,
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
                        ))}

                        {items.length > 0 ? (
                            <>
                                <Separator />
                                <div className="flex items-center justify-between rounded-lg bg-primary/5 p-3">
                                    <div className="font-semibold capitalize">{mealName} Total</div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold">{total.calories} kcal</div>
                                        <div className="text-sm text-muted-foreground">
                                            P: {total.protein}g • C: {total.carbs}g • F: {total.fat}g
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground">No records found for {mealName}.</div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default MealCard;
