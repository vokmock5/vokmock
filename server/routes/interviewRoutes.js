// import express from "express";
// import Interview from "../models/Interview.js";
// import authMiddleware from "../middleware/auth.js";

// const router = express.Router();

// /* SAVE INTERVIEW */
// router.post("/", authMiddleware, async (req, res) => {
//   try {
//     const { interviewTitle, qa, feedback } = req.body;

//     const interview = new Interview({
//       userId: req.user._id, // ✅ FIXED
//       interviewTitle,
//       qa,
//       feedback
//     });

//     await interview.save();

//     res.status(201).json({ success: true });
//   } catch (err) {
//     console.error("SAVE INTERVIEW ERROR:", err);
//     res.status(500).json({ error: "Failed to save interview" });
//   }
// });

// /* FETCH INTERVIEWS (Dashboard) */
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const interviews = await Interview.find({
//       userId: req.user._id // ✅ FIXED
//     }).sort({ createdAt: -1 });

//     // 🔥 VERY IMPORTANT: frontend expects object
//     res.status(200).json({ interviews });
//   } catch (err) {
//     console.error("FETCH INTERVIEWS ERROR:", err);
//     res.status(500).json({ error: "Failed to fetch interviews" });
//   }
// });

// /* DELETE INTERVIEW */
// router.delete("/:id", authMiddleware, async (req, res) => {
//   try {
//     await Interview.findByIdAndDelete(req.params.id);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("DELETE INTERVIEW ERROR:", err);
//     res.status(500).json({ error: "Failed to delete interview" });
//   }
// });

// export default router;

import express from "express";
import Interview from "../models/Interview.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


/* SAVE INTERVIEW */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { interviewTitle, qa, feedback } = req.body;

    const summary =
  (feedback?.strengths?.[0]) ||
  (feedback?.areasToImprove?.[0]) ||
  (feedback?.improvementTips?.[0]) ||
  "No summary available";
    const interview = new Interview({
      userId: req.user._id, // ✅ OLD STYLE (WORKING)
      interviewTitle,
      qa,
      feedback,
      summary,
    });

    await interview.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error("SAVE INTERVIEW ERROR:", err);
    res.status(500).json({ error: "Failed to save interview" });
  }
});

/* FETCH INTERVIEWS */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user._id // ✅ OLD STYLE (WORKING)
    }).sort({ createdAt: -1 });

    res.status(200).json({ interviews });
  } catch (err) {
    console.error("FETCH INTERVIEWS ERROR:", err);
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
});

/* DELETE INTERVIEW */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE INTERVIEW ERROR:", err);
    res.status(500).json({ error: "Failed to delete interview" });
  }
});

export default router;

