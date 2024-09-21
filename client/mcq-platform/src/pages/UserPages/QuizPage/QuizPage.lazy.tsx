import React, { lazy, Suspense } from 'react';

const LazyQuizPage = lazy(() => import('./QuizPage'));

const QuizPage = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyQuizPage {...props} />
  </Suspense>
);

export default QuizPage;
