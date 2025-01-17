const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        questionId: {
          type: Number,
          unique: false, // Ubah menjadi false
        },
        question: {
          type: String,
          required: true,
          trim: true,
        },
        optionA: {
          type: String,
          required: true,
          trim: true,
        },
        optionB: {
          type: String,
          required: true,
          trim: true,
        },
        optionC: {
          type: String,
          required: true,
          trim: true,
        },
        optionD: {
          type: String,
          required: true,
          trim: true,
        },
        correctOption: {
          type: String,
          required: true,
          enum: ["A", "B", "C", "D"],
        },
        score: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware untuk menghasilkan questionId unik sebelum validasi
questionSchema.pre("validate", function (next) {
  if (this.questions && this.questions.length > 0) {
    this.questions.forEach((question, index) => {
      question.questionId = index + 1;
    });
  }
  next();
});

module.exports = mongoose.model("Question", questionSchema);
