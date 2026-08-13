import React from "react";
import { useState } from "react";
import axios from "axios";
import {
  ExternalLink,
  Copy,
  Download,
  Eye,
  Edit3,
  FileText,
  RefreshCw,
  Image,
  UserX,
  MapPin,
} from "lucide-react";

const DoctorProfileDashboard = ({ doctorData, setQrGenerated }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

    const downloadPng = () => {
    const link = document.createElement("a");
    link.href = doctorData.qrCode
    link.download = `${doctorData.name}-qrcode.png`
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const downloadSvg = () => {
    console.log(doctorData.qrCodeSvg);
    console.log(doctorData);
    const blob = new Blob(
      [doctorData.qrCodeSvg],
      {type: "image/svg+xml"}
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${doctorData?.name}-qrcode.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

    const generateQr = async() => {
  
      try {
        const response = await axios(`api/doctors/saveQr/${doctorData.doctorId}`);
    
        if(response.status === 200) {
        setQrGenerated(true)
        }
      } catch (error) {
        console.error(error)
      }
  
    }
  

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 font-sans text-[#2D3748]">
      {/* --- Profile Section --- */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            doctorData?.imageFilePath?.length > 0
              ? `http://192.168.1.37:2468/${doctorData?.imageFilePath[0].filePath.replace(/\\/g, "/")}`
              : "/default-avatar.png"
          }
          alt={doctorData.name}
          className="w-20 h-20 rounded-full object-cover border border-gray-100"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1A202C]">
              {doctorData.name}
            </h2>
            <span className="bg-[#E6F4EA] text-[#137333] text-xs font-semibold px-2 py-0.5 rounded-full">
              {doctorData.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">{doctorData.specialty}</p>
          <p className="text-sm text-gray-500">{doctorData.clinic}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
            <MapPin size={14} />
            <span>
              {doctorData.city}, {doctorData.state}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-gray-100 my-5" />

      {/* --- URLs Section --- */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Doctor Page URL
          </label>
          <div className="flex items-center justify-between bg-white rounded-lg border border-transparent py-1">
            <a
              href={doctorData.doctorPageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-600 hover:underline break-all pr-2"
            >
              {doctorData.doctorPageUrl}
            </a>
            <ExternalLink
              size={16}
              className="text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">
            Short URL (QR)
          </label>
          <div className="flex items-center justify-between bg-white rounded-lg border border-transparent py-1">
            <span className="text-sm text-blue-600 break-all pr-2">
              {doctorData.shortUrl}
            </span>
            <Copy
              size={16}
              className="text-gray-400 cursor-pointer hover:text-gray-600 flex-shrink-0"
              onClick={() => handleCopy(doctorData.shortUrl)}
            />
          </div>
        </div>
      </div>

      {/* --- QR Code & Actions Section --- */}
      <div className="grid grid-cols-2 gap-4 items-center mb-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">
            QR Code
          </label>
          <div className="border border-gray-200 p-2 rounded-xl bg-white w-36 h-36 flex items-center justify-center">
            {/* Real implementation would use a QR generator component or img */}
            <img
              src={doctorData.qrCode}
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-2.5 pt-6">
          <button onClick={downloadPng} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#5c51da] text-[#5c51da] bg-white hover:bg-blue-50/30 rounded-xl text-sm font-medium transition-colors">
            <Download size={16} />
            Download PNG
          </button>
          <button onClick={downloadSvg} className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#5c51da] text-[#5c51da] bg-white hover:bg-blue-50/30 rounded-xl text-sm font-medium transition-colors">
            <Download size={16} />
            Download SVG
          </button>
          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#5c51da] text-[#5c51da] bg-white hover:bg-blue-50/30 rounded-xl text-sm font-medium transition-colors">
            <Eye size={16} />
            View Scans
          </button>
        </div>
      </div>

      {/* --- Data Metrics Grid --- */}
      <div className="space-y-3 mb-6 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Total Scans</span>
          <span className="text-gray-800 font-semibold">
            {doctorData.totalScans}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Unique Scans</span>
          <span className="text-gray-800 font-semibold">
            {doctorData.uniqueScans}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Last Scanned</span>
          <span className="text-gray-600">{0}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500 font-medium">Page Status</span>
          <span className="text-[#137333] font-medium">
            {doctorData.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Quiz</span>
          <span className="text-blue-600 font-medium hover:underline cursor-pointer">
            {0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 font-medium">Joined On</span>
          <span className="text-gray-600">{0}</span>
        </div>
      </div>

      <hr className="border-gray-100 my-5" />

      {/* --- Quick Actions Section --- */}
      <div>
        <h3 className="text-sm font-bold text-[#1A202C] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-3 gap-y-6 text-center">
          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50/50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Edit3 size={18} />
            </div>
            <span className="text-xs text-gray-500 font-medium mt-2">
              Edit Doctor
            </span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50/50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Eye size={18} />
            </div>
            <span className="text-xs text-gray-500 font-medium mt-2">
              Preview Page
            </span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50/50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <FileText size={18} />
            </div>
            <span className="text-xs text-gray-500 font-medium mt-2">
              Scan Report
            </span>
          </button>

          <button onClick={() => generateQr()} className="flex flex-col items-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50/50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <RefreshCw size={18} />
            </div>
            <span className="text-xs text-gray-500 font-medium mt-2">
              Regenerate QR
            </span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-50/50 border border-blue-100 text-blue-600 group-hover:bg-blue-100 transition-colors">
              <Image size={18} />
            </div>
            <span className="text-xs text-gray-500 font-medium mt-2">
              Download Poster
            </span>
          </button>

          <button className="flex flex-col items-center group">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-red-50 border border-red-100 text-red-500 group-hover:bg-red-100 transition-colors">
              <UserX size={18} />
            </div>
            <span className="text-xs text-red-500 font-medium mt-2">
              Deactivate Doctor
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfileDashboard;
