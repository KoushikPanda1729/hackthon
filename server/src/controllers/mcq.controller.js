import { MCQ } from "../models/mcq.model.js";
import ApiError from "../utils/ApiErrors.util.js";
import ApiResponces from "./../utils/ApiResponces.util.js";

const createMCQ = async (req, res) => {
  try {
    const { question, answers, category } = req.body;

    // Ensure exactly one correct answer
    const correctAnswersCount = answers.filter(
      (answer) => answer.isCorrect
    ).length;
    if (correctAnswersCount !== 1) {
      return res
        .status(400)
        .json({ message: "There must be exactly one correct answer." });
    }

    const existingQuestion = await MCQ.findOne({ question });

    if (existingQuestion?.question) {
      return res
        .status(400)
        .json({ message: "A question with this text already exists." });
    }

    const newMCQ = new MCQ({
      question,
      answers,
      category,
    });

    await newMCQ.save();
    return res
      .status(201)
      .json(new ApiResponces(200, { mcq: newMCQ }, "MCQ created successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(400, "Error creating MCQ", error.message));
  }
};

const getAllMCQs = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const mcqs = await MCQ.find(query);

    const totalQuestions = mcqs.length;
    const totalMarks = totalQuestions;

    return res.status(200).json({
      totalQuestions,
      totalMarks,
      mcqs,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching MCQs",
      error: error.message,
    });
  }
};

const updateMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answers, category } = req.body;

    const correctAnswersCount = answers.filter(
      (answer) => answer.isCorrect
    ).length;
    if (correctAnswersCount !== 1) {
      return res
        .status(400)
        .json({ message: "There must be exactly one correct answer." });
    }
    const existingQuestion = await MCQ.findOne({ question });

    if (existingQuestion?.question) {
      return res
        .status(400)
        .json({ message: "A question with this text already exists." });
    }
    const updatedMCQ = await MCQ.findByIdAndUpdate(
      id,
      { question, answers, category },
      { new: true }
    );

    if (!updatedMCQ) {
      return res.status(404).json({ message: "MCQ not found" });
    }

    res
      .status(200)
      .json({ message: "MCQ updated successfully", mcq: updatedMCQ });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating MCQ", error: error.message });
  }
};

const deleteMCQ = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMCQ = await MCQ.findByIdAndDelete(id);

    if (!deletedMCQ) {
      return res.status(404).json({ message: "MCQ not found" });
    }

    res
      .status(200)
      .json({ message: "MCQ deleted successfully", mcq: deletedMCQ });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting MCQ", error: error.message });
  }
};

const getObtainedMarks = async (req, res) => {
  try {
    const { answers } = req.body;
    console.log(answers);
    let obtainedMarks = 0;

    for (const answer of answers) {
      const { questionId, answerId } = answer;

      // Find the MCQ in the database
      const mcq = await MCQ.findById(questionId);

      if (!mcq) {
        return res
          .status(404)
          .json(new ApiError(404, `MCQ not found for ID: ${questionId}`));
      }

      // Find the correct answer from the database
      const correctAnswer = mcq.answers.find((ans) => ans.isCorrect === true);

      // Compare the user's answer with the correct answer
      if (correctAnswer && correctAnswer._id === answerId) {
        obtainedMarks += 1; // Increase marks for each correct answer
      }
    }

    return res
      .status(200)
      .json(
        new ApiResponces(200, { obtainedMarks }, "Marks obtained successfully")
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error calculating marks", error.message));
  }
};

export { createMCQ, getAllMCQs, updateMCQ, deleteMCQ, getObtainedMarks };
