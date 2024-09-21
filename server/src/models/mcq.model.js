import mongoose from "mongoose";

const MCQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answers: [
    {
      text: {
        type: String,
        required: true,
      },
      isCorrect: {
        type: Boolean,
        default: false, // Only one of the answers should be correct
      },
    },
  ],
  category: {
    type: String,
    required: true,
    enum: ["coding", "database", "algorithms", "data-structures", "general"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

MCQSchema.index({ category: 1 });

const MCQ = mongoose.model("MCQ", MCQSchema);
export { MCQ };
