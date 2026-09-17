import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollToTop } from '@/components/ScrollToTop';
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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
