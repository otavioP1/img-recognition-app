import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';

import { LoginForm } from './components/Authentication/LoginForm.tsx';
import { RegisterForm } from './components/Authentication/RegisterForm.tsx';
import { ImageAnaliser } from "./components/ImageAnalysis/ImageAnalyser.tsx"
import { NotFound } from './components/NotFound.tsx';

export function AppRoutes() {
  const { loggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="*" element={<Navigate to="/login" />} />
        {loggedIn && (
          <>
            <Route path="/image-analysis" element={<ImageAnaliser />}/>
            <Route path="*" element={<NotFound />} />
          </>
        )}
      </Routes>
    </Router>
  );
}