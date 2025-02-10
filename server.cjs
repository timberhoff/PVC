const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

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
app.post("/generate-pvc-id", (req, res) => {
  const { length, width } = req.body;
  const lengthPart = String(length).padStart(2, "0");  // Ensure 2 digits
  const widthPart = String(width).padStart(2, "0").slice(0, 2);  // Get first 2 digits

  db.query(
    "SELECT MAX(SUBSTRING(pvc_id, 5, 4)) AS lastQueue FROM pvc_records WHERE pvc_id LIKE ?",
    [`${lengthPart}${widthPart}%`],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }

      const lastQueue = result[0]?.lastQueue || "0000";
      const nextQueue = String(Number(lastQueue) + 1).padStart(4, "0");

      const newPvcId = `${lengthPart}${widthPart}${nextQueue}`;
      res.json({ pvc_id: newPvcId });
    }
  );
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
app.get("/get-condition/:pvcId", (req, res) => {
  const { pvcId } = req.params;
  db.query(
    "SELECT condition, damages FROM pvc_records WHERE pvc_id = ?",
    [pvcId],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(result[0] || {});
      }
    }
  );
});

// Save Condition & Damages
app.post("/save-condition/:pvcId", (req, res) => {
  const { pvcId } = req.params;
  const { condition, damages } = req.body;

  db.query(
    "UPDATE pvc_records SET condition = ?, damages = ? WHERE pvc_id = ?",
    [condition, JSON.stringify(damages), pvcId],
    (err) => {
      if (err) {
        res.status(500).json({ error: "Failed to save condition" });
      } else {
        res.json({ success: true });
      }
    }
  );
});


// Start Server
app.listen(5000, () => console.log("Server running on port 5000 🚀"));
