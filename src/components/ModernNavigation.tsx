import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UsageMeter from "@/components/UsageMeter";
import { Building, Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ModernNavigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const solutions = [
    { name: "Architectural Review", href: "/demo", description: "AI-powered compliance checking" },
    { name: "Meeting Mode", href: "/demo", description: "Jurisdiction-aware governance" },
    { name: "Decision Packets", href: "/demo", description: "Automated board reports" }
  ];

  const resources = [
    { name: "How It Works", href: "/how-it-works" },
    { name: "Security", href: "/security" },
    { name: "Pricing", href: "/pricing" }
  ];

  const company = [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Status", href: "/status" }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ARC Copilot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary group">
                  Solutions
                  <ChevronDown className="ml-2 h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 bg-card border border-white/10 shadow-elevated">
                {solutions.map((item) => (
                  <DropdownMenuItem key={item.name} asChild className="p-4">
                    <Link to={item.href} className="block">
                      <div className="font-medium text-card-foreground">{item.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary group">
                  Resources
                  <ChevronDown className="ml-2 h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border border-white/10 shadow-elevated">
                {resources.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      to={item.href} 
                      className={`block px-4 py-2 ${isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-card-foreground'}`}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Company Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary group">
                  Company
                  <ChevronDown className="ml-2 h-4 w-4 group-data-[state=open]:rotate-180 transition-transform" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-card border border-white/10 shadow-elevated">
                {company.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      to={item.href} 
                      className={`block px-4 py-2 ${isActive(item.href) ? 'bg-primary/10 text-primary' : 'text-card-foreground'}`}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4">
            <UsageMeter 
              plan="Growth"
              included={240}
              used={45}
              overage={0}
              overageRate={2.00}
            />
            <div className="flex items-center gap-3">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Login
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                asChild 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-2 shadow-glow hover:shadow-glow hover:scale-105 transition-all"
              >
                <Link to="/demo">Get a quote</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <div className="space-y-4">
              <div>
                <div className="font-semibold text-foreground mb-2">Solutions</div>
                <div className="pl-4 space-y-2">
                  {solutions.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-muted-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="font-semibold text-foreground mb-2">Resources</div>
                <div className="pl-4 space-y-2">
                  {resources.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-muted-foreground hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <Button 
                  asChild 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                    Get a quote
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavigation;