import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import VideoBackground from './components/VideoBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sections from './components/Sections';
import Footer from './components/Footer';
import AppLayout from './components/AppLayout';
import Dashboard from './components/Dashboard';
import OpportunityIntake from './pages/OpportunityIntake';
import OpportunityWorkspace from './pages/OpportunityWorkspace';
import KnowledgeBase from './pages/KnowledgeBase';
import Approvals from './pages/Approvals';
import Activity from './pages/Activity';
import Settings from './pages/Settings';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle hash-based navigation to dashboard if routed via hash
    if (window.location.hash === '#/dashboard' || window.location.hash.startsWith('#/dashboard')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen bg-[#03111e] text-foreground selection:bg-white/20">
      <VideoBackground />
      <Navbar />
      <main>
        <Hero />
        <Sections />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/opportunities/new" element={<OpportunityIntake />} />
            <Route path="/opportunities/:id" element={<OpportunityWorkspace />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
