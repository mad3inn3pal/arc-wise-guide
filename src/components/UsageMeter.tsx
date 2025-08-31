import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface UsageMeterProps {
  plan: string;
  included: number;
  used: number;
  overage: number;
  overageRate: number;
}

const UsageMeter = ({ plan, included, used, overage, overageRate }: UsageMeterProps) => {
  const usagePercent = Math.min((used / included) * 100, 100);
  const isOverage = used > included;
  
  return (
    <Card className="w-80">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={plan === 'free' ? 'secondary' : plan === 'pro' ? 'default' : 'info'}>
              {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            {used} / {included} submissions
          </div>
        </div>
        
        <Progress 
          value={usagePercent} 
          className={`h-2 mb-2 ${isOverage ? 'bg-destructive/20' : ''}`}
        />
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>This month</span>
          {isOverage && (
            <span className="text-destructive">
              +{overage} overage (${(overage * overageRate).toFixed(2)})
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageMeter;