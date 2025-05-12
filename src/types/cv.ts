export type TemplateName = 'classic' | 'modern' | 'creative';

export type Theme = {
  templateName: TemplateName;
  fontFamily: string;
  fontSize: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  pattern: string;
};

export type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  summary: string;
};

export type CustomSection = {
  id: string;
  name: string;
  type: 'text' | 'list' | 'rich' | 'custom';
  entries: (string | { [key: string]: unknown })[];
};

export type CvData = {
  id: string;
  theme: Theme;
  personalInfo: PersonalInfo;
  sections: CustomSection[];
};
