'use client';

import { PropsWithChildren } from 'react';
import DynamicSidebar from '@/components/Layout/Sidebar/DynamicSidebar';
import Navbar from '@/components/Layout/Navbar';
import BreadcrumbsContainer from '@/components/Layout/BreadcrumbsContainer';
import { Suspense } from 'react';
import Loading from '@/components/Layout/Loading';

interface ClientLayoutProps {
  isSidebarVisible: boolean;
}

const ClientLayout = ({ children, isSidebarVisible }: PropsWithChildren<ClientLayoutProps>) => {
  return (
    <div className="flex min-h-screen">
      {isSidebarVisible && <DynamicSidebar />}
      <main
        id="skip"
        className="flex-1 min-h-screen"
      >
        <div className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur">
          <Navbar visible={isSidebarVisible} />
          {isSidebarVisible && <BreadcrumbsContainer />}
        </div>
        <div>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;