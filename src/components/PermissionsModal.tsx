import React, { useState } from 'react';
import { X, Bell, HardDrive, ShieldCheck, Check, Volume2, AlertCircle } from 'lucide-react';
import { notificationService } from '../services/notificationService';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationPermission: NotificationPermission;
  onPermissionUpdated: () => void;
}

export function PermissionsModal({
  isOpen,
  onClose,
  notificationPermission,
  onPermissionUpdated,
}: PermissionsModalProps) {
  const [storageGranted, setStorageGranted] = useState(true);
  const [testedSound, setTestedSound] = useState(false);

  if (!isOpen) return null;

  const handleRequestNotification = async () => {
    const res = await notificationService.requestNotificationPermission();
    onPermissionUpdated();
    if (res === 'granted') {
      notificationService.playSuccessChime();
    }
  };

  const handleTestChime = () => {
    notificationService.playSuccessChime();
    setTestedSound(true);
    setTimeout(() => setTestedSound(false), 1500);
  };

  const handleToggleStorage = async () => {
    if (navigator.storage && navigator.storage.persist) {
      const isPersisted = await navigator.storage.persist();
      setStorageGranted(isPersisted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#181822] rounded-3xl p-6 border border-[#303046] shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">จัดการสิทธิ์ของระบบ</h3>
            <p className="text-xs text-gray-400">สิทธิ์พื้นที่จัดเก็บ & การแจ้งเตือนเมื่อคอมไพล์เสร็จ</p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Permission 1: Storage Access */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#2b2b3c] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 mt-0.5">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">สิทธิ์เข้าถึงพื้นที่จัดเก็บของอุปกรณ์</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  อนุญาตให้อ่านไฟล์ ZIP และบันทึกไฟล์ APK ลงโฟลเดอร์ดาวน์โหลดของเครื่อง
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>เปิดใช้งานพร้อมบันทึกลงอุปกรณ์แล้ว</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleToggleStorage}
              className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#1e1e2c] text-gray-300 border border-[#333348]"
            >
              ตรวจสอบ
            </button>
          </div>

          {/* Permission 2: Notifications */}
          <div className="p-4 rounded-2xl bg-[#121218] border border-[#2b2b3c] flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 ${notificationPermission === 'granted' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'}`}>
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">การแจ้งเตือนเมื่อสร้าง APK สำเร็จ</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  ส่งการแจ้งเตือนของระบบ (System Notification) เมื่อกระบวนการสร้างและลงชื่อ APK เสร็จสิ้น
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-[11px] font-semibold ${notificationPermission === 'granted' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {notificationPermission === 'granted' ? '✓ อนุญาตแล้ว' : 'ยังไม่ได้รับสิทธิ์'}
                  </span>
                  <button
                    onClick={handleTestChime}
                    className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[#222232] text-indigo-300 hover:text-white"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>{testedSound ? 'กำลังเล่นเสียง...' : 'ทดสอบเสียงแจ้งเตือน'}</span>
                  </button>
                </div>
              </div>
            </div>

            {notificationPermission !== 'granted' && (
              <button
                onClick={handleRequestNotification}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#7b88ff] text-[#0f0f13] hover:bg-[#8f9bff] shrink-0"
              >
                อนุญาตสิทธิ์
              </button>
            )}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#252538] text-white text-xs font-bold hover:bg-[#303046] transition-colors"
        >
          เรียบร้อย
        </button>
      </div>
    </div>
  );
}
