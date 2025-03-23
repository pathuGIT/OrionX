import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from "./components/Header";
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import SuperAdminDB from './pages/SuperAdminDB';
import { SubAdminDB } from './pages/SubAdminDB';
import EmployeeDB from './pages/EmployeeDB';
import CustomerDB from './pages/CustomerDB';
import { AuthProvider } from './context/Authcontext';
import ProtectedRoute from './components/ProtectedRoute';
import EventForm from './components/EventForm';
import WeddingForm from './components/weddingForm';
import Profile from './pages/Profile';
import SuperAdminHome from './pages/superAdmin/SuperAdminHome';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <main className=' px-20'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProtectedRoute name="customer"><Profile /></ProtectedRoute>} />
            <Route path="/superAdmin" element={<ProtectedRoute name="super_admin"><SuperAdminDB /></ProtectedRoute>} />
            <Route path="/subAdmin" element={<ProtectedRoute name="sub_admin"><SubAdminDB /></ProtectedRoute>} />
            <Route path="/employee" element={<ProtectedRoute name="employee"><EmployeeDB /></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute name="customer"><CustomerDB /></ProtectedRoute>} />
            <Route path="/customer/event" element={<EventForm/>} />
            <Route path="/customer/wedding" element={<WeddingForm/>} />
            <Route path="/superAdminHome" element={<ProtectedRoute name="customer"> <SuperAdminHome /> </ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
