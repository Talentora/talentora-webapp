import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import Logo from "@/public/favicon.png"
import Image from "next/image";

interface SidebarHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export function SidebarHeader({ isSidebarOpen, setIsSidebarOpen }: SidebarHeaderProps) {
  return (
    <div className="relative p-3">
      <Link href="/" className={cn(
        "flex items-center gap-3",
        !isSidebarOpen && "justify-center"
      )} aria-label="Logo">
        <Image src={Logo} alt="Logo" width={32} height={32} />
        {isSidebarOpen && (
          <h1 className="text-xl font-bold font-poppins text-white">
            Talent
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ora
            </span>
          </h1>
        )}
      </Link>
      {/* <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary border-border rounded-full"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? 
                <ChevronLeft className="h-5 w-5 text-primary-foreground" /> : 
                <ChevronRight className="h-5 w-5 text-primary-foreground" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-background text-foreground z-[100]">
            {isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}
    </div>
  );
}