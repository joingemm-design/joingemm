import { Suspense } from 'react';
import WelcomeForm from './WelcomeForm';
import Loading from './loading';

export default function WelcomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <WelcomeForm />
    </Suspense>
  );
}
