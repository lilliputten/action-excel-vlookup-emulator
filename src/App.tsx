import { ToastContainer } from 'react-toastify';

import { ExcelEmulatorPage } from '@/pages/ExcelEmulatorPage';

import { TailwindIndicator } from './blocks/TailwindIndicator';

/* // NOTE: Don't use routes for action projects: as they use relative paths for hosting apps
 * import { BrowserRouter, Route, Routes } from 'react-router-dom';
 * function AppRoutes() {
 *   return (
 *     <Routes>
 *       <Route path="/" element={<ExcelEmulatorPage />} />
 *       {[> <Route path="/test" element={<Test />} /> <]}
 *     </Routes>
 *   );
 * }
 */

function App() {
  return (
    <>
      {/* <AppNavBar /> */}
      <ExcelEmulatorPage />
      {/*
      // NOTE: Don't use routes for action projects: as they use relative paths for hosting apps
      <AppRoutes />
      */}
      <ToastContainer />
      <TailwindIndicator />
    </>
  );
}

export default App;
