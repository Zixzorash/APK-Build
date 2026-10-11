/**
 * Enhanced Notification Service for APK Builder Pro
 * Supports detailed multi-stage progress, completion chimes, and error notifications
 * 100% Offline-safe
 */

export interface BuildProgressDetails {
  step: number;
  totalSteps: number;
  phase: string;
  percent: number;
  currentAction: string;
}

class NotificationService {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Synthesize a modern Material 3 success chime (100% offline)
   */
  public playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Note 1: E5 (659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: G#5 (830.61 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(830.61, now + 0.08);
      gain2.gain.setValueAtTime(0.18, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.45);

      // Note 3: B5 (987.77 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(987.77, now + 0.16);
      gain3.gain.setValueAtTime(0.2, now + 0.16);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.16);
      osc3.stop(now + 0.6);

      // Final celebratory harmonic: E6 (1318.51 Hz)
      const osc4 = ctx.createOscillator();
      const gain4 = ctx.createGain();
      osc4.type = 'triangle';
      osc4.frequency.setValueAtTime(1318.51, now + 0.24);
      gain4.gain.setValueAtTime(0.14, now + 0.24);
      gain4.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
      osc4.connect(gain4);
      gain4.connect(ctx.destination);
      osc4.start(now + 0.24);
      osc4.stop(now + 0.85);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  /**
   * Synthesize a gentle error sound
   */
  public playErrorChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio chime error:', e);
    }
  }

  /**
   * Request system notification permission
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }

  public getNotificationPermission(): NotificationPermission {
    if (!('Notification' in window)) return 'denied';
    return Notification.permission;
  }

  /**
   * Trigger detailed system notification when build completes
   */
  public notifyBuildComplete(appName: string, format: string, details?: { durationSec?: number; sizeMb?: string }) {
    this.playSuccessChime();

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const extraText = details?.sizeMb ? ` | ขนาด ${details.sizeMb} MB` : '';
        const durationText = details?.durationSec ? ` (ใช้เวลา ${details.durationSec} วิ)` : '';
        const notif = new Notification(`APK Builder Pro: ${format.toUpperCase()} สร้างสำเร็จ! 🚀`, {
          body: `แอพพลิเคชัน "${appName}" ถูกแพ็กและลงลายมือชื่อดิจิทัลเรียบร้อยแล้ว${extraText}${durationText} พร้อมบันทึกลงอุปกรณ์ทันที`,
          icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%236750A4"/><path d="M50 20 L75 45 L65 45 L65 75 L35 75 L35 45 L25 45 Z" fill="%2338E08C"/></svg>',
          tag: 'build-success',
        });
        notif.onclick = () => window.focus();
      } catch (err) {
        console.warn('Notification display failed:', err);
      }
    }
  }

  /**
   * Trigger error notification
   */
  public notifyBuildError(appName: string, errorMessage: string) {
    this.playErrorChime();

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(`APK Builder Pro: การสร้างแอพขัดข้อง ✕`, {
          body: `เกิดข้อผิดพลาดในการแปลง "${appName}": ${errorMessage}`,
          icon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="24" fill="%23E53935"/><path d="M30 30 L70 70 M70 30 L30 70" stroke="white" stroke-width="12" stroke-linecap="round"/></svg>',
          tag: 'build-error',
        });
        notif.onclick = () => window.focus();
      } catch (err) {
        console.warn('Error notification failed:', err);
      }
    }
  }
}

export const notificationService = new NotificationService();
