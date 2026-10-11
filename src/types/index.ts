export type OutputFormat = 'apk' | 'xapk' | 'aab';

export type ProjectSourceType = 'google_ai_studio' | 'native_gradle' | 'web_hybrid' | 'unknown';

export interface AppConfig {
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  minSdkVersion: number;
  targetSdkVersion: number;
  outputFormat: OutputFormat;
  signType: 'debug' | 'release';
  enableOfflineCache: boolean;
  enableNotifications: boolean;
  enableHardwareAcceleration: boolean;
  permissions: {
    internet: boolean;
    storage: boolean;
    camera: boolean;
    notifications: boolean;
    vibrate: boolean;
    networkState: boolean;
  };
  keystore: {
    alias: string;
    organization: string;
    validityYears: number;
    sha256Fingerprint?: string;
  };
  customIconBlob?: Blob;
  customIconUrl?: string;
  customIconName?: string;
}

export interface BuildLog {
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface BuildResult {
  id: string;
  appName: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  format: OutputFormat;
  fileName: string;
  fileSize: number;
  blob: Blob;
  downloadUrl: string;
  createdAt: number;
  projectType: ProjectSourceType;
  sha256: string;
  md5: string;
  signFingerprint: string;
  targetSdk: number;
  permissions: string[];
  qrCodeUrl?: string;
  iconUrl?: string;
}

export interface ProjectAnalysis {
  detectedType: ProjectSourceType;
  title: string;
  suggestedPackageName: string;
  fileCount: number;
  totalSize: number;
  hasManifest: boolean;
  hasGradle: boolean;
  hasPackageJson: boolean;
  hasHtml: boolean;
  iconDataUrl?: string;
  iconFileName?: string;
  iconBlob?: Blob;
  entryPoint?: string;
}
