// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Admin Components
import AdminLogin from './Components/Admin/Login';
import AdminLayout from './Components/Admin/AdminLayout';
import AdminDashboard from './Components/Admin/Dashboard';
import ProtectedAdminRoute from './Components/Admin/ProtectedAdminRoute';
import DoctorPage from './Components/Doctor/DoctorPage';
import Clients from './Pages/client';

// Campaign Components
import Campaigns from './Pages/Campaigns';
import BulkUpload from './Pages/Bulkupload';
import Quizzes from './Pages/Quiz';

// MR Components
import MRLogin from './Components/MR/Login';
import MRLayout from './Components/Layouts/MRLayout';
import MRDashboard from './Components/MR/Dashboard';
import MyDoctors from './Components/MR/MyDoctors';
import SendConsent from './Components/MR/SendConsent';
import ProtectedMRRoute from './Components/MR/ProtectedMRRoute';

// Doctor/Public Components
import ConsentPage from './Components/Doctor/ConsentPage';
import ConsentSuccess from './Components/Doctor/ConsentSuccess';
// import ConfirmConsent from './Components/Doctor/ConfirmConsent';
import LoginSelection from './Components/LoginSelection';
import DoctorDashboard from './Components/Doctor/Dashboard';
import DoctorDetailUpload from './Components/MR/DoctorDetails';


import QrCode from "./Pages/QrCode"
import Video from "./Pages/Video"
import Logs from './Pages/Logs';
import Analytics from './Pages/Analytics';
import Reports from './Pages/Reports';
import UsersRoles from './Pages/UsersRoles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route - redirect based on role? Or show login selection */}
        <Route path="/" element={<LoginSelection />} />

        {/* ==================== ADMIN ROUTES ==================== */}
        <Route path="/admin/login" element={<AdminLogin />} />


        <Route path="/admin" element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="doctors" element={<DoctorDashboard />} />
          <Route path="bulk-upload" element={<BulkUpload />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="doctor-pages" element={<div>Doctor Pages (Coming Soon)</div>} />
          <Route path="video" element={<Video/>} />
          <Route path="qr-codes" element={<QrCode/>} />
          <Route path="analytics" element={<Analytics/>} />
          <Route path="reports" element={<Reports/>} />
          <Route path="users" element={<UsersRoles/>} />
          <Route path="settings" element={<div>Settings (Coming Soon)</div>} />
          <Route path="logs" element={<Logs/>} />
        </Route>

        {/* ==================== MR ROUTES ==================== */}
        <Route path="/mr/login" element={<MRLogin />} />

        <Route path="/mr" element={
          <ProtectedMRRoute>
            <MRLayout />
          </ProtectedMRRoute>
        }>
          <Route index element={<MRDashboard />} />
          <Route path="dashboard" element={<MRDashboard />} />
          <Route path="doctors" element={<MyDoctors />} />
          <Route path="/mr/doctorsDetailsUpload/:id" element={<DoctorDetailUpload />} />

          <Route path="send-consent" element={<SendConsent />} />
          <Route path="analytics" element={<div>Analytics Page (Coming Soon)</div>} />
        </Route>

        {/* ==================== PUBLIC/DOCTOR ROUTES ==================== */}
        <Route path="/consent/:token" element={<ConsentPage />} />
        <Route path="/consent/success" element={<ConsentSuccess />} />
        <Route path="/dr/:slug" element={<DoctorPage />} />
        {/* <Route path="/confirm/:token" element={<ConfirmConsent />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;