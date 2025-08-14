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


const App = () => {

  const [isOpen, setisOpen] = useState(false)

  const isClose = () => {
    setisOpen(false)
  }

  const openModal = () => {
    setisOpen(true)
  }

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

        <div className='blah absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 '>
          <p className='font-chillax text-2xl font-semibold'>Full-Stack Developer • Designer • Builder</p>
          <p className='font-chillax text-8xl font-semibold'>Aditya Kundra</p>
        </div>

        <AppDrawer />

        {/* {
          projectList.map((projects, index) => (
            projects.type !== 'Build' && (<Folder key={index} name={projects.name} isOpen={openModal}/>)
          ))
        } */}
        <Folder name="Folder Name" isOpen={openModal} />
        {/* {
          projectList.map((projects, index) => (
            projects.type !== 'Build' && (<Modal key={index}  isOpen={openModals[projects.name]} isClose={isClose} projectName={projects.name} />)
          ))
        } */}
        <Modal isOpen={isOpen} isClose={isClose} projectName="Folder Name" />

        {/* <Documents isOpen={isOpen} isClose={isClose} projectName="Folder Name" /> */}


        {/* <Image/> */}

        {/* <Terminal/> */}

        {/* <Contact/> */}

        <Message/>

      </div>

    </div>
  );
};

export default App;
