'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Logo from '@/components/ui/icons/Logo';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import { Button } from '@/components/ui/button';
import { User, LogOut, BarChart2, Users, FileText, HelpCircle, BookOpen, MessageSquare, Building2, Mail, CreditCard } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import Profile from '@/components/Layout/Profile';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/utils/cn';

const Loader2 = dynamic(() => import('lucide-react').then(mod => mod.Loader2), { ssr: false });

export default function Navlinks({ visible }: { visible: boolean }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, recruiter, loading } = useUser();

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
    <div className="sticky top-0 z-40 w-full bg-transparent">
      <div className="container px-4 mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            {!visible && (
            <Link href="/" className="mr-6 flex items-center space-x-2" aria-label="Logo">
              <Logo />
              <h1 className="text-primary text-2xl font-bold">
                Talent
                <span className="font-bold bg-gradient-to-r from-primary-dark to-pink-500 bg-clip-text text-transparent">
                  ora
                </span>
              </h1>
            </Link>
            )}

            <NavigationMenu>
              <NavigationMenuList>
                {user && !recruiter && (
                  <NavigationMenuItem>
                    <Link href="/dashboard" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
                      Dashboard
                    </Link>
                  </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <Link href="/product#ai-interviews" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">

                          <div className="flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2 text-purple-600" />
                            <h3 className="font-medium">AI Interviews</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Automated candidate screening and assessment</p>
                        </Link>
                        <Link href="/product#analytics" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">

                          <div className="flex items-center">
                            <Users className="h-5 w-5 mr-2 text-blue-600" />
                            <h3 className="font-medium">Analytics</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Data-driven hiring insights and metrics</p>
                        </Link>
                        <Link href="/product#assessments" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">

                          <div className="flex items-center">
                            <FileText className="h-5 w-5 mr-2 text-green-600" />
                            <h3 className="font-medium">Assessments</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Standardized skills evaluation</p>
                        </Link>
                        <Link href="/product#collaboration" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">

                          <div className="flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
                            <h3 className="font-medium">Collaboration</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">Team feedback and hiring decisions</p>
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] bg-white rounded-lg">
                      <Link href="/blog" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                          <h3 className="font-medium">Blog</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Latest insights and updates</p>
                      </Link>
                      <Link href="/help" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <HelpCircle className="h-5 w-5 mr-2 text-red-600" />
                          <h3 className="font-medium">Help Center</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Guides and documentation</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-3 p-6 w-[400px] bg-white rounded-lg">
                      <Link href="/about" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                          <h3 className="font-medium">About</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Learn about our mission and values</p>
                      </Link>
                      <Link href="/team" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2 text-blue-600" />
                          <h3 className="font-medium">Team</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Meet the people behind Talentora</p>
                      </Link>
                      <Link href="/pricing" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                          <h3 className="font-medium">Pricing</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">View our pricing plans</p>
                      </Link>
                      <Link href="/contact" className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-2 text-orange-600" />
                          <h3 className="font-medium">Contact</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">Get in touch with us</p>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <div className="flex items-center space-x-4">
            {!user ? (
              <div className="flex items-center space-x-2">
                <Link href="/signin">
                  <Button variant="ghost" className="rounded-full px-8">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="rounded-full px-8">Sign Up</Button>
                </Link>
              </div>
            ) : (
              <Profile />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
