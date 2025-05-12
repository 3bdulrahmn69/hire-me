import { useCvContext } from '../../../context/CvContext';
import { useState } from 'react';
import { FiEdit, FiTrash, FiPlus, FiSave } from 'react-icons/fi';
import Button from '../../ui/Button';
import Dialog from '../../ui/Dialog';

type SectionType = 'text' | 'list' | 'rich' | 'custom';

const SectionPanel = () => {
  const { cvData, addSection, removeSection, updateSection } = useCvContext();
  const sections = cvData.sections;

  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionType, setNewSectionType] = useState<SectionType>('text');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [deletingSection, setDeletingSection] = useState<string | null>(null);
  const [creatingSection, setCreatingSection] = useState(false);
  const [tempName, setTempName] = useState('');
  const [tempType, setTempType] = useState<SectionType>('text');

  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    addSection({
      id: Date.now().toString(),
      name: newSectionName.trim(),
      entries: [],
      type: newSectionType,
    });
    setNewSectionName('');
    setNewSectionType('text');
    setCreatingSection(false);
  };

  const handleEditSave = () => {
    if (editingSection && tempName.trim()) {
      updateSection(editingSection, tempName.trim(), tempType);
      setEditingSection(null);
    }
  };

  const renderTypeOptions = (
    selected: SectionType,
    onChange: (val: SectionType) => void,
    name = 'section-type'
  ) => (
    <div>
      <p className="mb-2 font-medium">Type</p>
      <div className="grid grid-cols-2 gap-2">
        {(['text', 'list', 'rich'] as SectionType[]).map((type) => (
          <Button
            key={type}
            variant={selected === type ? 'default' : 'outline'}
            onClick={() => onChange(type)}
            className="w-full"
            name={name}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white shadow h-full w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sections</h2>
        <Button onClick={() => setCreatingSection(true)} variant="default">
          Add Section <FiPlus />
        </Button>
      </div>

      <div className="space-y-2">
        {sections.map((section) => (
          <div
            key={section.id}
            className="flex justify-between items-center p-2 rounded hover:bg-gray-100"
          >
            <span className="truncate">
              {section.name}{' '}
              <span className="text-xs text-gray-500">({section.type})</span>
            </span>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setEditingSection(section.id);
                  setTempName(section.name);
                  setTempType(section.type as SectionType);
                }}
                variant="ghost"
                aria-label="Edit section"
              >
                <FiEdit className="text-gray-600" />
              </Button>
              <Button
                onClick={() => setDeletingSection(section.id)}
                variant="ghost"
                aria-label="Delete section"
              >
                <FiTrash className="text-red-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Section Dialog */}
      <Dialog
        isOpen={creatingSection}
        onClose={() => setCreatingSection(false)}
        title="Create New Section"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Section Name"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />

          {renderTypeOptions(newSectionType, setNewSectionType)}

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setCreatingSection(false)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button onClick={handleAddSection} variant="default">
              Create
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Edit Section Dialog */}
      <Dialog
        isOpen={!!editingSection}
        onClose={() => setEditingSection(null)}
        title="Edit Section"
      >
        <div className="space-y-4">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            autoFocus
          />

          {renderTypeOptions(tempType, setTempType, 'edit-section-type')}

          <div className="flex justify-end gap-2">
            <Button onClick={() => setEditingSection(null)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant="default">
              Save <FiSave />
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={!!deletingSection}
        onClose={() => setDeletingSection(null)}
        title="Delete Section"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this section?</p>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setDeletingSection(null)}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (deletingSection) {
                  removeSection(deletingSection);
                  setDeletingSection(null);
                }
              }}
              variant="destructive"
            >
              Delete <FiTrash />
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SectionPanel;
