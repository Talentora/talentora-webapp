'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BriefcaseIcon, Users, User, Sparkles, HomeIcon, LogOut, SettingsIcon, ChevronLeft, ChevronRight, Sun, Moon, Loader2, ChevronDown, ChevronUp, Search, CreditCard, Box, Mail, BookOpen, Building2, Phone } from 'lucide-react';

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
    <div className="flex items-center">
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className="hover:bg-primary-dark/10 transition-colors flex-1"
      >
        <Link href={href} className="flex items-center gap-3 text-white">
          <Icon className="h-5 w-5 text-white" />
          {isSidebarOpen && <span className="font-medium text-white">{children}</span>}
        </Link>
      </SidebarMenuButton>
      {hasDropdown && isSidebarOpen && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDropdownClick}
          className="ml-2 p-1 hover:bg-primary-dark/10"
        >
          {isDropdownOpen ? (
            <ChevronUp className="h-4 w-4 text-white" />
          ) : (
            <ChevronDown className="h-4 w-4 text-white" />
          )}
        </Button>
      )}
    </div>
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
  const { jobs, applications, bots, isLoading, isError } = useSidebarData();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

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

  const handleSignOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (getRedirectMethod() === 'client') {
      await handleRequest(e, SignOut, router);
    }
  };

  // Generate search items from all available pages/resources
  const searchItems = [
    {
      group: 'Pages',
      items: [
        { type: 'page', name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { type: 'page', name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
        { type: 'page', name: 'Applicants', href: '/applicants', icon: Users },
        { type: 'page', name: 'Settings', href: '/settings', icon: SettingsIcon },
        { type: 'page', name: 'Blog', href: '/blog', icon: BookOpen },
        { type: 'page', name: 'Contact', href: '/contact', icon: Mail },
        { type: 'page', name: 'Pricing', href: '/pricing', icon: CreditCard },
        { type: 'page', name: 'Ora Scouts', href: '/bot', icon: Sparkles },
        { type: 'page', name: 'Product', href: '/product', icon: Box }
      ]
    },
    {
      group: 'Suggested',
      items: [
        ...(jobs?.map((job: Job) => ({
          type: 'job', 
          name: job.name || 'Untitled Position',
          href: `/jobs/${job.id}`,
          icon: BriefcaseIcon
        })) || []),
        ...(applications?.map((app: ApplicationWithCandidate) => ({
          type: 'applicant',
          name: `${app.candidate?.first_name} ${app.candidate?.last_name}`,
          href: `/applicants/${app.application.id}`,
          icon: User
        })) || []),
        ...(bots?.map((bot: BotWithJobs) => ({
          type: 'bot',
          name: bot.name || 'Untitled Bot', 
          href: `/bot/${bot.id}`,
          icon: Sparkles
        })) || [])
      ]
    }
  ];

  const filteredItems = searchItems.flatMap(group => 
    group.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

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
    <SidebarProvider defaultOpen className="=">
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput 
          placeholder="Type a command or search..." 
          className="border-gray-300 text-gray-900 placeholder:text-gray-500"
        />
        <CommandList className="bg-white">
          {searchItems.map((group) => (
            <CommandGroup 
              key={group.group} 
              heading={group.group}
              className="text-gray-900 bg-gray-50"
            >
              {group.items
                .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <CommandItem
                      key={index}
                      onSelect={() => handleNavigation(item.href)}
                      className="hover:bg-gray-100 text-gray-900 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <Icon className="mr-2 h-4 w-4 text-gray-600" />
                        <span className="text-gray-900">{item.name}</span>
                      </div>
                      {isRouteLoading && item.href === pathname && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-600 ml-2" />
                      )}
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>

      <SidebarComponent className={cn(
        "bg-primary-dark transition-all duration-300 ease-in-out z-50",
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
              <TooltipContent side="right" className="bg-foreground text-primary-dark z-[100]">
                {isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </SidebarHeader>

        <SidebarContent className="flex-1 p-2">
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
              <span className="text-white">Dashboard</span>
            </SidebarLink>
            <SidebarLink 
              href="/jobs" 
              icon={BriefcaseIcon} 
              isActive={pathname === '/jobs'} 
              isSidebarOpen={isSidebarOpen}
              hasDropdown={true}
              isDropdownOpen={isJobsOpen}
              onDropdownClick={() => setIsJobsOpen(!isJobsOpen)}
            >
              <span className="text-white">Jobs</span>
            </SidebarLink>
            {isSidebarOpen && isJobsOpen && (
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  </div>
                ) : (
                  filteredItems
                    .filter(item => item.type === 'job')
                    .map((job, index) => (
                      <SubLink key={index} href={job.href}>
                        {job.name}
                      </SubLink>
                    ))
                )}
              </div>
            )}
            <SidebarLink 
              href="/bot" 
              icon={Sparkles} 
              isActive={pathname === '/bot'} 
              isSidebarOpen={isSidebarOpen}
              hasDropdown={true}
              isDropdownOpen={isBotsOpen}
              onDropdownClick={() => setIsBotsOpen(!isBotsOpen)}
            >
              Ora Scouts
            </SidebarLink>
            {isSidebarOpen && isBotsOpen && (
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
                  </div>
                ) : (
                  filteredItems
                    .filter(item => item.type === 'bot')
                    .map((bot, index) => (
                      <SubLink key={index} href={bot.href}>
                        {bot.name}
                      </SubLink>
                    ))
                )}
              </div>
            )}
            <SidebarLink 
              href="/applicants" 
              icon={Users} 
              isActive={pathname === '/applicants'} 
              isSidebarOpen={isSidebarOpen}
              hasDropdown={true}
              isDropdownOpen={isApplicantsOpen}
              onDropdownClick={() => setIsApplicantsOpen(!isApplicantsOpen)}
            >
              Applicants
            </SidebarLink>
            {isSidebarOpen && isApplicantsOpen && (
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-white/20 pl-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-white/70" />
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
                      <Link href="/settings?tab=account" className="inline-flex items-center rounded-full bg-purple-100 px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-purple-800 capitalize hover:bg-purple-200">
                        {user?.user_metadata?.role || 'User'}
                      </Link>
                      {company?.name && (
                        <Link href="/settings?tab=company" className="inline-flex items-center rounded-full bg-blue-100 px-[0.5em] py-[0.125em] text-[0.75em] font-medium text-blue-800 hover:bg-blue-200">
                          {company.name}
                        </Link>
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
