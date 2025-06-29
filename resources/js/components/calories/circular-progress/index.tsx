const CircularProgress = ({ value, max, label, color = 'bg-primary' }: { value: number; max: number; label: string; color?: string }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative h-24 w-24">
                <svg className="h-24 w-24 -rotate-90 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted-foreground/20" />
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className={`${color} transition-all duration-300`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">{value}</span>
                    <span className="text-xs text-muted-foreground">/{max}</span>
                </div>
            </div>
            <span className="mt-2 text-sm font-medium">{label}</span>
        </div>
    );
};

export default CircularProgress;
