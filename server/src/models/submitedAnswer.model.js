import mongoose, { Schema } from "mongoose";

// Answer schema for both user's answer and correct answer
const answerSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

// Each question result schema
const resultSchema = new Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "MCQ", // Assuming the questions come from the MCQ collection
  },
  question: {
    type: String,
    required: true,
  },
  userAnswerText: {
    type: answerSchema, // User's selected answer schema
    default: null, // Can be null if no answer was provided
  },
  correctAnswerText: {
    type: answerSchema, // Correct answer schema
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
});

// Main schema to store the quiz report for a user
const resultReportSchema = new Schema(
  {
    owner: {
      type: String,
    },
    obtainedMarks: {
      type: Number,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    results: [resultSchema], // Array of question results
  },
  { timestamps: true } // Auto-generates createdAt and updatedAt fields
);

// Create and export the model
const ResultReport = mongoose.model("ResultReport", resultReportSchema);
export default ResultReport;
