const mongoose = require("mongoose");
const Result = require("../models/Result"); // Sesuaikan path import
const Question = require("../models/Question"); // Import juga model Question untuk validasi

const submitAnswer = async (req, res) => {
  try {
    const { exam, userId, answers } = req.body;

    console.log("Received payload:", { exam, userId, answers }); // Log payload

    // Validasi input
    if (!exam || !userId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "Data input tidak valid",
      });
    }

    // Validasi ObjectId
    try {
      new mongoose.Types.ObjectId(exam);
      new mongoose.Types.ObjectId(userId);

      answers.forEach((answer) => {
        new mongoose.Types.ObjectId(answer.questionId);
      });
    } catch (idError) {
      return res.status(400).json({
        message: "ID tidak valid",
        error: idError.message,
      });
    }

    // Cek apakah ujian ada
    const questionSet = await Question.findById(exam);
    if (!questionSet) {
      return res.status(404).json({
        message: "Ujian tidak ditemukan",
      });
    }

    // Proses jawaban dengan perhitungan skor
    const updatedAnswers = answers.map((answer) => {
      const question = questionSet.questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      if (!question) {
        throw new Error(`Soal dengan ID ${answer.questionId} tidak ditemukan`);
      }

      const isCorrect = question.correctOption === answer.userAnswer;
      const score = isCorrect ? question.score || 5 : 0;

      return {
        questionId: new mongoose.Types.ObjectId(answer.questionId),
        userAnswer: answer.userAnswer,
        isCorrect: isCorrect,
        score: score,
      };
    });

    // Hitung total skor
    const totalScore = updatedAnswers.reduce(
      (total, answer) => total + answer.score,
      0
    );

    // Buat result baru
    const result = new Result({
      exam: new mongoose.Types.ObjectId(exam),
      userId: new mongoose.Types.ObjectId(userId),
      answers: updatedAnswers,
      totalScore: totalScore,
    });

    // Simpan result
    await result.save();

    res.status(200).json({
      message: "Hasil ujian berhasil disimpan",
      result: {
        totalScore: result.totalScore,
        isPassed: totalScore >= questionSet.questions.length * 5 * 0.6, // contoh passing grade 60%
      },
    });
  } catch (error) {
    console.error("Full Error:", error);
    res.status(500).json({
      message: "Terjadi kesalahan saat menyimpan hasil",
      error: error.message,
      errorDetails: error.stack,
    });
  }
};

const getResult = async (req, res) => {
  try {
    const { userId } = req.params;

    const results = await Result.find({ userId });
    if (results.length === 0)
      return res.status(404).json({ message: "No results found" });

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllResults = async (req, res) => {
  try {
    const results = await Result.find().populate("userId", "username email");
    if (results.length === 0)
      return res.status(404).json({ message: "No results found" });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitAnswer, getResult, getAllResults };
