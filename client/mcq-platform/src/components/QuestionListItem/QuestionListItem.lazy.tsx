import React, { lazy, Suspense } from 'react';

const LazyQuestionListItem = lazy(() => import('./QuestionListItem'));

const QuestionListItem = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyQuestionListItem {...props} />
  </Suspense>
);

export default QuestionListItem;
