import express from "express";
import Weather from "../models/Weather.js";

const router = express.Router();

// ✅ Save new weather data
router.post("/save", async (req, res) => {
  try {
    const { userId, city, temperature, description, humidity } = req.body;
    const newWeather = new Weather({
      userId,
      city,
      temperature,
      description,
      humidity,
      savedAt: new Date(),
    });
    const savedWeather = await newWeather.save();
    res.status(200).json(savedWeather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Fetch all saved weather entries for a user
router.get("/saved/:userId", async (req, res) => {
  try {
    const weathers = await Weather.find({ userId: req.params.userId }).sort({
      savedAt: -1,
    });
    res.status(200).json(weathers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a saved weather entry
router.put("/update/:id", async (req, res) => {
  try {
    const { temperature, description, humidity, refreshedAt } = req.body;
    const updatedWeather = await Weather.findByIdAndUpdate(
      req.params.id,
      { temperature, description, humidity, refreshedAt },
      { new: true }
    );
    if (!updatedWeather)
      return res.status(404).json({ message: "Weather not found" });
    res.status(200).json(updatedWeather);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE weather by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWeather = await Weather.findByIdAndDelete(id);

    if (!deletedWeather) {
      return res.status(404).json({ message: "Weather record not found" });
    }

    res.status(200).json({ message: "Weather record deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting weather:", error);
    res.status(500).json({ message: "Server error while deleting weather" });
  }
});

export default router;
