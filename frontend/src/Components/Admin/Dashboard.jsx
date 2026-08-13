// // src/components/Admin/Dashboard.jsx
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useOutletContext } from 'react-router-dom';
// import ReactApexChart from "react-apexcharts";
// import ReactECharts from "echarts-for-react";
// import * as echarts from "echarts";
// import indiaGeoJson from "../../assets/maps/india.json";
// import { 
//   ResponsiveContainer, 
//   LineChart, 
//   CartesianGrid, 
//   XAxis, 
//   YAxis, 
//   Tooltip, 
//   Legend, 
//   Line 
// } from 'recharts';

// const token = () => localStorage.getItem('adminToken');
//  const api   = (url, params) => axios.get(url, { headers: { Authorization: `Bearer ${token()}` }, params });


// // Mock data strictly matching the x-axis dates in the image
//   const options = {
//     chart: {
//       type: "area",
//       toolbar: {
//         show: false,
//       },
//       zoom: {
//         enabled: false,
//       },
//       fontFamily: "Inter, sans-serif",
//     },

//     stroke: {
//       curve: "smooth",
//       width: 3,
//     },

//     colors: ["#4F46E5", "#10B981"],

//     dataLabels: {
//       enabled: false,
//     },

//     grid: {
//       borderColor: "#EEF2F7",
//       strokeDashArray: 4,
//       xaxis: {
//         lines: {
//           show: false,
//         },
//       },
//     },

//     legend: {
//       position: "top",
//       horizontalAlign: "left",
//       markers: {
//         radius: 12,
//       },
//     },

//     fill: {
//       type: "gradient",
//       gradient: {
//         shadeIntensity: 1,
//         opacityFrom: 0.15,
//         opacityTo: 0,
//         stops: [0, 100],
//       },
//     },

//     xaxis: {
//       categories: [
//         "12 May",
//         "13 May",
//         "14 May",
//         "15 May",
//         "16 May",
//         "17 May",
//         "18 May",
//       ],

//       axisBorder: {
//         show: false,
//       },

//       axisTicks: {
//         show: false,
//       },

//       labels: {
//         style: {
//           colors: "#64748B",
//           fontSize: "12px",
//         },
//       },
//     },

//     yaxis: {
//       labels: {
//         style: {
//           colors: "#64748B",
//           fontSize: "12px",
//         },
//       },
//     },

//     tooltip: {
//       theme: "light",
//     },
//   };

//   const series = [
//     {
//       name: "Quiz Starts",
//       data: [4000, 5300, 6200, 7900, 6500, 6100, 3600],
//     },
//     {
//       name: "Quiz Completions",
//       data: [2500, 3300, 4100, 5400, 4300, 3800, 2500],
//     },
//   ];

// // ── Stat Card ─────────────────────────────────────────────




// const StatCard = ({ title, value, icon, iconBg, trend, active, inactive, published, draft }) => {
//   return (
//     /* Card Wrapper: flex-row layout strictly bounded */
//     <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-3.5 min-h-[110px] w-full min-w-0">
      
//       {/* Left Side: Icon Container (Shrink strict to 0 so it never squeezes text) */}
//       <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
//         {icon}
//       </div>

//       {/* Right Side: Content Box */}
//       <div className="flex-1 min-w-0 flex flex-col justify-center">
        
//         {/* Title Element: text size normalized to 13px with tight leading */}
//         <p className="text-[13px] font-medium text-slate-500 tracking-wide block w-full leading-snug break-words" title={title}>
//           {title}
//         </p>
        
//         {/* Value Element */}
//         <h3 className="text-2xl font-bold text-slate-900 mt-1.5 tracking-tight truncate leading-none">
//           {value ?? '—'}
//         </h3>
        
//         {/* AUTOMATIC SUBTITLES BASED ON TITLE */}
//         {title === "Total Doctors" && (active !== undefined || inactive !== undefined) && (
//           <div className="mt-2.5 flex items-center gap-3 text-xs font-medium text-slate-400 truncate">
//             <span>Active: <span className="text-emerald-500 font-semibold">{active ?? 0}</span></span>
//             <span>Inactive: <span className="text-rose-500 font-semibold">{inactive ?? 0}</span></span>
//           </div>
//         )}

//         {title === "Active Doctor Pages" && (published !== undefined || draft !== undefined) && (
//           <div className="mt-2.5 flex items-center gap-3 text-xs font-medium text-slate-400 truncate">
//             <span>Published: <span className="text-emerald-500 font-semibold">{published ?? 0}</span></span>
//             <span>Draft: <span className="text-amber-500 font-semibold">{draft ?? 0}</span></span>
//           </div>
//         )}

//         {trend !== undefined && trend !== null && (
//           <div className="mt-2.5 flex items-center gap-1.5 whitespace-nowrap">
//             <span className={`text-xs font-semibold flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
//               {trend >= 0 ? '↑' : '↓'}{Math.abs(trend)}%
//             </span>
//             <span className="text-xs text-slate-400 font-medium">vs last 7 days</span>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// // ── Quick Action Button ───────────────────────────────────
// const QuickAction = ({ label, icon, color, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all hover:scale-105 ${color}`}
//   >
//     <span className="text-xl">{icon}</span>
//     <span className="text-xs font-semibold text-center leading-tight">{label}</span>
//   </button>
// );

// // ── India Map (SVG placeholder with state dots) ───────────
// const IndiaMap = ({ byState }) => {
//   const stateMap = {
//     'Maharashtra': { cx: 170, cy: 310 },
//     'Delhi':       { cx: 195, cy: 175 },
//     'Karnataka':   { cx: 180, cy: 385 },
//     'Gujarat':     { cx: 130, cy: 270 },
//     'Tamil Nadu':  { cx: 200, cy: 430 },
//     'Rajasthan':   { cx: 150, cy: 210 },
//     'Uttar Pradesh': { cx: 230, cy: 195 },
//     'West Bengal': { cx: 285, cy: 245 },
//     'Telangana':   { cx: 210, cy: 360 },
//     'Punjab':      { cx: 165, cy: 145 },
//   };

//   const max = byState?.[0]?.scans || 1;

//   return (
//     <div className="relative flex items-center justify-center">
//       <svg viewBox="0 0 400 500" className="w-full max-h-[240px]">
//         {/* India outline simplified */}
//         <path
//           d="M160,60 L200,50 L230,60 L260,80 L290,110 L310,150 L320,200 L310,250 L300,290 L280,330 L260,370 L240,400 L220,430 L200,450 L185,440 L170,420 L155,390 L140,360 L130,320 L120,280 L110,240 L105,200 L110,160 L125,120 L140,90 Z"
//           fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5"
//         />
//         {/* State dots */}
//         {byState?.slice(0, 10).map((s, i) => {
//           const pos = stateMap[s._id];
//           if (!pos) return null;
//           const r = 6 + ((s.scans / max) * 14);
//           return (
//             <g key={s._id}>
//               <circle cx={pos.cx} cy={pos.cy} r={r} fill="#3B82F6" opacity={0.25}/>
//               <circle cx={pos.cx} cy={pos.cy} r={r * 0.5} fill="#2563EB" opacity={0.8}/>
//               <title>{s._id}: {s.scans} scans</title>
//             </g>
//           );
//         })}
//       </svg>
//     </div>
//   );
// };

// export default function AdminDashboard() {
//   const { activeCampaign } = useOutletContext() || {};
//   const [range, setRange]   = useState('7d');
//   const [stats, setStats]   = useState(null);
//   const [activity, setActivity] = useState([]);
//   const [mapData, setMapData]   = useState({ byState: [], topCities: [] });
//   const [devices, setDevices]   = useState([]);
//   const [topDocs, setTopDocs]   = useState([]);
//   const [campPerf, setCampPerf] = useState([]);
//   const [loading, setLoading]   = useState(true);

//     useEffect(() => {
//     echarts.registerMap("India", indiaGeoJson);
//   }, []);

// const mapOption = {
//   backgroundColor: "transparent",

//   tooltip: {
//     trigger: "item",
//     backgroundColor: "#0F172A",
//     borderWidth: 0,
//     textStyle: {
//       color: "#fff",
//       fontSize: 12,
//     },
//     formatter: (params) => `
//       <div>
//         <div style="font-weight:600">${params.name}</div>
//         <div>${params.value || 0} scans</div>
//       </div>
//     `,
//   },

//   visualMap: {
//     min: 0,
//     max: 25000,
//     show: false,

//     inRange: {
//       color: [
//         "#F5F3FF",
//         "#E9D5FF",
//         "#C4B5FD",
//         "#A78BFA",
//         "#8B5CF6",
//         "#6D28D9",
//       ],
//     },
//   },

//   series: [
//     {
//       name: "QR Scans",
//       type: "map",
//       map: "India",

//       roam: false,

//       zoom: 0.7,

//       top: 10,
//       bottom: 10,
//       left: 10,
//       right: 10,

//       label: {
//         show: false,
//       },

//       itemStyle: {
//         borderColor: "#FFFFFF",
//         borderWidth: 1.5,
//       },

//       emphasis: {
//         label: {
//           show: false,
//         },

//         itemStyle: {
//           areaColor: "#5B21B6",
//         },
//       },

//       data: [
//         { name: "Maharashtra", value: 24842 },
//         { name: "Delhi", value: 4218 },
//         { name: "Karnataka", value: 3987 },
//         { name: "Tamil Nadu", value: 3564 },
//         { name: "Telangana", value: 2875 },
//         { name: "Gujarat", value: 2100 },
//         { name: "Rajasthan", value: 1650 },
//         { name: "Uttar Pradesh", value: 3200 },
//       ],
//     },
//   ],
// };
//   useEffect(() => {
//     fetchAll();
//   }, [range, activeCampaign]);

//   const fetchAll = async () => {
//     setLoading(true);
//     const params = { range, ...(activeCampaign?._id ? { campaign: activeCampaign._id } : {}) };
//     try {
//       const [s, a, m, d, td, cp] = await Promise.all([
//         api('/api/analytics/dashboard', params),
//         api('/api/analytics/activity',  params),
//         api('/api/analytics/map',        params),
//         api('/api/analytics/devices',    params),
//         api('/api/analytics/top-doctors', { ...params, limit: 6 }),
//         api('/api/analytics/campaign-performance', params),
//       ]);
//       if (s.data.success)  setStats(s.data.data);
//       if (a.data.success)  setActivity(a.data.data);
//       if (m.data.success)  setMapData(m.data.data);
//       if (d.data.success)  setDevices(d.data.data);
//       if (td.data.success) setTopDocs(td.data.data);
//       if (cp.data.success) setCampPerf(cp.data.data);
//     } catch (e) { console.error(e); }
//     finally { setLoading(false); }
//   };

//   // ── Device donut (simple CSS) ─────────────────────────
//   const totalDeviceScans = devices.reduce((s, d) => s + d.count, 0);
//   const deviceColors = { mobile: '#3B82F6', desktop: '#10B981', tablet: '#F59E0B', unknown: '#9CA3AF' };

//   return (
//     <div>
//       {/* ── Page header ── */}
//       <div className="flex items-start justify-between mb-6">
//         <div>
//           <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
//           <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening with your platform.</p>
//         </div>
//         <div className="flex items-center gap-2">
//           <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
//           </svg>
//           <select
//             value={range}
//             onChange={e => setRange(e.target.value)}
//             className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 outline-none cursor-pointer"
//           >
//             <option value="7d">Last 7 Days</option>
//             <option value="30d">Last 30 Days</option>
//             <option value="90d">Last 90 Days</option>
//           </select>
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"/>
//         </div>
//       ) : (
//         <>
//           {/* ── KPI Cards ── */}
//           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
//             <StatCard
//               title="Total Doctors" value={stats?.totalDoctors?.toLocaleString()}
//               sub={`Active: ${stats?.activeDoctorPages || 0}  Draft: ${stats?.draftDoctorPages || 0}`}
//               subColor="#16a34a"
//               iconBg="bg-purple-100"
//               icon={<svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
//             />
//             <StatCard
//               title="Active Doctor Pages" value={stats?.activeDoctorPages?.toLocaleString()}
//               sub={`Draft: ${stats?.draftDoctorPages || 0}`}
//               iconBg="bg-blue-100"
//               icon={<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>}
//             />
//             <StatCard
//               title="Total QR Scans" value={stats?.totalScans?.toLocaleString()}
//               trend={stats?.trends?.scans}
//               iconBg="bg-green-100"
//               icon={<svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/></svg>}
//             />
//             <StatCard
//               title="Quiz Starts" value={stats?.quizStarts?.toLocaleString()}
//               trend={stats?.trends?.quizStarts}
//               iconBg="bg-orange-100"
//               icon={<svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
//             />
//             <StatCard
//               title="Quiz Completions" value={stats?.quizCompletions?.toLocaleString()}
//               trend={stats?.trends?.completions}
//               iconBg="bg-teal-100"
//               icon={<svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>}
//             />
//             <StatCard
//               title="Average Score" value={stats?.avgScore ? `${stats.avgScore}%` : '—'}
//               trend={stats?.trends?.avgScore}
//               iconBg="bg-yellow-100"
//               icon={<svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>}
//             />
//           </div>

//           {/* ── Row 2: Chart + Map + Top Doctors ── */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

//             {/* Line Chart */}
//              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="area"
//         height={320}
//       />
//     </div>

//             {/* India Map */}
//             <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
//   {/* Header */}
//   <div className="flex items-center justify-between mb-5">
//     <div>
//       <h2 className="text-sm font-semibold text-slate-800">
//         QR Scans by Location
//       </h2>
//       <p className="text-xs text-slate-400 mt-1">
//         Geographic scan distribution
//       </p>
//     </div>
//   </div>

//   {/* Content */}
//   <div className="grid grid-cols-[2.5fr_180px] gap-6 items-start">

//     {/* Map */}
//     <div className="overflow-hidden p-0 m-0">
//       <ReactECharts
//         option={mapOption}
//         style={{
//           height: "240px",
//           width: "100%",
//         }}
//       />
//     </div>

//     {/* Top Cities */}
//     <div>
//       <p className="text-xs font-semibold text-slate-500 mb-4">
//         Top Cities
//       </p>

//       <div className="space-y-4">
//         {mapData.topCities?.slice(0, 5).map((c, i) => (
//           <div
//             key={i}
//             className="flex items-center justify-between gap-3"
//           >
//             <div className="min-w-0">
//               <p className="text-sm font-medium text-slate-800 truncate">
//                 {c.city}
//               </p>

//               <p className="text-xs text-slate-400">
//                 {c.state}
//               </p>
//             </div>

//             <span className="text-sm font-bold text-slate-900 shrink-0">
//               {c.scans?.toLocaleString()}
//             </span>
//           </div>
//         ))}
//       </div>

//       {/* Optional Footer */}
//       <button className="mt-5 w-full rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition">
//         View All Locations
//       </button>
//     </div>

//   </div>
// </div>

//             {/* Top Doctors */}
//             <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
//               <div className="flex items-center justify-between mb-4">
//                 <h2 className="text-sm font-semibold text-gray-800">Top Performing Doctors</h2>
//                 <button className="text-xs text-blue-600 hover:underline">View All</button>
//               </div>
//               <div className="space-y-3">
//                 {topDocs.map((d, i) => (
//                   <div key={d.doctorId} className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold shrink-0">
//                       {d.name?.[0]}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-semibold text-gray-800 truncate">{d.name}</p>
//                       <p className="text-[10px] text-gray-400">{d.city}, {d.state}</p>
//                     </div>
//                     <div className="flex items-center gap-1.5 shrink-0">
//                       <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
//                         <div className="h-full bg-green-500 rounded-full" style={{ width: `${d.avgScore}%` }}/>
//                       </div>
//                       <span className="text-xs font-semibold text-gray-700">{d.avgScore}%</span>
//                     </div>
//                   </div>
//                 ))}
//                 {topDocs.length === 0 && <p className="text-xs text-gray-400">No data yet</p>}
//               </div>
//             </div>
//           </div>

//           {/* ── Row 3: Campaign Performance + Device Overview + Recent Activity ── */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

//             {/* Campaign Performance Table */}
//             <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//               <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//                 <h2 className="text-sm font-semibold text-gray-800">Campaign Performance</h2>
//                 <button className="text-xs text-blue-600 hover:underline">View All Campaigns</button>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-xs">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       {['Campaign','Doctors','QR Scans','Quiz Starts','Completions','Avg. Score'].map(h => (
//                         <th key={h} className="px-4 py-3 text-left text-gray-500 font-medium whitespace-nowrap">{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {campPerf.map((c, i) => (
//                       <tr key={c.campaignId} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 font-medium text-gray-800 max-w-[140px] truncate">{c.name}</td>
//                         <td className="px-4 py-3 text-gray-600">{c.doctors}</td>
//                         <td className="px-4 py-3 text-gray-600">{c.qrScans?.toLocaleString()}</td>
//                         <td className="px-4 py-3 text-gray-600">{c.quizStarts?.toLocaleString()}</td>
//                         <td className="px-4 py-3 text-gray-600">{c.completions?.toLocaleString()}</td>
//                         <td className="px-4 py-3">
//                           <span className={`font-semibold ${c.avgScore >= 70 ? 'text-green-600' : c.avgScore >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
//                             {c.avgScore}%
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                     {campPerf.length === 0 && (
//                       <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No campaign data</td></tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Device Overview */}
//             <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
//               <h2 className="text-sm font-semibold text-gray-800 mb-4">Device Overview</h2>

//               {/* Donut */}
//               <div className="flex items-center justify-center mb-4">
//                 <div className="relative w-32 h-32">
//                   <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
//                     {(() => {
//                       let offset = 0;
//                       return devices.map((d, i) => {
//                         const pct  = totalDeviceScans > 0 ? (d.count / totalDeviceScans) * 100 : 0;
//                         const el   = (
//                           <circle key={d.device} cx="18" cy="18" r="15.9155"
//                             fill="transparent"
//                             stroke={deviceColors[d.device] || '#9CA3AF'}
//                             strokeWidth="3.5"
//                             strokeDasharray={`${pct} ${100 - pct}`}
//                             strokeDashoffset={-offset}
//                           />
//                         );
//                         offset += pct;
//                         return el;
//                       });
//                     })()}
//                   </svg>
//                   <div className="absolute inset-0 flex flex-col items-center justify-center">
//                     <p className="text-lg font-bold text-gray-800">{totalDeviceScans?.toLocaleString()}</p>
//                     <p className="text-[10px] text-gray-400">Total</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 {devices.map(d => (
//                   <div key={d.device} className="flex items-center justify-between text-xs">
//                     <div className="flex items-center gap-2">
//                       <div className="w-2.5 h-2.5 rounded-full" style={{ background: deviceColors[d.device] || '#9CA3AF' }}/>
//                       <span className="text-gray-600 capitalize">{d.device}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <span className="text-gray-400">{d.count?.toLocaleString()}</span>
//                       <span className="font-semibold text-gray-700">{d.percent}%</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <button className="mt-4 w-full text-xs text-blue-600 border border-blue-100 rounded-lg py-2 hover:bg-blue-50 transition-colors">
//                 View Full Analytics
//               </button>
//             </div>
//           </div>

//           {/* ── Quick Actions ── */}
//           <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
//             <h2 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h2>
//             <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
//               {[
//                 { label: 'Add New Doctor',   icon: '👨‍⚕️', color: 'border-blue-100 bg-blue-50 text-blue-700',   path: '/admin/doctors/new' },
//                 { label: 'Bulk Upload',      icon: '📊', color: 'border-green-100 bg-green-50 text-green-700',  path: '/admin/bulk-upload' },
//                 { label: 'Create New Quiz',  icon: '📝', color: 'border-purple-100 bg-purple-50 text-purple-700', path: '/admin/quizzes/new' },
//                 { label: 'Upload Video',     icon: '🎬', color: 'border-orange-100 bg-orange-50 text-orange-700', path: '/admin/scenes' },
//                 { label: 'Upload Voiceover', icon: '🎤', color: 'border-pink-100 bg-pink-50 text-pink-700',     path: '/admin/scenes' },
//                 { label: 'Generate QR Codes',icon: '📱', color: 'border-teal-100 bg-teal-50 text-teal-700',    path: '/admin/qr-codes' },
//                 { label: 'View Reports',     icon: '📈', color: 'border-yellow-100 bg-yellow-50 text-yellow-700', path: '/admin/reports' },
//               ].map(a => (
//                 <button
//                   key={a.label}
//                   onClick={() => window.location.href = a.path}
//                   className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:scale-105 hover:shadow-sm ${a.color}`}
//                 >
//                   <span className="text-2xl">{a.icon}</span>
//                   <span className="text-[10px] font-semibold text-center leading-tight">{a.label}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

 import Uppersection from "../Dashboard components/uppersection";
 import Middlesection from "../Dashboard components/middlesection";
 import Bottomsection from "../Dashboard components/bottomsection";
 function Dashboard() {
  return (
    <div className="space-y-3">
      <Uppersection />
      <Middlesection />
      <Bottomsection />
    </div>
  );
}

export default Dashboard;