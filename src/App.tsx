import { Suspense, lazy, useEffect, useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Platforms from './components/Platforms';
import SiteFooter from './components/SiteFooter';

const DownloadPage = lazy(() => import('./components/DownloadPage'));

type Route = 'home' | 'download';

function getRoute(): Route {
  const h = window.location.hash;
  if (h.startsWith('#/download')) return 'download';
  return 'home';
}

// The privacy policy lives at /privacy/ (static file: privacy/index.html).
// If the main bundle boots with a privacy URL, the host served its SPA
// fallback instead of the static file — forward to the trailing-slash URL.
function redirectLegacyPrivacyUrls() {
  if (window.location.hash.startsWith('#/privacy')) {
    window.location.replace('/privacy/');
    return;
  }
  if (window.location.pathname === '/privacy') {
    window.location.replace('/privacy/');
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => getRoute());

  useEffect(() => {
    redirectLegacyPrivacyUrls();
    const onChange = () => {
      redirectLegacyPrivacyUrls();
      setRoute(getRoute());
    };
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

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <Platforms />
      </main>
      <SiteFooter />
    </>
  );
}
