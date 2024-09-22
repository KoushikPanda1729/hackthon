import React, { lazy, Suspense } from 'react';

const LazyAttemptedQuizListItem = lazy(() => import('./AttemptedQuizListItem'));

const AttemptedQuizListItem = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyAttemptedQuizListItem {...props} />
  </Suspense>
);

export default AttemptedQuizListItem;
