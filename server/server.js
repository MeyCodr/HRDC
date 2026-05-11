require('dotenv').config();
const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: '*' }));   // allow React dev server
app.use(express.json());

// ── DB Pool ───────────────────────────────────────────────────
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '3306'),
  user:     process.env.DB_USER     || 'admin',
  password: process.env.DB_PASSWORD || '@dminPhn17',
  database: process.env.DB_NAME     || 'hrdc_training',
  waitForConnections: true,
  connectionLimit:    10,
});

// ── Health Check ──────────────────────────────────────────────
app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// ── GET /api/trainings  — list all ───────────────────────────
app.get('/api/trainings', async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
         id, title, department, 
         DATE_FORMAT(training_date,  '%d/%m/%Y') AS training_date,
         DATE_FORMAT(due_grant_date, '%d/%m/%Y') AS due_grant_date,
         cost, pic, need_hrdc, status, vendor, pax, notes,
         created_at
       FROM trainings
       ORDER BY training_date ASC`
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/trainings/summary  — dashboard stats ────────────
app.get('/api/trainings/summary', async (_req, res) => {
  try {
    const [[stats]] = await pool.query(
      `SELECT
         COUNT(*)                              AS total,
         SUM(need_hrdc = 1)                    AS need_hrdc,
         SUM(status = 'pending')               AS pending,
         SUM(status = 'overdue')               AS overdue,
         SUM(status = 'done')                  AS done
       FROM trainings`
    );

    const [monthly] = await pool.query(
      `SELECT
         DATE_FORMAT(training_date, '%b') AS month,
         MONTH(training_date)             AS month_num,
         COUNT(*)                         AS count
       FROM trainings
       WHERE YEAR(training_date) = YEAR(CURDATE())
       GROUP BY month_num, month
       ORDER BY month_num`
    );

    const [hrdc] = await pool.query(
      `SELECT
         SUM(status = 'done'    AND need_hrdc = 1) AS approved,
         SUM(status = 'pending' AND need_hrdc = 1) AS pending,
         SUM(status = 'overdue' AND need_hrdc = 1) AS rejected
       FROM trainings`
    );

    res.json({
      success: true,
      stats: {
        total:     Number(stats.total)     || 0,
        need_hrdc: Number(stats.need_hrdc) || 0,
        pending:   Number(stats.pending)   || 0,
        overdue:   Number(stats.overdue)   || 0,
        done:      Number(stats.done)      || 0,
      },
      monthly,
      hrdc: hrdc[0] || { approved: 0, pending: 0, rejected: 0 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/departments  — lookup list ───────────────────────
app.get('/api/departments', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT name FROM departments ORDER BY name');
    res.json({ success: true, data: rows.map(r => r.name) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── POST /api/trainings  — create ────────────────────────────
// due_grant_date is GENERATED (auto = training_date - 14 days), never sent by client
app.post('/api/trainings', async (req, res) => {
  try {
    const { title, department, training_date, cost, pic, need_hrdc, status, vendor, pax, notes } = req.body;

    // Basic validation
    if (!title || !department || !training_date || cost === undefined) {
      return res.status(400).json({ success: false, message: 'title, department, training_date and cost are required.' });
    }

    const [result] = await pool.query(
      `INSERT INTO trainings (title, department, training_date, cost, pic, need_hrdc, status, vendor, pax, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        department,
        training_date,                          // YYYY-MM-DD from client
        parseFloat(cost),
        pic        || 'Fikri',
        need_hrdc  !== undefined ? need_hrdc : 1,
        status     || 'pending',
        vendor     || null,
        pax        || 1,
        notes      || null,
      ]
    );

    // Return newly created row with generated due_grant_date
    const [[newRow]] = await pool.query(
      `SELECT id, title, department,
         DATE_FORMAT(training_date,  '%d/%m/%Y') AS training_date,
         DATE_FORMAT(due_grant_date, '%d/%m/%Y') AS due_grant_date,
         cost, pic, need_hrdc, status, vendor, pax, notes
       FROM trainings WHERE id = ?`,
      [result.insertId]
    );

    res.status(201).json({ success: true, data: newRow });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/trainings/:id  — update ─────────────────────────
app.put('/api/trainings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, training_date, cost, pic, need_hrdc, status, vendor, pax, notes } = req.body;

    await pool.query(
      `UPDATE trainings SET
         title         = COALESCE(?, title),
         department    = COALESCE(?, department),
         training_date = COALESCE(?, training_date),
         cost          = COALESCE(?, cost),
         pic           = COALESCE(?, pic),
         need_hrdc     = COALESCE(?, need_hrdc),
         status        = COALESCE(?, status),
         vendor        = COALESCE(?, vendor),
         pax           = COALESCE(?, pax),
         notes         = COALESCE(?, notes)
       WHERE id = ?`,
      [title, department, training_date, cost ? parseFloat(cost) : null,
       pic, need_hrdc, status, vendor, pax, notes, id]
    );

    const [[updated]] = await pool.query(
      `SELECT id, title, department,
         DATE_FORMAT(training_date,  '%d/%m/%Y') AS training_date,
         DATE_FORMAT(due_grant_date, '%d/%m/%Y') AS due_grant_date,
         cost, pic, need_hrdc, status, vendor, pax, notes
       FROM trainings WHERE id = ?`,
      [id]
    );

    if (!updated) return res.status(404).json({ success: false, message: 'Record not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/trainings/:id  — delete ──────────────────────
app.delete('/api/trainings/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM trainings WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Record not found.' });
    res.json({ success: true, message: 'Deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 HRDC Training API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
