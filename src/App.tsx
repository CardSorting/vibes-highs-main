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
        <div className="h-screen w-full bg-[#0A0A0B] flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
