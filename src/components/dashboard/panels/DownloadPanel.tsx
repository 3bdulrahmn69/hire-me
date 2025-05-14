import Button from '../../ui/Button';
import { useState } from 'react';

const DownloadPanel = () => {
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isDownloadingCSV, setIsDownloadingCSV] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<'pdf' | 'csv' | null>(
    null
  );

  const handleDownload = async (type: 'pdf' | 'csv') => {
    // Simulate download delay
    if (type === 'pdf') {
      setIsDownloadingPDF(true);
    } else {
      setIsDownloadingCSV(true);
    }
    setDownloadSuccess(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setDownloadSuccess(type);

      // Here you would typically trigger the actual file download
      console.log(`Starting ${type.toUpperCase()} download`);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      if (type === 'pdf') {
        setIsDownloadingPDF(false);
      } else {
        setIsDownloadingCSV(false);
      }
    }
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          Data Exports
        </h2>
        <p className="mt-2 text-gray-600">
          Download your data in various formats. Choose between PDF reports or
          CSV raw data exports.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          className="w-full"
          onClick={() => handleDownload('pdf')}
          disabled={isDownloadingPDF}
        >
          {isDownloadingPDF ? 'Generating PDF...' : 'Download as PDF'}
        </Button>

        <Button
          className="w-full"
          onClick={() => handleDownload('csv')}
          disabled={isDownloadingCSV}
        >
          {isDownloadingCSV ? 'Generating CSV...' : 'Download as CSV'}
        </Button>

        <Button
          className="w-full"
          onClick={() => handleDownload('csv')}
          disabled={isDownloadingCSV}
          variant="link"
        >
          {isDownloadingCSV ? 'Generating CSV...' : 'Text File'}
        </Button>
      </div>

      {downloadSuccess && (
        <div className="mt-4 p-3 rounded-md bg-emerald-50 text-emerald-700 text-sm">
          Successfully generated {downloadSuccess.toUpperCase()} file! Your
          download will start shortly...
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-500">
          Need help? PDF reports are best for printing, while CSV files are
          suitable for data analysis.
        </p>
      </div>
    </div>
  );
};

export default DownloadPanel;
