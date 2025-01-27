import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-3 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Link 
            href={item.href}
            className={`
              transition-colors duration-200
              ${index === items.length - 1 
                ? 'text-gray-500 font-medium cursor-default pointer-events-none' 
                : 'text-gray-500 hover:text-gray-900'
              }
            `}
          >
            {item.label}
          </Link>
          {index < items.length - 1 && (
            <span className="text-gray-400">
              <ChevronRight className="w-3 h-3" />
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;