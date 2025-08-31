import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPIData {
  medianCycleDays: number;
  p95CycleDays: number;
  requestsThisWeek: number;
  overdue: number;
  needsInfoRate: number;
  outcomes: {
    pass: number;
    fail: number;
    needsInfo: number;
  };
}

interface KPIStripProps {
  data?: KPIData;
  isLoading?: boolean;
}

const KPICard = ({ 
  title, 
  value, 
  suffix = "", 
  trend, 
  trendValue, 
  variant = "default" 
}: {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  variant?: "default" | "warning" | "success" | "destructive";
}) => {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  const variantClasses = {
    default: "border-border",
    warning: "border-warning/20 bg-warning/5",
    success: "border-success/20 bg-success/5",
    destructive: "border-destructive/20 bg-destructive/5",
  };

  return (
    <Card className={cn("border transition-all hover:shadow-card", variantClasses[variant])}>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">{title}</div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-bold text-card-foreground">
              {value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{suffix}</span>
            </div>
            {trend && trendValue && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground"
              )}>
                <TrendIcon className="h-3 w-3" />
                {trendValue}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PassFailBar = ({ outcomes }: { outcomes: { pass: number; fail: number; needsInfo: number } }) => {
  const total = outcomes.pass + outcomes.fail + outcomes.needsInfo;
  if (total === 0) return <div className="h-2 bg-muted rounded-full" />;
  
  const passPercent = (outcomes.pass / total) * 100;
  const failPercent = (outcomes.fail / total) * 100;
  const needsInfoPercent = (outcomes.needsInfo / total) * 100;

  return (
    <div className="space-y-2">
      <div className="flex h-2 rounded-full overflow-hidden bg-muted">
        <div 
          className="bg-success" 
          style={{ width: `${passPercent}%` }}
        />
        <div 
          className="bg-destructive" 
          style={{ width: `${failPercent}%` }}
        />
        <div 
          className="bg-warning" 
          style={{ width: `${needsInfoPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Pass: {outcomes.pass}</span>
        <span>Fail: {outcomes.fail}</span>
        <span>Info: {outcomes.needsInfo}</span>
      </div>
    </div>
  );
};

const KPIStrip = ({ data, isLoading }: KPIStripProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-8 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KPICard title="Median Cycle Time" value="—" suffix="days" />
        <KPICard title="95th Percentile" value="—" suffix="days" />
        <KPICard title="Requests This Week" value="—" />
        <KPICard title="Overdue" value="—" variant="default" />
        <KPICard title="Needs-Info Rate" value="—" suffix="%" />
        <Card className="border">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Pass/Fail Split</div>
              <div className="h-2 bg-muted rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <KPICard 
        title="Median Cycle Time" 
        value={data.medianCycleDays.toFixed(1)} 
        suffix="days"
      />
      <KPICard 
        title="95th Percentile" 
        value={data.p95CycleDays.toFixed(1)} 
        suffix="days"
      />
      <KPICard 
        title="Requests This Week" 
        value={data.requestsThisWeek}
      />
      <KPICard 
        title="Overdue" 
        value={data.overdue}
        variant={data.overdue > 0 ? "destructive" : "default"}
      />
      <KPICard 
        title="Needs-Info Rate" 
        value={Math.round(data.needsInfoRate * 100)} 
        suffix="%"
        variant={data.needsInfoRate > 0.4 ? "warning" : "default"}
      />
      <Card className="border">
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">Pass/Fail Split</div>
            <PassFailBar outcomes={data.outcomes} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KPIStrip;