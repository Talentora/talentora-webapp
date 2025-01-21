'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BriefcaseIcon, Users, User, Sparkles, HomeIcon, LogOut, SettingsIcon, ChevronLeft, ChevronRight, Sun, Moon, Loader2 } from 'lucide-react';

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
import { useSidebarData } from '@/hooks/useSidebarData';

interface SidebarLinkProps {
  href: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isActive: boolean;
  isSidebarOpen?: boolean;
}

const SidebarLink = ({ href, icon: Icon, children, isActive, isSidebarOpen }: SidebarLinkProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="hover:bg-primary-dark/10 transition-colors"
    >
      <Link href={href} className="flex items-center gap-3 text-white">
        <Icon className="h-5 w-5 text-white" />
        {isSidebarOpen && <span className="font-medium text-white">{children}</span>}
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
    className="block text-sm text-white/70 hover:text-white transition-colors py-1 pl-11"
  >
    {children}
  </Link>
);

const Sidebar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, company } = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { jobs, applications, isLoading } = useSidebarData();


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
        "bg-primary-dark transition-all duration-300 ease-in-out",
        isSidebarOpen ? "w-50" : "w-20"
      )}>
        <SidebarHeader className="relative p-4">
          <Link href="/" className={cn(
            "flex items-center gap-3",
            !isSidebarOpen && "justify-center"
          )} aria-label="Logo">
            <Logo className="h-8 w-8 text-white" />
            {isSidebarOpen && (
              <h1 className="text-xl font-bold font-poppins text-white">
                Talent
                <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">
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
                  className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary-dark border border-primary-border rounded-full"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <ChevronLeft className="h-5 w-5 text-white" /> : <ChevronRight className="h-5 w-5 text-white" />}
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
            <SidebarLink href="/dashboard" icon={HomeIcon} isActive={pathname === '/dashboard'} isSidebarOpen={isSidebarOpen}>
              <span className="text-white">Dashboard</span>
            </SidebarLink>
            <SidebarLink href="/jobs" icon={BriefcaseIcon} isActive={pathname === '/jobs'} isSidebarOpen={isSidebarOpen}>
              <span className="text-white">Jobs</span>
            </SidebarLink>
            {isSidebarOpen && (
              <div className="ml-1 mt-1 space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  </div>
                ) : (
                  jobs.map((job: any) => (
                    <SubLink key={job.id} href={`/jobs/${job.id}`}>
                      {job.name || 'Untitled Position'}
                    </SubLink>
                  ))
                )}

              </div>
            )}
            <SidebarLink href="/bot" icon={Sparkles} isActive={pathname === '/bot'} isSidebarOpen={isSidebarOpen}>
              Ora Scouts
            </SidebarLink>
            <SidebarLink href="/applicants" icon={Users} isActive={pathname === '/applicants'} isSidebarOpen={isSidebarOpen}>
              Applicants
            </SidebarLink>
            {isSidebarOpen && (
              <div className="ml-1 mt-1 space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  </div>
                ) : (
                  applications.map((app: any) => (
                    <SubLink key={app.application.id} href={`/applicants/${app.application.id}`}>
                      {app.candidate?.first_name} {app.candidate?.last_name}
                    </SubLink>
                  ))
                )}

              </div>
            )}
            <SidebarLink href="/settings" icon={SettingsIcon} isActive={pathname === '/settings'} isSidebarOpen={isSidebarOpen}>
              Settings
            </SidebarLink>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full justify-start gap-3 text-white hover:bg-primary-dark/10"
            >
              <User className="h-5 w-5" />
              {isSidebarOpen && <span className="font-medium truncate">{user?.user_metadata.full_name || user?.email}</span>}
            </Button>

            {isUserMenuOpen && (
              <div className={cn(
                "absolute bottom-full mb-2 rounded-lg bg-foreground p-5 shadow-xl left-0 w-[18rem]",
                isSidebarOpen ? "left-0 w-full" : ""
              )}>
                <div className="space-y-[0.75em]">
                  <div>
                    <h4 className="font-medium text-gray-900 text-[1em]">
                      {user?.user_metadata.full_name || user?.email}
                    </h4>
                    <div className="flex items-center gap-[0.5em] mt-[0.25em]">
                      <span className="inline-flex items-center rounded-full bg-purple-100 px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-purple-800 capitalize">
                        {user?.user_metadata?.role || 'User'}
                      </span>
                      {company?.name && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-blue-800">
                          {company.name}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="h-[1px] bg-gray-200" />
                  
                  <form onSubmit={handleSignOut}>
                    <input type="hidden" name="pathName" value={pathname} />
                    <Button 
                      type="submit" 
                      variant="ghost" 
                      size="sm"
                      className="w-full justify-start text-[0.875em] text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <LogOut className="mr-[0.5em] h-[1em] w-[1em]" />
                      Sign out
                    </Button>
                  </form>
                </div>

              </div>
            )}
          </div>
       
        </SidebarFooter>
      </SidebarComponent>
    </SidebarProvider>
  );
};

export default Sidebar;
