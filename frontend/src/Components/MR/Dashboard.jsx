// src/components/MR/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, MailCheck, Activity, TrendingUp, Pencil } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    consentSent: 0,
    consentAccepted: 0,
    pendingConsent: 0
  });
  const [recentDoctors, setRecentDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('mrToken');
      
      // Fetch doctors list
      const doctorsRes = await axios.get('/api/mr/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const doctors = doctorsRes.data.data;
      
      // Calculate stats
      const consentSent = doctors.filter(d => d.consentStatus === 'sent').length;
      const consentAccepted = doctors.filter(d => d.consentStatus === 'accepted').length;
      const pendingConsent = doctors.filter(d => d.consentStatus === 'not_sent').length;
      
      setStats({
        totalDoctors: doctors.length,
        consentSent,
        consentAccepted,
        pendingConsent
      });
      
      // Get recent doctors (last 5)
      setRecentDoctors(doctors.slice(0, 5));
      
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Consent Sent',
      value: stats.consentSent,
      icon: MailCheck,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Consent Accepted',
      value: stats.consentAccepted,
      icon: Activity,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Pending Consent',
      value: stats.pendingConsent,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '-3%',
      changeType: 'decrease'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your doctors.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-xs font-medium ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Doctors</h2>
          <p className="text-sm text-gray-500 mt-1">Recently added or updated doctors</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consent Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDoctors.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.specialty || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{doctor.city || '—'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      doctor.consentStatus === 'accepted' ? 'bg-green-100 text-green-800' :
                      doctor.consentStatus === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doctor.consentStatus === 'accepted' ? 'Accepted' :
                       doctor.consentStatus === 'sent' ? 'Sent' : 'Not Sent'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;