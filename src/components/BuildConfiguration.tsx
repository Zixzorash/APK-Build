import React, { useState } from 'react';
import { 
  Smartphone, 
  Package, 
  Key, 
  ShieldCheck, 
  Cpu, 
  Settings2, 
  Play, 
  Layers, 
  Globe, 
  Camera, 
  Bell, 
  HardDrive, 
  Vibrate, 
  Info,
  Sparkles,
  Check
} from 'lucide-react';
import { AppConfig, OutputFormat } from '../types';

interface BuildConfigurationProps {
  config: AppConfig;
  onChangeConfig: (newConfig: AppConfig) => void;
  onStartBuild: () => void;
  isBuilding: boolean;
  canBuild: boolean;
}

export function BuildConfiguration({
  config,
  onChangeConfig,
  onStartBuild,
  isBuilding,
  canBuild,
}: BuildConfigurationProps) {
  const [activeConfigTab, setActiveConfigTab] = useState<'general' | 'signing' | 'permissions'>('general');

  const updateField = <K extends keyof AppConfig>(key: K, value: AppConfig[K]) => {
    onChangeConfig({
      ...config,
      [key]: value,
    });
  };

  const updatePermission = (permKey: keyof AppConfig['permissions'], val: boolean) => {
    onChangeConfig({
      ...config,
      permissions: {
        ...config.permissions,
        [permKey]: val,
      },
    });
  };

  const updateKeystore = (field: keyof AppConfig['keystore'], val: string | number) => {
    onChangeConfig({
      ...config,
      keystore: {
        ...config.keystore,
        [field]: val,
      },
    });
  };

  return (
    <div className="bg-[#181820] rounded-3xl p-5 lg:p-6 border border-[#2b2b3a] shadow-xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#38e08c] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#38e08c]"></span>
            ขั้นตอนที่ 2 : กำหนดค่าการคอมไพล์และแพ็กเกจ
          </span>
          <h2 className="text-lg lg:text-xl font-bold text-white mt-1">
            การตั้งค่า APK & สถาปัตยกรรม Android
          </h2>
        </div>

        {/* Sub-tabs for configuration */}
        <div className="flex items-center p-1 bg-[#121217] rounded-2xl border border-[#262634] w-full sm:w-auto">
          <button
            onClick={() => setActiveConfigTab('general')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeConfigTab === 'general'
                ? 'bg-[#2a2a3b] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            ทั่วไป & รูปแบบ
          </button>
          <button
            onClick={() => setActiveConfigTab('signing')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeConfigTab === 'signing'
                ? 'bg-[#2a2a3b] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            การลงชื่อ (Keystore)
          </button>
          <button
            onClick={() => setActiveConfigTab('permissions')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeConfigTab === 'permissions'
                ? 'bg-[#2a2a3b] text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            สิทธิ์ของแอพ ({Object.values(config.permissions).filter(Boolean).length})
          </button>
        </div>
      </div>

      {/* OUTPUT FORMAT SELECTOR (Material Design 3 Segmented Buttons) */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center justify-between">
          <span>ตัวเลือก OUTPUT : รูปแบบไฟล์ผลลัพธ์</span>
          <span className="text-[11px] text-[#7b88ff] font-normal">พร้อมติดตั้งและส่งขึ้นสโตร์</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Option 1: APK */}
          <div
            onClick={() => updateField('outputFormat', 'apk')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
              config.outputFormat === 'apk'
                ? 'bg-[#212130] border-[#7b88ff] shadow-md shadow-[#7b88ff]/10 ring-1 ring-[#7b88ff]'
                : 'bg-[#131319] border-[#292938] hover:border-[#38384e] opacity-80'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${config.outputFormat === 'apk' ? 'bg-[#7b88ff]/20 text-[#9cb0ff]' : 'bg-[#1e1e28] text-gray-400'}`}>
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white">APK Standalone</h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">ยอดนิยม</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">ไฟล์ติดตั้งลงบนมือถือ Android ได้ทันที</p>
            </div>
            {config.outputFormat === 'apk' && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7b88ff] flex items-center justify-center text-[#131318]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Option 2: XAPK */}
          <div
            onClick={() => updateField('outputFormat', 'xapk')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
              config.outputFormat === 'xapk'
                ? 'bg-[#212130] border-[#7b88ff] shadow-md shadow-[#7b88ff]/10 ring-1 ring-[#7b88ff]'
                : 'bg-[#131319] border-[#292938] hover:border-[#38384e] opacity-80'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${config.outputFormat === 'xapk' ? 'bg-[#7b88ff]/20 text-[#9cb0ff]' : 'bg-[#1e1e28] text-gray-400'}`}>
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white">XAPK (Bundle)</h4>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">รวม Split APKs, OBB & Manifest สำหรับสโตร์</p>
            </div>
            {config.outputFormat === 'xapk' && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7b88ff] flex items-center justify-center text-[#131318]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>

          {/* Option 3: AAB */}
          <div
            onClick={() => updateField('outputFormat', 'aab')}
            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 relative ${
              config.outputFormat === 'aab'
                ? 'bg-[#212130] border-[#7b88ff] shadow-md shadow-[#7b88ff]/10 ring-1 ring-[#7b88ff]'
                : 'bg-[#131319] border-[#292938] hover:border-[#38384e] opacity-80'
            }`}
          >
            <div className={`p-2.5 rounded-xl ${config.outputFormat === 'aab' ? 'bg-[#7b88ff]/20 text-[#9cb0ff]' : 'bg-[#1e1e28] text-gray-400'}`}>
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-bold text-white">AAB (Play Store)</h4>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-500/20 text-indigo-300">Play Store</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">Android App Bundle สำหรับอัปโหลดขึ้น Play Console</p>
            </div>
            {config.outputFormat === 'aab' && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#7b88ff] flex items-center justify-center text-[#131318]">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab 1: General Settings */}
      {activeConfigTab === 'general' && (
        <div className="space-y-4 pt-2">
          {/* App Icon Banner */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#2e2e3e] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#1a1a24] border-2 border-emerald-500/40 p-1 flex items-center justify-center shrink-0 shadow-md">
                {config.customIconUrl ? (
                  <img
                    src={config.customIconUrl}
                    alt="App Icon"
                    className="w-full h-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#7b88ff] to-[#38e08c] flex items-center justify-center text-xl shadow-inner">
                    🤖
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    ไอคอนแอพพลิเคชัน (App Icon)
                  </h4>
                  {config.customIconUrl && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      ตรวจพบจาก ZIP อัตโนมัติ
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {config.customIconName
                    ? `ใช้ไฟล์ "${config.customIconName}" สำหรับสร้างไอคอนทุกความละเอียด (mdpi ถึง xxxhdpi)`
                    : 'ใช้ชุดไอคอน Material Design 3 เริ่มต้น หรือเลือกรูปภาพใหม่'}
                </p>
              </div>
            </div>

            <label className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#222232] text-gray-200 hover:bg-[#2c2c40] border border-[#35354a] transition-all cursor-pointer shrink-0">
              <span>เปลี่ยนไอคอน</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    onChangeConfig({
                      ...config,
                      customIconBlob: f,
                      customIconUrl: URL.createObjectURL(f),
                      customIconName: f.name,
                    });
                  }
                }}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* App Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span>ชื่อแอพพลิเคชัน (App Name)</span>
              <span className="text-gray-500 text-[11px]">ชื่อไอคอนบนหน้าจอ</span>
            </label>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => updateField('appName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white focus:outline-none focus:border-[#7b88ff] text-sm font-medium transition-colors"
              placeholder="เช่น My Awesome App"
            />
          </div>

          {/* Package Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span>แพ็กเกจ (Package Name / ApplicationId)</span>
              <span className="text-gray-500 text-[11px]">ห้ามซ้ำบนสโตร์</span>
            </label>
            <input
              type="text"
              value={config.packageName}
              onChange={(e) => updateField('packageName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-indigo-300 focus:outline-none focus:border-[#7b88ff] font-mono text-sm transition-colors"
              placeholder="com.yourdomain.appname"
            />
          </div>

          {/* Version Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span>เวอร์ชัน (Version Name)</span>
              <span className="text-gray-500 text-[11px]">เช่น 1.0.0</span>
            </label>
            <input
              type="text"
              value={config.versionName}
              onChange={(e) => updateField('versionName', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white focus:outline-none focus:border-[#7b88ff] text-sm font-mono transition-colors"
              placeholder="1.0.0"
            />
          </div>

          {/* Version Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span>รหัสเวอร์ชัน (Version Code)</span>
              <span className="text-gray-500 text-[11px]">ตัวเลขจำนวนเต็ม</span>
            </label>
            <input
              type="number"
              min="1"
              value={config.versionCode}
              onChange={(e) => updateField('versionCode', parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white focus:outline-none focus:border-[#7b88ff] text-sm font-mono transition-colors"
            />
          </div>

          {/* Target SDK */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 flex items-center justify-between">
              <span>Target SDK (เป้าหมายระบบ Android)</span>
              <span className="text-emerald-400 text-[11px] font-bold">Android 15 (ล่าสุด)</span>
            </label>
            <select
              value={config.targetSdkVersion}
              onChange={(e) => updateField('targetSdkVersion', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#121218] border border-[#2e2e3e] text-white focus:outline-none focus:border-[#7b88ff] text-sm transition-colors"
            >
              <option value={35}>API Level 35 (Android 15 - รุ่นล่าสุด)</option>
              <option value={34}>API Level 34 (Android 14 - Play Store บังคับขั้นต่ำ)</option>
              <option value={33}>API Level 33 (Android 13 Tiramisu)</option>
            </select>
          </div>

          {/* Hardware Acceleration & Optimization */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#121218] border border-[#2e2e3e] self-end">
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                เปิดใช้ Hardware Acceleration
              </p>
              <p className="text-[11px] text-gray-400">เร่งความเร็วการเรนเดอร์ GPU บนมือถือ</p>
            </div>
            <input
              type="checkbox"
              checked={config.enableHardwareAcceleration}
              onChange={(e) => updateField('enableHardwareAcceleration', e.target.checked)}
              className="w-5 h-5 accent-[#7b88ff] rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
      )}

      {/* Tab 2: Signing & Keystore Settings */}
      {activeConfigTab === 'signing' && (
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              onClick={() => updateField('signType', 'debug')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                config.signType === 'debug'
                  ? 'bg-[#212130] border-[#7b88ff] ring-1 ring-[#7b88ff]'
                  : 'bg-[#131319] border-[#292938]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Key className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Auto Debug Keystore</h4>
              </div>
              <p className="text-xs text-gray-400">สร้างคีย์ดีบักอัตโนมัติ ติดตั้งและทดสอบบนมือถือได้ทุกเครื่องทันที ไม่ต้องตั้งรหัสผ่าน</p>
            </div>

            <div
              onClick={() => updateField('signType', 'release')}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                config.signType === 'release'
                  ? 'bg-[#212130] border-[#7b88ff] ring-1 ring-[#7b88ff]'
                  : 'bg-[#131319] border-[#292938]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Production Release Keystore</h4>
              </div>
              <p className="text-xs text-gray-400">ลงชื่อด้วยคีย์ Production พร้อมนำส่งขึ้น Google Play Store อย่างปลอดภัย</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#121218] border border-[#2e2e3e]">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Key Alias</label>
              <input
                type="text"
                value={config.keystore.alias}
                onChange={(e) => updateKeystore('alias', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-[#333346] text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">องค์กร / ผู้พัฒนา</label>
              <input
                type="text"
                value={config.keystore.organization}
                onChange={(e) => updateKeystore('organization', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-[#333346] text-xs text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">อายุคีย์ (ปี)</label>
              <input
                type="number"
                value={config.keystore.validityYears}
                onChange={(e) => updateKeystore('validityYears', parseInt(e.target.value) || 25)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#181822] border border-[#333346] text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Permissions Settings */}
      {activeConfigTab === 'permissions' && (
        <div className="space-y-3 pt-2">
          <p className="text-xs text-gray-400">
            เลือกสิทธิ์ของระบบ Android ที่ต้องการให้เพิ่มลงใน <code>AndroidManifest.xml</code> โดยอัตโนมัติ:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Internet */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2e2e3e] cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-xs font-bold text-white">INTERNET</p>
                  <p className="text-[10px] text-gray-400">เชื่อมต่ออินเทอร์เน็ต & API</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.permissions.internet}
                onChange={(e) => updatePermission('internet', e.target.checked)}
                className="w-4 h-4 accent-[#7b88ff] rounded"
              />
            </label>

            {/* Storage */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2e2e3e] cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">STORAGE / MEDIA</p>
                  <p className="text-[10px] text-gray-400">เข้าถึงรูปภาพ วิดีโอ และไฟล์</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.permissions.storage}
                onChange={(e) => updatePermission('storage', e.target.checked)}
                className="w-4 h-4 accent-[#7b88ff] rounded"
              />
            </label>

            {/* Camera */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2e2e3e] cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">CAMERA</p>
                  <p className="text-[10px] text-gray-400">สิทธิ์ใช้งานกล้องถ่ายรูป</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.permissions.camera}
                onChange={(e) => updatePermission('camera', e.target.checked)}
                className="w-4 h-4 accent-[#7b88ff] rounded"
              />
            </label>

            {/* Notifications */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2e2e3e] cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-pink-400" />
                <div>
                  <p className="text-xs font-bold text-white">NOTIFICATIONS</p>
                  <p className="text-[10px] text-gray-400">แจ้งเตือน (Android 13+)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.permissions.notifications}
                onChange={(e) => updatePermission('notifications', e.target.checked)}
                className="w-4 h-4 accent-[#7b88ff] rounded"
              />
            </label>

            {/* Vibrate */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2e2e3e] cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-purple-400" />
                <div>
                  <p className="text-xs font-bold text-white">VIBRATE</p>
                  <p className="text-[10px] text-gray-400">การสั่นตอบสนอง (Haptic)</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.permissions.vibrate}
                onChange={(e) => updatePermission('vibrate', e.target.checked)}
                className="w-4 h-4 accent-[#7b88ff] rounded"
              />
            </label>

            {/* Network State */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-[#121218] border border-[#2e2e3e] cursor-pointer hover:border-gray-600 transition-colors">
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-xs font-bold text-white">NETWORK STATE</p>
                  <p className="text-[10px] text-gray-400">ตรวจสอบสถานะเน็ต On/Off</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={config.permissions.networkState}
                onChange={(e) => updatePermission('networkState', e.target.checked)}
                className="w-4 h-4 accent-[#7b88ff] rounded"
              />
            </label>
          </div>
        </div>
      )}

      {/* Action / Trigger Build Button */}
      <div className="pt-2">
        <button
          onClick={onStartBuild}
          disabled={!canBuild || isBuilding}
          className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg flex items-center justify-center gap-3 transition-all transform shadow-xl active:scale-[0.98] ${
            !canBuild || isBuilding
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
              : 'bg-gradient-to-r from-[#7b88ff] via-[#8c74f5] to-[#38e08c] text-white hover:opacity-95 shadow-[0_8px_25px_rgba(123,136,255,0.35)]'
          }`}
        >
          {isBuilding ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>กำลังแปลงและคอมไพล์ {config.outputFormat.toUpperCase()}...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>เริ่มแปลงเป็น {config.outputFormat.toUpperCase()} และลงชื่ออัตโนมัติ</span>
            </>
          )}
        </button>
        {!canBuild && (
          <p className="text-center text-xs text-amber-400/90 mt-2 flex items-center justify-center gap-1">
            <Info className="w-3.5 h-3.5" />
            กรุณาเลือกไฟล์ ZIP โปรเจกต์ในขั้นตอนที่ 1 ก่อนเริ่มสร้าง APK
          </p>
        )}
      </div>
    </div>
  );
}
