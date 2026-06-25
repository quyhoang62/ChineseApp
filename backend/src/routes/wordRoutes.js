const express = require("express");
const {
  listWords,
  createWord,
  updateLearned,
  deleteWord,
} = require("../controllers/wordController");

const router = express.Router();

router.get("/words", listWords);
router.post("/words", createWord);
router.patch("/words/:id/learned", updateLearned);
router.delete("/words/:id", deleteWord);

module.exports = router;
