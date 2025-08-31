import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Building, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ARC Copilot
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link
                    to="/product"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                      isActive("/product") ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}
                  >
                    Product
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link
                    to="/how-it-works"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                      isActive("/how-it-works") ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}
                  >
                    How It Works
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link
                    to="/pricing"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary px-3 py-2 rounded-md",
                      isActive("/pricing") ? "text-primary bg-primary/10" : "text-muted-foreground"
                    )}
                  >
                    Pricing
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            to="/docs"
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-primary p-6 no-underline outline-none focus:shadow-md"
                          >
                            <div className="mb-2 mt-4 text-lg font-medium text-primary-foreground">
                              Documentation
                            </div>
                            <p className="text-sm leading-tight text-primary-foreground/80">
                              Quickstarts, API specs, and integration guides.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/case-studies"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Case Studies</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Real community success stories with metrics.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/blog"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Blog</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Updates, guides, and ARC best practices.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/security"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Security</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Controls, compliance, and data protection.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/faq"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">FAQ</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Common questions and answers.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/demo">Book a Demo</Link>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t">
            <div className="space-y-3">
              <Link
                to="/product"
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Product
              </Link>
              <Link
                to="/how-it-works"
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-foreground mb-2">Resources</div>
                <div className="space-y-2 pl-4">
                  <Link
                    to="/docs"
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Documentation
                  </Link>
                  <Link
                    to="/case-studies"
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Case Studies
                  </Link>
                  <Link
                    to="/blog"
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    to="/security"
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Security
                  </Link>
                  <Link
                    to="/faq"
                    className="block text-sm text-muted-foreground hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    FAQ
                  </Link>
                </div>
              </div>
              <div className="px-3 pt-4 border-t">
                <div className="space-y-2">
                  <Button variant="ghost" asChild className="w-full justify-start">
                    <Link to="/login" onClick={() => setIsOpen(false)}>Log in</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/demo" onClick={() => setIsOpen(false)}>Book a Demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navigation;