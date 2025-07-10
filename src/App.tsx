import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { ExcelEmulatorPage } from '@/pages/ExcelEmulatorPage';

import { TailwindIndicator } from './blocks/TailwindIndicator';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ExcelEmulatorPage />} />
      {/* <Route path="/test" element={<Test />} /> */}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      {/* <AppNavBar /> */}
      <AppRoutes />
      <ToastContainer />
      <TailwindIndicator />
    </BrowserRouter>
  );
}

export default App;
