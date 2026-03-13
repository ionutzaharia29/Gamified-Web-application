import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import DashboardLayout from './components/DashboardLayout';
import OverviewPage from './pages/OverviewPage';
import CoursesPage from './pages/CoursesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SchedulePage from './pages/SchedulePage';
import AchievementsPage from './pages/AchievementsPage';
import SupportPage from './pages/SupportPage';
import BrainBreaksPage from './pages/brain-breaks/BrainBreaksPage';
import TicTacToePage from './pages/brain-breaks/TicTacToePage';
import CyberTyperPage from './pages/brain-breaks/CyberTyperPage';
import { authService } from './services/authService';

function ProtectedRoute({ children }) {
  return authService.isLoggedIn() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview"     element={<OverviewPage />} />
          <Route path="courses"      element={<CoursesPage />} />
          <Route path="leaderboard"  element={<LeaderboardPage />} />
          <Route path="schedule"     element={<SchedulePage />} />
          <Route path="achievements" element={<AchievementsPage />} />
          <Route path="brain-breaks" element={<BrainBreaksPage />} />
          <Route path="brain-breaks/tic-tac-toe" element={<TicTacToePage />} />
          <Route path="brain-breaks/cyber-typer"   element={<CyberTyperPage />} />
          <Route path="support"      element={<SupportPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
