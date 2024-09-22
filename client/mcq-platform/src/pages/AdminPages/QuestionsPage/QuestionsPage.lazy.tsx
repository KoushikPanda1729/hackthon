import React, { lazy, Suspense } from 'react';

const LazyQuestionsPage = lazy(() => import('./QuestionsPage'));

const QuestionsPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyQuestionsPage {...props} />
  </Suspense>
);

export default QuestionsPage;
