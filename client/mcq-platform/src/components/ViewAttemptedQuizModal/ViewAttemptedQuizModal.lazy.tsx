import React, { lazy, Suspense } from 'react';

const LazyViewAttemptedQuizModal = lazy(() => import('./ViewAttemptedQuizModal'));

const ViewAttemptedQuizModal = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyViewAttemptedQuizModal {...props} />
  </Suspense>
);

export default ViewAttemptedQuizModal;
