import { useState, useEffect, Suspense, lazy } from 'react';
import './App.css';
import grid from './assets/mainBg.avif';
import AppDrawer from './components/AppDrawer';
import Folder from './components/Folder';
import Headbar from './components/Headbar';
import { projectList } from './components/Info';
import Resume from './components/Resume';
import Loader from './components/Loader';

const Modal = lazy(() => import('./components/Modal'));
const Terminal = lazy(() => import('./components/Terminal'));
const Contact = lazy(() => import('./components/Contact'));
const Message = lazy(() => import('./components/Message'));
const Gallery = lazy(() => import('./components/Gallery'));
const Notes = lazy(() => import('./components/Notes'));

const ModalFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-xl animate-pulse" />
);

const DOCK_APPS = ['Messages', 'Contacts', 'Terminal', 'Photos', 'Notes'];

const getCenterPosition = (width, height) => ({
  x: Math.max(0, (window.innerWidth - Math.min(width, window.innerWidth)) / 2),
  y: Math.max(0, (window.innerHeight - Math.min(height, window.innerHeight)) / 2),
});

const App = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [openModals, setOpenModals] = useState({});
  const [minimizedWindows, setMinimizedWindows] = useState({});
  const [windowPositions, setWindowPositions] = useState({});

  const openModal = (name) => {
    setOpenModals((prev) => ({ ...prev, [name]: true }));
    setMinimizedWindows((prev) => ({ ...prev, [name]: false }));
  };

  const closeModal = (name) => {
    setOpenModals((prev) => ({ ...prev, [name]: false }));
    setMinimizedWindows((prev) => ({ ...prev, [name]: false }));
  };

  const minimizeWindow = (name) => {
    if (DOCK_APPS.includes(name)) {
      setMinimizedWindows((prev) => ({ ...prev, [name]: true }));
    }
  };

  const restoreWindow = (name) => {
    setMinimizedWindows((prev) => ({ ...prev, [name]: false }));
  };

  const handleDockClick = (name) => {
    if (name === 'Mail') return;
    if (!DOCK_APPS.includes(name)) return;
    if (openModals[name] && minimizedWindows[name]) {
      restoreWindow(name);
    } else if (openModals[name] && !minimizedWindows[name]) {
      minimizeWindow(name);
    } else {
      openModal(name);
    }
  };

  const getWindowPosition = (name, width, height) => {
    if (!windowPositions[name]) {
      return getCenterPosition(width, height);
    }
    return windowPositions[name];
  };

  const setWindowPosition = (name, pos) => {
    setWindowPositions((prev) => ({ ...prev, [name]: pos }));
  };

  if (showLoader) return <Loader onFinish={() => setShowLoader(false)} />;

  const modalProps = (name, width, height) => ({
    isOpen: true,
    isClose: () => closeModal(name),
    onMinimize: () => minimizeWindow(name),
    position: getWindowPosition(name, width, height),
    onPositionChange: (pos) => setWindowPosition(name, pos),
  });

  return (
    <div className="relative h-screen max-w-full overflow-hidden mainBg transition-colors">
      <div className="absolute inset-0 z-0">
        <img
          src={grid}
          alt="grid-bg"
          className="w-full h-full object-cover opacity-40 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 h-full flex justify-between flex-col">
        <Headbar />

        <div
          className="blah absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-center px-4
            text-[#1d1d1f] dark:text-[#f5f5f7]
            animate-fade-in-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
        >
          <p className="font-chillax text-lg sm:text-xl md:text-2xl font-semibold opacity-90">
            Full-Stack Developer • Designer • Builder
          </p>
          <p className="font-chillax text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold mt-1">
            Aditya Kundra
          </p>
        </div>

        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <AppDrawer
            openModals={handleDockClick}
            openWindows={openModals}
            minimizedWindows={minimizedWindows}
          />
        </div>

        {projectList.map((project, index) => (
          <div
            key={index}
            className="absolute animate-fade-in-up"
            style={{
              animationDelay: `${0.2 + index * 0.05}s`,
              animationFillMode: 'both',
              ...project.positions,
            }}
          >
            <Folder
              name={project.name}
              position={{}}
              openModal={() => openModal(project.name)}
            />
          </div>
        ))}

          {projectList.map(
            (project, index) =>
              openModals[project.name] && (
                <Suspense key={index} fallback={<ModalFallback />}>
                  <Modal
                    name={project.name}
                    isOpen
                    isClose={() => closeModal(project.name)}
                    projectName={project.name}
                    position={getWindowPosition(project.name, 700, 350)}
                    onPositionChange={(pos) => setWindowPosition(project.name, pos)}
                    onSwitchProject={(newName) => {
                      closeModal(project.name);
                      openModal(newName);
                    }}
                  />
                </Suspense>
              )
          )}

          {openModals['Terminal'] && !minimizedWindows['Terminal'] && (
            <Suspense fallback={<ModalFallback />}>
              <Terminal {...modalProps('Terminal', 500, 300)} />
            </Suspense>
          )}

          {openModals['Contacts'] && !minimizedWindows['Contacts'] && (
            <Suspense fallback={<ModalFallback />}>
              <Contact {...modalProps('Contacts', 460, 480)} />
            </Suspense>
          )}

          {openModals['Messages'] && !minimizedWindows['Messages'] && (
            <Suspense fallback={<ModalFallback />}>
              <Message {...modalProps('Messages', 300, 550)} />
            </Suspense>
          )}

          {openModals['Photos'] && !minimizedWindows['Photos'] && (
            <Suspense fallback={<ModalFallback />}>
              <Gallery {...modalProps('Photos', 750, 450)} />
            </Suspense>
          )}

          {openModals['Notes'] && !minimizedWindows['Notes'] && (
            <Suspense fallback={<ModalFallback />}>
              <Notes {...modalProps('Notes', 720, 480)} />
            </Suspense>
          )}

        <Resume />
      </div>
    </div>
  );
};

export default App;
