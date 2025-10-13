import axiosInstance from '@/lib/axios';

export interface DownloadStatus {
  can_download: boolean;
  downloads_used: number;
  download_limit: number | null;
  remaining_downloads: number | null;
  plan_expired: boolean;
  is_active: boolean;
  is_premium: boolean;
  plan_name: string;
  plan_slug: string;
  current_period_end?: string;
  message: string;
}

export interface DownloadTrackResponse {
  success: boolean;
  downloads_used: number;
  download_limit: number | null;
  remaining_downloads: number | null;
  plan_expired: boolean;
  message: string;
}

class DownloadsAPI {
  async getDownloadStatus(): Promise<DownloadStatus> {
    const response = await axiosInstance.get('/api/downloads/download-status');
    return response.data;
  }

  async trackDownload(): Promise<DownloadTrackResponse> {
    const response = await axiosInstance.post('/api/downloads/track-download');
    return response.data;
  }
}

export const downloadsAPI = new DownloadsAPI();
