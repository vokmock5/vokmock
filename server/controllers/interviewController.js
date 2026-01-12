export const getInterviews = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const interviews = await Interview.find({
      user: req.user._id
    }).sort({ createdAt: -1 });

    res.status(200).json({ interviews });
  } catch (error) {
    console.error("GET INTERVIEWS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
