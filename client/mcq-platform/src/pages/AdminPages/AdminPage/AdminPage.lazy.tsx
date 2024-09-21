import React, { lazy, Suspense } from 'react';

const LazyAdminPage = lazy(() => import('./AdminPage'));

const AdminPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAdminPage {...props} />
  </Suspense>
);

export default AdminPage;
