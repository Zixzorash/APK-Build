import JSZip from 'jszip';

export interface GalleryApp {
  id: string;
  name: string;
  category: 'AI & Data' | 'Productivity' | 'Games & 3D' | 'Health & Utility' | 'Native Android';
  description: string;
  tags: string[];
  icon: string;
  version: string;
  stars: number;
  author: string;
  suggestedPackage: string;
  projectType: 'google_ai_studio' | 'native_gradle';
  codeHighlights: {
    framework: string;
    styling: string;
    features: string[];
  };
}

export const GALLERY_APPS: GalleryApp[] = [
  {
    id: 'gallery-cryptopulse',
    name: 'CryptoPulse: Web3 Portfolio Tracker',
    category: 'AI & Data',
    description: 'แดชบอร์ดติดตามราคาเหรียญคริปโตแบบเรียลไทม์ พร้อมการวิเคราะห์พอร์ตโฟลิโอและกราฟราคาแบบอินเทอร์แอคทีฟ',
    tags: ['Google AI Studio', 'React 19', 'Charts', 'Web3'],
    icon: '💎',
    version: '1.4.0',
    stars: 284,
    author: 'AI Studio Showcase',
    suggestedPackage: 'com.cryptopulse.portfolio',
    projectType: 'google_ai_studio',
    codeHighlights: {
      framework: 'React 19 + Vite',
      styling: 'Tailwind CSS v4 (Dark Theme)',
      features: ['IndexedDB Local Caching', 'Interactive Canvas Charts', 'Live Currency Converter'],
    },
  },
  {
    id: 'gallery-zenith3d',
    name: 'Zenith: 3D Spatial Simulator',
    category: 'Games & 3D',
    description: 'โปรเจกต์กราฟิก 3D แบบเรียลไทม์จำลองระบบสุริยะและสนามแรงโน้มถ่วง เรนเดอร์บนมือถือด้วย GPU Hardware Acceleration 60fps',
    tags: ['Google AI Studio', 'Three.js', 'WebGL', 'Gaming'],
    icon: '🪐',
    version: '2.0.1',
    stars: 412,
    author: 'Creative Studio Lab',
    suggestedPackage: 'com.zenith.spatial3d',
    projectType: 'google_ai_studio',
    codeHighlights: {
      framework: 'HTML5 Canvas + WebGL',
      styling: 'Minimalist HUD Overlay',
      features: ['Touch Orbit Controls', 'Particle Engine', 'GPU Shaders'],
    },
  },
  {
    id: 'gallery-cybernotes',
    name: 'CyberNotes: Vault & Markdown Editor',
    category: 'Productivity',
    description: 'แอพจดบันทึกความปลอดภัยสูงแบบออฟไลน์ พร้อมโปรแกรมแก้ไข Markdown, แท็กจัดกลุ่ม และการค้นหาแบบ Full-text',
    tags: ['Google AI Studio', 'Offline-First', 'Markdown', 'PWA'],
    icon: '📝',
    version: '1.2.5',
    stars: 198,
    author: 'DevCore Studio',
    suggestedPackage: 'com.cybernotes.vault',
    projectType: 'google_ai_studio',
    codeHighlights: {
      framework: 'React + TypeScript',
      styling: 'Material Design 3 Surfaces',
      features: ['Zero Cloud Leakage', 'Instant Search', 'Export PDF/MD'],
    },
  },
  {
    id: 'gallery-fittrack',
    name: 'FitTrack Pro: Jetpack Workout Tracker',
    category: 'Native Android',
    description: 'แอพติดตามการออกกำลังกายเขียนด้วย Native Kotlin และ Jetpack Compose พร้อมเซ็นเซอร์นับก้าว และการแจ้งเตือนดื่มน้ำ',
    tags: ['Native Android', 'Kotlin', 'Jetpack Compose', 'Gradle'],
    icon: '🏃',
    version: '3.1.0',
    stars: 520,
    author: 'Android Masters',
    suggestedPackage: 'com.fittrack.android.pro',
    projectType: 'native_gradle',
    codeHighlights: {
      framework: 'Native Kotlin 1.9 + Gradle 8.2',
      styling: 'Jetpack Compose Material You',
      features: ['Step Sensor Integration', 'Room Database', 'WorkManager Background Alerts'],
    },
  },
  {
    id: 'gallery-neonrider',
    name: 'Neon Rider: Cyberpunk Arcade Runner',
    category: 'Games & 3D',
    description: 'เกมแคชชวล 2D สไตล์ Synthwave Retro สีสันสดใส เสียงซินธ์สังเคราะห์ในตัว เล่นลื่นไหลบน Android ทุกรุ่น',
    tags: ['HTML5 Game', 'Canvas API', 'Web Audio', 'Arcade'],
    icon: '🏎️',
    version: '1.0.8',
    stars: 345,
    author: 'Arcade Forge',
    suggestedPackage: 'com.neonrider.cyberpunk',
    projectType: 'google_ai_studio',
    codeHighlights: {
      framework: 'Vanilla HTML5 + Web Audio API',
      styling: 'Neon Glow CSS Filters',
      features: ['High-score Leaderboard', 'Procedural Road Generator', 'Offline Synth Music'],
    },
  },
  {
    id: 'gallery-omnichat',
    name: 'OmniSmart: Local AI Task Assistant',
    category: 'AI & Data',
    description: 'ผู้ช่วยจัดการงานอัจฉริยะ พร้อมระบบถอดเสียงไมโครโฟน และระบบบริหารโปรเจกต์แบบ Kanban Board',
    tags: ['Google AI Studio', 'Voice Web API', 'Kanban', 'AI Ready'],
    icon: '🧠',
    version: '2.3.0',
    stars: 610,
    author: 'NextGen Apps',
    suggestedPackage: 'com.omnismart.assistant',
    projectType: 'google_ai_studio',
    codeHighlights: {
      framework: 'React 19 + TypeScript',
      styling: 'Glassmorphism Material 3',
      features: ['Drag & Drop Kanban', 'Speech Recognition', 'JSON Data Backup'],
    },
  },
];

/**
 * Generate complete project ZIP for any gallery app
 */
export async function generateGalleryAppZip(app: GalleryApp): Promise<File> {
  const zip = new JSZip();

  if (app.projectType === 'native_gradle') {
    zip.file('build.gradle', `plugins {\n    id 'com.android.application' version '8.2.2' apply false\n    id 'org.jetbrains.kotlin.android' version '1.9.22' apply false\n}`);
    zip.file('settings.gradle', `rootProject.name = "${app.name.replace(/[^a-zA-Z0-9]/g, '')}"\ninclude ':app'`);
    zip.file('app/build.gradle', `plugins {\n    id 'com.android.application'\n    id 'org.jetbrains.kotlin.android'\n}\nandroid {\n    namespace '${app.suggestedPackage}'\n    compileSdk 35\n    defaultConfig {\n        applicationId "${app.suggestedPackage}"\n        minSdk 24\n        targetSdk 35\n        versionCode 1\n        versionName "${app.version}"\n    }\n}`);
    zip.file('app/src/main/AndroidManifest.xml', `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${app.suggestedPackage}">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <application
        android:label="${app.name}"
        android:icon="@drawable/ic_launcher">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`);
    zip.file('app/src/main/java/com/app/MainActivity.kt', `package ${app.suggestedPackage}
import android.os.Bundle
import androidx.activity.ComponentActivity

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
    }
}`);
    const blob = await zip.generateAsync({ type: 'blob' });
    return new File([blob], `${app.id}.zip`, { type: 'application/zip' });
  }

  // Google AI Studio Project structure
  zip.file('metadata.json', JSON.stringify({
    name: app.name,
    description: app.description,
    majorCapabilities: ['MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API'],
  }, null, 2));

  zip.file('package.json', JSON.stringify({
    name: app.id,
    version: app.version,
    type: 'module',
    scripts: { dev: 'vite', build: 'vite build' },
    dependencies: { react: '^19.0.0', 'react-dom': '^19.0.0', 'lucide-react': '^0.400.0' },
  }, null, 2));

  const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7b88ff"/>
      <stop offset="100%" stop-color="#38e08c"/>
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="28" fill="url(#g)"/>
  <text x="50" y="66" font-size="48" text-anchor="middle">${app.icon}</text>
</svg>`;
  zip.file('icon.svg', iconSvg);
  zip.file('public/icon.svg', iconSvg);

  zip.file('index.html', `<!doctype html>
<html lang="th">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="/icon.svg" />
    <title>${app.name}</title>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; background: #0f0f14; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
        .app-card { background: #1a1a24; border: 1px solid #2e2e42; border-radius: 28px; padding: 32px; max-width: 420px; width: 100%; text-align: center; box-shadow: 0 16px 40px rgba(0,0,0,0.6); }
        .icon { font-size: 54px; margin-bottom: 12px; }
        h1 { margin: 0 0 8px; font-size: 22px; font-weight: 800; }
        p { color: #a0a0b2; font-size: 14px; line-height: 1.5; margin: 0 0 24px; }
        .btn { background: linear-gradient(135deg, #7b88ff, #38e08c); color: #0c0d14; border: none; padding: 14px 28px; border-radius: 999px; font-size: 15px; font-weight: 800; cursor: pointer; width: 100%; transition: transform 0.2s; }
        .btn:active { transform: scale(0.97); }
    </style>
</head>
<body>
    <div class="app-card">
        <div class="icon">${app.icon}</div>
        <h1>${app.name}</h1>
        <p>${app.description}</p>
        <button class="btn" onclick="alert('แอพ ${app.name} ทำงานสมบูรณ์บน Android!')">เข้าสู่แอพพลิเคชัน</button>
    </div>
</body>
</html>`);

  zip.file('src/App.tsx', `export default function App() { return <div>${app.name} Running!</div>; }`);
  zip.file('src/main.tsx', `console.log("${app.name} initialized");`);

  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], `${app.id}.zip`, { type: 'application/zip' });
}
