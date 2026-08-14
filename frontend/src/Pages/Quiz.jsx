
import React, { useEffect, useState } from "react";
import axios from "axios";

import QuizHeader from "../components/quiz components/QuizHeader";
import QuizStats from "../components/quiz components/QuizStats";
import QuizFilters from "../components/quiz components/QuizFilters";
import QuizTable from "../components/quiz components/QuizTable";
import QuizSidebar from "../components/quiz components/QuizSidebar";
import QuizForm from "../Components/quiz components/QuizForm";

function Quizzes() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [campaign, setCampaign] = useState([]);
  const [search, setSearch] = useState("");
  const [therapyArea, setTherapyArea] = useState("All");
  const [client, setClient] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);




  useEffect(() => {
    const fetchQuizDashboard = async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit,
        };

        if (search.trim()) {
          params.search = search.trim();
        }

        if (therapyArea !== "All") {
          params.therapyArea = therapyArea;
        }

        if (client !== "All") {
          params.client = client;
        }

        if (status !== "All") {
          params.status = status;
        }

        console.log("API PARAMS:", params);

        const response = await axios.get(
          "/api/quizzes/dashboard",
          {
            params,
          }
        );

        console.log(
          "API RESPONSE for quizz:",
          response
        );

        setQuizData(response.data);

      } catch (error) {
        console.error(
          "Quiz Dashboard Error:",
          error.response?.status,
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDashboard();

  }, [
    search,
    therapyArea,
    client,
    status,
    page,
    limit,
  ]);

  // ==========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================

  useEffect(() => {
    setPage(1);
  }, [
    search,
    therapyArea,
    client,
    status,
  ]);

  // ==========================================
  // GET CAMPAIGNS FOR QUIZ FORM
  // ==========================================

  useEffect(() => {
    if (!showForm) return;

    const fetchCampaigns = async () => {
      try {
        const response = await axios.get(
          "/api/campaigns/campaignList"
        );

        if (response.status === 200) {
          setCampaign(
            response.data?.campaignSelector || []
          );
        }

      } catch (error) {
        console.error(
          "Campaign API Error:",
          error
        );
      }
    };

    fetchCampaigns();

  }, [showForm]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !quizData) {
    return (
      <div className="p-6 text-center">
        Loading quizzes...
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="p-6 space-y-6  min-h-screen">

      {showForm ? (

        <QuizForm
          cancel={() => setShowForm(false)}
          campaign={campaign}
        />

      ) : (

        <>
          {/* HEADER */}

          <QuizHeader
            setShowForm={setShowForm}
            data={quizData}
          />

          {/* STATS */}

          <QuizStats
            data={quizData}
          />

          <div className="grid grid-cols-12 gap-6">

            {/* LEFT */}

            <div className="col-span-12 lg:col-span-9">

              {/* FILTERS */}

              <QuizFilters
                data={quizData}

                search={search}
                setSearch={setSearch}

                therapyArea={therapyArea}
                setTherapyArea={setTherapyArea}

                client={client}
                setClient={setClient}

                status={status}
                setStatus={setStatus}

                setPage={setPage}
              />

              {/* TABLE */}

              <QuizTable
                data={quizData}
                onSelect={setSelectedQuiz}

                page={page}
                setPage={setPage}

                limit={limit}
                setLimit={setLimit}
              />

            </div>

            {/* RIGHT */}

            <div className="col-span-12 lg:col-span-3">

              <QuizSidebar
                quiz={selectedQuiz}
              />

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default Quizzes;