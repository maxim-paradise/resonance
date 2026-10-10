import { Suspense, lazy, useEffect, useState } from 'react';
import HeroB from './components/HeroB';
import Platforms from './components/Platforms';
import SiteFooter from './components/SiteFooter';

const DownloadPage = lazy(() => import('./components/DownloadPage'));

function isDownloadHash() {
  return window.location.hash.startsWith('#/download');
}

export default function App() {
  const [route, setRoute] = useState<'home' | 'download'>(() => (isDownloadHash() ? 'download' : 'home'));

  useEffect(() => {
    const onChange = () => setRoute(isDownloadHash() ? 'download' : 'home');
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  useEffect(() => {
    if (route === 'download') {
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
