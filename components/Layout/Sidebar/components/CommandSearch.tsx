import { Button } from "@/components/ui/button";
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface CommandSearchProps {
  isSidebarOpen: boolean;
  searchItems: Array<{
    group: string;
    items: Array<{
      name: string;
      href: string;
      icon: any;
      type: string;
    }>;
  }>;
}

export function CommandSearch({ isSidebarOpen, searchItems }: CommandSearchProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleNavigation = async (href: string) => {
    setIsRouteLoading(true);
    try {
      await router.push(href);
      setIsRouteLoading(false);
      setIsSearchOpen(false);
    } catch (error) {
      setIsRouteLoading(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput 
          placeholder="Type a command or search..."
          className=" border-border text-foreground placeholder:text-muted-foreground"
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList className="bg-background">
          {searchItems.map((group) => (
            <CommandGroup 
              key={group.group} 
              heading={group.group}
              className="text-foreground bg-background"
            >
              {group.items
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={index}
                      onSelect={() => handleNavigation(item.href)}
                      className="hover:bg-accent text-foreground flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{item.name}</span>
                      </div>
                      {isRouteLoading && (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
                      )}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      {!isSidebarOpen ? (
        <Button
          variant="ghost" 
          size="icon"
          className="w-10 h-10 flex items-center justify-center text-white bg-accent/10 border border-border"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          className="w-full h-10 flex items-center justify-start gap-2 text-white bg-white/5 rounded-lg border border-border"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="h-5 w-5" />
          <span>Search (⌘+K)</span>
        </Button>
      )}
    </>
  );
} 