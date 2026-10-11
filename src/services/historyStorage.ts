import { BuildResult } from '../types';

const STORAGE_KEY = 'apk_builder_pro_history';

export class HistoryStorage {
  public static getHistory(): Omit<BuildResult, 'blob'>[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public static saveBuild(result: BuildResult) {
    try {
      const list = this.getHistory();
      // Omit blob from localStorage to save space, store metadata
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { blob, downloadUrl: _, ...item } = result;
      const updated = [item, ...list.filter(x => x.id !== result.id)].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save build history:', e);
    }
  }

  public static removeBuild(id: string) {
    try {
      const list = this.getHistory();
      const updated = list.filter(x => x.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to remove build:', e);
    }
  }

  public static clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear build history:', e);
    }
  }
}
