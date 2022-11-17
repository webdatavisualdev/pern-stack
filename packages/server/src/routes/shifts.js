const express = require("express");

const db = require("../db");

const router = express.Router();

// GET /api/shifts
// get all the shifts
router.get("/", async (req, res) => {
  const client = await db.pool.connect();
  const { rows } = await client.query(
    "SELECT Q.*, F.facility_name FROM question_one_shifts AS Q LEFT JOIN facilities as F ON Q.facility_id=F.facility_id;"
  );
  res.status(200).json({ shifts: rows });
  client.release();
});

router.post("/overlap", async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Bad request" });
  }
  const { shiftA, shiftB } = req.body;
  if (
    !shiftA?.facility_id ||
    !shiftB?.facility_id ||
    !shiftA?.start_time ||
    !shiftB?.start_time ||
    !shiftA?.end_time ||
    !shiftB?.end_time ||
    !shiftA?.shift_date ||
    !shiftB?.shift_date
  ) {
    return res.status(400).json({ message: "Bad request" });
  }
  if (shiftA.facility_id !== shiftB.facility_id) {
    return res.json({
      overlap_minutes: 0,
      maximum_overlap: 0,
      exceeds_overlap: false,
    });
  }
  const shiftAStartTime = new Date(
    `${shiftA.shift_date}T${shiftA.start_time}`
  ).getTime();
  const shiftAStopTime = new Date(
    `${shiftA.shift_date}T${shiftA.end_time}`
  ).getTime();
  const shiftBStartTime = new Date(
    `${shiftB.shift_date}T${shiftB.start_time}`
  ).getTime();
  const shiftBStopTime = new Date(
    `${shiftB.shift_date}T${shiftB.end_time}`
  ).getTime();
  let overlap_minutes = 0;
  if (shiftBStopTime > shiftAStopTime && shiftAStopTime > shiftBStartTime) {
    overlap_minutes = (shiftAStopTime - shiftBStartTime) / 60000;
  } else if (
    shiftAStopTime > shiftBStopTime &&
    shiftBStopTime > shiftAStartTime
  ) {
    overlap_minutes = (shiftBStopTime - shiftAStartTime) / 60000;
  }
  res.json({
    overlap_minutes,
    maximum_overlap: 30,
    exceeds_overlap: overlap_minutes > 0,
  });
});

module.exports = router;
