import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFoundPage from '../components/common/NotFoundPage';
import Layout from '../components/layout/Layout';
import HomePage from '../components/pages/home/HomePage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
