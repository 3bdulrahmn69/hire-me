import { useState } from 'react';
import Button from '../../ui/Button';
import { useCvContext } from '../../../context/CvContext';

type AIService = 'openai' | 'gemini' | 'claude';

interface AnalysisState {
  service: AIService;
  targetPosition: string;
  cvData: object;
}

function omitKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const newObj = { ...obj };
  keys.forEach((key) => delete newObj[key]);
  return newObj;
}
const AnalysisPanel = () => {
  const { cvData } = useCvContext();
  const topLevelClean = omitKeys(cvData, ['id', 'theme']);
  const sectionsClean = topLevelClean.sections.map((section) =>
    omitKeys(section, ['id'])
  );
  const cleanedCvData = {
    ...topLevelClean,
    sections: sectionsClean,
  };

  const [state, setState] = useState<AnalysisState>({
    service: 'claude',
    targetPosition: '',
    cvData: cleanedCvData,
  });

  const handleServiceChange = (service: AIService) => {
    setState((prev) => ({ ...prev, service }));
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, targetPosition: e.target.value }));
  };

  const handleSubmit = () => {
    console.log('Submitting for analysis:', state);
  };

  return (
    <div className="w-full h-full bg-white p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Analyze your CV</h2>
        <p className="text-gray-700">
          Our AI analysis assesses the quality of your CV and gives you
          personalized advice to improve it.
        </p>
      </div>

      {/* AI Model Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose AI Model
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'claude', name: 'Claude', emoji: '🟣' },
            { id: 'openai', name: 'OpenAI', emoji: '🟢' },
            { id: 'gemini', name: 'Gemini', emoji: '🔵' },
          ].map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceChange(service.id as AIService)}
              className={`p-2 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                state.service === service.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200'
              }`}
            >
              <div className="text-xl mb-1">{service.emoji}</div>
              <span className="text-sm font-medium text-gray-700">
                {service.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Target Position Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Target position (optional)
        </label>
        <input
          type="text"
          value={state.targetPosition}
          onChange={handleTargetChange}
          placeholder="Ex: Front-end Web Developer"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <Button variant="default" className="w-full" onClick={handleSubmit}>
        Analyze my CV
      </Button>
    </div>
  );
};

export default AnalysisPanel;
