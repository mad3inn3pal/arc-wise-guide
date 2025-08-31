import { useState } from "react";
import { Search, Bell, ChevronDown, Building, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UsageMeter from "@/components/UsageMeter";

interface AppHeaderProps {
  user: any;
  orgName?: string;
  usage?: {
    plan: string;
    included: number;
    used: number;
    overage: number;
    overageRate: number;
  };
}

const AppHeader = ({ user, orgName = "Your Organization", usage }: AppHeaderProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGlobalSearch = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(true);
    }
  };

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Logo */}
            <Link to="/app" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">ARC Copilot</span>
            </Link>

            {/* Center: Global Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search submissions, properties, documents... (Cmd+K)"
                  className="pl-10 bg-muted/50"
                  onKeyDown={handleGlobalSearch}
                  onFocus={() => setSearchOpen(true)}
                />
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-4">
              {/* Org Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Building className="h-4 w-4" />
                    <span className="hidden sm:inline">{orgName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem>
                    <Building className="h-4 w-4 mr-2" />
                    {orgName}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Organization Settings</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Plan & Usage */}
              {usage && (
                <div className="hidden md:block">
                  <UsageMeter {...usage} />
                </div>
              )}

              {/* Notifications */}
              <Sheet open={auditOpen} onOpenChange={setAuditOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                      3
                    </Badge>
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-80 sm:w-96 bg-popover">
                  <SheetHeader>
                    <SheetTitle>Recent Activity</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    <div className="text-sm text-muted-foreground">
                      No recent activity to display.
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover">
                  <DropdownMenuItem className="flex-col items-start">
                    <div className="font-medium">{user?.email}</div>
                    <div className="text-xs text-muted-foreground">Organization Admin</div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Banner */}
        <div className="border-t border-border bg-muted/30 px-6 py-2">
          <div className="container mx-auto">
            <div className="flex items-center justify-between text-sm">
              <Badge variant="secondary" className="bg-warning/20 text-warning-foreground border-warning/20">
                Draft for Human Review — Not legal advice
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Sheet */}
      <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
        <SheetContent side="top" className="h-96 bg-popover">
          <SheetHeader>
            <SheetTitle>Global Search</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <Input
              placeholder="Search submissions, properties, documents..."
              className="mb-4"
              autoFocus
            />
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Recent Searches</h4>
                <div className="text-sm text-muted-foreground">
                  No recent searches
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AppHeader;