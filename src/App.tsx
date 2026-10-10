import { Suspense, lazy, useEffect, useState } from 'react';
import HeroB from './components/HeroB';
import Platforms from './components/Platforms';
import SiteFooter from './components/SiteFooter';

const DownloadPage = lazy(() => import('./components/DownloadPage'));
const PrivacyPage = lazy(() => import('./components/PrivacyPage'));

type Route = 'home' | 'download' | 'privacy';

function getRoute(): Route {
  const h = window.location.hash;
  if (h.startsWith('#/download')) return 'download';
  if (h.startsWith('#/privacy')) return 'privacy';
  return 'home';
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => getRoute());

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  useEffect(() => {
    if (route !== 'home') {
      window.scrollTo(0, 0);
      return;
    }
    const id = window.location.hash.replace(/^#/, '');
    if (id && !id.startsWith('/')) {
      const t = setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80);
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [route]);

  if (route === 'download') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <DownloadPage />
      </Suspense>
    );
  }

  if (route === 'privacy') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <PrivacyPage />
      </Suspense>
    );
  }

  return (
    <>
      <main>
        <HeroB />
        <Platforms />
      </main>
      <SiteFooter />
    </>
  );
}
