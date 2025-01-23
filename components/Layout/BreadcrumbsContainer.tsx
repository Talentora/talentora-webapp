'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumbs from './Breadcrumbs';

const BreadcrumbsContainer: React.FC = () => {
  const pathname = usePathname();

  // Don't show breadcrumbs on dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  // Define breadcrumb items based on the current pathname
  const pathParts = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...pathParts.map((part, index) => ({
      label: part.charAt(0).toUpperCase() + part.slice(1),
      href: '/' + pathParts.slice(0, index + 1).join('/')
    }))
  ];

  return (
    <div className="px-6 py-4">

      <Breadcrumbs items={breadcrumbs} />
    </div>
  );
};

export default BreadcrumbsContainer;