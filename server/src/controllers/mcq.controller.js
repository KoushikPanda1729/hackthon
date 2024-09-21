import { MCQ } from "../models/mcq.model.js";
import ApiError from "../utils/ApiErrors.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiResponces from "./../utils/ApiResponces.util.js";

const createMCQ = asyncHandler(async (req, res) => {
  try {
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
});

const getAllMCQs = asyncHandler(async (req, res) => {
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
});

const updateMCQ = asyncHandler(async (req, res) => {
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
});

const deleteMCQ = asyncHandler(async (req, res) => {
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
});

const createResultReport = async (req, res) => {
  try {
    const answers = req.body; // The array of user answers
    let obtainedMarks = 0;
    const totalMarks = answers.length;
    const results = [];

    for (const answer of answers) {
      const { questionId, answerId, timeSpent } = answer;

      // Find the MCQ in the database
      const mcq = await MCQ.findById(questionId);

      if (!mcq) {
        return res
          .status(404)
          .json(new ApiError(404, `MCQ not found for ID: ${questionId}`));
      }

      const correctAnswer = mcq.answers.find((ans) => ans.isCorrect === true);
      const userAnswer = mcq.answers.find(
        (ans) => ans._id.toString() === answerId
      );

      const isCorrect =
        correctAnswer && correctAnswer._id.toString() === answerId;

      // Add to the total marks if the answer is correct
      if (isCorrect) {
        obtainedMarks += 1;
      }

      // Add this question's result to the results array
      results.push({
        questionId: mcq._id,
        question: mcq.question,
        userAnswerText: userAnswer ? userAnswer : null, // Text of the user's selected answer
        correctAnswerText: correctAnswer ? correctAnswer : null, // Text of the correct answer
        isCorrect: isCorrect,
        timeSpent: timeSpent, // Time spent on this question
      });
    }

    // Return the final report
    return res.status(200).json(
      new ApiResponces(
        200,
        {
          obtainedMarks,
          totalMarks,
          results, // List of question results
        },
        "Marks obtained successfully"
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error calculating marks", error.message));
  }
};

export { createMCQ, getAllMCQs, updateMCQ, deleteMCQ, createResultReport };
