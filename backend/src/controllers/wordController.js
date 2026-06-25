const pool = require("../db");

function mapRow(row) {
  return {
    id: String(row.id),
    hanzi: row.hanzi,
    pinyin: row.pinyin || "",
    meaning: row.meaning,
    lesson: row.lesson || "",
    example: row.example || "",
    note: row.note || "",
    learned: Boolean(row.learned),
  };
}

async function listWords(req, res) {
  const [rows] = await pool.query(
    "SELECT id, hanzi, pinyin, meaning, lesson, example, note, learned FROM words ORDER BY id DESC"
  );
  res.json(rows.map(mapRow));
}

async function createWord(req, res) {
  const {
    hanzi = "",
    pinyin = "",
    meaning = "",
    lesson = "",
    example = "",
    note = "",
  } = req.body || {};

  if (!hanzi.trim() || !meaning.trim()) {
    return res.status(400).json({ message: "hanzi va meaning la bat buoc" });
  }

  const [result] = await pool.query(
    "INSERT INTO words (hanzi, pinyin, meaning, lesson, example, note, learned) VALUES (?, ?, ?, ?, ?, ?, 0)",
    [hanzi.trim(), pinyin.trim(), meaning.trim(), lesson.trim(), example.trim(), note.trim()]
  );

  const [rows] = await pool.query(
    "SELECT id, hanzi, pinyin, meaning, lesson, example, note, learned FROM words WHERE id = ?",
    [result.insertId]
  );

  res.status(201).json(mapRow(rows[0]));
}

async function updateLearned(req, res) {
  const { id } = req.params;
  const { learned } = req.body || {};

  if (typeof learned !== "boolean") {
    return res.status(400).json({ message: "learned phai la boolean" });
  }

  const [result] = await pool.query("UPDATE words SET learned = ? WHERE id = ?", [learned ? 1 : 0, id]);

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Khong tim thay tu vung" });
  }

  const [rows] = await pool.query(
    "SELECT id, hanzi, pinyin, meaning, lesson, example, note, learned FROM words WHERE id = ?",
    [id]
  );

  res.json(mapRow(rows[0]));
}

async function deleteWord(req, res) {
  const { id } = req.params;
  const [result] = await pool.query("DELETE FROM words WHERE id = ?", [id]);

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Khong tim thay tu vung" });
  }

  res.status(204).send();
}

module.exports = {
  listWords,
  createWord,
  updateLearned,
  deleteWord,
};
