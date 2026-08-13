// src/components/Doctor/DoctorPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DoctorPage = () => {
  const { slug } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchDoctorPage();
  }, [slug]);

  const fetchDoctorPage = async () => {
    try {
      // This calls your backend endpoint
      const response = await axios.get(`/api/doctors/page/${slug}`);
      
      if (response.data.success) {
        setDoctor(response.data.data.doctor);
        setQuiz(response.data.data.quiz);
      }
    } catch (err) {
      console.error('Failed to load doctor page:', err);
      setError('Page not found or not published');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md">
          <div className="text-6xl mb-4">👨‍⚕️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
          <p className="text-gray-500 mb-6">{error || 'This doctor page is not available'}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (showQuiz && quiz) {
    return <QuizComponent doctor={doctor} quiz={quiz} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Doctor Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          {doctor.photo && (
            <img 
              src={doctor.photo} 
              alt={doctor.name}
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white"
            />
          )}
          <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
          <p className="text-blue-100">{doctor.specialty}</p>
          <p className="text-blue-100 text-sm mt-1">{doctor.clinic}, {doctor.city}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to my Quiz</h2>
          <p className="text-gray-600 mb-6">
            Test your knowledge about important health topics. This quiz is designed 
            to educate and raise awareness.
          </p>

          {doctor.videos?.opening && (
            <div className="mb-8">
              <video 
                src={doctor.videos.opening} 
                controls 
                className="w-full rounded-lg"
                poster="https://via.placeholder.com/800x400?text=Video+Thumbnail"
              />
            </div>
          )}

          <button
            onClick={handleStartQuiz}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Start Quiz
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">
            This quiz takes about 2-3 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
};

// Simple Quiz Component (you can expand this)
const QuizComponent = ({ doctor, quiz }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());

  const handleAnswer = async (selectedOption) => {
    const question = quiz.questions[currentQuestion];
    const isCorrect = selectedOption === question.correctAnswer;
    
    const newAnswers = [...answers, {
      questionNumber: currentQuestion + 1,
      selectedOption: selectedOption,
      isCorrect: isCorrect,
      timeTaken: 0
    }];
    
    setAnswers(newAnswers);
    if (isCorrect) setScore(score + 1);
    
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit quiz
      await submitQuiz(newAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      // First start the attempt
      const startRes = await axios.post('/api/attempts/start', {
        doctorId: doctor.id,
        campaignId: quiz.campaign,
        quizId: quiz._id,
        sessionId: sessionId
      });
      
      const attemptId = startRes.data.data.attemptId;
      
      // Submit the attempt
      await axios.post(`/api/attempts/${attemptId}/submit`, {
        score: finalAnswers.filter(a => a.isCorrect).length,
        answers: finalAnswers
      });
      
      setCompleted(true);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    }
  };

  if (completed) {
    const percentage = (score / quiz.questions.length) * 100;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
          <p className="text-gray-600 mb-4">
            You scored {score} out of {quiz.questions.length}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
            <div 
              className="bg-green-600 h-4 rounded-full transition-all"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl w-full">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-500">
              {quiz.timePerQuestion} seconds per question
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {question.questionText}
        </h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <span className="font-medium text-gray-800">{String.fromCharCode(65 + idx)}.</span>
              <span className="ml-3 text-gray-700">{option}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-sm text-gray-400">
          <span>Doctor: {doctor.name}</span>
          <span>Educational Quiz</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorPage;