import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  ExternalLink 
} from 'lucide-react';
import JSZip from 'jszip';
import { AppConfig } from '../types';
import { GitHubExportService, GitHubRepoOptions } from '../services/githubExportService';

interface GitHubPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceZip: JSZip | null;
  config: AppConfig;
}

export function GitHubPublishModal({
  isOpen,
  onClose,
  sourceZip,
  config,
}: GitHubPublishModalProps) {
  const [repoName, setRepoName] = useState(() => 
    config.appName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'my-android-app'
  );
  const [description, setDescription] = useState(
    `Mobile Android application for ${config.appName} built with APK Builder Pro`
  );
  const [includeCiWorkflow, setIncludeCiWorkflow] = useState(true);
  const [includeLicense, setIncludeLicense] = useState(true);
  const [licenseType, setLicenseType] = useState<'MIT' | 'Apache-2.0' | 'GPL-3.0'>('MIT');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const handleDownloadRepoZip = async () => {
    if (!sourceZip) {
      alert('กรุณาเลือกไฟล์โปรเจกต์ก่อนส่งออกไปยัง GitHub');
      return;
    }

    try {
      setIsExporting(true);
      const options: GitHubRepoOptions = {
        repoName,
        description,
        isPrivate: false,
        includeCiWorkflow,
        includeLicense,
        licenseType,
      };

      const blob = await GitHubExportService.generateGitHubRepoZip(sourceZip, config, options);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${repoName}-github-repo.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('เกิดข้อผิดพลาดในการสร้างไฟล์ GitHub Repository');
    } finally {
      setIsExporting(false);
    }
  };

  const gitCommands = `# 1. แตกไฟล์ zip ที่ดาวน์โหลดแล้วเปิด Terminal ในโฟลเดอร์
cd ${repoName}

# 2. เริ่มต้น Git Repository
git init
git add .
git commit -m "Initial commit from APK Builder Pro"
git branch -M main

# 3. ส่งขึ้น GitHub (เลือกวิธีใดวิธีหนึ่ง):
# วิธี A: ใช้ GitHub CLI (แนะนำ - สร้าง Repository ให้อัตโนมัติ):
gh repo create ${repoName} --public --source=. --remote=origin --push

# วิธี B: หรือสร้าง Repo เปล่าบน https://github.com/new แล้วเชื่อมต่อ:
git remote add origin https://github.com/YOUR_USERNAME/${repoName}.git
git push -u origin main`;

  const handleCopyCommands = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#181824] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Publish to GitHub
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                CI/CD READY
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              ส่งออกโปรเจกต์พร้อมโครงสร้าง Repository, GitHub Actions CI/CD และเอกสาร README.md
            </p>
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">ชื่อ Repository (GitHub Repo Name):</label>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white text-xs font-mono focus:outline-none focus:border-[#7b88ff]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">ใบอนุญาต (License):</label>
            <select
              value={licenseType}
              onChange={(e) => setLicenseType(e.target.value as 'MIT' | 'Apache-2.0' | 'GPL-3.0')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white text-xs focus:outline-none focus:border-[#7b88ff]"
            >
              <option value="MIT">MIT License (ยอดนิยม เปิดกว้าง)</option>
              <option value="Apache-2.0">Apache License 2.0</option>
              <option value="GPL-3.0">GNU GPL v3</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-300">คำอธิบายโปรเจกต์ (Description):</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white text-xs focus:outline-none focus:border-[#7b88ff]"
          />
        </div>

        {/* Feature Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2b2b3c] cursor-pointer">
            <div>
              <p className="text-xs font-bold text-white">GitHub Actions CI/CD</p>
              <p className="text-[10px] text-gray-400">สร้างไฟล์ .github/workflows คอมไพล์ APK อัตโนมัติ</p>
            </div>
            <input
              type="checkbox"
              checked={includeCiWorkflow}
              onChange={(e) => setIncludeCiWorkflow(e.target.checked)}
              className="w-4 h-4 accent-[#7b88ff] rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2b2b3c] cursor-pointer">
            <div>
              <p className="text-xs font-bold text-white">ใส่ไฟล์ LICENSE</p>
              <p className="text-[10px] text-gray-400">ระบุลิขสิทธิ์โอเพ่นซอร์สในโครงการ</p>
            </div>
            <input
              type="checkbox"
              checked={includeLicense}
              onChange={(e) => setIncludeLicense(e.target.checked)}
              className="w-4 h-4 accent-[#7b88ff] rounded"
            />
          </label>
        </div>

        {/* Terminal Instructions */}
        <div className="rounded-2xl bg-[#0e0e14] border border-[#262638] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5 font-mono text-gray-300">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              คำสั่งสำหรับ Push ขึ้น GitHub (Git CLI):
            </span>
            <button
              onClick={handleCopyCommands}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-semibold"
            >
              {copiedCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCmd ? 'คัดลอกแล้ว!' : 'คัดลอกคำสั่ง'}</span>
            </button>
          </div>
          <pre className="text-[11px] font-mono text-gray-300 overflow-x-auto p-2.5 rounded-xl bg-[#14141c] leading-relaxed select-all">
            {gitCommands}
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <a
            href="https://github.com/new"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>เปิดหน้าสร้าง GitHub Repo ใหม่</span>
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#222232] text-gray-300 hover:bg-[#2b2b40]"
            >
              ปิด
            </button>

            <button
              type="button"
              onClick={handleDownloadRepoZip}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-black hover:bg-gray-200 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isExporting ? 'กำลังแพ็กเกจ Repo...' : 'ดาวน์โหลด GitHub Repo ZIP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
