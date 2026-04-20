import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar        from './components/Navbar';
import Home          from './pages/Home';
import Login         from './pages/Login';
import Register      from './pages/Register';
import CreatePoll    from './pages/CreatePoll';
import PollDetail    from './pages/PollDetail';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/poll/:id"   element={<PollDetail />} />
            <Route path="/create"     element={
              <ProtectedRoute><CreatePoll /></ProtectedRoute>
            }/>
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}