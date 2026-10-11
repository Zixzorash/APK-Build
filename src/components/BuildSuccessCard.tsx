import React, { useState } from 'react';
import { 
  Download, 
  QrCode, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  Smartphone, 
  Package, 
  Layers, 
  ExternalLink, 
  Copy, 
  HelpCircle, 
  RotateCcw,
  Sparkles,
  Info
} from 'lucide-react';
import { BuildResult } from '../types';

interface BuildSuccessCardProps {
  result: BuildResult;
  onReset: () => void;
  onOpenGuide: () => void;
}

export function BuildSuccessCard({ result, onReset, onOpenGuide }: BuildSuccessCardProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);
  const [installGuideOpen, setInstallGuideOpen] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = result.downloadUrl;
    a.download = result.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopySha = () => {
    navigator.clipboard.writeText(result.sha256);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ดาวน์โหลด ${result.appName} (${result.format.toUpperCase()})`,
          text: `ติดตั้งแอป ${result.appName} เวอร์ชั่น ${result.versionName} สร้างด้วย APK Builder Pro`,
          url: window.location.href,
        });
      } catch {
        // ignore share cancellation
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว!');
    }
  };

  return (
    <div className="bg-[#181822] rounded-3xl p-6 lg:p-8 border border-[#2f2f42] shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background glow celebration */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#29293a]">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#13131a] rounded-[14px] flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                การสร้าง {result.format.toUpperCase()} สำเร็จ!
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                พร้อมติดตั้ง
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              ลงลายมือชื่อดิจิทัล (Signed) และจัดเรียง Zipalign เรียบร้อย สามารถนำไปติดตั้งใช้งานได้ทันที
            </p>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => setShowQrModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#222232] text-gray-200 hover:bg-[#2c2c40] border border-[#343448] transition-all"
            title="สแกน QR Code เพื่อดาวน์โหลดลงมือถือ"
          >
            <QrCode className="w-4 h-4 text-indigo-400" />
            <span>QR Code</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#222232] text-gray-200 hover:bg-[#2c2c40] border border-[#343448] transition-all"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>แชร์</span>
          </button>
        </div>
      </div>

      {/* Big Prominent Save / Download Action Button (As Requested: ปุ่ม "บันทึก" สำหรับดาวน์โหลด OUTPUT ลงอุปกรณ์) */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-[#1e2336] to-indigo-950/40 p-5 rounded-2xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Real App Icon Preview */}
          <div className="w-16 h-16 rounded-2xl bg-[#121218] border border-[#2e2e42] p-1 shrink-0 flex items-center justify-center shadow-md">
            {result.iconUrl ? (
              <img
                src={result.iconUrl}
                alt="App Icon"
                className="w-full h-full object-contain rounded-xl"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#7b88ff] to-[#38e08c] flex items-center justify-center text-2xl shadow-inner">
                🤖
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ไฟล์พร้อมติดตั้ง
              </span>
              <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Binary AXML Verified
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-0.5">{result.fileName}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              ขนาดไฟล์: <strong className="text-emerald-300 font-bold">{formatFileSize(result.fileSize)}</strong> (รวม Native Runtime & Multi-Density Mipmaps)
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full md:w-auto px-8 py-4 rounded-2xl font-black text-lg bg-gradient-to-r from-emerald-500 via-teal-400 to-[#7b88ff] text-[#0f1118] hover:opacity-95 shadow-[0_8px_30px_rgba(56,224,140,0.35)] transition-all flex items-center justify-center gap-3 transform active:scale-95"
        >
          <Download className="w-6 h-6 stroke-[2.5]" />
          <span>บันทึก {result.format.toUpperCase()} ลงอุปกรณ์</span>
        </button>
      </div>

      {/* APK Information Inspector Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Package & Version Info */}
        <div className="p-4 rounded-2xl bg-[#13131b] border border-[#29293a] space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            ข้อมูลแพ็กเกจ (App Package Info)
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#20202e]">
              <span className="text-gray-400">ชื่อแอพ:</span>
              <span className="text-white font-bold">{result.appName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#20202e]">
              <span className="text-gray-400">Package Name:</span>
              <span className="text-indigo-300 font-mono font-bold break-all">{result.packageName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#20202e]">
              <span className="text-gray-400">Version:</span>
              <span className="text-white font-mono">{result.versionName} (Code: {result.versionCode})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#20202e]">
              <span className="text-gray-400">เป้าหมายระบบ:</span>
              <span className="text-emerald-400 font-medium">Target SDK {result.targetSdk} (Android 15)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">การติดตั้ง:</span>
              <span className="text-teal-300 font-medium">รองรับทุกเวอร์ชัน Android รุ่นล่าสุด</span>
            </div>
          </div>
        </div>

        {/* Box 2: Security & Signature Details */}
        <div className="p-4 rounded-2xl bg-[#13131b] border border-[#29293a] space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            การลงชื่อและใบรับรอง (Signature & Keystore)
          </h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[#20202e]">
              <span className="text-gray-400">สถานะการลงชื่อ:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                ✓ Signed (v1 & v2 Auto)
              </span>
            </div>
            <div className="py-1 border-b border-[#20202e]">
              <div className="flex items-center justify-between text-gray-400 mb-1">
                <span>SHA-256 Fingerprint:</span>
                <button
                  onClick={handleCopySha}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  {copiedSha ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </button>
              </div>
              <p className="font-mono text-[10px] text-gray-300 break-all bg-[#0f0f16] p-2 rounded-lg border border-[#242436]">
                {result.signFingerprint}
              </p>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-400">Checksum (MD5):</span>
              <span className="text-gray-300 font-mono text-[11px]">{result.md5}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Permissions List Tagging */}
      <div className="p-4 rounded-2xl bg-[#13131b] border border-[#29293a]">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5">
          สิทธิ์ระบบที่ได้รับ (Android Permissions):
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {result.permissions.map((perm, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-[#1d1d2b] text-indigo-300 border border-[#2c2c42]"
            >
              {perm.replace('android.permission.', '')}
            </span>
          ))}
          {result.permissions.length === 0 && (
            <span className="text-xs text-gray-500">ไม่มีการขอสิทธิ์พิเศษ (Minimal Sandbox)</span>
          )}
        </div>
      </div>

      {/* Installation Guide Collapsible Card */}
      <div className="rounded-2xl border border-[#2d2d3e] bg-[#14141d] overflow-hidden">
        <button
          onClick={() => setInstallGuideOpen(!installGuideOpen)}
          className="w-full p-4 text-left flex items-center justify-between hover:bg-[#191924] transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-white">วิธีติดตั้ง APK บนมือถือ Android (คู่มือแก้ปัญหา)</span>
          </div>
          <span className="text-xs text-indigo-400 font-semibold">
            {installGuideOpen ? 'ซ่อนคำแนะนำ' : 'แสดงคำแนะนำ'}
          </span>
        </button>

        {installGuideOpen && (
          <div className="p-4 pt-0 text-xs text-gray-300 space-y-3 border-t border-[#232332] mt-1">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
              <strong>💡 หมายเหตุสำหรับ Android 13/14/15:</strong> เมื่อดาวน์โหลด APK ผ่าน Chrome หรือเบราว์เซอร์ ระบบจะขอสิทธิ์ &quot;ติดตั้งแอพที่ไม่รู้จัก (Install Unknown Apps)&quot; กรุณากด &quot;อนุญาต (Allow)&quot;
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-gray-400">
              <li>กดปุ่ม <strong>&quot;บันทึก APK ลงอุปกรณ์&quot;</strong> เพื่อดาวน์โหลดไฟล์เข้าเครื่อง</li>
              <li>เปิดแถบแจ้งเตือนหรือแอพ <strong>Files / ตัวจัดการไฟล์</strong> แล้วแตะที่ไฟล์ APK ที่ดาวน์โหลดเสร็จ</li>
              <li>หากขึ้นเตือน <em>&quot;สำหรับความปลอดภัย โทรศัพท์ของคุณไม่อนุญาตให้ติดตั้งแอปที่ไม่รู้จักจากแหล่งที่มานี้&quot;</em> ให้กด <strong>การตั้งค่า (Settings)</strong> แล้วเปิดสวิตช์อนุญาต</li>
              <li>หากหน้าต่าง Google Play Protect ปรากฏขึ้น ให้เลือก <strong>&quot;ติดตั้งต่อไป (Install anyway)&quot;</strong></li>
            </ol>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#20202e] text-gray-300 hover:bg-[#28283a] border border-[#323246] transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>แปลงไฟล์โปรเจกต์อื่น</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[#20202e] text-indigo-300 hover:bg-[#28283a] border border-indigo-500/30 transition-all"
        >
          <ExternalLink className="w-4 h-4 text-indigo-400" />
          <span>คำแนะนำนำส่งขึ้น Google Play Store</span>
        </button>
      </div>

      {/* QR Code Modal for Direct Mobile Scan */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#181822] rounded-3xl p-6 border border-[#323246] text-center space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">สแกนด้วยกล้องมือถือ Android</h3>
            <p className="text-xs text-gray-400">
              เปิดกล้องมือถือสแกนเพื่อเปิดหน้านี้บนสมาร์ทโฟน แล้วกดดาวน์โหลดติดตั้งได้ทันที
            </p>

            <div className="p-4 bg-white rounded-2xl inline-block shadow-inner mx-auto">
              {result.qrCodeUrl && (
                <img src={result.qrCodeUrl} alt="QR Code" className="w-56 h-56 mx-auto" />
              )}
            </div>

            <p className="text-[11px] text-gray-400 font-mono break-all">
              {window.location.href}
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#28283c] text-white text-xs font-bold hover:bg-[#34344e] transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
