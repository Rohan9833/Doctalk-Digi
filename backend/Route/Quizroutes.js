const express = require("express");
const router = express.Router();
const { protect, restrictTo } = require("../Controller/Authmiddleware");
const {
  getAllQuizzes,
  getQuizById,
  createNewQuiz,
  updateQuiz,
  deleteQuiz,
  updateSingleQuestion,
  getQuizDashBoardData,
} = require("../Controller/Quizcontroller");

router.get("/dashboard", getQuizDashBoardData)
router.post("/", createNewQuiz);

router.use(protect);

router.get("/", getAllQuizzes);
router.get("/:id", getQuizById);
// router.post("/", createQuiz);
router.put("/:id", updateQuiz);
router.patch("/:id/questions/:questionNumber", updateSingleQuestion);
router.delete("/:id", restrictTo("superadmin", "admin"), deleteQuiz);

module.exports = router;