/**
 * Cloud Storage Import Service for Google Drive, Dropbox, OneDrive, and Direct URLs
 * Converts public share links into direct downloadable streams
 */

export type CloudProvider = 'google_drive' | 'dropbox' | 'onedrive' | 'direct_url';

export interface CloudDownloadResult {
  file: File;
  provider: CloudProvider;
  originalName: string;
}

export class CloudStorageService {
  /**
   * Detect provider from URL
   */
  public static detectProvider(url: string): CloudProvider {
    const trimmed = url.trim().toLowerCase();
    if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
      return 'google_drive';
    }
    if (trimmed.includes('dropbox.com') || trimmed.includes('dropboxusercontent.com')) {
      return 'dropbox';
    }
    if (trimmed.includes('1drv.ms') || trimmed.includes('onedrive.live.com') || trimmed.includes('sharepoint.com')) {
      return 'onedrive';
    }
    return 'direct_url';
  }

  /**
   * Convert Dropbox share link to direct download link
   * e.g., https://www.dropbox.com/s/xyz/app.zip?dl=0 -> ?dl=1
   * e.g., https://www.dropbox.com/scl/fi/xyz/app.zip?rlkey=abc&dl=0 -> &dl=1
   */
  public static convertDropboxUrl(url: string): string {
    const u = new URL(url.trim());
    u.searchParams.set('dl', '1');
    return u.toString();
  }

  /**
   * Convert OneDrive share link to direct download link
   * OneDrive public shared links can be converted using the direct download parameter or API
   */
  public static convertOneDriveUrl(url: string): string {
    const trimmed = url.trim();
    // 1drv.ms short link or live.com
    if (trimmed.includes('1drv.ms')) {
      // 1drv shortlink redirect with download=1
      return trimmed.includes('?') ? `${trimmed}&download=1` : `${trimmed}?download=1`;
    }
    try {
      const u = new URL(trimmed);
      if (u.hostname.includes('onedrive.live.com')) {
        u.searchParams.set('download', '1');
        return u.toString();
      }
    } catch {
      // fallback
    }
    return trimmed;
  }

  /**
   * Convert Google Drive share link to direct download link
   */
  public static convertGoogleDriveUrl(urlOrId: string): string {
    const trimmed = urlOrId.trim();
    // Direct ID check
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
      return `https://drive.google.com/uc?export=download&id=${trimmed}`;
    }
    // Extract ID
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                  trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
                  trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return trimmed;
  }

  /**
   * Fetch ZIP from any cloud provider with progress notification
   */
  public static async fetchCloudFile(
    inputUrl: string,
    forcedProvider?: CloudProvider,
    onProgress?: (phase: string, percent?: number) => void
  ): Promise<CloudDownloadResult> {
    const provider = forcedProvider || this.detectProvider(inputUrl);
    let downloadUrl = inputUrl.trim();

    onProgress?.(`กำลังเชื่อมต่อไปยัง ${this.getProviderLabel(provider)}...`, 20);

    if (provider === 'dropbox') {
      downloadUrl = this.convertDropboxUrl(inputUrl);
    } else if (provider === 'onedrive') {
      downloadUrl = this.convertOneDriveUrl(inputUrl);
    } else if (provider === 'google_drive') {
      downloadUrl = this.convertGoogleDriveUrl(inputUrl);
    }

    onProgress?.('กำลังเริ่มดาวน์โหลดไฟล์โปรเจกต์ ZIP...', 45);

    try {
      const response = await fetch(downloadUrl, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`ไม่สามารถดาวน์โหลดไฟล์ได้ (HTTP ${response.status}: ${response.statusText}) กรุณาตรวจสอบว่าได้ตั้งค่าสิทธิ์แชร์เป็นสาธารณะแล้ว`);
      }

      onProgress?.('กำลังรับข้อมูลสตรีมไฟล์...', 75);
      const blob = await response.blob();

      // Check if response returned HTML page instead of zip
      if (blob.type.includes('text/html')) {
        const text = await blob.text();
        if (text.includes('virus scan warning') || text.includes('Google Drive - Virus scan warning')) {
          const confirmMatch = text.match(/href="(\/uc\?export=download[^"]+)"/);
          if (confirmMatch && confirmMatch[1]) {
            const confirmUrl = `https://drive.google.com${confirmMatch[1].replace(/&amp;/g, '&')}`;
            const secondResp = await fetch(confirmUrl);
            const secondBlob = await secondResp.blob();
            return {
              file: new File([secondBlob], 'cloud_project.zip', { type: 'application/zip' }),
              provider,
              originalName: 'cloud_project.zip',
            };
          }
        }
        throw new Error(`ลิงก์นี้ส่งคืนหน้าเว็บ HTML แทนที่จะเป็นไฟล์ ZIP กรุณาตรวจสอบว่าเลือกแชร์ไฟล์แบบ 'ทุกคนที่มีลิงก์สามารถเข้าถึงได้'`);
      }

      // Determine appropriate filename
      let fileName = 'cloud_project.zip';
      const contentDisposition = response.headers.get('content-disposition');
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=['"]?(?:UTF-\d['"]*)?([^;\r\n"']*)['"]?/i);
        if (match && match[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      } else {
        const pathSegments = new URL(downloadUrl).pathname.split('/');
        const last = pathSegments[pathSegments.length - 1];
        if (last && last.toLowerCase().endsWith('.zip')) {
          fileName = decodeURIComponent(last);
        }
      }

      if (!fileName.toLowerCase().endsWith('.zip')) {
        fileName += '.zip';
      }

      onProgress?.('ดาวน์โหลดไฟล์จากคลาวด์สำเร็จ!', 100);

      const file = new File([blob], fileName, { type: 'application/zip' });
      return { file, provider, originalName: fileName };
    } catch (err: unknown) {
      console.error('Cloud download error:', err);
      const e = err as Error;
      throw new Error(e.message || 'เกิดข้อผิดพลาดในการดาวน์โหลดจากคลาวด์');
    }
  }

  public static getProviderLabel(provider: CloudProvider): string {
    switch (provider) {
      case 'google_drive': return 'Google Drive';
      case 'dropbox': return 'Dropbox';
      case 'onedrive': return 'Microsoft OneDrive';
      case 'direct_url': return 'Direct Cloud URL';
    }
  }
}
