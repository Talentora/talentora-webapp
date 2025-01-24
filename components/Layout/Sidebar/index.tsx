'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BriefcaseIcon, Users, User, HelpCircle, Sparkles, HomeIcon, LogOut, SettingsIcon, CreditCard, ChevronLeft, ChevronRight, Sun, Moon, Loader2 } from 'lucide-react';

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
import { useSidebarData } from '@/hooks/useSidebarData';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandDialog } from '@/components/ui/command';
import { BotWithJobs } from '@/types/custom';

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

const SidebarLink = ({ href, icon: Icon, children, isActive, isSidebarOpen, hasDropdown, isDropdownOpen, onDropdownClick }: SidebarLinkProps) => (
  <SidebarMenuItem>
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="hover:bg-primary-dark/10 transition-colors"
    >
      <Link href={href} className="flex items-center gap-3 text-black dark:text-white">
        <Icon className="h-5 w-5 text-black hover:text-black/40 dark:text-white dark:hover:text-white/40" />
        {isSidebarOpen && <span className="font-medium text-black dark:text-white">{children}</span>}
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
    className="block text-sm text-black/70 hover:text-black/40 transition-colors py-1 dark:text-white/70 dark:hover:text-white/40"
  >
    {children}
  </Link>
);

interface Job {
  id: string;
  name: string;
}

interface Candidate {
  first_name?: string;
  last_name?: string;
}

interface Application {
  id: string;
}

interface ApplicationWithCandidate {
  candidate?: Candidate;
  application: Application;
}

interface Bot {
  id: string;
  name?: string;
}

const Sidebar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isJobsOpen, setIsJobsOpen] = useState(true);
  const [isApplicantsOpen, setIsApplicantsOpen] = useState(true);
  const [isBotsOpen, setIsBotsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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
        // setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = async (href: string) => {
    setIsRouteLoading(true);
    console.log('Navigating to:', href);
    try {
      // // Set up route change handler before navigation
      // const handleRouteComplete = () => {
      //   setIsRouteLoading(false);
      //   setIsSearchOpen(false);
      //   // Clean up event listener
      //   router.events.off('routeChangeComplete', handleRouteComplete);
      // };

      // router.events.on('routeChangeComplete', handleRouteComplete);

      await router.push(href);
      setIsRouteLoading(false);
      setIsSearchOpen(false);
    } catch (error) {
      // Reset states if navigation fails
      setIsRouteLoading(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <SidebarProvider defaultOpen>
      <SidebarComponent className=" bg-white dark:bg-black">
        <SidebarHeader className="relative p-4">
   
          
        </SidebarHeader>

        <SidebarContent className="mt-20 flex-1 p-4">
          <SidebarMenu className="space-y-2">
            {!isSidebarOpen ? (
              <Button
                variant="ghost" 
                size="icon"
                className="w-10 h-10 flex items-center justify-center text-white bg-white/10 hover:bg-white/20 border border-white/20"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full h-10 flex items-center justify-start gap-2 text-white bg-white/10 hover:bg-white/20 rounded-lg border border-white/20"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
                <span>Search (⌘+K)</span>
              </Button>
            )}

            <SidebarLink href="/dashboard" icon={HomeIcon} isActive={pathname === '/dashboard'} isSidebarOpen={isSidebarOpen}>
              <span className="text-black dark:text-white">Dashboard</span>
            </SidebarLink>
            <SidebarLink href="/jobs" icon={BriefcaseIcon} isActive={pathname === '/jobs'} isSidebarOpen={isSidebarOpen}>
              <span className="text-black dark:text-white">Jobs</span>
            </SidebarLink>
            {isSidebarOpen && (
              <div className="ml-1 mt-1 space-y-1">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-black/70 dark:text-white/70" />
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
            {isSidebarOpen && isApplicantsOpen && (
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-black/70 dark:text-white/70" />
                  </div>
                ) : (
                  filteredItems
                    .filter(item => item.type === 'applicant')
                    .map((applicant, index) => (
                      <SubLink key={index} href={applicant.href}>
                        {applicant.name}
                      </SubLink>
                    ))
                )}
              </div>
            )}
            <SidebarLink 
              href="/settings" 
              icon={SettingsIcon} 
              isActive={pathname.startsWith('/settings')} 
              isSidebarOpen={isSidebarOpen}
              hasDropdown={true}
              isDropdownOpen={isSettingsOpen}
              onDropdownClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              Settings
            </SidebarLink>
            {isSidebarOpen && isSettingsOpen && (
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                <SubLink href="/settings?tab=account">
                  Account
                </SubLink>
                <SubLink href="/settings?tab=company">
                  Company
                </SubLink>
                <SubLink href="/settings?tab=billing">
                  Billing
                </SubLink>
                <SubLink href="/settings?tab=team">
                  Team
                </SubLink>
                <SubLink href="/settings?tab=integrations">
                  Integration Status
                </SubLink>
              </div>
            )}
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <div className="relative" ref={userMenuRef}>
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full justify-start gap-3 text-black hover:bg-primary-dark/10 dark:text-white dark:hover:bg-primary-dark/10"
            >
              <User className="h-5 w-5" />
              {isSidebarOpen && <span className="font-medium truncate">{user?.user_metadata.full_name || user?.email}</span>}
            </Button>

            {isUserMenuOpen && (
  <div
    className={cn(
      "absolute bottom-full mb-2 rounded-lg bg-foreground p-5 shadow-xl left-0 w-[18rem]",
      isSidebarOpen ? "left-0 w-full" : "",
      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'
    )}
  >
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

      {/* Menu links section */}
      <div>
      <Link href="/settings"
          variant="ghost"
          size="sm"
          className="w-full inline-flex pb-2 justify-start text-[0.875em] text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={() => router.push('/profile')}
        >
          <User className="text-black mr-[0.5em] h-[1em] w-[1em]" />
          Profile
        </Link>
         <Link href="/settings"
          variant="ghost"
          size="sm"
          className="w-full inline-flex pb-2 justify-start text-[0.875em] text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={() => router.push('/settings')}
        >
          <SettingsIcon className="text-black mr-[0.5em] h-[1em] w-[1em]" />
          Settings
        </Link>
         <Link href="/pricing"
          variant="ghost"
          size="sm"
          className="w-full inline-flex pb-2 justify-start text-[0.875em] text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
          onClick={() => router.push('/subscriptions')}
        >
          <CreditCard className="mr-[0.5em] h-[1em] w-[1em]" />
          Subscriptions
        </Link>
        <Link 
        href="/pricing" 
        className="w-full inline-flex justify-start text-[0.875em] text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
      >
        <HelpCircle className="mr-[0.5em] h-[1em] w-[1em]" />
        Help
      </Link>
      </div>

      <div className="h-[1px] bg-gray-200" />

      <form onSubmit={handleSignOut}>
        <input type="hidden" name="pathName" value={pathname} />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="w-full justify-start text-[0.875em] text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
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
