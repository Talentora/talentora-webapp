'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function BreadcrumbsContainer() {
  const pathname = usePathname();
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxOpacity = 1;
      const minOpacity = 0;
      const scrollHeight = 50;
      const opacity = Math.max(
        minOpacity,
        Math.min(maxOpacity, 1 - scrollPosition / scrollHeight)
      );
      setOpacity(opacity);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Skip rendering breadcrumbs on the dashboard
  if (pathname === '/dashboard') {
    return null;
  }

  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment !== '');

  if (pathSegments.length === 0) {
    return null;
  }

  // Use visibility:hidden when opacity is 0 to prevent interaction with hidden breadcrumbs
  const visibilityStyle = opacity <= 0.05 ? { visibility: 'hidden' as const } : {};

  return (
    <div 
      className="px-6 py-2 bg-background/60 text-sm text-muted-foreground transition-all duration-150"
      style={{ ...visibilityStyle, opacity }}
    >
      <div className="max-w-6xl mx-auto">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link href="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </li>
            
            {pathSegments.map((segment, index) => {
              // Build the URL for this breadcrumb
              const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
              
              // Format the text (capitalize, replace hyphens with spaces)
              const text = segment
                .replace(/-/g, ' ')
                .replace(/^\w/, (c) => c.toUpperCase());
                
              // If it's the last segment, don't make it a link
              const isLastSegment = index === pathSegments.length - 1;
              
              return (
                <React.Fragment key={segment}>
                  <li className="flex items-center">
                    <span className="mx-1">/</span>
                  </li>
                  <li>
                    {isLastSegment ? (
                      <span className="font-medium">{text}</span>
                    ) : (
                      <Link href={url} className="hover:text-foreground transition-colors">
                        {text}
                      </Link>
                    )}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}