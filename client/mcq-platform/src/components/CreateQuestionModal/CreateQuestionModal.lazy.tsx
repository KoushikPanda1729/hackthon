import React, { lazy, Suspense } from 'react';

const LazyCreateQuestionModal = lazy(() => import('./CreateQuestionModal'));

const CreateQuestionModal = (props: JSX.IntrinsicAttributes & { children?: React.ReactNode; }) => (
  <Suspense fallback={null}>
    <LazyCreateQuestionModal {...props} />
  </Suspense>
);

export default CreateQuestionModal;
