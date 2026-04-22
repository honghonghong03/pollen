import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Feed from './pages/Feed';
import SurveyViewer from './pages/SurveyViewer';
import CreateSurvey from './pages/CreateSurvey';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SurveyResults from './pages/SurveyResults';
import EditSurvey from './pages/EditSurvey';
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import Landing from './pages/Landing';

function ProtectedRoute({ children }) {
  const { authUser, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!authUser) return <Navigate to="/login" replace />;
  return children;
}

function LoadingScreen() {
  return (
    <div className="min-h-dvh bg-petal flex items-center justify-center">
      <div className="text-center">
        <svg width="40" height="40" viewBox="0 0 32 32" className="mx-auto mb-3 animate-pulse">
          <circle cx="16" cy="16" r="4" fill="#F2A623"/>
          <circle cx="16" cy="6" r="2.5" fill="#E8C44A"/>
          <circle cx="24.5" cy="11" r="2.5" fill="#E8C44A"/>
          <circle cx="24.5" cy="21" r="2.5" fill="#E8C44A"/>
          <circle cx="16" cy="26" r="2.5" fill="#E8C44A"/>
          <circle cx="7.5" cy="21" r="2.5" fill="#E8C44A"/>
          <circle cx="7.5" cy="11" r="2.5" fill="#E8C44A"/>
        </svg>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { authUser, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Root: landing page for guests, feed for logged-in */}
      <Route path="/" element={authUser ? <Navigate to="/feed" replace /> : <Landing />} />
      <Route path="/login" element={authUser ? <Navigate to="/feed" replace /> : <Login />} />
      <Route path="/signup" element={authUser ? <Navigate to="/feed" replace /> : <Signup />} />
      {/* App routes inside Layout (accessible to guests + logged-in) */}
      <Route element={<Layout />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        {/* Protected routes — redirect to login if not authenticated */}
        <Route path="/survey/:id" element={authUser ? <SurveyViewer /> : <Navigate to="/login" replace />} />
        <Route path="/survey/:id/results" element={authUser ? <SurveyResults /> : <Navigate to="/login" replace />} />
        <Route path="/survey/:id/edit" element={authUser ? <EditSurvey /> : <Navigate to="/login" replace />} />
        <Route path="/create" element={authUser ? <CreateSurvey /> : <Navigate to="/login" replace />} />
        <Route path="/wallet" element={authUser ? <Wallet /> : <Navigate to="/login" replace />} />
        <Route path="/rewards" element={authUser ? <Rewards /> : <Navigate to="/login" replace />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
