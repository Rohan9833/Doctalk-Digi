// src/components/MR/MyDoctors.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Mail, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// 1. Import your Medical Image Uploader component here
import MedicalImageUploader from '../ui/MedicalImageUploader'; 

const MyDoctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // State to manage which doctor's uploader is open
  const [activeUploadDoctorId, setActiveUploadDoctorId] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    filterDoctors();
  }, [searchTerm, statusFilter, doctors]);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('mrToken');
      const response = await axios.get('/api/mr/doctors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctors(response.data.data);
      setFilteredDoctors(response.data.data);
    } catch (err) {
      console.error('Failed to fetch doctors', err);
    } finally {
      loading && setLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = [...doctors];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doctor => doctor.consentStatus === statusFilter);
    }
    
    setFilteredDoctors(filtered);
    setCurrentPage(1);
  };

  const handleSendConsent = (doctorId) => {
    navigate('/mr/send-consent', { state: { selectedDoctorId: doctorId } });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
      sent: { color: 'bg-yellow-100 text-yellow-800', label: 'Sent' },
      not_sent: { color: 'bg-gray-100 text-gray-800', label: 'Not Sent' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expired' }
    };
    const config = statusConfig[status] || statusConfig.not_sent;
    return <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>{config.label}</span>;
  };

  // Pagination
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage);

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
        <h1 className="text-2xl font-bold text-gray-800">My Doctors</h1>
        <p className="text-gray-600 mt-1">Manage and track consent status of your assigned doctors</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, specialty or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="accepted">Accepted</option>
              <option value="sent">Sent</option>
              <option value="not_sent">Not Sent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedDoctors.map((doctor) => (
                <tr key={doctor._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{doctor.specialty || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{doctor.email || '—'}</div>
                    <div className="text-xs text-gray-400">{doctor.mobile || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">{doctor.city || '—'}</div>
                    <div className="text-xs text-gray-400">{doctor.state || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(doctor.consentStatus)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/mr/doctors/${doctor._id}`)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* 2. Modified Pencil Click to activate modal overlay state instead of navigating */}
                      <button
                        onClick={() => setActiveUploadDoctorId(doctor._id)}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Edit Doctor Records"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      
                      {doctor.consentStatus !== 'accepted' && (
                        <button
                          onClick={() => handleSendConsent(doctor._id)}
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Send Consent"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 3. DYNAMIC MODAL OVERLAY: Shows when an activeUploadDoctorId is present */}
      {activeUploadDoctorId && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200"
          onClick={() => setActiveUploadDoctorId(null)} // Click outside to close
        >
          <div 
            className="w-full max-w-2xl transform transition-transform"
            onClick={(e) => e.stopPropagation()} // Stop overlay click events inside the card
          >
            {/* Render Image Portal and handle closing state layout */}
            <MedicalImageUploader 
              doctorId={activeUploadDoctorId} 
              onClose={() => setActiveUploadDoctorId(null)} 
            />
          </div>
        </div>
      )}
      
    </div>
  );
};

export default MyDoctors;