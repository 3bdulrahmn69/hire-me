import { useState } from 'react';
import Button from '../../ui/Button';
import { useCvContext } from '../../../context/CvContext';

const SharePanel = () => {
  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [hasCreatedLink, setHasCreatedLink] = useState(false);
  const { cvData } = useCvContext();

  const handleCreateShareLink = async () => {
    setIsLoading(true);
    try {
      setShareUrl(`http://localhost:5173/sahre/${cvData.id}`);
      setHasCreatedLink(true);
    } catch (error) {
      console.error('Error creating share link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div className="w-full max-w-md p-4 space-y-4">
      <h2 className="text-xl font-semibold">Share your CV</h2>
      <p className="text-sm text-gray-600">
        Create a shareable link to your CV. You can send this link to anyone you
        want to share your CV with.
      </p>

      {hasCreatedLink ? (
        <div className="space-y-3">
          <label htmlFor="share-url" className="text-sm font-medium block">
            Shareable link
          </label>
          <input
            id="share-url"
            type="text"
            value={shareUrl}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <Button
            onClick={handleCopyLink}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={isCopied}
          >
            {isCopied ? 'Copied !' : 'Copy link'}
          </Button>
          <p className="text-xs text-gray-500"></p>
        </div>
      ) : (
        <Button
          onClick={handleCreateShareLink}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating link...' : 'Create share link'}
        </Button>
      )}

      <p className="text-xs text-gray-500 mt-2"></p>
    </div>
  );
};

export default SharePanel;
