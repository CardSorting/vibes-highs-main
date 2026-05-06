import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './Home';
import Editorial from './pages/Editorial';
import Partners from './pages/Partners';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CodeOfConduct from './pages/CodeOfConduct';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
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
    </BrowserRouter>
  );
}

export default App;
