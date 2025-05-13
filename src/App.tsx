import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* context */
import { CvProvider } from './context/CvContext';

/* pages */
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import TemplatePreview from './pages/TemplatePreview';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <CvProvider>
              <Dashboard />
            </CvProvider>
          }
        />
        <Route
          path="/share"
          element={
            <CvProvider>
              <TemplatePreview />
            </CvProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
