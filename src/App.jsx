import { useState } from 'react';
import './App.css';
import grid from './assets/mainBg.avif';
import AppDrawer from './components/AppDrawer';
import Folder from './components/Folder';
import Headbar from './components/Headbar';
import Modal from './components/Modal';
import { projectList } from './components/Info'
import Documents from './components/Documents';
import Contact from './components/Contact';
import Image from './components/Image';
import Terminal from './components/Terminal';
import Message from './components/Message';
import Notes from './components/Notes'
import Resume from './components/Resume'


const App = () => {

  const [openModals, setOpenModals] = useState({});
  const openModal = (name) => {
    setOpenModals(prev => ({ ...prev, [name]: true }));
  };

  const closeModal = (name) => {
    setOpenModals(prev => ({ ...prev, [name]: false }));
  };

  return (
    <div className="relative h-screen max-w-full overflow-hidden mainBg">

      {/* Background overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={grid}
          alt="grid-bg"
          className="w-full h-full object-cover opacity-40"
        />
      </div>

      <div className="relative z-10 h-full flex justify-between flex-col">

        <Headbar />

        <div className='blah absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 dark:text-[#272727]'>
          <p className='font-chillax text-2xl font-semibold'>Full-Stack Developer • Designer • Builder</p>
          <p className='font-chillax text-8xl font-semibold'>Aditya Kundra</p>
        </div>

        <AppDrawer openModals={(name) => openModal(name)} />

        {
          projectList.map((projects, index) => (
            projects.type !== 'Build' && (<Folder key={index} name={projects.name} position={projects.positions} openModal={() => openModal(projects.name)} />)
          ))
        }

        {
          projectList.map((projects, index) => (
            projects.type !== 'Build' && (<Modal key={index} name={projects.name} isOpen={openModals[projects.name]} isClose={() => closeModal(projects.name)} projectName={projects.name} />)
          ))
        }

        <Terminal isOpen={openModals['Terminal']} isClose={() => closeModal('Terminal')} />

        <Contact isOpen={openModals['Contacts']} isClose={() => closeModal('Contacts')} />

        <Message isOpen={openModals['Messages']} isClose={() => closeModal('Messages')} />

        <Resume />

      </div>

    </div>
  );
};

export default App;
