import { useState } from 'react';
import Panel from '../components/dashboard/Panel';
import Sidebar from '../components/dashboard/Sidebar';
import TemplateRender from '../components/dashboard/TemplateRender';

const Dashboard = () => {
  const [currentPanel, setCurrentPanel] = useState('add-section');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPanel={currentPanel} setCurrentPanel={setCurrentPanel} />
      <Panel currentPanel={currentPanel} />
      <TemplateRender />
    </div>
  );
};

export default Dashboard;
