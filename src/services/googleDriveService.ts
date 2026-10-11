/**
 * Google Drive file importer helper
 * Allows users to import APK/ZIP source projects via Google Drive share link or ID
 */

export class GoogleDriveService {
  /**
   * Extract File ID from various Google Drive URL formats
   */
  public static extractFileId(urlOrId: string): string | null {
    const trimmed = urlOrId.trim();
    // Direct ID check (typical 28-44 chars alphanumeric with dashes/underscores)
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
      return trimmed;
    }

    // Pattern 1: /file/d/{id}/view
    const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1 && match1[1]) return match1[1];

    // Pattern 2: ?id={id}
    const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match2 && match2[1]) return match2[1];

    // Pattern 3: /folders/{id}
    const match3 = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (match3 && match3[1]) return match3[1];

    return null;
  }

  /**
   * Fetch ZIP from Google Drive direct download link
   */
  public static async fetchZipFromDrive(
    fileId: string,
    onProgress?: (msg: string) => void
  ): Promise<File> {
    onProgress?.('กำลังเชื่อมต่อไปยัง Google Drive...');

    // Google Drive direct export URL
    const directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    try {
      onProgress?.('กำลังดาวน์โหลดไฟล์ ZIP จากคลาวด์...');
      const response = await fetch(directUrl, { method: 'GET' });

      if (!response.ok) {
        throw new Error(`Google Drive ตอบกลับสถานะ: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
      
      // Check if response is actually HTML error page
      if (blob.type.includes('text/html')) {
        const text = await blob.text();
        if (text.includes('Google Drive') && text.includes('virus scan warning')) {
          // Large file virus confirmation link
          const confirmMatch = text.match(/href="(\/uc\?export=download[^"]+)"/);
          if (confirmMatch && confirmMatch[1]) {
            const confirmUrl = `https://drive.google.com${confirmMatch[1].replace(/&amp;/g, '&')}`;
            const secondResp = await fetch(confirmUrl);
            const secondBlob = await secondResp.blob();
            return new File([secondBlob], `drive_project_${fileId.slice(0, 6)}.zip`, { type: 'application/zip' });
          }
        }
        throw new Error('ไม่สามารถเข้าถึงไฟล์จาก Google Drive ได้ (กรุณาตั้งค่าสิทธิ์แชร์เป็น "ทุกคนที่มีลิงก์")');
      }

      return new File([blob], `gdrive_project_${fileId.slice(0, 6)}.zip`, { type: 'application/zip' });
    } catch (err) {
      console.error('Google Drive fetch error:', err);
      throw err;
    }
  }
}
