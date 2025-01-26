import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utils/cn";

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
  isSidebarOpen?: boolean;
  hasDropdown?: boolean;
  isDropdownOpen?: boolean;
  onDropdownClick?: () => void;
}

export function SidebarLink({ 
  href, 
  icon: Icon, 
  children, 
  isActive, 
  isSidebarOpen, 
  hasDropdown, 
  isDropdownOpen, 
  onDropdownClick 
}: SidebarLinkProps) {
  return (
    <div className="flex items-center">
      <div
        className={cn(
          "hover:bg-accent/10 transition-colors flex-1",
          isActive && "bg-primary text-primary-foreground"
        )}
      >
        <Link href={href} className="flex items-center gap-3 text-foreground p-2">
          <Icon className="h-5 w-5" />
          {isSidebarOpen && <span className="font-medium">{children}</span>}
        </Link>
      </div>
      {hasDropdown && isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDropdownClick}
          className="ml-2 p-3 hover:bg-accent/10"
        >
          {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4 text-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground" />
          )}
        </Button>
      )}
    </div>
  );
}

export function SubLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="block text-sm text-foreground/70 hover:text-foreground transition-colors py-1 pl-11"
    >
      {children}
    </Link>
  );
} 