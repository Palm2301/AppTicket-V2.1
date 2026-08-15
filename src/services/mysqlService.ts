/**
 * ============================================================================
 * [SERVICE LAYER: MYSQL & DATABASE INTERACTION ENGINE]
 * File: /src/services/mysqlService.ts
 * Description: Client-side service for communicating with the backend MySQL REST API,
 *              generating standalone SQL DDL dumps, and bundling PHP API scripts.
 * 
 * [ฟังก์ชันหลัก]:
 * - checkDatabaseStatus: ส่ง Request ตรวจสอบสถานะการเชื่อมต่อ MySQL และนับ Tables
 * - syncDataToMySQL: ส่ง Payload ข้อมูลทั้งหมดขึ้นไปบันทึกลงฐานข้อมูล MySQL
 * - fetchLatestDataFromMySQL: ดึงข้อมูลล่าสุดจาก MySQL กลับมายัง Client
 * - generateFullSqlDump: สร้างคำสั่ง `CREATE TABLE` และ `INSERT INTO` ครบ 8 ตาราง
 * - generatePhpBackendScripts: สร้างไฟล์ `db.php`, `api.php`, `.htaccess` สำหรับ Standalone Hosting
 * ============================================================================
 */

import {
  Asset,
  Branch,
  Department,
  FormAdjustmentConfig,
  ITTicket,
  SystemRolePermissions,
  TransferForm,
  UserProfile,
  WeeklyProblemSummary,
} from '../types';

export interface DbStatusResponse {
  connected: boolean;
  driver: 'mysql2' | 'local_fallback';
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  tableCount?: number;
  message: string;
  lastSync?: string;
  error?: string;
}

/**
 * Checks connection status with the backend MySQL server
 */
export async function checkDatabaseStatus(): Promise<DbStatusResponse> {
  try {
    const res = await fetch('/api/db/status', {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      return {
        connected: false,
        driver: 'local_fallback',
        message: `HTTP Server Status: ${res.statusText}`,
      };
    }
    return await res.json();
  } catch (err: any) {
    return {
      connected: false,
      driver: 'local_fallback',
      message: 'Running in Local Storage mode (Backend API offline or not configured)',
      error: err.message,
    };
  }
}

/**
 * Pushes entire application dataset to MySQL database via /api/db/sync
 */
export async function syncDataToMySQL(payload: {
  branches: Branch[];
  departments: Department[];
  staffList: UserProfile[];
  assets: Asset[];
  transfers: TransferForm[];
  tickets: ITTicket[];
  weeklyProblems: WeeklyProblemSummary[];
  formConfig: FormAdjustmentConfig;
  rolePermissions: SystemRolePermissions;
}): Promise<{ success: boolean; message: string; timestamp: string }> {
  try {
    const res = await fetch('/api/db/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: `Failed to sync to MySQL: ${err.message}`,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Fetches latest dataset from MySQL database
 */
export async function fetchDataFromMySQL(): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const res = await fetch('/api/db/data');
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      message: err.message,
    };
  }
}

/**
 * Generates the complete, production-ready SQL DDL and DML dump script
 * for direct import in phpMyAdmin or MySQL CLI.
 */
export function generateFullSqlDump(data: {
  branches: Branch[];
  departments: Department[];
  staffList: UserProfile[];
  assets: Asset[];
  transfers: TransferForm[];
  tickets: ITTicket[];
  weeklyProblems: WeeklyProblemSummary[];
  formConfig: FormAdjustmentConfig;
  rolePermissions: SystemRolePermissions;
}): string {
  const dateStr = new Date().toISOString();
  
  const escapeSql = (str: any): string => {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'number' || typeof str === 'boolean') return `${str}`;
    return `'${String(str).replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  };

  const escapeJson = (obj: any): string => {
    if (!obj) return 'NULL';
    return escapeSql(JSON.stringify(obj));
  };

  let sql = `-- =========================================================================
-- Xing Tai Enterprise Asset & IT Ticket Database Schema & Data Dump
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+, phpMyAdmin
-- Generated on: ${dateStr}
-- Target Database: xingtai_db
-- =========================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: \`xingtai_db\`
--
CREATE DATABASE IF NOT EXISTS \`xingtai_db\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`xingtai_db\`;

-- --------------------------------------------------------

--
-- Table structure for table \`branches\` (สาขา)
--
CREATE TABLE IF NOT EXISTS \`branches\` (
  \`code\` varchar(20) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`address\` text NOT NULL,
  \`phone\` varchar(50) DEFAULT NULL,
  \`tax_id\` varchar(50) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`departments\` (แผนก)
--
CREATE TABLE IF NOT EXISTS \`departments\` (
  \`code\` varchar(50) NOT NULL,
  \`name\` varchar(255) NOT NULL,
  \`name_en\` varchar(255) DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`users\` (พนักงานและบัญชีผู้ใช้งาน)
--
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` varchar(50) NOT NULL,
  \`staff_id\` varchar(50) NOT NULL UNIQUE,
  \`username\` varchar(100) DEFAULT NULL,
  \`password\` varchar(255) NOT NULL DEFAULT 'Lemony2026',
  \`is_first_login\` tinyint(1) NOT NULL DEFAULT 1,
  \`name\` varchar(255) NOT NULL,
  \`thai_name\` varchar(255) NOT NULL,
  \`nickname\` varchar(100) DEFAULT NULL,
  \`email\` varchar(255) NOT NULL,
  \`role\` enum('ADMIN','IT','ACC','MANAGER','USER') NOT NULL DEFAULT 'USER',
  \`department_code\` varchar(50) NOT NULL,
  \`department_name\` varchar(255) DEFAULT NULL,
  \`branch_code\` varchar(20) NOT NULL,
  \`branch_name\` varchar(255) DEFAULT NULL,
  \`avatar_url\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_staff_id\` (\`staff_id\`),
  KEY \`idx_role\` (\`role\`),
  KEY \`idx_branch\` (\`branch_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`assets\` (ทะเบียนทรัพย์สิน)
--
CREATE TABLE IF NOT EXISTS \`assets\` (
  \`id\` varchar(50) NOT NULL,
  \`asset_id\` varchar(100) NOT NULL UNIQUE,
  \`item_code\` varchar(100) NOT NULL,
  \`serial_no\` varchar(100) NOT NULL,
  \`asset_name\` varchar(255) NOT NULL,
  \`category\` varchar(100) NOT NULL,
  \`brand\` varchar(100) DEFAULT NULL,
  \`model\` varchar(100) DEFAULT NULL,
  \`location\` varchar(255) NOT NULL,
  \`branch_code\` varchar(20) NOT NULL,
  \`department_code\` varchar(50) NOT NULL,
  \`owner_staff_id\` varchar(50) DEFAULT NULL,
  \`owner_staff_name\` varchar(255) DEFAULT NULL,
  \`status\` enum('ACTIVE','MAINTENANCE','TRANSFERRED','RETIRED','DAMAGED','IN_REPAIR') NOT NULL DEFAULT 'ACTIVE',
  \`acquisition_date\` date NOT NULL,
  \`cost\` decimal(12,2) NOT NULL DEFAULT 0.00,
  \`supplier\` varchar(255) DEFAULT NULL,
  \`warranty_expire_date\` date DEFAULT NULL,
  \`notes\` text DEFAULT NULL,
  \`image_url\` text DEFAULT NULL,
  \`repair_logs\` json DEFAULT NULL,
  \`custody_history\` json DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_asset_id\` (\`asset_id\`),
  KEY \`idx_status\` (\`status\`),
  KEY \`idx_branch_dept\` (\`branch_code\`,\`department_code\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`transfer_forms\` (ใบโอนย้ายทรัพย์สิน A4 มาตรฐาน 3 ลายเซ็น)
--
CREATE TABLE IF NOT EXISTS \`transfer_forms\` (
  \`id\` varchar(50) NOT NULL,
  \`form_no\` varchar(50) NOT NULL UNIQUE,
  \`created_date\` date NOT NULL,
  \`originating_branch\` varchar(255) NOT NULL,
  \`originating_branch_code\` varchar(20) NOT NULL,
  \`originating_dept\` varchar(255) NOT NULL,
  \`reason_type\` enum('NEW_EMPLOYEE','RESIGNATION','BRANCH_TRANSFER','TEMPORARY_BORROW','OTHERS') NOT NULL,
  \`reason_note\` text DEFAULT NULL,
  \`items\` json NOT NULL,
  \`it_approved\` tinyint(1) NOT NULL DEFAULT 0,
  \`it_approved_by\` varchar(255) DEFAULT NULL,
  \`it_approved_date\` datetime DEFAULT NULL,
  \`it_signature\` text DEFAULT NULL,
  \`manager_approved\` tinyint(1) NOT NULL DEFAULT 0,
  \`manager_approved_by\` varchar(255) DEFAULT NULL,
  \`manager_approved_date\` datetime DEFAULT NULL,
  \`manager_signature\` text DEFAULT NULL,
  \`acc_approved\` tinyint(1) NOT NULL DEFAULT 0,
  \`acc_approved_by\` varchar(255) DEFAULT NULL,
  \`acc_approved_date\` datetime DEFAULT NULL,
  \`acc_signature\` text DEFAULT NULL,
  \`status\` enum('DRAFT','PENDING_IT','PENDING_MANAGER','PENDING_ACC','APPROVED','REJECTED','COMPLETED') NOT NULL DEFAULT 'PENDING_IT',
  \`delivered_by\` varchar(255) DEFAULT NULL,
  \`delivery_date\` datetime DEFAULT NULL,
  \`vehicle_plate_no\` varchar(50) DEFAULT NULL,
  \`receiver_sign_date\` datetime DEFAULT NULL,
  \`receiver_signature\` text DEFAULT NULL,
  \`notes\` text DEFAULT NULL,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_form_no\` (\`form_no\`),
  KEY \`idx_status\` (\`status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`it_tickets\` (ใบแจ้งซ่อม IT Helpdesk)
--
CREATE TABLE IF NOT EXISTS \`it_tickets\` (
  \`id\` varchar(50) NOT NULL,
  \`subject\` varchar(255) NOT NULL,
  \`details\` text NOT NULL,
  \`category\` enum('HARDWARE_MALFUNCTION','SOFTWARE_ISSUE','NETWORK_WIFI','ASSET_TRANSFER_REQUEST','NEW_EQUIPMENT','MAINTENANCE') NOT NULL,
  \`priority\` enum('LOW','MEDIUM','HIGH','CRITICAL') NOT NULL DEFAULT 'MEDIUM',
  \`status\` enum('NEW','ASSIGNED','IN_PROGRESS','PENDING_PARTS','RESOLVED','CLOSED') NOT NULL DEFAULT 'NEW',
  \`requester_staff_id\` varchar(50) NOT NULL,
  \`requester_staff_name\` varchar(255) NOT NULL,
  \`requester_dept\` varchar(100) NOT NULL,
  \`requester_branch\` varchar(100) NOT NULL,
  \`assigned_to_technician\` varchar(50) DEFAULT NULL,
  \`assigned_technician_name\` varchar(255) DEFAULT NULL,
  \`asset_id\` varchar(100) DEFAULT NULL,
  \`asset_name\` varchar(255) DEFAULT NULL,
  \`created_at\` datetime NOT NULL,
  \`updated_at\` datetime NOT NULL,
  \`resolved_at\` datetime DEFAULT NULL,
  \`resolution_hours\` decimal(8,2) DEFAULT NULL,
  \`resolution_note\` text DEFAULT NULL,
  \`repair_cost\` decimal(12,2) DEFAULT NULL,
  \`repair_vendor\` varchar(255) DEFAULT NULL,
  \`repair_sent_date\` date DEFAULT NULL,
  \`repair_returned_date\` date DEFAULT NULL,
  \`history_log\` json DEFAULT NULL,
  PRIMARY KEY (\`id\`),
  KEY \`idx_ticket_status\` (\`status\`),
  KEY \`idx_requester\` (\`requester_staff_id\`),
  KEY \`idx_assigned\` (\`assigned_to_technician\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`weekly_problems\` (สรุปปัญหาประจำสัปดาห์ KPI)
--
CREATE TABLE IF NOT EXISTS \`weekly_problems\` (
  \`week_number\` int(11) NOT NULL,
  \`week_label\` varchar(100) NOT NULL,
  \`date_range\` varchar(100) NOT NULL,
  \`total_incidents\` int(11) NOT NULL DEFAULT 0,
  \`top_issues\` json NOT NULL,
  \`hardware_count\` int(11) NOT NULL DEFAULT 0,
  \`software_count\` int(11) NOT NULL DEFAULT 0,
  \`network_count\` int(11) NOT NULL DEFAULT 0,
  \`resolved_rate\` decimal(5,2) NOT NULL DEFAULT 0.00,
  \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`week_number\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table \`system_settings\` (การตั้งค่าแบบฟอร์มและสิทธิ์)
--
CREATE TABLE IF NOT EXISTS \`system_settings\` (
  \`setting_key\` varchar(100) NOT NULL,
  \`setting_value\` json NOT NULL,
  \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`setting_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================================
-- INITIAL DATA DUMP
-- =========================================================================

`;

  // 1. Branches Dump
  if (data.branches.length > 0) {
    sql += `--\n-- Dumping data for table \`branches\`\n--\n`;
    sql += `INSERT INTO \`branches\` (\`code\`, \`name\`, \`address\`, \`phone\`, \`tax_id\`) VALUES\n`;
    sql += data.branches
      .map(
        (b) =>
          `  (${escapeSql(b.code)}, ${escapeSql(b.name)}, ${escapeSql(b.address)}, ${escapeSql(b.phone)}, ${escapeSql(b.taxId)})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`address\`=VALUES(\`address\`), \`phone\`=VALUES(\`phone\`), \`tax_id\`=VALUES(\`tax_id\`);\n\n`;
  }

  // 2. Departments Dump
  if (data.departments.length > 0) {
    sql += `--\n-- Dumping data for table \`departments\`\n--\n`;
    sql += `INSERT INTO \`departments\` (\`code\`, \`name\`, \`name_en\`) VALUES\n`;
    sql += data.departments
      .map(
        (d) =>
          `  (${escapeSql(d.code)}, ${escapeSql(d.name)}, ${escapeSql(d.nameEn)})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`name_en\`=VALUES(\`name_en\`);\n\n`;
  }

  // 3. Users Dump
  if (data.staffList.length > 0) {
    sql += `--\n-- Dumping data for table \`users\`\n--\n`;
    sql += `INSERT INTO \`users\` (\`id\`, \`staff_id\`, \`username\`, \`password\`, \`is_first_login\`, \`name\`, \`thai_name\`, \`nickname\`, \`email\`, \`role\`, \`department_code\`, \`department_name\`, \`branch_code\`, \`branch_name\`, \`avatar_url\`) VALUES\n`;
    sql += data.staffList
      .map(
        (u) =>
          `  (${escapeSql(u.id)}, ${escapeSql(u.staffId)}, ${escapeSql(u.username || u.staffId.toLowerCase())}, ${escapeSql(u.password || 'Lemony2026')}, ${u.isFirstLogin ? 1 : 0}, ${escapeSql(u.name)}, ${escapeSql(u.thaiName)}, ${escapeSql(u.nickname || null)}, ${escapeSql(u.email)}, ${escapeSql(u.role)}, ${escapeSql(u.departmentCode)}, ${escapeSql(u.departmentName)}, ${escapeSql(u.branchCode)}, ${escapeSql(u.branchName)}, ${escapeSql(u.avatarUrl || null)})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`password\`=VALUES(\`password\`), \`is_first_login\`=VALUES(\`is_first_login\`), \`role\`=VALUES(\`role\`), \`thai_name\`=VALUES(\`thai_name\`);\n\n`;
  }

  // 4. Assets Dump
  if (data.assets.length > 0) {
    sql += `--\n-- Dumping data for table \`assets\`\n--\n`;
    sql += `INSERT INTO \`assets\` (\`id\`, \`asset_id\`, \`item_code\`, \`serial_no\`, \`asset_name\`, \`category\`, \`brand\`, \`model\`, \`location\`, \`branch_code\`, \`department_code\`, \`owner_staff_id\`, \`owner_staff_name\`, \`status\`, \`acquisition_date\`, \`cost\`, \`supplier\`, \`warranty_expire_date\`, \`notes\`, \`image_url\`, \`repair_logs\`, \`custody_history\`) VALUES\n`;
    sql += data.assets
      .map(
        (a) =>
          `  (${escapeSql(a.id)}, ${escapeSql(a.assetId)}, ${escapeSql(a.itemCode)}, ${escapeSql(a.serialNo)}, ${escapeSql(a.assetName)}, ${escapeSql(a.category)}, ${escapeSql(a.brand || null)}, ${escapeSql(a.model || null)}, ${escapeSql(a.location)}, ${escapeSql(a.branchCode)}, ${escapeSql(a.departmentCode)}, ${escapeSql(a.ownerStaffId || null)}, ${escapeSql(a.ownerStaffName || null)}, ${escapeSql(a.status)}, ${escapeSql(a.acquisitionDate)}, ${a.cost || 0}, ${escapeSql(a.supplier || null)}, ${escapeSql(a.warrantyExpireDate || null)}, ${escapeSql(a.notes || null)}, ${escapeSql(a.imageUrl || null)}, ${escapeJson(a.repairLogs || [])}, ${escapeJson(a.custodyHistory || [])})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`location\`=VALUES(\`location\`), \`owner_staff_id\`=VALUES(\`owner_staff_id\`), \`owner_staff_name\`=VALUES(\`owner_staff_name\`), \`custody_history\`=VALUES(\`custody_history\`), \`repair_logs\`=VALUES(\`repair_logs\`);\n\n`;
  }

  // 5. Transfer Forms Dump
  if (data.transfers.length > 0) {
    sql += `--\n-- Dumping data for table \`transfer_forms\`\n--\n`;
    sql += `INSERT INTO \`transfer_forms\` (\`id\`, \`form_no\`, \`created_date\`, \`originating_branch\`, \`originating_branch_code\`, \`originating_dept\`, \`reason_type\`, \`reason_note\`, \`items\`, \`it_approved\`, \`it_approved_by\`, \`it_approved_date\`, \`it_signature\`, \`manager_approved\`, \`manager_approved_by\`, \`manager_approved_date\`, \`manager_signature\`, \`acc_approved\`, \`acc_approved_by\`, \`acc_approved_date\`, \`acc_signature\`, \`status\`, \`delivered_by\`, \`delivery_date\`, \`vehicle_plate_no\`, \`receiver_sign_date\`, \`receiver_signature\`, \`notes\`) VALUES\n`;
    sql += data.transfers
      .map(
        (t) =>
          `  (${escapeSql(t.id)}, ${escapeSql(t.formNo)}, ${escapeSql(t.createdDate)}, ${escapeSql(t.originatingBranch)}, ${escapeSql(t.originatingBranchCode)}, ${escapeSql(t.originatingDept)}, ${escapeSql(t.reasonType)}, ${escapeSql(t.reasonNote || null)}, ${escapeJson(t.items)}, ${t.itApproved ? 1 : 0}, ${escapeSql(t.itApprovedBy || null)}, ${escapeSql(t.itApprovedDate || null)}, ${escapeSql(t.itSignature || null)}, ${t.managerApproved ? 1 : 0}, ${escapeSql(t.managerApprovedBy || null)}, ${escapeSql(t.managerApprovedDate || null)}, ${escapeSql(t.managerSignature || null)}, ${t.accApproved ? 1 : 0}, ${escapeSql(t.accApprovedBy || null)}, ${escapeSql(t.accApprovedDate || null)}, ${escapeSql(t.accSignature || null)}, ${escapeSql(t.status)}, ${escapeSql(t.deliveredBy || null)}, ${escapeSql(t.deliveryDate || null)}, ${escapeSql(t.vehiclePlateNo || null)}, ${escapeSql(t.receiverSignDate || null)}, ${escapeSql(t.receiverSignature || null)}, ${escapeSql(t.notes || null)})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`it_approved\`=VALUES(\`it_approved\`), \`manager_approved\`=VALUES(\`manager_approved\`), \`acc_approved\`=VALUES(\`acc_approved\`);\n\n`;
  }

  // 6. IT Tickets Dump
  if (data.tickets.length > 0) {
    sql += `--\n-- Dumping data for table \`it_tickets\`\n--\n`;
    sql += `INSERT INTO \`it_tickets\` (\`id\`, \`subject\`, \`details\`, \`category\`, \`priority\`, \`status\`, \`requester_staff_id\`, \`requester_staff_name\`, \`requester_dept\`, \`requester_branch\`, \`assigned_to_technician\`, \`assigned_technician_name\`, \`asset_id\`, \`asset_name\`, \`created_at\`, \`updated_at\`, \`resolved_at\`, \`resolution_hours\`, \`resolution_note\`, \`repair_cost\`, \`repair_vendor\`, \`repair_sent_date\`, \`repair_returned_date\`, \`history_log\`) VALUES\n`;
    sql += data.tickets
      .map(
        (tk) =>
          `  (${escapeSql(tk.id)}, ${escapeSql(tk.subject)}, ${escapeSql(tk.details)}, ${escapeSql(tk.category)}, ${escapeSql(tk.priority)}, ${escapeSql(tk.status)}, ${escapeSql(tk.requesterStaffId)}, ${escapeSql(tk.requesterStaffName)}, ${escapeSql(tk.requesterDept)}, ${escapeSql(tk.requesterBranch)}, ${escapeSql(tk.assignedToTechnician || null)}, ${escapeSql(tk.assignedTechnicianName || null)}, ${escapeSql(tk.assetId || null)}, ${escapeSql(tk.assetName || null)}, ${escapeSql(tk.createdAt)}, ${escapeSql(tk.updatedAt)}, ${escapeSql(tk.resolvedAt || null)}, ${tk.resolutionHours || null}, ${escapeSql(tk.resolutionNote || null)}, ${tk.repairCost || null}, ${escapeSql(tk.repairVendor || null)}, ${escapeSql(tk.repairSentDate || null)}, ${escapeSql(tk.repairReturnedDate || null)}, ${escapeJson(tk.historyLog || [])})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`status\`=VALUES(\`status\`), \`assigned_to_technician\`=VALUES(\`assigned_to_technician\`), \`resolved_at\`=VALUES(\`resolved_at\`), \`resolution_note\`=VALUES(\`resolution_note\`);\n\n`;
  }

  // 7. Weekly Problems Dump
  if (data.weeklyProblems && data.weeklyProblems.length > 0) {
    sql += `--\n-- Dumping data for table \`weekly_problems\`\n--\n`;
    sql += `INSERT INTO \`weekly_problems\` (\`week_number\`, \`week_label\`, \`date_range\`, \`total_incidents\`, \`top_issues\`, \`hardware_count\`, \`software_count\`, \`network_count\`, \`resolved_rate\`) VALUES\n`;
    sql += data.weeklyProblems
      .map(
        (wp) =>
          `  (${wp.weekNumber}, ${escapeSql(wp.weekLabel)}, ${escapeSql(wp.dateRange)}, ${wp.totalIncidents}, ${escapeJson(wp.topIssues)}, ${wp.hardwareCount}, ${wp.softwareCount}, ${wp.networkCount}, ${wp.resolvedRate})`
      )
      .join(',\n');
    sql += `\nON DUPLICATE KEY UPDATE \`total_incidents\`=VALUES(\`total_incidents\`), \`top_issues\`=VALUES(\`top_issues\`), \`resolved_rate\`=VALUES(\`resolved_rate\`);\n\n`;
  }

  // 8. System Settings Dump (Form Config & Role Permissions)
  sql += `--\n-- Dumping data for table \`system_settings\`\n--\n`;
  sql += `INSERT INTO \`system_settings\` (\`setting_key\`, \`setting_value\`) VALUES\n`;
  sql += `  ('form_adjustment_config', ${escapeJson(data.formConfig)}),\n`;
  sql += `  ('role_permissions', ${escapeJson(data.rolePermissions)})\n`;
  sql += `ON DUPLICATE KEY UPDATE \`setting_value\`=VALUES(\`setting_value\`);\n\n`;

  sql += `COMMIT;\n\n/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n`;

  return sql;
}

/**
 * Generates standalone PHP code (api.php and db_config.php)
 * for hosting on standard Apache/Nginx + PHP + MySQL servers.
 */
export function generatePhpBackendScripts(): {
  dbConfigPhp: string;
  apiPhp: string;
} {
  const dbConfigPhp = `<?php
/**
 * Xing Tai Enterprise Asset & IT Ticket System
 * Database Connection Configuration (MySQL / phpMyAdmin)
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$DB_HOST = getenv('MYSQL_HOST') ?: 'localhost';
$DB_PORT = getenv('MYSQL_PORT') ?: '3306';
$DB_USER = getenv('MYSQL_USER') ?: 'root';
$DB_PASS = getenv('MYSQL_PASSWORD') ?: '';
$DB_NAME = getenv('MYSQL_DATABASE') ?: 'xingtai_db';

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;port=$DB_PORT;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $e->getMessage()
    ]);
    exit();
}
`;

  const apiPhp = `<?php
/**
 * Xing Tai REST API Entry Point (PHP 7.4+ / PHP 8.x)
 */
require_once __DIR__ . '/db_config.php';

header('Content-Type: application/json; charset=utf-8');

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'status':
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as asset_count FROM assets");
            $count = $stmt->fetch()['asset_count'] ?? 0;
            echo json_encode([
                'connected' => true,
                'driver' => 'php_pdo_mysql',
                'database' => $DB_NAME,
                'message' => 'Connected to MySQL successfully via PHP PDO',
                'assetCount' => (int)$count
            ]);
        } catch (Exception $e) {
            echo json_encode(['connected' => false, 'error' => $e->getMessage()]);
        }
        break;

    case 'get_assets':
        $stmt = $pdo->query("SELECT * FROM assets ORDER BY id DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['repairLogs'] = json_decode($r['repair_logs'] ?: '[]', true);
            $r['custodyHistory'] = json_decode($r['custody_history'] ?: '[]', true);
        }
        echo json_encode(['success' => true, 'data' => $rows]);
        break;

    case 'get_tickets':
        $stmt = $pdo->query("SELECT * FROM it_tickets ORDER BY created_at DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['historyLog'] = json_decode($r['history_log'] ?: '[]', true);
        }
        echo json_encode(['success' => true, 'data' => $rows]);
        break;

    case 'get_transfers':
        $stmt = $pdo->query("SELECT * FROM transfer_forms ORDER BY id DESC");
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $r['items'] = json_decode($r['items'] ?: '[]', true);
        }
        echo json_encode(['success' => true, 'data' => $rows]);
        break;

    case 'get_all_data':
        $branches = $pdo->query("SELECT * FROM branches")->fetchAll();
        $depts = $pdo->query("SELECT * FROM departments")->fetchAll();
        $users = $pdo->query("SELECT * FROM users")->fetchAll();
        $assets = $pdo->query("SELECT * FROM assets")->fetchAll();
        $transfers = $pdo->query("SELECT * FROM transfer_forms")->fetchAll();
        $tickets = $pdo->query("SELECT * FROM it_tickets")->fetchAll();
        $weekly = $pdo->query("SELECT * FROM weekly_problems")->fetchAll();

        echo json_encode([
            'success' => true,
            'branches' => $branches,
            'departments' => $depts,
            'staffList' => $users,
            'assets' => $assets,
            'transfers' => $transfers,
            'tickets' => $tickets,
            'weeklyProblems' => $weekly
        ]);
        break;

    default:
        echo json_encode([
            'success' => true,
            'message' => 'Xing Tai PHP MySQL API Gateway is running',
            'available_actions' => ['status', 'get_assets', 'get_tickets', 'get_transfers', 'get_all_data']
        ]);
        break;
}
`;

  return { dbConfigPhp, apiPhp };
}
