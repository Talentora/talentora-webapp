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
    <div className="flex items-center rounded-lg ">
      <div
        className={cn(
          " transition-colors flex-1 rounded-md",
          isActive && "bg-accent/20 font-semibold"
        )}
      >
        <Link href={href} className="pl-4 flex  items-center gap-3 text-white p-2">
          <Icon className={cn(
            "h-5 w-5",
            isActive && "text-white",
            !isActive && "text-white"
          )} />
          {isSidebarOpen && <span>{children}</span>}
        </Link>
      </div>
      {hasDropdown && isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDropdownClick}
          className="ml-2 p-3 "
        >
          {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4 text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white" />
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
      className="block text-sm text-white transition-colors py-1 pl-3"
    >
      {children}
    </Link>
  );
} 