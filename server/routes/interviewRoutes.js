import express from "express";
import Interview from "../models/Interview.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/* SAVE INTERVIEW */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { interviewTitle, qa, feedback } = req.body;

    const interview = new Interview({
      userId: req.user.id,   // ✅ REAL USER
      interviewTitle,
      qa,
      feedback
    });

    await interview.save();

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to save interview" });
  }
});

/* FETCH INTERVIEWS (Dashboard) */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const interviews = await Interview.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(interviews);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch interviews" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    await Interview.findByIdAndDelete(id);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete interview" });
  }
});

export default router;
