import React from 'react';
import Button from '../../ui/Button';
import { useCvContext } from '../../../context/CvContext';

const SharePanel = () => {
  const [isCopied, setIsCopied] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [shareUrl, setShareUrl] = React.useState('');
  const [hasCreatedLink, setHasCreatedLink] = React.useState(false);
  const { cvData } = useCvContext();

  const handleCreateShareLink = async () => {
    setIsLoading(true);
    try {
      setShareUrl(cvData.id);
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
      <h2 className="text-xl font-semibold">Partager le CV</h2>
      <p className="text-sm text-gray-600">
        Partagez ce lien pour permettre aux autres de visualiser votre CV en
        lecture seule.
      </p>

      {hasCreatedLink ? (
        <div className="space-y-3">
          <label htmlFor="share-url" className="text-sm font-medium block">
            Lien de partage
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
            {isCopied ? 'Copié !' : 'Copier le lien'}
          </Button>
          <p className="text-xs text-gray-500">
            Ce lien donne accès à une version en lecture seule de votre CV
          </p>
        </div>
      ) : (
        <Button
          onClick={handleCreateShareLink}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Création du lien...' : 'Créer un lien de partage'}
        </Button>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Les personnes avec ce lien pourront visualiser votre CV actuel. Mettez à
        jour votre CV pour modifier la version partagée.
      </p>
    </div>
  );
};

export default SharePanel;
