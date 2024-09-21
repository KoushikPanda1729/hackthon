import React, { lazy, Suspense } from 'react';

const LazyResultPage = lazy(() => import('./ResultPage'));

const ResultPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyResultPage {...props} />
  </Suspense>
);

export default ResultPage;
