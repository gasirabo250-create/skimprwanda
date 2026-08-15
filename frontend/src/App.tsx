import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { StickyWhatsApp } from './components/WhatsAppButton';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import BrowseCars from './pages/BrowseCars';
import VehicleDetail from './pages/VehicleDetail';
import FindMyCar from './pages/FindMyCar';
import CompareCars from './pages/CompareCars';
import SavedCars from './pages/SavedCars';
import SellYourCar from './pages/SellYourCar';
import Garage from './pages/Garage';
import ArticleDetail from './pages/ArticleDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import BookViewing from './pages/BookViewing';
import BrandPage from './pages/BrandPage';
import ModelPage from './pages/ModelPage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Overview from './admin/pages/Overview';
import VehiclesList from './admin/pages/VehiclesList';
import VehicleForm from './admin/pages/VehicleForm';
import BrandsAdmin from './admin/pages/BrandsAdmin';
import ModelsAdmin from './admin/pages/ModelsAdmin';
import ViewingRequestsAdmin from './admin/pages/ViewingRequestsAdmin';
import SellerRequestsAdmin from './admin/pages/SellerRequestsAdmin';
import ReviewsAdmin from './admin/pages/ReviewsAdmin';
import ArticlesAdmin from './admin/pages/ArticlesAdmin';
import SettingsAdmin from './admin/pages/SettingsAdmin';

const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <BackToTop />
    <StickyWhatsApp />
  </div>
);

const App: React.FC = () => (
  <Routes>
    {/* Customer-facing site */}
    <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
    <Route path="/cars" element={<SiteLayout><BrowseCars /></SiteLayout>} />
    <Route path="/cars/:brandSlug/:modelSlug" element={<SiteLayout><ModelPage /></SiteLayout>} />
    <Route path="/cars/:id" element={<SiteLayout><VehicleDetail /></SiteLayout>} />
    <Route path="/find-my-car" element={<SiteLayout><FindMyCar /></SiteLayout>} />
    <Route path="/compare" element={<SiteLayout><CompareCars /></SiteLayout>} />
    <Route path="/saved-cars" element={<SiteLayout><SavedCars /></SiteLayout>} />
    <Route path="/sell-your-car" element={<SiteLayout><SellYourCar /></SiteLayout>} />
    <Route path="/garage" element={<SiteLayout><Garage /></SiteLayout>} />
    <Route path="/garage/:slug" element={<SiteLayout><ArticleDetail /></SiteLayout>} />
    <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />
    <Route path="/contact" element={<SiteLayout><Contact /></SiteLayout>} />
    <Route path="/book-viewing" element={<SiteLayout><BookViewing /></SiteLayout>} />
    <Route path="/brands/:slug" element={<SiteLayout><BrandPage /></SiteLayout>} />
    <Route path="/privacy" element={<SiteLayout><Privacy /></SiteLayout>} />
    <Route path="/terms" element={<SiteLayout><Terms /></SiteLayout>} />

    {/* Admin */}
    <Route path="/admin/login" element={<AdminLogin />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Overview />} />
      <Route path="vehicles" element={<VehiclesList />} />
      <Route path="vehicles/new" element={<VehicleForm />} />
      <Route path="vehicles/:id/edit" element={<VehicleForm />} />
      <Route path="brands" element={<BrandsAdmin />} />
      <Route path="models" element={<ModelsAdmin />} />
      <Route path="viewing-requests" element={<ViewingRequestsAdmin />} />
      <Route path="seller-requests" element={<SellerRequestsAdmin />} />
      <Route path="reviews" element={<ReviewsAdmin />} />
      <Route path="articles" element={<ArticlesAdmin />} />
      <Route path="settings" element={<SettingsAdmin />} />
    </Route>

    <Route path="*" element={<SiteLayout><NotFound /></SiteLayout>} />
  </Routes>
);

export default App;
