import { useState, useMemo } from 'react';
import { useCvContext } from '../../../context/CvContext';
import Button from '../../ui/Button';

const ReviseTextPanel = () => {
  const { cvData, updateSectionEntries, setPersonalInfo } = useCvContext();

  const [selectedSectionId, setSelectedSectionId] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewResult, setReviewResult] = useState<null | {
    issues: string[];
    improvedDescriptions: string[];
  }>(null);
  const [activeService, setActiveService] = useState<
    'openai' | 'gemini' | 'claude'
  >('claude');

  const isSummarySelected = selectedSectionId === 'summary';

  const selectedSection = useMemo(
    () => cvData.sections.find((s) => s.id === selectedSectionId),
    [selectedSectionId, cvData.sections]
  );

  const entries = useMemo(
    () => selectedSection?.entries || [],
    [selectedSection]
  );

  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const entriesToText = () =>
    entries
      .map((entry, i) => {
        if (typeof entry === 'object' && entry !== null) {
          const formatted = Object.entries(entry)
            .map(([key, value]) => `${capitalize(key)}: ${value}`)
            .join('\n');
          return `Entry ${i + 1}:\n${formatted}`;
        }
        return `Entry ${i + 1}: ${String(entry)}`;
      })
      .join('\n\n');

  const validateBeforeReview = () => {
    const summaryExists = cvData.personalInfo.summary.trim().length > 0;

    if (isSummarySelected && !summaryExists) {
      setError('Your summary is empty. Please add one first.');
      return false;
    }

    if (!isSummarySelected && entries.length === 0) {
      setError('No entries found in this section.');
      return false;
    }

    return true;
  };

  const handleReview = async () => {
    if (!validateBeforeReview()) return;

    setLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      const textToReview = isSummarySelected
        ? cvData.personalInfo.summary
        : entriesToText();

      const response = await fetch('/api/ai/review-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToReview,
          sectionType: isSummarySelected ? 'summary' : selectedSection?.type,
          service: activeService,
        }),
      });

      if (!response.ok)
        throw new Error('AI service failed to process the request.');

      const data = await response.json();

      if (!data?.improvedDescriptions?.length) {
        setError('The AI did not return any suggestions.');
        return;
      }

      setReviewResult(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!reviewResult) return;

    if (isSummarySelected) {
      const improved = reviewResult.improvedDescriptions[0];
      if (improved) {
        setPersonalInfo({ ...cvData.personalInfo, summary: improved });
      }
    } else {
      let index = 0;
      const updated = entries.map((entry) => {
        if (typeof entry === 'object' && entry !== null) {
          const updatedDescription =
            reviewResult.improvedDescriptions[index] || JSON.stringify(entry);
          index++;
          return { ...entry, description: updatedDescription };
        }
        return entry;
      });

      updateSectionEntries(selectedSectionId, updated);
    }

    setReviewResult(null);
  };

  return (
    <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-y-auto border border-gray-100">
      <div className="p-6 border-b border-gray-150">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-xl">✨</div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              AI-Powered Text Revision
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Improve your summary or section content using AI
            </p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Section Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Section
            </label>
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="summary">Summary</option>
              {cvData.sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* AI Model Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose AI Model
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'claude', name: 'Claude', emoji: '🟣' },
                { id: 'openai', name: 'Openai', emoji: '🟢' },
                { id: 'gemini', name: 'Gemini', emoji: '🔵' },
              ].map((service) => (
                <button
                  key={service.id}
                  onClick={() =>
                    setActiveService(
                      service.id as 'openai' | 'gemini' | 'claude'
                    )
                  }
                  className={`p-2 rounded-lg flex flex-col items-center justify-center border-2 transition-all ${
                    activeService === service.id
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

          {/* Read-Only Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Preview
            </label>
            <textarea
              readOnly
              rows={8}
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm text-gray-700 resize-none"
              value={
                isSummarySelected
                  ? cvData.personalInfo.summary
                  : entriesToText()
              }
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex gap-2">
              ❗ {error}
            </div>
          )}

          {/* Review Button */}
          <Button
            className="w-full h-11 flex items-center justify-center gap-2"
            onClick={handleReview}
            disabled={loading}
          >
            {loading ? '🔄 Analyzing...' : '🔍 Review Text'}
          </Button>

          {/* Review Result */}
          {reviewResult && (
            <div className="space-y-6 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                ✅ Analysis Results
              </h3>

              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-orange-700 mb-2">
                  ⚠️ Potential Issues
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-orange-700">
                  {reviewResult.issues.length === 0 ? (
                    <li>No critical issues detected</li>
                  ) : (
                    reviewResult.issues.map((issue, i) => (
                      <li key={i}>{issue}</li>
                    ))
                  )}
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">
                  ✨ Suggested Improvements
                </h4>
                {reviewResult.improvedDescriptions.map((desc, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="text-xs font-medium text-gray-500 mb-2">
                      {isSummarySelected ? 'Summary' : `Entry ${i + 1}`}
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {desc}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setReviewResult(null)}
                >
                  🚫 Discard
                </Button>
                <Button className="flex-1" onClick={handleApply}>
                  ✅ Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviseTextPanel;
