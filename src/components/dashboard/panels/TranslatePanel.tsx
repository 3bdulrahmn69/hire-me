import { useState } from 'react';
import Button from '../../ui/Button';
import { useCvContext } from '../../../context/CvContext';
import { omitKeys } from '../../../lib/utilities';

const languages = [
  { id: 'english', name: 'English' },
  { id: 'spanish', name: 'Spanish' },
  { id: 'german', name: 'German' },
  { id: 'italian', name: 'Italian' },
  { id: 'portuguese', name: 'Portuguese' },
  { id: 'dutch', name: 'Dutch' },
  { id: 'russian', name: 'Russian' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'arabic', name: 'Arabic' },
];

const TranslatePanel = () => {
  const [activeService, setActiveService] = useState<
    'claude' | 'openai' | 'gemini'
  >('claude');
  const [language, setLanguage] = useState<string>('english');
  const { cvData } = useCvContext();
  const topLevelClean = omitKeys(cvData, ['id', 'theme']);
  const sectionsClean = topLevelClean.sections.map((section) =>
    omitKeys(section, ['id'])
  );
  const cleanedCvData = {
    ...topLevelClean,
    sections: sectionsClean,
  };

  const handleTranslate = () => {
    console.log('Translating CV:', {
      service: activeService,
      targetLanguage: language,
      cvData: cleanedCvData,
    });
  };

  return (
    <div className="w-full h-full p-4 space-y-4">
      <h2 className="text-xl font-semibold">Translate your CV</h2>
      <p className="text-sm text-gray-600">
        Select a language to translate your CV. The translation will be done
        automatically.
      </p>

      <div className="space-y-3">
        <label htmlFor="language" className="text-sm font-medium block">
          Select Language
        </label>
        <select
          id="language"
          name="language"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {languages.map((lang) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium block">Select Service</label>
        <div className="flex space-x-4 mt-2">
          {['claude', 'openai', 'gemini'].map((service) => (
            <Button
              key={service}
              onClick={() =>
                setActiveService(service as 'claude' | 'openai' | 'gemini')
              }
              variant={activeService === service ? 'default' : 'secondary'}
            >
              {service.charAt(0).toUpperCase() + service.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <Button
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        onClick={handleTranslate}
      >
        Translate
      </Button>
    </div>
  );
};

export default TranslatePanel;
