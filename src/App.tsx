import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Seo } from '@/components/Seo';
import { AboutPage } from '@/pages/AboutPage';
import { CountryPage } from '@/pages/CountryPage';
import { DestinationPage } from '@/pages/DestinationPage';
import { ExperiencePage } from '@/pages/ExperiencePage';
import { ExperiencesPage } from '@/pages/ExperiencesPage';
import { HomePage } from '@/pages/HomePage';
import { MonthPage } from '@/pages/MonthPage';
import { MonthsPage } from '@/pages/MonthsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { SearchPage } from '@/pages/SearchPage';
import { WanderlistPage } from '@/pages/WanderlistPage';
import { WorldPage } from '@/pages/WorldPage';
import { CountriesPage } from '@/pages/CountriesPage';
import { EventsPage } from '@/pages/EventsPage';
import { PhenomenaPage } from '@/pages/PhenomenaPage';
import { PhenomenonPage } from '@/pages/PhenomenonPage';

export function AppContent() {
  return (
      <MotionConfig reducedMotion="user">
      <Seo />
      <ScrollToTop />
      <div className="min-h-screen bg-stone-950 text-white antialiased">
        <Navbar />
        <main className="overflow-x-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/months" element={<MonthsPage />} />
            <Route path="/month/:month" element={<MonthPage />} />
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/experience/:experienceId" element={<ExperiencePage />} />
            <Route path="/world" element={<WorldPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/phenomena" element={<PhenomenaPage />} />
            <Route path="/phenomena/:slug" element={<PhenomenonPage />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/country/:slug" element={<CountryPage />} />
            <Route path="/destination/:slug" element={<DestinationPage />} />
            <Route path="/wanderlist" element={<WanderlistPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </MotionConfig>
  );
}

function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}

export default App;
