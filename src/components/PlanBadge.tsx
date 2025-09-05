import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Settings, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useBilling } from "@/hooks/useBilling";

const PlanBadge = () => {
  const { plan, isLoading } = useBilling();

  if (isLoading || !plan) {
    return <Badge variant="secondary">Loading...</Badge>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className="inline-flex items-center rounded-md border border-input bg-secondary px-3 py-1.5 text-sm font-semibold text-secondary-foreground shadow-sm cursor-pointer hover:bg-secondary/80 transition-colors border-2 border-muted z-50"
        >
          {plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1)} · {plan.seats.used}/{plan.included}
          <ChevronDown className="w-3 h-3 ml-1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border-2 border-border shadow-lg z-50">
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="flex items-center w-full">
            <Settings className="w-4 h-4 mr-2" />
            Manage Plan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center">
          <BarChart3 className="w-4 h-4 mr-2" />
          View Usage
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlanBadge;