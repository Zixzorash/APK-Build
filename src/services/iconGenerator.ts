/**
 * Android Multi-Density PNG Icon Generator
 * Renders sharp, high-contrast, adaptive launcher icons across all standard Android DPIs
 * (mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi) using custom icons extracted directly from the imported ZIP.
 */

export interface IconDensity {
  folder: string;
  size: number;
}

export const DENSITIES: IconDensity[] = [
  { folder: 'mipmap-mdpi', size: 48 },
  { folder: 'mipmap-hdpi', size: 72 },
  { folder: 'mipmap-xhdpi', size: 96 },
  { folder: 'mipmap-xxhdpi', size: 144 },
  { folder: 'mipmap-xxxhdpi', size: 192 },
];

export class IconGenerator {
  /**
   * Load any image blob (PNG, SVG, ICO, JPG, WEBP) into a CanvasImageSource
   */
  public static async createDrawableFromBlob(blob: Blob): Promise<CanvasImageSource> {
    const url = URL.createObjectURL(blob);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        createImageBitmap(blob)
          .then(resolve)
          .catch((err) => {
            console.warn('Failed to decode icon image bitmap:', err);
            reject(err);
          });
      };
      img.src = url;
    });
  }

  /**
   * Generates a PNG binary buffer for a given icon size using offscreen canvas
   */
  public static async generateLauncherIcon(
    size: number,
    appName: string,
    isRound = false,
    customDrawable?: CanvasImageSource
  ): Promise<Uint8Array> {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Cannot get 2d canvas context');

    ctx.clearRect(0, 0, size, size);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (customDrawable) {
      // Draw user provided custom icon extracted from imported ZIP
      ctx.save();
      ctx.beginPath();
      if (isRound) {
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      } else {
        const radius = size * 0.22;
        this.roundRect(ctx, 0, 0, size, size, radius);
      }
      ctx.closePath();
      ctx.clip();

      // Draw custom icon centered and scaled
      ctx.drawImage(customDrawable, 0, 0, size, size);
      ctx.restore();
    } else {
      // Draw modern Material Design 3 adaptive squircle or round icon fallback
      const radius = isRound ? size / 2 : size * 0.24;

      // Base gradient squircle
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, '#7b88ff');
      gradient.addColorStop(0.5, '#6c5ce7');
      gradient.addColorStop(1, '#00b894');

      ctx.save();
      ctx.beginPath();
      if (isRound) {
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      } else {
        this.roundRect(ctx, size * 0.04, size * 0.04, size * 0.92, size * 0.92, radius);
      }
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner subtle dark glass plate
      ctx.beginPath();
      if (isRound) {
        ctx.arc(size / 2, size / 2, size * 0.44, 0, Math.PI * 2);
      } else {
        this.roundRect(ctx, size * 0.08, size * 0.08, size * 0.84, size * 0.84, radius * 0.85);
      }
      ctx.fillStyle = 'rgba(19, 19, 26, 0.88)';
      ctx.fill();

      // Android Robot Dome Head
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(size * 0.5, size * 0.44, size * 0.22, Math.PI, 0, false);
      ctx.fill();

      // Antennae
      ctx.strokeStyle = '#7b88ff';
      ctx.lineWidth = Math.max(2, size * 0.04);
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(size * 0.38, size * 0.3);
      ctx.lineTo(size * 0.32, size * 0.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(size * 0.62, size * 0.3);
      ctx.lineTo(size * 0.68, size * 0.2);
      ctx.stroke();

      // Robot Eyes
      ctx.fillStyle = '#13131a';
      ctx.beginPath();
      ctx.arc(size * 0.42, size * 0.38, Math.max(1.5, size * 0.035), 0, Math.PI * 2);
      ctx.arc(size * 0.58, size * 0.38, Math.max(1.5, size * 0.035), 0, Math.PI * 2);
      ctx.fill();

      // Build Spark
      ctx.fillStyle = '#38e08c';
      ctx.beginPath();
      const cx = size * 0.5;
      const cy = size * 0.68;
      const s = size * 0.16;
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s, cy);
      ctx.lineTo(cx, cy + s);
      ctx.lineTo(cx - s, cy);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    return await this.canvasToUint8Array(canvas);
  }

  private static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  private static canvasToUint8Array(canvas: HTMLCanvasElement): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas blob creation failed'));
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(new Uint8Array(reader.result as ArrayBuffer));
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
      }, 'image/png');
    });
  }
}
