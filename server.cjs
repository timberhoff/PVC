const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase payload limit
app.use(express.urlencoded({ extended: true, limit: "50mb" })); 


// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",   // Your MySQL username (default is 'root')
  password: "8320",   // Your MySQL password (leave empty if none)
  database: "pvc_tracker",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database ✅");
  }
});

// Get Next Available PVC ID
// ✅ Test route to check if backend is working
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.post("/generate-pvc-id", async (req, res) => {
  try {
      console.log("✅ Received Request to Generate PVC ID");
      console.log("Request Body:", req.body);

      const { length, width } = req.body;
      if (!length || !width) {
          console.error("❌ Missing Length or Width");
          return res.status(400).json({ error: "Missing length or width" });
      }

      // ✅ Find the highest queue number
      const [result] = await db.promise().query(
          "SELECT MAX(CAST(SUBSTRING(pvc_id, 5, 4) AS UNSIGNED)) AS maxQueue FROM pvc_records WHERE pvc_id LIKE ?",
          [`${length}${width}%`]
      );

      console.log("🔍 Database Result:", result);

      let nextQueue = (result[0].maxQueue || 0) + 1;
      let queueStr = String(nextQueue).padStart(4, "0");
      const pvcId = `${length}${width}${queueStr}`;

      console.log("✅ Generated PVC ID:", pvcId);
      res.json({ pvc_id: pvcId });

  } catch (error) {
      console.error("❌ Error Generating PVC ID:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});
// Store PVC in Database
app.post("/add-pvc", (req, res) => {
  const { pvc_id, length, width } = req.body;

  db.query(
    "INSERT INTO pvc_records (pvc_id, length, width) VALUES (?, ?, ?)",
    [pvc_id, length, width],
    (err) => {
      if (err) {
        console.error("Failed to save PVC:", err);
        return res.status(500).json({ error: "Failed to save PVC" });
      }
      res.json({ success: true });
    }
  );
});

// Fetch Existing Condition
app.get("/get-pvc/:id", (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT pvc_id, length, width, `condition`, damages FROM pvc_records WHERE pvc_id = ?",
    [id],
    (err, results) => {
      if (err) {
        console.error("Failed to fetch PVC details:", err);
        return res.status(500).json({ error: "Failed to fetch PVC details" });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "PVC not found" });
      }

      const pvcData = results[0];
      pvcData.damages = pvcData.damages ? JSON.parse(pvcData.damages) : []; // Convert damages JSON to array

      res.json(pvcData);
    }
  );
});


// Save Condition & Damages
app.post("/save-condition/:pvcId", async (req, res) => {
  try {
      console.log("✅ Received Data:", req.body); // Debugging incoming data

      const { condition, damages } = req.body;
      const pvcId = req.params.pvcId;

      // ✅ Check if condition & damages exist
      if (!condition.trim() || !Array.isArray(damages)) {
          console.error("❌ Missing condition or damages data");
          return res.status(400).json({ error: "Missing condition or damages data" });
      }

      // ✅ Fix: Convert damages array to JSON string safely
      const damagesJson = JSON.stringify(damages);

      // ✅ Save to Database
      await db.promise().query(
          "UPDATE pvc_records SET `condition` = ?, damages = ? WHERE pvc_id = ?",
          [condition, damagesJson, pvcId]
      );

      console.log("✅ Successfully saved condition for:", pvcId);
      res.json({ success: true });

  } catch (error) {
      console.error("❌ Failed to save condition:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});




// Start Server
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
