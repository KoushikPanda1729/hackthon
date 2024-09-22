import React, { lazy, Suspense } from 'react';

const LazyAttemptedQuizzesPage = lazy(() => import('./AttemptedQuizzesPage'));

const AttemptedQuizzesPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAttemptedQuizzesPage {...props} />
  </Suspense>
);

export default AttemptedQuizzesPage;
