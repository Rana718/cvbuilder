import { downloadsAPI } from '@/lib/api/downloads';
import { showAlert } from '@/components/ui/alert-utils';

export const trackDownloadWithLimit = async (): Promise<boolean> => {
  try {
    // Check if user can download
    const status = await downloadsAPI.getDownloadStatus();
    
    if (!status.can_download) {
      if (status.plan_expired) {
        showAlert('Your plan has expired. Please upgrade to continue downloading.');
      } else {
        showAlert(`Download limit reached. ${status.message}`);
      }
      return false;
    }

    // Track the download
    const result = await downloadsAPI.trackDownload();
    
    if (result.plan_expired) {
      showAlert('This was your last download. Your plan has expired. Please upgrade to continue.');
    } else if (result.remaining_downloads !== null && result.remaining_downloads <= 2) {
      showAlert(`Download successful! You have ${result.remaining_downloads} downloads remaining.`);
    }

    return true;
  } catch (error: any) {
    showAlert(error.message || 'Download failed. Please try again.');
    return false;
  }
};

// Usage example in PDF download:
// const handleDownload = async () => {
//   const canDownload = await trackDownloadWithLimit();
//   if (canDownload) {
//     // Proceed with actual PDF generation/download
//     generatePDF();
//   }
// };
