import { useCvContext } from '../../context/CvContext';

const TemplateRender = () => {
  const { cvData } = useCvContext();

  return (
    <div className='ml-12 p-6 bg-red-50 overflow-y-auto'>
      <pre>{JSON.stringify(cvData, null, 2)}</pre>
    </div>
  );
};

export default TemplateRender;
