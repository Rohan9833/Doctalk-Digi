// src/components/LoginSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, ArrowRight } from 'lucide-react';

const LoginSelection = () => {
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    navigate('/admin/login');
  };

  const handleMrLogin = () => {
    navigate('/mr/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="text-center pt-20 pb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">DQ</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">DocTalk Quiz</h1>
        <p className="text-gray-500 text-lg">Pharmaceutical Campaign Management Platform</p>
      </div>

      {/* Login Cards */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Admin Card */}
          <div 
            onClick={handleAdminLogin}
            className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
              <Shield className="w-7 h-7 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Complete platform control. Manage clients, campaigns, doctors, and access all analytics and reports.
            </p>
            <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
              <span>Login as Admin</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* MR Card */}
          <div 
            onClick={handleMrLogin}
            className="group bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 cursor-pointer"
          >
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-100 transition-colors">
              <Users className="w-7 h-7 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">MR Portal</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Manage your assigned doctors, send consent forms, track progress, and update doctor information.
            </p>
            <div className="flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
              <span>Login as MR</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-8 pb-12">
        <p className="text-sm text-gray-400">
          Secure platform for pharmaceutical campaign management
        </p>
      </div>
    </div>
  );
};

export default LoginSelection;