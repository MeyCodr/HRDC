-- ============================================================
-- TRAINING & HRDC GRANT MONITORING SYSTEM
-- MySQL Schema for phpMyAdmin
-- Import this file via: phpMyAdmin > Import > Choose File
-- ============================================================

CREATE DATABASE IF NOT EXISTS hrdc_training
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hrdc_training;

-- ============================================================
-- TABLE: trainings
-- ============================================================
CREATE TABLE IF NOT EXISTS trainings (
  id              INT             NOT NULL AUTO_INCREMENT,
  title           VARCHAR(255)    NOT NULL COMMENT 'Training title',
  department      VARCHAR(100)    NOT NULL COMMENT 'Department name',
  training_date   DATE            NOT NULL COMMENT 'Date of training',
  due_grant_date  DATE            GENERATED ALWAYS AS (DATE_SUB(training_date, INTERVAL 14 DAY)) STORED
                                  COMMENT 'Auto: 14 days before training date',
  cost            DECIMAL(10, 2)  NOT NULL DEFAULT 0.00 COMMENT 'Training cost (RM)',
  pic             VARCHAR(100)    NOT NULL DEFAULT 'Fikri' COMMENT 'Person In Charge',
  need_hrdc       TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '1=Yes, 0=No',
  status          ENUM('pending','overdue','done') NOT NULL DEFAULT 'pending',
  vendor          VARCHAR(255)    NULL COMMENT 'Training vendor / provider',
  pax             INT             NULL DEFAULT 1 COMMENT 'Number of participants',
  notes           TEXT            NULL COMMENT 'Additional notes',
  created_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_status        (status),
  INDEX idx_training_date (training_date),
  INDEX idx_department    (department),
  INDEX idx_due_grant     (due_grant_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Training & HRDC Grant Records';

-- ============================================================
-- TABLE: departments (lookup)
-- ============================================================
CREATE TABLE IF NOT EXISTS departments (
  id    INT          NOT NULL AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO departments (name) VALUES
  ('IT'),
  ('HR'),
  ('Finance'),
  ('Operations'),
  ('Sales'),
  ('QA'),
  ('Engineering'),
  ('Legal'),
  ('Admin');

-- ============================================================
-- SAMPLE DATA (optional — remove if not needed)
-- ============================================================
INSERT INTO trainings (title, department, training_date, cost, pic, need_hrdc, status, vendor, pax) VALUES
  ('AI Workshop',            'IT',         '2026-05-20', 4500.00, 'Fikri', 1, 'overdue',  'TechLearn Sdn Bhd',   20),
  ('ISO Training',           'QA',         '2026-05-25', 3200.00, 'Fikri', 1, 'pending',  'ISO Consultants',      15),
  ('Leadership Programme',   'HR',         '2026-05-28', 6800.00, 'Fikri', 1, 'pending',  'Leadership Hub',       12),
  ('Safety & Health',        'Operations', '2026-05-30', 2100.00, 'Fikri', 1, 'pending',  'Safety Pro',           40),
  ('Communication Skills',   'Sales',      '2026-01-09', 3000.00, 'Fikri', 1, 'done',     'Soft Skills Academy',  25),
  ('Data Analysis',          'IT',         '2026-01-15', 4200.00, 'Fikri', 1, 'done',     'DataPro Academy',      18);
