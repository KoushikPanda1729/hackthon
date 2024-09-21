import React, { lazy, Suspense } from 'react';

const LazyQuizQuestion = lazy(() => import('./QuizQuestion'));

const QuizQuestion = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyQuizQuestion {...props} />
  </Suspense>
);

export default QuizQuestion;
