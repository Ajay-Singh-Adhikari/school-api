import express from "express";
import pool from "./db.js";
import Joi from "joi";

const app = express();
app.use(express.json());

// Validation schema
const schoolSchema = Joi.object({
  name: Joi.string().min(2).max(255).required(),
  address: Joi.string().min(5).max(255).required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});


// Add School API
app.post("/addSchool", async (req, res) => {
  try {
    const { error, value } = schoolSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });
    }

    const { name, address, latitude, longitude } = value;

    const [result] = await pool.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );

    res.status(201).json({
      success: true,
      message: "School added successfully",
      schoolId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}); 

// List Schools API
app.get("/listSchools", async (req, res) => {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
      return res.status(400).json({
        success: false,
        error:
          "latitude and longitude query parameters are required and must be numbers",
      });
    }

    const [schools] = await pool.query("SELECT * FROM schools");

    // Haversine distance function
    function getDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Earth radius in km
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // in kilometers
    }

    // Add distance field to each school
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance: getDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      ),
    }));

    // Sort by distance
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json({ success: true, schools: schoolsWithDistance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

const PORT =process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
