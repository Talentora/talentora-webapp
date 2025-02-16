// Start of Selection
'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { BriefcaseIcon, Users, User, Sparkles, HomeIcon, LogOut, SettingsIcon, ChevronLeft, ChevronRight, Sun, Moon, Loader2, ChevronDown, ChevronUp, Search, CreditCard, Box, Mail, BookOpen, Building2, Phone } from 'lucide-react';

import { ThemeToggle } from '@/components/Layout/Sidebar/ThemeToggle';


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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { cn } from '@/utils/cn';
import { useSidebarData } from '@/hooks/useSidebarData';
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandDialog
} from '@/components/ui/command';
import { ScoutWithJobs } from '@/types/custom';
import { SidebarHeader as NewSidebarHeader } from './components/SidebarHeader';
import { CommandSearch } from './components/CommandSearch';
import { SidebarLink, SubLink } from './components/SidebarLink';

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

interface scout {
  id: string;
  name?: string;
}

const Sidebar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isJobsOpen, setIsJobsOpen] = useState(false);
  const [isApplicantsOpen, setIsApplicantsOpen] = useState(false);
  const [isScoutsOpen, setIsScoutsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { jobs, applications, scouts, isLoading, isError } = useSidebarData();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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

  // Generate search items from all available pages/resources
  const searchItems = [
    {
      group: 'Pages',
      items: [
        { type: 'page', name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { type: 'page', name: 'Jobs', href: '/jobs', icon: BriefcaseIcon },
        { type: 'page', name: 'Applicants', href: '/applicants', icon: Users },
        {
          type: 'page',
          name: 'Settings',
          href: '/settings',
          icon: SettingsIcon
        },
        { type: 'page', name: 'Blog', href: '/blog', icon: BookOpen },
        { type: 'page', name: 'Contact', href: '/contact', icon: Mail },
        { type: 'page', name: 'Pricing', href: '/pricing', icon: CreditCard },
        { type: 'page', name: 'Ora Scouts', href: '/scouts', icon: Sparkles },
        { type: 'page', name: 'Product', href: '/product', icon: Box }
      ]
    },
    {
      group: 'Suggested',
      items: [

        ...(Array.isArray(jobs) && jobs.length > 0
          ? jobs.map((job: Job) => ({
              type: 'job',
              name: job.name || 'Untitled Position',
              href: `/jobs/${job.id}`,
              icon: BriefcaseIcon
            }))
          : []),
        ...(Array.isArray(applications) && applications.length > 0
          ? applications.map((app: ApplicationWithCandidate) => ({
              type: 'applicant',
              name: `${app.candidate?.first_name || ''} ${app.candidate?.last_name || ''}`.trim() || 'No Applicant Name',
              href: `/applicants/${app.application.id}`,
              icon: User
            }))
          : []),
        ...(Array.isArray(scouts) && scouts.length > 0
          ? scouts.map((scout: ScoutWithJobs) => ({
              type: 'scout',
              name: scout.name || 'Untitled scout',
              href: `/scouts/${scout.id}`,
              icon: Sparkles
            }))
          : [])
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
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
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
      await router.push(href);
      setIsRouteLoading(false);
      setIsSearchOpen(false);
    } catch (error) {
      setIsRouteLoading(false);
      setIsSearchOpen(false);
    }
  };

  return (
    <SidebarProvider defaultOpen className="=">
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          className="border-border text-white "
        />
        <CommandList className="bg-background">

          {searchItems.map((group) => {
            const groupFilteredItems = group.items.filter(item =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return (
              <CommandGroup
                key={group.group}
                heading={group.group}
                className="text-white bg-background"
              >
                {groupFilteredItems.length > 0 ? (
                  groupFilteredItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <CommandItem
                        key={index}
                        onSelect={() => handleNavigation(item.href)}
                        className=" hover:bg-accent text-white flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-white">{item.name}</span>
                        </div>
                        {isRouteLoading && item.href === pathname && (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
                        )}
                      </CommandItem>
                    );
                  })
                ) : (
                  <CommandItem disabled className="cursor-default text-muted-foreground">
                    {group.group === 'Suggested' ? 'No suggestions available' : 'No items available'}
                  </CommandItem>
                )}
              </CommandGroup>
            );
          })}

        </CommandList>
      </CommandDialog>

      <SidebarComponent
        className={cn(
          "bg-sidebar text-white border-r border-border transition-all duration-300 ease-in-out z-50",
          isSidebarOpen ? "w-50" : "w-20"
        )}
      >
        <NewSidebarHeader
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <SidebarContent className="flex-1 p-2">
          <div className="space-y-2">
            <CommandSearch
              isSidebarOpen={isSidebarOpen}
              searchItems={searchItems}
            />

            <SidebarLink
              href="/dashboard"
              icon={HomeIcon}
              isActive={pathname === '/dashboard'}
              isSidebarOpen={isSidebarOpen}
            >
              Dashboard
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
              Jobs
            </SidebarLink>
            {isSidebarOpen && isJobsOpen && (
              <div className="ml-4 mt-2 space-y-1 border-l-2 border-border">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (

                  (() => {
                    const jobItems = filteredItems.filter(item => item.type === 'job');
                    return jobItems.length > 0 ? (
                      jobItems.map((job, index) => (
                        <SubLink key={index} href={job.href}>
                          {job.name}
                        </SubLink>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-muted-foreground">No jobs available</div>
                    );
                  })()

                )}
              </div>
            )}
            <SidebarLink
              href="/scouts"
              icon={Sparkles}
              isActive={pathname === '/scouts'}
              isSidebarOpen={isSidebarOpen}
              hasDropdown={true}
              isDropdownOpen={isScoutsOpen}
              onDropdownClick={() => setIsScoutsOpen(!isScoutsOpen)}
            >
              Ora Scouts
            </SidebarLink>
            {isSidebarOpen && isScoutsOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-border pl-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : (

                  (() => {
                    const scoutItems = filteredItems.filter(item => item.type === 'scout');
                    return scoutItems.length > 0 ? (
                      scoutItems.map((scout, index) => (
                        <SubLink key={index} href={scout.href}>
                          {scout.name}
                        </SubLink>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-muted-foreground">No Ora scouts available</div>
                    );
                  })()

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
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-border pl-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (

                  (() => {
                    const applicantItems = filteredItems.filter(item => item.type === 'applicant');
                    return applicantItems.length > 0 ? (
                      applicantItems.map((applicant, index) => (
                        <SubLink key={index} href={applicant.href}>
                          {applicant.name}
                        </SubLink>
                      ))
                    ) : (
                      <div className="px-2 py-1 text-sm text-muted-foreground">No applicants available</div>
                    );
                  })()

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
              <div className="ml-1 mt-1 space-y-1 border-l-2 border-border pl-3">

                <SubLink href="/settings?tab=account">
                  Account
                </SubLink>
                <SubLink href="/settings?tab=company">
                  Company
                </SubLink>
                {/* <SubLink href="/settings?tab=billing">
                  Billing
                </SubLink> */}
                {/* <SubLink href="/settings?tab=team">
                  Team
                </SubLink> */}

                <SubLink href="/settings?tab=integrations">
                  Integration Status
                </SubLink>
              </div>
            )}
          </div>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <ThemeToggle />
        </SidebarFooter>
      </SidebarComponent>
    </SidebarProvider>
  );
};

export default Sidebar;
// End of Selectio
