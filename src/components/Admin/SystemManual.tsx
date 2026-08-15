/**
 * ============================================================================
 * [MODULE: SYSTEM MANUAL & WORDPRESS DEPLOYMENT GUIDE (THAI PDF EXPORTER)]
 * File: /src/components/Admin/SystemManual.tsx
 * Description: Interactive enterprise system documentation, architecture diagrams,
 *              file-by-file modification dictionary, WordPress plugin packager, 
 *              and High-Definition Thai A4 PDF export engine.
 * 
 * [ฟังก์ชันหลัก]:
 * 1. Multi-Page Thai PDF Generator: แปลงคู่มือภาษาไทย 4 หน้า A4 คมชัด 100% สระวรรณยุกต์ครบ
 * 2. System Architecture & RBAC 5-Tier Matrix: เอกสารสถาปัตยกรรมและตารางสิทธิ์
 * 3. File Modification Dictionary: บันทึกรายการไฟล์และส่วนที่ถูกพัฒนา 8 โมดูลหลัก
 * 4. WordPress Deployment Guide: 4 วิธีติดตั้งบน WordPress พร้อมดาวน์โหลด Plugin PHP
 * 5. phpMyAdmin & MySQL Setup: คู่มือการนำเข้าและตั้งค่าฐานข้อมูล
 * 6. Print Engine: รองรับการสั่งพิมพ์ A4 ทางเครื่องพิมพ์โดยตรง
 * ============================================================================
 */

import React, { useState, useRef } from 'react';
import {
  FileText,
  Download,
  Copy,
  Check,
  BookOpen,
  Layers,
  Server,
  Database,
  Globe,
  Code2,
  CheckCircle2,
  Printer,
  ChevronRight,
  FolderGit2,
  Settings,
  Shield,
  FileCode,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Clock,
  ShieldCheck,
  Building2,
  QrCode,
  Laptop,
  Briefcase,
  Calculator,
  User,
  Terminal,
  Cpu,
  Play,
  Monitor,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { generateWordPressPluginCode } from '../../utils/wordpressPluginHelper';
import { XingTaiLogo } from '../Common/XingTaiLogo';

export const SystemManual: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'files' | 'localhost' | 'wordpress' | 'mysql'>('localhost');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [copiedWpCode, setCopiedWpCode] = useState(false);
  const [copiedShortcode, setCopiedShortcode] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(id);
    setTimeout(() => setCopiedCmd(null), 2500);
  };

  const wpPluginCode = generateWordPressPluginCode(window.location.origin);

  const handleCopyWpCode = () => {
    navigator.clipboard.writeText(wpPluginCode);
    setCopiedWpCode(true);
    setTimeout(() => setCopiedWpCode(false), 2500);
  };

  const handleCopyShortcode = () => {
    navigator.clipboard.writeText('[xingtai_assets height="100vh"]');
    setCopiedShortcode(true);
    setTimeout(() => setCopiedShortcode(false), 2500);
  };

  const handleDownloadWpPlugin = () => {
    const blob = new Blob([wpPluginCode], { type: 'application/x-php;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'xingtai-asset-manager.php';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  /**
   * High-Definition Multi-Page Thai PDF Export Engine
   * Uses HTML-to-Image canvas rendering to ensure 100% Thai font accuracy,
   * proper tone mark positioning, crisp vector logos, and A4 page boundaries.
   */
  const handleExportPdf = async () => {
    if (!pdfTemplateRef.current) return;
    setIsExportingPdf(true);
    setPdfProgress(10);

    try {
      // Find all A4 page containers in the hidden printable template
      const pageElements = pdfTemplateRef.current.querySelectorAll<HTMLElement>('.pdf-a4-page');
      if (pageElements.length === 0) {
        throw new Error('ไม่พบเทมเพลตหน้าเอกสาร PDF');
      }

      // Initialize jsPDF with standard A4 portrait (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const totalPages = pageElements.length;

      for (let i = 0; i < totalPages; i++) {
        const pageEl = pageElements[i];
        setPdfProgress(Math.round(((i + 0.5) / totalPages) * 100));

        // Render page with HTML-to-Image at 2x pixel ratio for maximum sharpness
        const imgData = await toPng(pageEl, {
          quality: 0.98,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });

        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        // Exact A4 portrait size (210mm x 297mm)
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setPdfProgress(100);
      const dateStr = new Date().toISOString().slice(0, 10);
      pdf.save(`XingTai_Enterprise_System_Manual_TH_${dateStr}.pdf`);
    } catch (err: any) {
      console.error('PDF Export Error:', err);
      alert(`เกิดข้อผิดพลาดในการสร้างไฟล์ PDF: ${err?.message || err}`);
    } finally {
      setIsExportingPdf(false);
      setPdfProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#111f3d] to-[#091122] border border-blue-800/60 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 shrink-0">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white tracking-tight">
                  คู่มือสถาปัตยกรรมระบบ & วิธีนำไปรันบน WordPress (System Manual)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 border border-emerald-700 text-emerald-300">
                  Thai PDF & Plugin Ready
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                เอกสารคู่มือสถาปัตยกรรมระบบ, พจนานุกรมไฟล์และโค้ดแต่ละส่วน, ขั้นตอนติดตั้ง phpMyAdmin และชุดติดตั้งสำเร็จรูปสำหรับ WordPress พร้อมดาวน์โหลดคู่มือ PDF ภาษาไทยคมชัด 100%
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
              title="พิมพ์เอกสารออกเครื่องพิมพ์"
            >
              <Printer className="w-4 h-4 text-zinc-300" />
              <span>พิมพ์คู่มือ (Print)</span>
            </button>

            <button
              onClick={handleDownloadWpPlugin}
              className="px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>ดาวน์โหลด Plugin WP (.php)</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-70"
            >
              {isExportingPdf ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>กำลังสร้าง PDF ภาษาไทย ({pdfProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>ดาวน์โหลดคู่มือ PDF (ภาษาไทย)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveSection('localhost')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'localhost'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-zinc-900 text-cyan-400 hover:text-white border border-cyan-800/60'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>⚡ ติดตั้ง Standalone บน Localhost (ไม่ฝังหน้าเว็บ)</span>
        </button>

        <button
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>1. โครงสร้างสถาปัตยกรรม & RBAC</span>
        </button>

        <button
          onClick={() => setActiveSection('files')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'files'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>2. พจนานุกรมไฟล์ & วิธีแก้ไขโค้ด</span>
        </button>

        <button
          onClick={() => setActiveSection('mysql')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'mysql'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>3. คู่มือฐานข้อมูล phpMyAdmin & MySQL</span>
        </button>

        <button
          onClick={() => setActiveSection('wordpress')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
            activeSection === 'wordpress'
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>4. กรณีใช้งานบน WordPress (Plugin)</span>
        </button>
      </div>

      {/* SECTION 0: STANDALONE LOCALHOST INSTALLATION */}
      {activeSection === 'localhost' && (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-cyan-950/60 via-blue-950/50 to-slate-950/80 border border-cyan-700/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold shadow-lg">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    การติดตั้งและรันแบบ Standalone บน Localhost (เครื่องตนเอง)
                  </h3>
                  <p className="text-xs text-cyan-200/80">
                    รันเป็นเว็บแอปพลิเคชันเต็มหน้าจอ (Full Page Web App) ผ่าน Node.js + Express โดยไม่ต้องฝัง iframe หรือหน้าเพจ WordPress
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Full Stack Port 3000
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-[#0b101d] p-3.5 rounded-xl border border-cyan-900/50">
                <span className="text-zinc-400 block mb-0.5">ความต้องการระบบ (Prerequisites)</span>
                <strong className="text-white text-sm">Node.js v18+ หรือ v20+ LTS</strong>
                <p className="text-[11px] text-zinc-400 mt-1">พร้อม npm หรือ bun สำหรับติดตั้ง dependencies</p>
              </div>

              <div className="bg-[#0b101d] p-3.5 rounded-xl border border-cyan-900/50">
                <span className="text-zinc-400 block mb-0.5">ฐานข้อมูล (Database)</span>
                <strong className="text-white text-sm">MySQL / XAMPP / Laragon</strong>
                <p className="text-[11px] text-zinc-400 mt-1">หรือรันแบบ Browser Cache ออฟไลน์ได้ทันที</p>
              </div>

              <div className="bg-[#0b101d] p-3.5 rounded-xl border border-cyan-900/50">
                <span className="text-zinc-400 block mb-0.5">URL สำหรับเปิดใช้งาน</span>
                <strong className="text-cyan-400 font-mono text-sm">http://localhost:3000</strong>
                <p className="text-[11px] text-zinc-400 mt-1">รองรับกล้องสแกน QR, พิมพ์ A4 และส่ง Ticket</p>
              </div>
            </div>
          </div>

          {/* Step by Step Execution Guide */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>ขั้นตอนการติดตั้ง 4 สเต็ป (Step-by-Step Command)</span>
            </h4>

            {/* Step 1 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <h5 className="font-bold text-white text-sm">แตกไฟล์โปรเจกต์ หรือ Clone มายังโฟลเดอร์ในเครื่อง</h5>
                </div>
                <button
                  onClick={() => copyToClipboard('cd xingtai-asset-system', 'step1')}
                  className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'step1' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'step1' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400">
                เปิด Terminal / Command Prompt (CMD) หรือ PowerShell แล้วเข้าไปยังโฟลเดอร์โปรเจกต์:
              </p>
              <pre className="bg-black/60 p-3 rounded-xl border border-zinc-800 text-cyan-300 font-mono text-xs overflow-x-auto">
cd /path/to/xingtai-asset-system
              </pre>
            </div>

            {/* Step 2 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </span>
                  <h5 className="font-bold text-white text-sm">ติดตั้ง Dependencies ทั้งหมด (npm install)</h5>
                </div>
                <button
                  onClick={() => copyToClipboard('npm install', 'step2')}
                  className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'step2' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'step2' ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400">
                คำสั่งนี้จะทำการดาวน์โหลด React, Express, Vite, Tailwind CSS, MySQL2 และเครื่องมือประมวลผล PDF/QR:
              </p>
              <pre className="bg-black/60 p-3 rounded-xl border border-zinc-800 text-emerald-400 font-mono text-xs overflow-x-auto">
npm install
              </pre>
            </div>

            {/* Step 3 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </span>
                  <h5 className="font-bold text-white text-sm">ตั้งค่าไฟล์สภาพแวดล้อม (.env) เพื่อเชื่อมต่อ MySQL บนเครื่อง</h5>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
`MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=xingtai_db`,
                      'step3'
                    )
                  }
                  className="text-xs px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd === 'step3' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd === 'step3' ? 'คัดลอก .env' : 'คัดลอก .env'}</span>
                </button>
              </div>
              <p className="text-xs text-zinc-400">
                สร้างไฟล์ชื่อ <code className="text-cyan-300 font-bold font-mono">.env</code> ในรูทโฟลเดอร์ของโปรเจกต์ แล้วกำหนดค่า MySQL (หากใช้ XAMPP ปกติ User คือ root และไม่มี Password):
              </p>
              <pre className="bg-black/60 p-3 rounded-xl border border-zinc-800 text-amber-300 font-mono text-xs overflow-x-auto">
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=xingtai_db
              </pre>
            </div>

            {/* Step 4 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <h5 className="font-bold text-white text-sm">สั่งรันเซิร์ฟเวอร์ (เลือกระหว่าง Dev Mode หรือ Production)</h5>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard('npm run dev', 'devcmd')}
                    className="text-xs px-2.5 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === 'devcmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>คัดลอก dev</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard('npm run build && npm start', 'prodcmd')}
                    className="text-xs px-2.5 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === 'prodcmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>คัดลอก build & start</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                <div className="p-3.5 bg-black/40 border border-blue-900/40 rounded-xl space-y-1.5">
                  <strong className="text-cyan-300 font-bold block">โหมดทดสอบ & พัฒนา (Development):</strong>
                  <pre className="p-2 bg-zinc-950 rounded text-cyan-400 font-mono text-xs">npm run dev</pre>
                  <span className="text-zinc-400 text-[11px] block">
                    ระบบจะเปิดเซิร์ฟเวอร์ Express และ Vite Middleware พร้อมเปิดเบราว์เซอร์ที่ http://localhost:3000
                  </span>
                </div>

                <div className="p-3.5 bg-black/40 border border-emerald-900/40 rounded-xl space-y-1.5">
                  <strong className="text-emerald-300 font-bold block">โหมดใช้งานจริง (Production Build):</strong>
                  <pre className="p-2 bg-zinc-950 rounded text-emerald-400 font-mono text-xs">npm run build && npm start</pre>
                  <span className="text-zinc-400 text-[11px] block">
                    สร้างไฟล์ Bundled Optimized HTML/JS/CSS พร้อมรัน Express Node.js Server ความเร็วสูงสุด
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Scripts for Windows & Linux */}
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>สคริปต์เปิดระบบคลิกเดียว (One-Click Launchers)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-zinc-200">1. Windows One-Click (start-system.bat)</strong>
                  <button
                    onClick={() =>
                      copyToClipboard(
`@echo off
title Xing Tai Enterprise Asset System
echo Starting Xing Tai Asset & Ticket System on Localhost...
cd /d %~dp0
call npm install
start http://localhost:3000
npm run dev
pause`,
                        'bat'
                      )
                    }
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === 'bat' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'bat' ? 'คัดลอกแล้ว' : 'คัดลอกไฟล์ .bat'}</span>
                  </button>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  สร้างไฟล์ <code className="text-cyan-300 font-mono">start-system.bat</code> ไว้ที่โฟลเดอร์โปรเจกต์ ดับเบิ้ลคลิกเพื่อเปิดระบบและเปิดเบราว์เซอร์อัตโนมัติ:
                </p>
                <pre className="bg-black/60 p-3 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`@echo off
title Xing Tai Enterprise Asset System
echo Starting Xing Tai Asset & Ticket System on Localhost...
cd /d %~dp0
call npm install
start http://localhost:3000
npm run dev
pause`}
                </pre>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-zinc-200">2. macOS / Linux (start.sh)</strong>
                  <button
                    onClick={() =>
                      copyToClipboard(
`#!/bin/bash
echo "Starting Xing Tai Asset & Ticket System on Localhost..."
cd "$(dirname "$0")"
npm install
if which xdg-open > /dev/null; then
  xdg-open http://localhost:3000 &
elif which open > /dev/null; then
  open http://localhost:3000 &
fi
npm run dev`,
                        'sh'
                      )
                    }
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCmd === 'sh' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCmd === 'sh' ? 'คัดลอกแล้ว' : 'คัดลอกไฟล์ .sh'}</span>
                  </button>
                </div>
                <p className="text-zinc-400 text-[11px]">
                  สร้างไฟล์ <code className="text-cyan-300 font-mono">start.sh</code> แล้วรันคำสั่ง <code className="text-cyan-300 font-mono">chmod +x start.sh && ./start.sh</code>:
                </p>
                <pre className="bg-black/60 p-3 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`#!/bin/bash
echo "Starting Xing Tai Asset & Ticket System on Localhost..."
cd "$(dirname "$0")"
npm install
open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null &
npm run dev`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 1: ARCHITECTURE OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                FE
              </div>
              <h4 className="font-bold text-white text-sm">Frontend (React 19 & Tailwind v4)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                สร้างด้วย React 19 และ Tailwind CSS 4 รวดเร็ว น้ำหนักเบา รองรับ Responsive เต็มรูปแบบ พร้อมระบบสร้างแบบฟอร์ม A4 สำหรับสั่งพิมพ์ความคมชัดสูง
              </p>
              <div className="text-[11px] text-zinc-500 font-mono">
                Entry: /src/main.tsx, /src/App.tsx
              </div>
            </div>

            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                BE
              </div>
              <h4 className="font-bold text-white text-sm">Backend API (Express & Node.js)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                เซิร์ฟเวอร์ Express ให้บริการ REST API endpoints สำหรับการซิงค์ข้อมูลลง MySQL, ตรวจสอบสถานะการเชื่อมต่อ และทำหน้าที่เสิร์ฟไฟล์ Single Page App
              </p>
              <div className="text-[11px] text-zinc-500 font-mono">
                Entry: /server.ts
              </div>
            </div>

            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                DB
              </div>
              <h4 className="font-bold text-white text-sm">Database (MySQL & phpMyAdmin)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                จัดเก็บข้อมูลแบบ Relational Database บน MySQL/MariaDB 8 ตารางหลัก ครอบคลุมทรัพย์สิน, ใบโอนย้าย 3 ลายเซ็น, บันทึกส่งซ่อม และสิทธิ์ผู้ใช้ RBAC
              </p>
              <div className="text-[11px] text-zinc-500 font-mono">
                Schema: /src/services/mysqlService.ts
              </div>
            </div>
          </div>

          <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>การบริหารสิทธิ์ผู้ใช้งาน (RBAC Matrix 5 บทบาท)</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">คำอธิบาย</th>
                    <th className="py-2.5 px-3">สิทธิ์หลัก</th>
                    <th className="py-2.5 px-3">การอนุมัติใบโอน A4</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-purple-400">ADMIN</td>
                    <td className="py-2.5 px-3">ผู้ดูแลระบบสูงสุด</td>
                    <td className="py-2.5 px-3">เข้าถึงทุกเมนู, ปรับสิทธิ์ RBAC, จัดการ MySQL, ลบ/แก้ไขข้อมูลหลัก</td>
                    <td className="py-2.5 px-3 text-emerald-400">ทุกขั้นตอน</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-cyan-400">IT</td>
                    <td className="py-2.5 px-3">เจ้าหน้าที่ฝ่ายไอที</td>
                    <td className="py-2.5 px-3">จัดการทรัพย์สิน, พิมพ์สติกเกอร์ QR, รับเรื่อง Ticket, มอบหมายงานช่าง</td>
                    <td className="py-2.5 px-3 text-cyan-300">อนุมัติ Step 1 (ผู้จัดทำ/ฝ่ายไอที)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-amber-400">MANAGER</td>
                    <td className="py-2.5 px-3">ผู้จัดการแผนก</td>
                    <td className="py-2.5 px-3">ดูภาพรวมทรัพย์สินในแผนก, เปิด Ticket, อนุมัติการเคลื่อนย้ายอุปกรณ์</td>
                    <td className="py-2.5 px-3 text-amber-300">อนุมัติ Step 2 (ผจก. แผนกต้นทาง)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-emerald-400">ACC</td>
                    <td className="py-2.5 px-3">ฝ่ายบัญชีและการเงิน</td>
                    <td className="py-2.5 px-3">ตรวจสอบมูลค่าต้นทุนทรัพย์สิน, ตรวจสอบสินทรัพย์ตัดจำหน่าย/ส่งซ่อม</td>
                    <td className="py-2.5 px-3 text-emerald-300">อนุมัติ Step 3 (ฝ่ายบัญชีควบคุม)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-zinc-400">USER</td>
                    <td className="py-2.5 px-3">พนักงานทั่วไป</td>
                    <td className="py-2.5 px-3">ดูทรัพย์สินที่ตนเองถือครอง, แจ้งซ่อม Helpdesk Ticket, ดูประวัติ Bincard</td>
                    <td className="py-2.5 px-3 text-zinc-500">ดูรายการที่เกี่ยวข้อง</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: FILE DICTIONARY */}
      {activeSection === 'files' && (
        <div className="space-y-4">
          <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-6 space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-blue-400" />
                <span>พจนานุกรมไฟล์ และส่วนที่แก้ไขในระบบ (Source Code Reference)</span>
              </h4>
              <p className="text-xs text-zinc-400 mt-1">
                รายละเอียดไฟล์หลัก พร้อมคำอธิบายหน้าที่ และจุดที่สามารถปรับแต่งเพิ่มเติมได้
              </p>
            </div>

            <div className="space-y-3 text-xs">
              {/* 1. server.ts */}
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-cyan-300 flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-cyan-400" />
                    <span>/server.ts</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800">
                    Backend / Node.js
                  </span>
                </div>
                <p className="text-zinc-300">
                  <strong>หน้าที่หลัก:</strong> เซิร์ฟเวอร์ Express สำหรับรันระบบทั้งในโหมด Dev (Vite Middleware) และ Production รวมถึงสร้าง Connection Pool เชื่อมต่อไปยัง MySQL (<code className="text-cyan-300">mysql2/promise</code>) และให้บริการ API Endpoints:
                </p>
                <ul className="list-disc list-inside text-zinc-400 pl-2 space-y-0.5 font-mono text-[11px]">
                  <li>GET /api/db/status - ตรวจสอบสถานะการเชื่อมต่อ MySQL</li>
                  <li>POST /api/db/sync - ซิงค์ข้อมูลทั้งหมดจากหน้าเว็บลงฐานข้อมูล MySQL</li>
                  <li>GET /api/db/data - ดึงข้อมูลทั้งหมดจาก MySQL กลับมายังหน้าเว็บ</li>
                </ul>
              </div>

              {/* 2. App.tsx */}
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-blue-300 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>/src/App.tsx</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-950 text-blue-300 border border-blue-800">
                    Core State Hub
                  </span>
                </div>
                <p className="text-zinc-300">
                  <strong>หน้าที่หลัก:</strong> ตัวควบคุม State กลางของแอปพลิเคชัน จัดการ Authentication, การเปลี่ยนรหัสผ่านครั้งแรก, การเปิด-ปิด Modal ต่างๆ, ระบบค้นหา Global Search, และการกระจายข้อมูล Props ไปยังแต่ละหน้า (Dashboard, Assets, Transfers, Tickets, Reports, Admin)
                </p>
              </div>

              {/* 3. TransferFormA4Modal.tsx */}
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-emerald-300 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>/src/components/Transfers/TransferFormA4Modal.tsx</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                    A4 Form & Signature Engine
                  </span>
                </div>
                <p className="text-zinc-300">
                  <strong>หน้าที่หลัก:</strong> แสดงผลใบโอนย้ายทรัพย์สิน A4 มาตรฐาน 3 ภาษา (ไทย, อังกฤษ, จีน) พร้อมระบบ 3 ลายเซ็นดิจิทัล (IT &rarr; Manager &rarr; ACC) รองรับการตั้งค่ากล่องลายเซ็น 9 กล่อง, การสเกลขนาด A4 Fit, และการพิมพ์ออกเครื่องพิมพ์หรือ PDF คมชัดสมบูรณ์
                </p>
              </div>

              {/* 4. LoginScreen.tsx */}
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-purple-300 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    <span>/src/components/Auth/LoginScreen.tsx</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-800">
                    Authentication & Production Portal
                  </span>
                </div>
                <p className="text-zinc-300">
                  <strong>หน้าที่หลัก:</strong> หน้าต่าง Login ดีไซน์ Dual-Pane พรีเมียม พร้อม Hero Status Card, การตรวจสอบรหัสผ่านอย่างปลอดภัย, และการแสดงตราสัญลักษณ์ XingTaiLogo พร้อมสำหรับ Production Deployment
                </p>
              </div>

              {/* 5. MySQLManager.tsx & mysqlService.ts */}
              <div className="p-4 rounded-xl bg-black/40 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-mono font-bold text-amber-300 flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-amber-400" />
                    <span>/src/components/Admin/MySQLManager.tsx & /src/services/mysqlService.ts</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800">
                    Database Bridge
                  </span>
                </div>
                <p className="text-zinc-300">
                  <strong>หน้าที่หลัก:</strong> ฟังก์ชันสร้างไฟล์ <code className="text-cyan-300">xingtai_db.sql</code> อัตโนมัติ, เครื่องมือซิงค์ข้อมูล, ตรวจสอบสถานะการเชื่อมต่อ และตัวสร้างชุดไฟล์ PHP API Gateway (<code className="text-cyan-300">api.php</code>, <code className="text-cyan-300">db_config.php</code>)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: WORDPRESS DEPLOYMENT */}
      {activeSection === 'wordpress' && (
        <div className="space-y-6">
          {/* Quick Action Bar */}
          <div className="bg-[#111728] border border-blue-900/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>ชุดปลั๊กอินสำเร็จรูปสำหรับ WordPress (Ready-to-use WP Plugin)</span>
              </div>
              <p className="text-xs text-zinc-400">
                ดาวน์โหลดไฟล์ <code className="text-cyan-300">xingtai-asset-manager.php</code> แล้วนำไปใส่ในโฟลเดอร์ <code className="text-cyan-300">wp-content/plugins/</code> ของ WordPress ได้ทันที
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyWpCode}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 border border-zinc-700 transition-colors cursor-pointer"
              >
                {copiedWpCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWpCode ? 'คัดลอกแล้ว!' : 'คัดลอกโค้ด PHP'}</span>
              </button>
              <button
                onClick={handleDownloadWpPlugin}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลด Plugin</span>
              </button>
            </div>
          </div>

          {/* 4 Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Method 1 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">วิธีที่ 1: ติดตั้งผ่าน WordPress Plugin (แนะนำ)</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                1. กดปุ่ม <strong>"ดาวน์โหลด Plugin"</strong> ด้านบน<br />
                2. นำไฟล์ <code className="text-cyan-300">xingtai-asset-manager.php</code> ไปวางในโฟลเดอร์ <code className="text-cyan-300">/wp-content/plugins/xingtai-asset-manager/</code> บน Hosting หรือใส่ใน zip แล้วกด Add New Plugin ใน WordPress Admin<br />
                3. กด <strong>Activate Plugin</strong><br />
                4. ในหน้าเพจของ WordPress ให้พิมพ์ Shortcode:
              </p>
              <div className="flex items-center justify-between bg-black/50 p-2.5 rounded-lg border border-zinc-800 font-mono text-xs text-cyan-300">
                <span>[xingtai_assets height="100vh"]</span>
                <button
                  onClick={handleCopyShortcode}
                  className="text-zinc-400 hover:text-white"
                  title="คัดลอก Shortcode"
                >
                  {copiedShortcode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Method 2 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">วิธีที่ 2: วางใน Elementor หรือ Gutenberg HTML</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                หากใช้ Elementor หรือ Gutenberg สามารถเพิ่มวิดเจ็ต <strong>Custom HTML</strong> แล้วใส่โค้ด iframe นี้ได้ทันที:
              </p>
              <pre className="bg-black/50 p-2.5 rounded-lg border border-zinc-800 font-mono text-[11px] text-cyan-300 overflow-x-auto leading-relaxed select-all">
{`<iframe 
  src="${window.location.origin}" 
  style="width:100%; height:950px; border:none; border-radius:12px;" 
  allow="camera; clipboard-read; clipboard-write;"
></iframe>`}
              </pre>
            </div>

            {/* Method 3 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">วิธีที่ 3: Build & อัปโหลดไปยังโฟลเดอร์ย่อย</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                1. รันคำสั่ง <code className="text-cyan-300 font-mono">npm run build</code> เพื่อสร้างไฟล์ HTML/JS/CSS ในโฟลเดอร์ <code className="text-cyan-300 font-mono">/dist</code><br />
                2. อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์ <code className="text-cyan-300 font-mono">dist</code> ไปไว้ที่โฟลเดอร์ของ WordPress เช่น <code className="text-cyan-300 font-mono">public_html/assets/</code><br />
                3. สามารถเข้าสู่ระบบได้ที่ <code className="text-cyan-300 font-mono">https://your-domain.com/assets/</code> โดยตรง
              </p>
            </div>

            {/* Method 4 */}
            <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  4
                </div>
                <h4 className="font-bold text-white text-sm">วิธีที่ 4: เชื่อมต่อผ่าน MySQL เดียวกับ WordPress</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                ระบบ Xing Tai สามารถใช้ฐานข้อมูล MySQL เดียวกับ WordPress ได้ โดยเพียงแค่นำเข้าตาราง <code className="text-cyan-300 font-mono">branches</code>, <code className="text-cyan-300 font-mono">assets</code>, <code className="text-cyan-300 font-mono">transfer_forms</code> ลงใน Database ของ WordPress ผ่าน phpMyAdmin
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: MYSQL & PHPMYADMIN */}
      {activeSection === 'mysql' && (
        <div className="bg-[#111420] border border-zinc-800 rounded-2xl p-6 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-400" />
            <span>ขั้นตอนการติดตั้ง MySQL & phpMyAdmin สำหรับระบบ Xing Tai</span>
          </h4>
          <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800">
              <strong className="text-white block mb-1">1. การสร้าง Database</strong>
              เข้าสู่ phpMyAdmin &rarr; คลิก New &rarr; ตั้งชื่อ <code className="text-cyan-300 font-mono">xingtai_db</code> &rarr; เลือกการเข้ารหัส <code className="text-cyan-300 font-mono">utf8mb4_unicode_ci</code> &rarr; กด Create
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800">
              <strong className="text-white block mb-1">2. การนำเข้า Schema & Data Dump</strong>
              ไปที่แท็บ Import ใน phpMyAdmin &rarr; เลือกไฟล์ <code className="text-cyan-300 font-mono">xingtai_db.sql</code> ที่ดาวน์โหลดจากเมนู Admin ของระบบนี้ &rarr; กด Go เพื่อรันคำสั่งสร้าง 8 ตาราง
            </div>
            <div className="p-3.5 rounded-xl bg-black/40 border border-zinc-800">
              <strong className="text-white block mb-1">3. การกำหนดค่าใน .env</strong>
              ระบุตัวแปรสภาพแวดล้อม:
              <pre className="mt-1 bg-zinc-950 p-2.5 rounded text-emerald-400 font-mono text-[11px]">
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=xingtai_db
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HIDDEN PRINTABLE / PDF GENERATION TEMPLATE (A4 HIGH-RESOLUTION THAI PAGES) */}
      {/* ========================================================================= */}
      <div className="overflow-hidden h-0 w-0 opacity-0 pointer-events-none fixed -top-[10000px] -left-[10000px]">
        <div ref={pdfTemplateRef} className="font-sans text-zinc-900 bg-white">
          
          {/* ==================== PAGE 1: COVER, ARCHITECTURE & RBAC ==================== */}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-10 flex flex-col justify-between box-border text-zinc-900 relative">
            <div>
              {/* Header */}
              <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center text-white font-extrabold text-lg shadow">
                    XT
                  </div>
                  <div>
                    <h1 className="text-lg font-extrabold text-blue-950 tracking-tight">
                      บริษัท ซิงไท่ เทรดดิ้ง (ประเทศไทย) จำกัด
                    </h1>
                    <div className="text-[11px] font-semibold text-zinc-600">
                      XING TAI TRADING (THAILAND) CO., LTD.
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 bg-blue-900 text-white rounded font-bold text-xs">
                    SYSTEM MANUAL & SPECIFICATION
                  </span>
                  <div className="text-[10px] text-zinc-500 mt-1 font-mono">
                    Version 2.4 (Production Release)
                  </div>
                </div>
              </div>

              {/* Title Section */}
              <div className="my-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-xl shadow-md">
                <h2 className="text-xl font-bold">
                  คู่มือสถาปัตยกรรมระบบ, การบริหารสิทธิ์ RBAC & คู่มือการติดตั้ง
                </h2>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Enterprise Asset Governance, 3-Step Approval Transfer Forms, IT Helpdesk SLA & WordPress Deployment
                </p>
              </div>

              {/* Section 1: System Overview */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-blue-950 border-b border-zinc-300 pb-1 mb-2.5 flex items-center gap-1.5">
                  <span>1. ภาพรวมสถาปัตยกรรม 3-Tier Enterprise</span>
                </h3>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div className="font-bold text-blue-900 mb-1">1. Frontend Layer</div>
                    <div className="text-[11px] text-zinc-700 leading-relaxed">
                      React 19 + TypeScript + Vite + Tailwind CSS 4 ออกแบบเป็น Single Page Application (SPA) รองรับ Responsive และพิมพ์เอกสาร A4 คมชัดสูง
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div className="font-bold text-blue-900 mb-1">2. Backend API Layer</div>
                    <div className="text-[11px] text-zinc-700 leading-relaxed">
                      Node.js Express Server พร้อม Connection Pool เชื่อมต่อไปยัง MySQL พร้อม API Endpoint สำหรับซิงค์ข้อมูลและตรวจสอบสถานะระบบ
                    </div>
                  </div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div className="font-bold text-blue-900 mb-1">3. Database Layer</div>
                    <div className="text-[11px] text-zinc-700 leading-relaxed">
                      MySQL 5.7+ / 8.0+ / MariaDB จัดเก็บ 8 ตารางหลัก รองรับ utf8mb4_unicode_ci และสามารถบริหารจัดการผ่าน phpMyAdmin ได้ 100%
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: RBAC Matrix */}
              <div className="mb-5">
                <h3 className="text-sm font-bold text-blue-950 border-b border-zinc-300 pb-1 mb-2.5 flex items-center gap-1.5">
                  <span>2. ตารางสิทธิ์การใช้งาน 5 ระดับ (RBAC 5-Tier Permission Matrix)</span>
                </h3>
                <table className="w-full text-xs text-left border border-zinc-300 border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 text-zinc-800 font-bold border-b border-zinc-300">
                      <th className="p-2 border-r border-zinc-300 w-24">Role</th>
                      <th className="p-2 border-r border-zinc-300">บทบาทและหน้าที่</th>
                      <th className="p-2 border-r border-zinc-300">ขอบเขตสิทธิ์ในระบบ</th>
                      <th className="p-2">การอนุมัติใบโอน A4</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-[11px] text-zinc-800">
                    <tr>
                      <td className="p-2 font-bold text-purple-800 border-r border-zinc-200">ADMIN</td>
                      <td className="p-2 border-r border-zinc-200">ผู้ดูแลระบบสูงสุด</td>
                      <td className="p-2 border-r border-zinc-200">เข้าถึงทุกเมนู, ปรับสิทธิ์ RBAC, นำเข้า/ส่งออก MySQL, จัดการพนักงาน</td>
                      <td className="p-2 font-bold text-emerald-700">อนุมัติได้ทุกขั้นตอน</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-cyan-800 border-r border-zinc-200">IT Specialist</td>
                      <td className="p-2 border-r border-zinc-200">ฝ่ายเทคโนโลยีสารสนเทศ</td>
                      <td className="p-2 border-r border-zinc-200">จัดการทะเบียนทรัพย์สิน, พิมพ์สติกเกอร์ QR, รับเรื่อง Ticket, จ่ายงานซ่อม</td>
                      <td className="p-2 text-cyan-800">อนุมัติ Step 1 (ผู้จัดทำ/ฝ่ายไอที)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-amber-800 border-r border-zinc-200">MANAGER</td>
                      <td className="p-2 border-r border-zinc-200">ผู้จัดการแผนก</td>
                      <td className="p-2 border-r border-zinc-200">ดูทรัพย์สินแผนก, อนุมัติยืม/ย้าย, ดูรายงานภาพรวม</td>
                      <td className="p-2 text-amber-800">อนุมัติ Step 2 (ผจก. แผนกต้นทาง)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-emerald-800 border-r border-zinc-200">ACC</td>
                      <td className="p-2 border-r border-zinc-200">ฝ่ายบัญชีและการเงิน</td>
                      <td className="p-2 border-r border-zinc-200">ตรวจมูลค่าต้นทุน, ตรวจสอบสินทรัพย์ตัดจำหน่ายและค่าเสื่อม</td>
                      <td className="p-2 text-emerald-800">อนุมัติ Step 3 (ฝ่ายบัญชีควบคุม)</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold text-zinc-700 border-r border-zinc-200">USER</td>
                      <td className="p-2 border-r border-zinc-200">พนักงานทั่วไป</td>
                      <td className="p-2 border-r border-zinc-200">ดูทรัพย์สินที่ตนถือครอง, เปิดแจ้งซ่อม Helpdesk Ticket, ดูประวัติการใช้งาน</td>
                      <td className="p-2 text-zinc-500">ดูรายการที่เกี่ยวข้อง</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Security & Approvals */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-lg text-xs text-zinc-800 space-y-1">
                <div className="font-bold text-blue-950">มาตรฐานความปลอดภัยและกระบวนการอนุมัติ 3 ลายเซ็น:</div>
                <div className="text-[11px] text-zinc-700 leading-relaxed">
                  ระบบบังคับใช้กระบวนการ 3 ลายเซ็นดิจิทัลตามมาตรฐานองค์กร: <strong>IT Specialist &rarr; Dept Manager &rarr; Accounting Controller</strong> เพื่อความโปร่งใสและตรวจสอบย้อนหลังได้ 100% พร้อมระบบบันทึก Audit Log และการป้องกันข้อมูลระดับ Enterprise
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-300 pt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>บริษัท ซิงไท่ เทรดดิ้ง (ประเทศไทย) จำกัด • ฝ่ายเทคโนโลยีสารสนเทศ</span>
              <span>หน้าที่ 1 จาก 4</span>
            </div>
          </div>

          {/* ==================== PAGE 2: SOURCE CODE & FILE DICTIONARY ==================== */}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-10 flex flex-col justify-between box-border text-zinc-900 relative">
            <div>
              {/* Header */}
              <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-extrabold text-base">
                    XT
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-blue-950">
                      พจนานุกรมไฟล์โครงสร้างระบบ (Source Code & File Reference)
                    </h2>
                    <div className="text-[10px] text-zinc-600">
                      Xing Tai Enterprise Asset Management System
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px] text-zinc-500 font-mono">
                  SECTION 2: SOURCE CODE DICTIONARY
                </div>
              </div>

              {/* Content List */}
              <div className="mt-4 space-y-3 text-xs">
                {/* 1 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/server.ts</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-sans">Node.js / Express</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> เซิร์ฟเวอร์ Express สำหรับรันระบบทั้งในโหมดพัฒนาและ Production, จัดการ MySQL Connection Pool (<code className="text-blue-800">mysql2/promise</code>) และให้บริการ API Endpoints: <code className="text-blue-800">GET /api/db/status</code>, <code className="text-blue-800">POST /api/db/sync</code>, <code className="text-blue-800">GET /api/db/data</code>
                  </p>
                </div>

                {/* 2 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/src/App.tsx</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-sans">State Hub & RBAC</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> ตัวควบคุมศูนย์กลางของแอปพลิเคชัน จัดการสถานะ Authentication, การเปลี่ยนรหัสผ่านครั้งแรก, การเปิด-ปิด Modal ต่างๆ, ระบบค้นหา Global Search, และการกระจายข้อมูล Props ไปยังแต่ละหน้า
                  </p>
                </div>

                {/* 3 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/src/components/Transfers/TransferFormA4Modal.tsx</span>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-sans">A4 Form & Signature Engine</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> แสดงผลใบโอนย้ายทรัพย์สิน A4 มาตรฐาน 3 ภาษา (ไทย, อังกฤษ, จีน) พร้อมระบบ 3 ลายเซ็นดิจิทัล (IT &rarr; Manager &rarr; ACC) รองรับการตั้งค่ากล่องลายเซ็น 9 กล่อง, การสเกลขนาด A4 Fit, และการพิมพ์ออกเครื่องพิมพ์หรือ PDF คมชัดสมบูรณ์
                  </p>
                </div>

                {/* 4 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/src/components/Auth/LoginScreen.tsx</span>
                    <span className="text-[10px] px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-sans">Production Auth Portal</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> หน้าต่าง Login แบบ Dual-Pane พรีเมียม พร้อม Hero Status Card, การตรวจสอบรหัสผ่านอย่างปลอดภัย และการแสดงตราสัญลักษณ์ XingTaiLogo รองรับ Production เต็มรูปแบบ
                  </p>
                </div>

                {/* 5 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/src/components/Assets/AssetInventory.tsx</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-sans">Inventory & QR Scanner</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> ตารางทะเบียนทรัพย์สิน ค้นหา กรองสถานะ สแกน QR ตรวจสอบทรัพย์สิน และพิมพ์สติกเกอร์บาร์โค้ดขนาดมาตรฐาน
                  </p>
                </div>

                {/* 6 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/src/components/Tickets/TicketList.tsx</span>
                    <span className="text-[10px] px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded font-sans">Helpdesk & SLA Engine</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> ระบบเปิดใบแจ้งซ่อม ติดตามสถานะงานช่างไอที SLA Countdown และบันทึกประวัติค่าใช้จ่ายส่งซ่อมภายนอก
                  </p>
                </div>

                {/* 7 */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex items-center justify-between font-mono font-bold text-blue-900 text-xs">
                    <span>/src/services/mysqlService.ts & /src/components/Admin/MySQLManager.tsx</span>
                    <span className="text-[10px] px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-sans">Database Bridge</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 mt-1 leading-relaxed">
                    <strong>หน้าที่หลัก:</strong> เครื่องมือสร้างไฟล์ DDL/DML <code className="text-blue-800">xingtai_db.sql</code> อัตโนมัติ, ซิงค์ข้อมูล, ตรวจสอบสถานะการเชื่อมต่อ และตัวสร้างชุดไฟล์ PHP API Gateway (<code className="text-blue-800">api.php</code>, <code className="text-blue-800">db_config.php</code>)
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-300 pt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>บริษัท ซิงไท่ เทรดดิ้ง (ประเทศไทย) จำกัด • เอกสารอ้างอิงโครงสร้างซอร์สโค้ด</span>
              <span>หน้าที่ 2 จาก 4</span>
            </div>
          </div>

          {/* ==================== PAGE 3: WORDPRESS DEPLOYMENT GUIDE ==================== */}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-10 flex flex-col justify-between box-border text-zinc-900 relative">
            <div>
              {/* Header */}
              <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-extrabold text-base">
                    XT
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-blue-950">
                      คู่มือการนำระบบไปติดตั้งบน WordPress (WordPress Deployment Guide)
                    </h2>
                    <div className="text-[10px] text-zinc-600">
                      4 วิธีการติดตั้งสำหรับสภาพแวดล้อมองค์กร
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px] text-zinc-500 font-mono">
                  SECTION 3: WORDPRESS INTEGRATION
                </div>
              </div>

              {/* 4 Methods */}
              <div className="mt-4 space-y-4 text-xs">
                {/* Method 1 */}
                <div className="p-4 bg-zinc-50 border border-blue-200 rounded-lg">
                  <div className="font-bold text-blue-950 text-sm mb-1.5 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">1</span>
                    <span>วิธีที่ 1: ติดตั้งผ่าน WordPress Plugin สำเร็จรูป (แนะนำ)</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-zinc-700 space-y-1 pl-1 leading-relaxed">
                    <li>ดาวน์โหลดไฟล์ <code className="font-mono text-blue-900 font-bold">xingtai-asset-manager.php</code> จากปุ่มในระบบ</li>
                    <li>นำไฟล์ไปวางในโฟลเดอร์ <code className="font-mono text-blue-900">/wp-content/plugins/xingtai-asset-manager/</code> บนเว็บโฮสติ้ง หรือ Zip แล้วอัปโหลดผ่าน WordPress Admin</li>
                    <li>ไปที่เมนู <strong>Plugins &rarr; Installed Plugins</strong> แล้วกด <strong>Activate</strong></li>
                    <li>สร้างหน้าเพจใหม่ (Page) แล้ววาง Shortcode: <code className="bg-blue-100 px-1.5 py-0.5 rounded font-mono font-bold text-blue-900">[xingtai_assets height="100vh"]</code></li>
                  </ol>
                </div>

                {/* Method 2 */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 text-sm mb-1.5 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">2</span>
                    <span>วิธีที่ 2: ฝังผ่าน Elementor หรือ Gutenberg Custom HTML Block</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-zinc-700 space-y-1 pl-1 leading-relaxed">
                    <li>เปิดหน้าแก้ไขของ Elementor หรือ Gutenberg Block Editor</li>
                    <li>เพิ่มวิดเจ็ต <strong>Custom HTML</strong> แล้วใส่โค้ด iframe:</li>
                  </ol>
                  <div className="mt-2 p-2 bg-zinc-900 text-cyan-300 font-mono text-[10px] rounded border border-zinc-700">
                    &lt;iframe src="{window.location.origin}" style="width:100%; height:950px; border:none; border-radius:12px;" allow="camera; clipboard-read; clipboard-write;"&gt;&lt;/iframe&gt;
                  </div>
                </div>

                {/* Method 3 */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 text-sm mb-1.5 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">3</span>
                    <span>วิธีที่ 3: Build และอัปโหลดไปยังโฟลเดอร์ย่อย (Subdirectory)</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-zinc-700 space-y-1 pl-1 leading-relaxed">
                    <li>รันคำสั่ง <code className="font-mono text-blue-900 font-bold">npm run build</code> เพื่อสร้างไฟล์ HTML/JS/CSS ในโฟลเดอร์ <code className="font-mono text-blue-900">/dist</code></li>
                    <li>อัปโหลดไฟล์ทั้งหมดในโฟลเดอร์ <code className="font-mono text-blue-900">dist</code> ไปไว้ที่โฟลเดอร์ของ WordPress เช่น <code className="font-mono text-blue-900">public_html/assets/</code></li>
                    <li>สามารถเข้าสู่ระบบได้ที่ <code className="font-mono text-blue-900 font-bold">https://your-domain.com/assets/</code> โดยตรง รวดเร็วและปลอดภัย</li>
                  </ol>
                </div>

                {/* Method 4 */}
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 text-sm mb-1.5 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">4</span>
                    <span>วิธีที่ 4: เชื่อมต่อผ่านฐานข้อมูล MySQL เดียวกับ WordPress</span>
                  </div>
                  <p className="text-[11px] text-zinc-700 leading-relaxed pl-1">
                    ระบบ Xing Tai สามารถใช้ฐานข้อมูล MySQL เดียวกับ WordPress ได้ โดยเพียงแค่นำเข้าตารางทั้ง 8 ตารางลงใน Database ของ WordPress ผ่าน phpMyAdmin เพื่อรวมศูนย์ข้อมูลและการสำรองข้อมูลไว้ในที่เดียว
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-zinc-300 pt-2.5 flex items-center justify-between text-[10px] text-zinc-500">
              <span>บริษัท ซิงไท่ เทรดดิ้ง (ประเทศไทย) จำกัด • คู่มือการติดตั้งบน WordPress</span>
              <span>หน้าที่ 3 จาก 4</span>
            </div>
          </div>

          {/* ==================== PAGE 4: MYSQL SETUP & SLA ==================== */}
          <div className="pdf-a4-page w-[794px] h-[1123px] bg-white p-10 flex flex-col justify-between box-border text-zinc-900 relative">
            <div>
              {/* Header */}
              <div className="border-b-2 border-blue-900 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-white font-extrabold text-base">
                    XT
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-blue-950">
                      คู่มือการติดตั้ง MySQL & phpMyAdmin และการบำรุงรักษาระบบ
                    </h2>
                    <div className="text-[10px] text-zinc-600">
                      Database Installation, Maintenance & Support SLA
                    </div>
                  </div>
                </div>
                <div className="text-right text-[10px] text-zinc-500 font-mono">
                  SECTION 4: DATABASE & SLA
                </div>
              </div>

              {/* MySQL Setup Steps */}
              <div className="mt-4 space-y-3.5 text-xs">
                <h3 className="text-sm font-bold text-blue-950 border-b border-zinc-300 pb-1 flex items-center gap-1.5">
                  <span>ขั้นตอนการตั้งค่า MySQL & phpMyAdmin</span>
                </h3>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 mb-1">1. การสร้างฐานข้อมูล (Database Creation)</div>
                  <div className="text-[11px] text-zinc-700 leading-relaxed">
                    เข้าสู่ phpMyAdmin &rarr; คลิก <strong>New</strong> &rarr; ตั้งชื่อ Database: <code className="font-mono font-bold text-blue-900">xingtai_db</code> &rarr; เลือก Collation: <code className="font-mono font-bold text-blue-900">utf8mb4_unicode_ci</code> &rarr; กด Create
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 mb-1">2. การนำเข้าโครงสร้างตาราง (Importing Schema & Seed Data)</div>
                  <div className="text-[11px] text-zinc-700 leading-relaxed">
                    ไปที่แท็บ <strong>Import</strong> ใน phpMyAdmin &rarr; เลือกไฟล์ <code className="font-mono font-bold text-blue-900">xingtai_db.sql</code> ที่ดาวน์โหลดจากเมนู Admin &rarr; กด <strong>Go</strong> เพื่อสร้างตารางทั้ง 8 ตาราง พร้อมข้อมูลเริ่มต้นของสาขา แผนก และสิทธิ์ RBAC
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 mb-1">3. การกำหนดค่า Environment Variables (.env)</div>
                  <pre className="mt-1 bg-zinc-900 text-emerald-400 p-2.5 rounded font-mono text-[10px]">
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_secure_password
MYSQL_DATABASE=xingtai_db
                  </pre>
                </div>

                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="font-bold text-blue-950 mb-1">4. การรันเซิร์ฟเวอร์ใน Production</div>
                  <div className="text-[11px] text-zinc-700 leading-relaxed">
                    รันคำสั่ง <code className="font-mono text-blue-900 font-bold">npm run build</code> แล้วสตาร์ทด้วย <code className="font-mono text-blue-900 font-bold">npm start</code> หรือใช้ PM2 / Docker Container ในการควบคุมกระบวนการทำงานตลอด 24/7
                  </div>
                </div>

                {/* IT Support & SLA Box */}
                <div className="mt-5 p-4 bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-xl shadow">
                  <div className="font-bold text-sm mb-2 text-cyan-300">
                    ข้อมูลติดต่อฝ่ายเทคนิคและการรับประกัน SLA (IT Support & Maintenance)
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px] text-zinc-300">
                    <div>
                      <div><strong>ฝ่ายเทคโนโลยีสารสนเทศ:</strong> บริษัท ซิงไท่ เทรดดิ้ง (ประเทศไทย) จำกัด</div>
                      <div><strong>เบอร์โทรศัพท์ภายใน:</strong> ต่อ 1102 (ฝ่ายไอที)</div>
                      <div><strong>อีเมลแจ้งปัญหา:</strong> it-support@xingtai.co.th</div>
                    </div>
                    <div>
                      <div><strong>เป้าหมาย SLA แก้ไขปัญหา:</strong> ปิดงานภายใน 4-24 ชั่วโมง</div>
                      <div><strong>การสำรองข้อมูล (Backup):</strong> อัตโนมัติทุกวันเวลา 00:00 น.</div>
                      <div><strong>สถานะความพร้อมใช้งาน (Uptime):</strong> 99.8% Guarantee</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature sign-off */}
            <div className="pt-4 border-t border-zinc-300 flex items-center justify-between text-xs text-zinc-600">
              <div>
                <div className="text-[10px] text-zinc-500">ผู้อนุมัติเอกสารคู่มือ:</div>
                <div className="font-bold text-zinc-800">ฝ่ายเทคโนโลยีสารสนเทศ และผู้บริหารเทคโนโลยี</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-zinc-500">วันที่จัดทำเอกสาร:</div>
                <div className="font-bold text-zinc-800">{new Date().toLocaleDateString('th-TH')}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

