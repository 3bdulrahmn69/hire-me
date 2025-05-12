import { useCvContext } from '../../../context/CvContext';

const DesignPanel = () => {
  const { cvData, setTheme } = useCvContext();
  const theme = cvData.theme;

  const changeFontFamily = (fontFamily: string) =>
    setTheme({ ...theme, fontFamily });

  const changeFontSize = (fontSize: string) => setTheme({ ...theme, fontSize });

  const changePrimaryColor = (primaryColor: string) =>
    setTheme({ ...theme, primaryColor });

  const changePageMargin = (pageMargin: string) =>
    setTheme({ ...theme, pageMargin });

  const changeSectionSpacing = (sectionSpacing: string) =>
    setTheme({ ...theme, sectionSpacing });

  const changeLineSpacing = (lineSpacing: string) =>
    setTheme({ ...theme, lineSpacing });

  const changePattern = (pattern: string) => setTheme({ ...theme, pattern });

  return (
    <div className="space-y-4 w-full h-full">
      <h2 className="text-lg font-semibold">Design Panel</h2>

      <div className="space-y-2">
        <label className="block">
          Font Family
          <select
            value={theme.fontFamily}
            onChange={(e) => changeFontFamily(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Roboto">Roboto</option>
            <option value="Open Sans">Open Sans</option>
          </select>
        </label>

        <label className="block">
          Font Size
          <input
            type="text"
            value={theme.fontSize}
            onChange={(e) => changeFontSize(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Primary Color
          <input
            type="color"
            value={theme.primaryColor}
            onChange={(e) => changePrimaryColor(e.target.value)}
            className="w-16 h-10 p-0 border rounded"
          />
        </label>

        <label className="block">
          Page Margin
          <input
            type="text"
            value={theme.pageMargin}
            onChange={(e) => changePageMargin(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Section Spacing
          <input
            type="text"
            value={theme.sectionSpacing}
            onChange={(e) => changeSectionSpacing(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Line Spacing
          <input
            type="text"
            value={theme.lineSpacing}
            onChange={(e) => changeLineSpacing(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block">
          Pattern
          <select
            value={theme.pattern}
            onChange={(e) => changePattern(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="none">None</option>
            <option value="stripes">Stripes</option>
            <option value="dots">Dots</option>
            <option value="grid">Grid</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default DesignPanel;
