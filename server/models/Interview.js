import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    interviewTitle: {
      type: String,
      default: "Mock Interview"
    },

    qa: [
      {
        question: String,
        answer: String
      }
    ],

    feedback: {
      strengths: [String],
      weaknesses: [String],
      improvementTips: [String],

      overallPerformance: String,
      confidenceLevel: String,
      score: Number
    }
  },
  { timestamps: true } // createdAt, updatedAt
);

export default mongoose.model("Interview", interviewSchema);
