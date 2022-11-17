const express = require("express");

const db = require("../db");

const router = express.Router();

// GET /api/queries
router.get("/q4", async (req, res) => {
  const client = await db.pool.connect();
  const { rows } = await client.query(`
    SELECT 
      facility_id,
      nurse_type_needed,
      (SUM(total_number_nurses_needed) - COUNT(nurse_id)) AS remaining
    FROM jobs AS J
    LEFT JOIN nurse_hired_jobs AS N
      ON J.job_id=N.job_id
    GROUP BY facility_id, nurse_type_needed
    ORDER BY facility_id ASC, nurse_type_needed ASC;
  `);
  res.status(200).json({ data: rows });
  client.release();
});

router.get("/q5", async (req, res) => {
  const client = await db.pool.connect();
  const { rows } = await client.query(`
    SELECT 
      N.nurse_id,
      N.nurse_name,
      N.nurse_type,
      (SUM(J.total_number_nurses_needed - 
        (SELECT 
          COUNT(nurse_id) 
        FROM nurse_hired_jobs AS NH
        WHERE NH.job_id = J.job_id)))
      AS available_jobs
    FROM nurses AS N
    LEFT JOIN jobs AS J ON N.nurse_type = J.nurse_type_needed
    GROUP BY N.nurse_id
    ORDER BY nurse_id ASC;
  `);
  res.status(200).json({ data: rows });
  client.release();
});

router.get("/q6/:name", async (req, res) => {
  if (!req.params?.name) {
    return res.status(400).send({ message: "Bad Request" });
  }
  const client = await db.pool.connect();
  const { rows } = await client.query(`
    SELECT 
      nurse_name 
    FROM nurses 
    WHERE nurse_name != '${req.params.name}' AND nurse_id IN 
      (SELECT 
        nurse_id 
      FROM nurse_hired_jobs 
      WHERE job_id IN 
      (SELECT 
        job_id 
      FROM jobs 
      WHERE facility_id = 
      (SELECT 
          J.facility_id
        FROM nurses AS N
        LEFT JOIN nurse_hired_jobs AS NH ON N.nurse_id = NH.nurse_id
        LEFT JOIN jobs AS J ON NH.job_id = J.job_id
        WHERE N.nurse_name = '${req.params.name}')));
  `);
  res.status(200).json({ data: rows.map((row) => row.nurse_name) });
  client.release();
});

module.exports = router;
