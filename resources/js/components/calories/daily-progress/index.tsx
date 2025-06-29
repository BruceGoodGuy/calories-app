import CircularProgress from '@/components/calories/circular-progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Target, Zap } from 'lucide-react';

interface DailyGoals {
    calories: { current: number; target: number };
    protein: { current: number; target: number };
    carbs: { current: number; target: number };
    fat: { current: number; target: number };
}

interface DailyProgressProps {
    dailyGoals: DailyGoals;
}

const DailyProgress: React.FC<DailyProgressProps> = ({ dailyGoals }) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4" />
                        Calories
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CircularProgress value={dailyGoals.calories.current} max={dailyGoals.calories.target} label="kcal" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Zap className="h-4 w-4" />
                        Protein
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CircularProgress value={dailyGoals.protein.current} max={dailyGoals.protein.target} label="g" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Activity className="h-4 w-4" />
                        Carbs
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CircularProgress value={dailyGoals.carbs.current} max={dailyGoals.carbs.target} label="g" />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium">
                        <Target className="h-4 w-4" />
                        Fat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <CircularProgress value={dailyGoals.fat.current} max={dailyGoals.fat.target} label="g" />
                </CardContent>
            </Card>
        </div>
    );
};

export default DailyProgress;
