import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserDetail from './pages/UserDetail'
import Devices from './pages/Devices'
import ActivityLogs from './pages/ActivityLogs'
import Notifications from './pages/Notifications'
import Accounts from './pages/Accounts'
import Transactions from './pages/Transactions'
import LoginAudits from './pages/LoginAudits'
import DashboardLayout from './components/layout/DashboardLayout'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:id"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <UserDetail />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/devices"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Devices />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/activity-logs"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ActivityLogs />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Accounts />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Transactions />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/login-audits"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <LoginAudits />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
