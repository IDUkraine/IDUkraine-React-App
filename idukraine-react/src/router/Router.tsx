import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../components/common/NotFoundPage';
import Layout from '../components/layout/Layout';
import HomePage from '../components/pages/home/HomePage';
import AdminPage from '../components/admin/AdminPage';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';

const Router = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default Router;
