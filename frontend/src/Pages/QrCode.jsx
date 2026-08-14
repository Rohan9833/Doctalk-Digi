import React, { useCallback, useEffect, useMemo, useState } from "react";

import QrDashboard from "../Components/Qrcode/QrDashboard";
import QrGraph from "../Components/Qrcode/QrAnalytics.jsx";
import QrBottom from "../Components/Qrcode/QrBottom.jsx";

import axios from "axios";

function Qrcode() {
  // ==========================================
  // QR DASHBOARD DATA
  // ==========================================

  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // QR LIST DATA
  // ==========================================

  const [qrList, setQrList] = useState([]);
  const [qrListLoading, setQrListLoading] = useState(true);

  // SERVER PAGINATION

  const [qrPage, setQrPage] = useState(1);
  const [qrLimit, setQrLimit] = useState(10);
  const [qrTotal, setQrTotal] = useState(0);
  const [qrPages, setQrPages] = useState(1);

  // ==========================================
  // DOCTORS & CAMPAIGNS
  // ==========================================

  const [doctors, setDoctors] = useState([]);
  const [exportDoctors, setExportDoctors] = useState([]);
  const [campaigns, setCampaigns] = useState([]);

  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [campaignsLoading, setCampaignsLoading] = useState(true);

  // ==========================================
  // QR GRAPH DATA
  // ==========================================

  const [qrGraphData, setQrGraphData] = useState([]);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphRange, setGraphRange] = useState("7d");

  // ==========================================
  // PIE CHART DATA
  // ==========================================

  const [topCities, setTopCities] = useState([]);
  const [totalScans, setTotalScans] = useState(0);
  const [locationLoading, setLocationLoading] = useState(true);

  // ==========================================
  // AUTH CONFIG
  // ==========================================

  const authConfig = useMemo(() => {
    const token = localStorage.getItem("adminToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, []);

  // ==========================================
  // GET QR DASHBOARD
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchQRDashboard = async () => {
      try {
        setLoading(true);

        console.log("Fetching QR Dashboard...");

        const response = await axios.get("/api/qrcode/dashboard", authConfig);

        if (!cancelled) {
          console.log("QR Dashboard Response:", response.data);

          setQrData(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "QR Dashboard Error:",
            error.response?.status,
            error.response?.data || error.message,
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchQRDashboard();

    return () => {
      cancelled = true;
    };
  }, [authConfig]);

  // ==========================================
  // GET PAGINATED QR LIST
  // ==========================================

  const fetchQrList = useCallback(
    async (page, limit) => {
      try {
        setQrListLoading(true);

        console.log(`Fetching QR List: page=${page}, limit=${limit}`);

        const response = await axios.get(
          `/api/qrcode?page=${page}&limit=${limit}`,
          authConfig,
        );

        console.log("QR List Response:", response.data);

        const responseData = response.data;

        // ==============================
        // QR DATA
        // ==============================

        setQrList(responseData.data || []);

        // ==============================
        // PAGINATION
        // ==============================

        const pagination = responseData.pagination || {};

        setQrTotal(Number(pagination.total) || 0);

        setQrPage(Number(pagination.page) || page);

        setQrLimit(Number(pagination.limit) || limit);

        setQrPages(Number(pagination.pages) || 1);
      } catch (error) {
        console.error(
          "QR List Error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        setQrList([]);
        setQrTotal(0);
        setQrPages(1);
      } finally {
        setQrListLoading(false);
      }
    },
    [authConfig],
  );

  // ==========================================
  // INITIAL QR LIST
  // ==========================================

  useEffect(() => {
    fetchQrList(1, 10);
  }, [fetchQrList]);

  // ==========================================
  // CHANGE QR PAGE
  // ==========================================

  const handleQrPageChange = useCallback(
    (newPage) => {
      const page = Number(newPage);

      if (page < 1 || page > qrPages) {
        return;
      }

      setQrPage(page);

      fetchQrList(page, qrLimit);
    },
    [qrPages, qrLimit, fetchQrList],
  );

  // ==========================================
  // CHANGE QR LIMIT
  // ==========================================

  const handleQrLimitChange = useCallback(
    (newLimit) => {
      const limit = Number(newLimit);

      if (!limit || limit < 1) {
        return;
      }

      setQrLimit(limit);
      setQrPage(1);

      fetchQrList(1, limit);
    },
    [fetchQrList],
  );

  // ==========================================
  // GET PAGINATED DOCTORS
  // ==========================================

  const fetchDoctors = useCallback(
    async (search = "") => {
      try {
        setDoctorsLoading(true);

        const trimmedSearch = search.trim();

        console.log(
          "Fetching Doctors:",
          trimmedSearch ? `Search = ${trimmedSearch}` : "Initial 10 doctors",
        );

        const params = new URLSearchParams();

        params.append("page", "1");
        params.append("limit", "10");

        if (trimmedSearch) {
          params.append("search", trimmedSearch);
        }

        const response = await axios.get(
          `/api/doctors?${params.toString()}`,
          authConfig,
        );

        console.log("Doctors Response:", response.data);

        setDoctors(response.data.data || []);
      } catch (error) {
        console.error(
          "Doctors Error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    },
    [authConfig],
  );

  // ==========================================
  // INITIAL DOCTORS
  // ==========================================

  useEffect(() => {
    fetchDoctors("");
  }, [fetchDoctors]);

  // ==========================================
  // GET ALL DOCTORS FOR EXPORT
  // ==========================================

  const fetchAllDoctorsForExport = useCallback(async () => {
    try {
      console.log("Fetching ALL doctors for Excel export...");

      const response = await axios.get("/api/doctors/export", authConfig);

      console.log("Export Doctors Response:", response.data);

      const allDoctors = response.data.data || [];

      setExportDoctors(allDoctors);

      return allDoctors;
    } catch (error) {
      console.error(
        "Export Doctors Error:",
        error.response?.status,
        error.response?.data || error.message,
      );

      setExportDoctors([]);

      return [];
    }
  }, [authConfig]);

  // ==========================================
  // GET CAMPAIGNS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchCampaigns = async () => {
      try {
        setCampaignsLoading(true);

        console.log("Fetching Campaigns...");

        const response = await axios.get("/api/campaigns", authConfig);

        if (!cancelled) {
          console.log("Campaigns Response:", response.data);

          setCampaigns(response.data.data || response.data.campaigns || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Campaigns Error:",
            error.response?.status,
            error.response?.data || error.message,
          );

          setCampaigns([]);
        }
      } finally {
        if (!cancelled) {
          setCampaignsLoading(false);
        }
      }
    };

    fetchCampaigns();

    return () => {
      cancelled = true;
    };
  }, [authConfig]);

  // ==========================================
  // CREATE QR
  // ==========================================

  const handleGenerateQR = useCallback(
    async ({ doctorId, campaignId, videoUrl }) => {
      try {
        console.log("Generating QR with:", {
          doctorId,
          campaignId,
          videoUrl,
        });

        const payload = {
          doctorId,
          campaignId,
          quizId: null,
        };

        console.log("Create QR Payload:", payload);

        await axios.post("/api/qrcode/create", payload, authConfig);

        // ==========================================
        // REFRESH DASHBOARD
        // ==========================================

        const dashboardResponse = await axios.get(
          "/api/qrcode/dashboard",
          authConfig,
        );

        setQrData(dashboardResponse.data);

        // ==========================================
        // REFRESH CURRENT QR LIST PAGE
        // ==========================================

        await fetchQrList(qrPage, qrLimit);

        console.log("Video URL entered:", videoUrl);

        alert("QR code generated successfully.");
      } catch (error) {
        console.error(
          "Generate QR Error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        alert(error.response?.data?.message || "Failed to generate QR code.");
      }
    },
    [authConfig, fetchQrList, qrPage, qrLimit],
  );

  // ==========================================
  // EDIT QR
  // ==========================================

  const handleEditQR = useCallback(
    async (qrId, updateData) => {
      try {
        console.log("Updating QR:", {
          qrId,
          updateData,
        });

        const response = await axios.put(
          `/api/qrcode/edit/${qrId}`,
          updateData,
          authConfig,
        );

        console.log("Update QR Response:", response.data);

        const updatedQR = response.data.data;

        // ==========================================
        // UPDATE QR LIST WITHOUT PAGE REFRESH
        // ==========================================

        setQrList((previousList) =>
          previousList.map((qr) =>
            qr.id === updatedQR.id || qr._id === updatedQR._id ? updatedQR : qr,
          ),
        );

        // ==========================================
        // REFRESH DASHBOARD
        // ==========================================

        const dashboardResponse = await axios.get(
          "/api/qrcode/dashboard",
          authConfig,
        );

        setQrData(dashboardResponse.data);

        return updatedQR;
      } catch (error) {
        console.error(
          "Update QR Error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        throw error;
      }
    },
    [authConfig],
  );

  // ==========================================
  // GET QR GRAPH DATA
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchQRGraph = async () => {
      try {
        setGraphLoading(true);

        console.log("Fetching QR Graph Data:", graphRange);

        const response = await axios.get(
          `/api/qrcode/qr-scans-over-time?range=${graphRange}`,
          authConfig,
        );

        if (!cancelled) {
          console.log("QR Graph Response:", response.data);

          setQrGraphData(response.data.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "QR Graph Error:",
            error.response?.status,
            error.response?.data || error.message,
          );

          setQrGraphData([]);
        }
      } finally {
        if (!cancelled) {
          setGraphLoading(false);
        }
      }
    };

    fetchQRGraph();

    return () => {
      cancelled = true;
    };
  }, [graphRange, authConfig]);

  // ==========================================
  // GET TOP LOCATIONS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const fetchTopLocations = async () => {
      try {
        setLocationLoading(true);

        console.log("Fetching Top Locations...");

        const response = await axios.get(
          "/api/analytics/adminDashboard",
          authConfig,
        );

        if (!cancelled) {
          console.log("Admin Dashboard Response:", response.data);

          const dashboardData = response.data.data || {};

          setTotalScans(dashboardData.totalScans || 0);

          setTopCities(dashboardData.locationData?.topCities || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Top Locations Error:",
            error.response?.status,
            error.response?.data || error.message,
          );

          setTopCities([]);
          setTotalScans(0);
        }
      } finally {
        if (!cancelled) {
          setLocationLoading(false);
        }
      }
    };

    fetchTopLocations();

    return () => {
      cancelled = true;
    };
  }, [authConfig]);

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      {/* ================= QR DASHBOARD ================= */}

      <QrDashboard
        data={qrData}
        loading={loading}
        doctors={doctors}
        exportDoctors={exportDoctors}
        campaigns={campaigns}
        doctorsLoading={doctorsLoading}
        campaignsLoading={campaignsLoading}
        onSearchDoctors={fetchDoctors}
        onFetchExportDoctors={fetchAllDoctorsForExport}
        onGenerateQR={handleGenerateQR}
      />

      {/* ================= QR GRAPH ================= */}

      <QrGraph
        data={qrGraphData}
        loading={graphLoading}
        range={graphRange}
        setRange={setGraphRange}
        topCities={topCities}
        totalScans={totalScans}
        locationLoading={locationLoading}
      />

      {/* ================= QR BOTTOM ================= */}

      <QrBottom
        data={qrList}
        loading={qrListLoading}
        page={qrPage}
        pages={qrPages}
        total={qrTotal}
        limit={qrLimit}
        onPageChange={handleQrPageChange}
        onLimitChange={handleQrLimitChange}
        onEditQR={handleEditQR}
      />
    </>
  );
}

export default Qrcode;
