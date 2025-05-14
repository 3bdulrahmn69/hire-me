import { useState } from 'react';
import { useCvContext } from '../../../context/CvContext';
import { omitKeys } from '../../../lib/utilities';
import Button from '../../ui/Button';

const AdaptPanel = () => {
  const [jobDescription, setJobDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { cvData } = useCvContext();

  const topLevelClean = omitKeys(cvData, ['id', 'theme']);
  const sectionsClean = topLevelClean.sections.map((section) =>
    omitKeys(section, ['id'])
  );
  const cleanedCvData = {
    ...topLevelClean,
    sections: sectionsClean,
  };

  const handleAdapt = () => {
    if (!jobDescription.trim()) {
      setErrorMessage('Please enter a job description');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('CV adapted successfully! Review changes below.');
      console.log('Adapting CV:', { jobDescription, cvData: cleanedCvData });
    }, 2000);
  };

  const loadExample = () => {
    setJobDescription(`Example Job Description:
We are seeking a skilled React developer with experience in TypeScript and modern frontend frameworks. Key responsibilities include:
- Developing responsive user interfaces
- Collaborating with cross-functional teams
- Optimizing application performance
- Maintaining code quality and best practices

Requirements:
- 3+ years of React experience
- Proficiency in TypeScript
- Experience with state management (Redux/MobX)
- Familiarity with REST APIs and modern tooling`);
  };

  return (
    <div className="w-full h-full bg-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">CV Adaptation</h2>
        <p className="text-gray-600 mt-2">
          Optimize your CV for specific job applications
        </p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Job Description
          </h3>
          <button
            onClick={loadExample}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Load Example
          </button>
        </div>

        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-all resize-none prose"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setErrorMessage('');
          }}
        />
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-500">
            {jobDescription.length}/2000 characters
          </span>
          {errorMessage && (
            <span className="text-red-600 text-sm">{errorMessage}</span>
          )}
        </div>
      </div>

      <div className="mt-8">
        <Button
          className="w-full py-3"
          onClick={handleAdapt}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              Adapting CV...
            </span>
          ) : (
            'Analyze & Adapt CV'
          )}
        </Button>

        {successMessage && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 font-medium">{successMessage}</p>
            <div className="mt-2 text-sm text-green-700">
              [Generated suggestions and comparisons would appear here]
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptPanel;
