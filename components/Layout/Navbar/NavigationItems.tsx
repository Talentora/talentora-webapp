'use client';

import Link from 'next/link';
import { BarChart2, Users, FileText, MessageSquare, BookOpen, HelpCircle, Building2, Mail, CreditCard } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { cn } from '@/utils/cn';
import { ThemeToggle } from '@/components/Layout/Sidebar/ThemeToggle';


export function NavigationItems({ isUser, isRecruiter }: { isUser: boolean; isRecruiter: boolean }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {isUser && !isRecruiter && (
          <NavigationMenuItem>
            <Link href="/dashboard" className={cn(navigationMenuTriggerStyle(), "bg-transparent")}>
              Dashboard
            </Link>
          </NavigationMenuItem>
        )}
        <SolutionsMenu />
        <ResourcesMenu />
        <CompanyMenu />
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function SolutionsMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent">Solutions</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-2 w-[400px] md:w-[500px] lg:w-[600px] bg-white rounded-lg">
          <div className="grid grid-cols-2 gap-2 text-black">
            <NavigationLink 
              href="/product#ai-interviews" 
              icon={<BarChart2 className="h-5 w-5 mr-2 text-purple-600" />}
              title="AI Interviews"
              description="Automated candidate screening and assessment"
            />
            <NavigationLink 
              href="/product#analytics" 
              icon={<Users className="h-5 w-5 mr-2 text-blue-600" />}
              title="Analytics"
              description="Data-driven hiring insights and metrics"
            />
            <NavigationLink 
              href="/product#assessments" 
              icon={<FileText className="h-5 w-5 mr-2 text-green-600" />}
              title="Assessments"
              description="Standardized skills evaluation"
            />
            <NavigationLink 
              href="/product#collaboration" 
              icon={<MessageSquare className="h-5 w-5 mr-2 text-orange-600" />}
              title="Collaboration"
              description="Team feedback and hiring decisions"
            />
          </div>
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function ResourcesMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent">Resources</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-2 w-[400px] text-black bg-white rounded-lg">
          <NavigationLink 
            href="/blog" 
            icon={<BookOpen className="h-5 w-5 mr-2 text-indigo-600" />}
            title="Blog"
            description="Latest insights and updates"
          />
          <NavigationLink 
            href="/help" 
            icon={<HelpCircle className="h-5 w-5 mr-2 text-red-600" />}
            title="Help Center"
            description="Guides and documentation"
          />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

function CompanyMenu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger className="bg-transparent">Company</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid grid-cols-2 gap-3 p-2 w-[400px] text-black bg-white rounded-lg">
          <NavigationLink 
            href="/about" 
            icon={<Building2 className="h-5 w-5 mr-2 text-purple-600" />}
            title="About"
            description="Learn about our mission and values"
          />
          <NavigationLink 
            href="/team" 
            icon={<Users className="h-5 w-5 mr-2 text-blue-600" />}
            title="Team"
            description="Meet the people behind Talentora"
          />
          <NavigationLink 
            href="/pricing" 
            icon={<CreditCard className="h-5 w-5 mr-2 text-green-600" />}
            title="Pricing"
            description="View our pricing plans"
          />
          <NavigationLink 
            href="/contact" 
            icon={<Mail className="h-5 w-5 mr-2 text-orange-600" />}
            title="Contact"
            description="Get in touch with us"
          />
        </div>
        
      </NavigationMenuContent>
    </NavigationMenuItem>
             
    
  );
}

interface NavigationLinkProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}

function NavigationLink({ href, icon, title, description }: NavigationLinkProps) {
  return (
    <Link href={href} className="group block space-y-2 p-4 rounded-lg hover:bg-gray-50">
      <div className="flex items-center">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
} 