/**
 * [LAYER: CORE]
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Route-based code splitting
const Home = lazy(() => import('./Home'));
const Editorial = lazy(() => import('./pages/Editorial'));
const Partners = lazy(() => import('./pages/Partners'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CodeOfConduct = lazy(() => import('./pages/CodeOfConduct'));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={
        <div className="h-screen w-full bg-[#0A0A0B] flex flex-col items-center justify-center font-mono text-primary gap-4">
          <div className="w-16 h-px bg-primary/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-primary animate-[shimmer_2s_infinite]"></div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.5em] animate-pulse">Initializing_Substrate...</div>
        </div>
      }>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/editorial" element={<Editorial />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/conduct" element={<CodeOfConduct />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
