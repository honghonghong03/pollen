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
import Leaderboard from './pages/Leaderboard';
import Rewards from './pages/Rewards';
import Landing from './pages/Landing';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function HomeRoute() {
  const { user } = useAuth();
  if (!user) return <Landing />;
  return <Navigate to="/feed" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Landing page for guests, redirect to feed for logged-in */}
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {/* Guest-accessible routes (feed + leaderboard) */}
      <Route element={<Layout />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>
      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/survey/:id" element={<SurveyViewer />} />
        <Route path="/survey/:id/results" element={<SurveyResults />} />
        <Route path="/create" element={<CreateSurvey />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile" element={<Profile />} />
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
