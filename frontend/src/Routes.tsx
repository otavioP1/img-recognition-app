import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';

import { LoginForm } from './components/Authentication/LoginForm.tsx';
import { RegisterForm } from './components/Authentication/RegisterForm.tsx';
import { ImageAnaliser } from "./components/ImageAnalysis/ImageAnalyser.tsx"
import { AnalysisHistory } from './components/AnalysisHistory/AnalysisHistory.tsx';

export function AppRoutes() {
  const { loggedIn } = useAuth();

  return (
    <Router>
      <Routes>
        {!loggedIn && (
          <>
            <Route index element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        {loggedIn && (
          <>
            <Route index element={<Navigate to="/analysis-history" />} />
            <Route path="/image-analysis" element={<ImageAnaliser />}/>
            <Route path="/analysis-history" element={<AnalysisHistory />}/>
            <Route path="*" element={<Navigate to="/analysis-history" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}