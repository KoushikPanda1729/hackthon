import { MCQ } from "../models/mcq.model.js";
import ResultReport from "../models/submitedAnswer.model.js";
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
    // const existingQuestion = await MCQ.findOne({
    //   question: question.trim(),
    //   category: category.trim(),
    // });

    // if (existingQuestion?.question) {
    //   return res
    //     .status(400)
    //     .json({ message: "A question with this text already exists." });
    // }
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
    console.log("Creating result report for user:", req?.user?._id);

    const userId = req?.user?._id;
    const answers = req.body;
    let obtainedMarks = 0;
    const totalMarks = answers.length;
    const results = [];

    // Log user answers
    console.log("User answers:", answers);

    for (const answer of answers) {
      const { questionId, answerId, timeSpent } = answer;

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
      if (isCorrect) obtainedMarks += 1;

      results.push({
        questionId: mcq._id,
        question: mcq.question,
        userAnswerText: userAnswer ? userAnswer : null,
        correctAnswerText: correctAnswer ? correctAnswer : null,
        isCorrect: isCorrect,
        timeSpent: timeSpent,
      });
    }
    const resultReport = new ResultReport({
      owner: userId,
      obtainedMarks,
      totalMarks,
      results,
    });

    await resultReport.save();
    console.log("Result report saved successfully.");

    return res
      .status(200)
      .json(
        new ApiResponces(
          200,
          { obtainedMarks, totalMarks, results },
          "Marks obtained successfully"
        )
      );
  } catch (error) {
    console.log("Error while creating result report:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error calculating marks", error.message));
  }
};

const createResultReportForAdmin = async (req, res) => {
  try {
    console.log("Creating result report for user:", req?.user?._id);

    const userId = req?.user?._id;
    const answers = req.body;
    let obtainedMarks = 0;
    const totalMarks = answers.length;
    const results = [];

    // Log user answers
    console.log("User answers:", answers);

    for (const answer of answers) {
      const { questionId, answerId, timeSpent } = answer;

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
      if (isCorrect) obtainedMarks += 1;

      results.push({
        questionId: mcq._id,
        question: mcq.question,
        userAnswerText: userAnswer ? userAnswer : null,
        correctAnswerText: correctAnswer ? correctAnswer : null,
        isCorrect: isCorrect,
        timeSpent: timeSpent,
      });
    }

    // Log before saving
    console.log("Saving result report for user:", userId);

    console.log("Result report saved successfully.");

    return res
      .status(200)
      .json(
        new ApiResponces(
          200,
          { obtainedMarks, totalMarks, results },
          "Marks obtained successfully"
        )
      );
  } catch (error) {
    console.log("Error while creating result report:", error);
    return res
      .status(500)
      .json(new ApiError(500, "Error calculating marks", error.message));
  }
};

const getAllResultReport = async (req, res) => {
  try {
    // Populate the owner field with user details
    const allReports = await ResultReport.find().populate(
      "owner",
      "userName email"
    );

    console.log(allReports);

    return res
      .status(200)
      .json(
        new ApiResponces(
          200,
          { allReports },
          "All reports fetched successfully"
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiError(500, "Error fetching reports", error.message));
  }
};

export {
  createMCQ,
  getAllMCQs,
  updateMCQ,
  deleteMCQ,
  createResultReport,
  createResultReportForAdmin,
  getAllResultReport,
};
