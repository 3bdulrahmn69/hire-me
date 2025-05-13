import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CustomSection, CvData } from '../types/cv.ts';
import { nanoid } from 'nanoid';

type CvContextType = {
  cvData: CvData;
  setTheme: (theme: CvData['theme']) => void;
  setPersonalInfo: (personalInfo: CvData['personalInfo']) => void;
  addSection: (section: CustomSection) => void;
  removeSection: (id: string) => void;
  updateSectionEntries: (
    sectionId: string,
    entries: CustomSection['entries']
  ) => void;
  updateSection: (
    sectionId: string,
    name: string,
    type: CustomSection['type']
  ) => void;
  reorderSections: (sourceIndex: number, destinationIndex: number) => void;
};

const CvContext = createContext<CvContextType | undefined>(undefined);

const initialCvData: CvData = {
  id: nanoid(),
  theme: {
    templateName: 'classic',
    fontFamily: 'Arial',
    fontSize: '16px',
    primaryColor: '#000000',
    pageMargin: '1in',
    sectionSpacing: '1.5em',
    lineSpacing: '1.5',
    pattern: 'none',
  },
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    summary: 'asfa fasfasf afasf',
  },
  sections: [
    {
      id: nanoid(),
      name: 'Experience',
      type: 'list',
      entries: [
        {
          company: 'Company A',
          position: 'Software Engineer',
          startDate: '2020-01-01',
          endDate: '2021-01-01',
          description: 'Developed web applications using React and Node.js.',
        },
        {
          company: 'Company B',
          position: 'Frontend Developer',
          startDate: '2019-01-01',
          endDate: '2020-01-01',
          description: 'Worked on UI/UX design and implementation.',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'Education',
      type: 'list',
      entries: [
        {
          institution: 'University A',
          degree: 'Bachelor of Science in Computer Science',
          startDate: '2015-01-01',
          endDate: '2019-01-01',
          description: 'Graduated with honors.',
        },
        {
          institution: 'University B',
          degree: 'Master of Science in Software Engineering',
          startDate: '2021-01-01',
          endDate: '2023-01-01',
          description: 'Thesis on AI and Machine Learning.',
        },
      ],
    },
    {
      id: nanoid(),
      name: 'Skills',
      type: 'list',
      entries: [
        { skill: 'JavaScript', level: 'Advanced' },
        { skill: 'React', level: 'Advanced' },
        { skill: 'Node.js', level: 'Intermediate' },
        { skill: 'CSS', level: 'Advanced' },
      ],
    },
    {
      id: nanoid(),
      name: 'Certifications',
      type: 'list',
      entries: [],
    },
    {
      id: nanoid(),
      name: 'Projects',
      type: 'list',
      entries: [],
    },
    {
      id: nanoid(),
      name: 'Languages',
      type: 'list',
      entries: [],
    },
  ],
};

type CvAction =
  | { type: 'SET_THEME'; payload: CvData['theme'] }
  | { type: 'SET_PERSONAL_INFO'; payload: CvData['personalInfo'] }
  | { type: 'ADD_SECTION'; payload: CustomSection }
  | { type: 'REMOVE_SECTION'; payload: string }
  | {
      type: 'UPDATE_SECTION_ENTRIES';
      payload: { sectionId: string; entries: CustomSection['entries'] };
    }
  | {
      type: 'UPDATE_SECTION';
      payload: { sectionId: string; name: string; type: CustomSection['type'] };
    }
  | {
      type: 'REORDER_SECTIONS';
      payload: { sourceIndex: number; destinationIndex: number };
    };

const cvReducer = (state: CvData, action: CvAction): CvData => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: { ...state.theme, ...action.payload } };
    case 'SET_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload },
      };
    case 'ADD_SECTION':
      return {
        ...state,
        sections: [...state.sections, action.payload],
      };
    case 'REMOVE_SECTION':
      return {
        ...state,
        sections: state.sections.filter(
          (section) => section.id !== action.payload
        ),
      };
    case 'UPDATE_SECTION_ENTRIES':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? { ...section, entries: action.payload.entries }
            : section
        ),
      };
    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map((section) =>
          section.id === action.payload.sectionId
            ? {
                ...section,
                name: action.payload.name,
                type: action.payload.type,
              }
            : section
        ),
      };
    case 'REORDER_SECTIONS': {
      const { sourceIndex, destinationIndex } = action.payload;
      const updatedSections = Array.from(state.sections);
      const [movedSection] = updatedSections.splice(sourceIndex, 1);
      updatedSections.splice(destinationIndex, 0, movedSection);
      return {
        ...state,
        sections: updatedSections,
      };
    }
    default:
      return state;
  }
};

export const CvProvider = ({ children }: { children: ReactNode }) => {
  const [cvData, dispatch] = useReducer(cvReducer, initialCvData);

  const setTheme = (theme: CvData['theme']) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setPersonalInfo = (personalInfo: CvData['personalInfo']) => {
    dispatch({ type: 'SET_PERSONAL_INFO', payload: personalInfo });
  };

  const addSection = (section: CustomSection) => {
    dispatch({ type: 'ADD_SECTION', payload: section });
  };

  const removeSection = (id: string) => {
    dispatch({ type: 'REMOVE_SECTION', payload: id });
  };

  const updateSectionEntries = (
    sectionId: string,
    entries: CustomSection['entries']
  ) => {
    dispatch({
      type: 'UPDATE_SECTION_ENTRIES',
      payload: { sectionId, entries },
    });
  };

  const updateSection = (
    sectionId: string,
    name: string,
    type: CustomSection['type']
  ) => {
    dispatch({
      type: 'UPDATE_SECTION',
      payload: { sectionId, name, type },
    });
  };

  const reorderSections = (sourceIndex: number, destinationIndex: number) => {
    dispatch({
      type: 'REORDER_SECTIONS',
      payload: { sourceIndex, destinationIndex },
    });
  };

  const value = {
    cvData,
    setTheme,
    setPersonalInfo,
    addSection,
    removeSection,
    updateSectionEntries,
    updateSection,
    reorderSections,
  };

  return <CvContext.Provider value={value}>{children}</CvContext.Provider>;
};

export const useCvContext = () => {
  const context = useContext(CvContext);
  if (!context) {
    throw new Error('useCvContext must be used within a CvProvider');
  }
  return context;
};

export default CvContext;
