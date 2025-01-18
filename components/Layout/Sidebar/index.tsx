'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BriefcaseIcon, Users, User, Sparkles, HomeIcon, LogOut, SettingsIcon, ChevronLeft, ChevronRight, Sun, Moon } from 'lucide-react';
import Logo from '@/components/ui/icons/Logo';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  Sidebar as SidebarComponent
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { useTheme } from 'next-themes';

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
}

const SidebarLink = ({ href, icon: Icon, children, isActive }: SidebarLinkProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="hover:bg-sidebar-accent/10 transition-colors"
    >
      <Link href={href} className="flex items-center gap-3 text-sidebar-foreground">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{children}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

interface SubLinkProps {
  href: string;
  children: React.ReactNode;
}

const SubLink = ({ href, children }: SubLinkProps) => (
  <Link 
    href={href} 
    className="block text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors py-1 pl-11"
  >
    {children}
  </Link>
);

const Sidebar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user } = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      await handleRequest(e, SignOut, router);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <SidebarProvider defaultOpen>
      <SidebarComponent className={cn(
        "bg-sidebar transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <SidebarHeader className="border-b border-sidebar-border relative p-4">
          <Link href="/" className={cn(
            "flex items-center gap-3",
            !isSidebarOpen && "justify-center"
          )} aria-label="Logo">
            <Logo className="h-8 w-8 text-accent" />
            {isSidebarOpen && (
              <h1 className="text-xl font-bold font-poppins">
                Talent
                <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                  ora
                </span>
              </h1>
            )}
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-4 top-1/2 -translate-y-1/2 bg-sidebar border border-sidebar-border rounded-full"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarHeader>

        <SidebarContent className="flex-1 p-4">
          <SidebarMenu className="space-y-2">
            <SidebarLink href="/dashboard" icon={HomeIcon} isActive={pathname === '/dashboard'}>
              Dashboard
            </SidebarLink>
            <SidebarLink href="/jobs" icon={BriefcaseIcon} isActive={pathname === '/jobs'}>
              All Jobs
            </SidebarLink>
            {isSidebarOpen && (
              <div className="ml-5 mt-1 space-y-1">
                <SubLink href="/jobs/senior-developer">Senior Developer</SubLink>
                <SubLink href="/jobs/product-manager">Product Manager</SubLink>
              </div>
            )}
            <SidebarLink href="/bot" icon={Sparkles} isActive={pathname === '/bot'}>
              Ora Scouts
            </SidebarLink>
            <SidebarLink href="/applicants" icon={Users} isActive={pathname === '/applicants'}>
              Applicants
            </SidebarLink>
            {isSidebarOpen && (
              <div className="ml-5 mt-1 space-y-1">
                <SubLink href="/applicants/john-doe">John Doe - Senior Dev</SubLink>
                <SubLink href="/applicants/jane-smith">Jane Smith - PM</SubLink>
                <SubLink href="/applicants/mike-jones">Mike Jones - Designer</SubLink>
              </div>
            )}
            <SidebarLink href="/settings" icon={SettingsIcon} isActive={pathname === '/settings'}>
              Settings
            </SidebarLink>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent/10"
            >
              <User className="h-5 w-5" />
              {isSidebarOpen && <span className="font-medium truncate">{user?.user_metadata.full_name || user?.email}</span>}
            </Button>

            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg border border-sidebar-border bg-sidebar p-3 shadow-lg">
                <div className="px-2 py-2">
                  <p className="text-sm font-medium text-sidebar-foreground/60">Signed in as</p>
                  <p className="text-sm font-bold truncate text-sidebar-foreground">{user?.user_metadata.full_name || user?.email}</p>
                  <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.user_metadata?.role}</p>
                </div>
                <div className="my-2 border-t border-sidebar-border" />
                <form onSubmit={handleSignOut}>
                  <input type="hidden" name="pathName" value={pathname} />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-sm text-sidebar-foreground hover:bg-sidebar-accent/10"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    Sign out
                  </Button>
                </form>
              </div>
            )}
          </div>
       
        </SidebarFooter>
      </SidebarComponent>
    </SidebarProvider>
  );
};

export default Sidebar;
