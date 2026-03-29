import { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import './App.css';
import grid from './assets/mainBg.avif';
import AppDrawer from './components/AppDrawer';
import Folder from './components/Folder';
import Headbar from './components/Headbar';
import { projectList } from './components/Info';
import Loader from './components/Loader';
const Modal = lazy(() => import('./components/Modal'));
const Terminal = lazy(() => import('./components/Terminal'));
const Contact = lazy(() => import('./components/Contact'));
const Message = lazy(() => import('./components/Message'));
const Gallery = lazy(() => import('./components/Gallery'));
const Notes = lazy(() => import('./components/Notes'));
const Safari = lazy(() => import('./components/Safari'));
const Music = lazy(() => import('./components/Music'));
const Spotlight = lazy(() => import('./components/Spotlight'));
const Settings = lazy(() => import('./components/Settings'));

const ModalFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/20 rounded-xl animate-pulse" />
);

const DOCK_APPS = ['Messages', 'Contacts', 'Terminal', 'Photos', 'Notes', 'Safari', 'Music', 'Settings'];

const getCenterPosition = (width, height) => {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  const w = Math.min(width, window.innerWidth * 0.95);
  const h = Math.min(height, window.innerHeight * 0.9);
  return {
    x: Math.max(0, (window.innerWidth - w) / 2),
    y: Math.max(0, (window.innerHeight - h) / 2),
  };
};

const App = () => {
  const [showLoader, setShowLoader] = useState(true);
  const [openModals, setOpenModals] = useState({});
  const [minimizedWindows, setMinimizedWindows] = useState({});
  const [windowPositions, setWindowPositions] = useState({});
  const [desktopPositions, setDesktopPositions] = useState([]);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const desktopAreaRef = useRef(null);

  const clampFolderPixelPos = useCallback((pos) => {
    const el = desktopAreaRef.current;
    const padX = 72;
    const padY = 96;
    if (el && el.getBoundingClientRect().width > 40) {
      const { width, height } = el.getBoundingClientRect();
      return {
        x: Math.min(Math.max(0, pos.x), Math.max(0, width - padX)),
        y: Math.min(Math.max(0, pos.y), Math.max(0, height - padY)),
      };
    }
    if (typeof window === 'undefined') return pos;
    const w = window.innerWidth;
    const h = window.innerHeight;
    return {
      x: Math.min(Math.max(0, pos.x), Math.max(0, w - padX)),
      y: Math.min(Math.max(0, pos.y), Math.max(0, h - padY)),
    };
  }, []);

  useEffect(() => {
    const seed = () => {
      const el = desktopAreaRef.current;
      let w = typeof window !== 'undefined' ? window.innerWidth : 1200;
      let h = typeof window !== 'undefined' ? window.innerHeight - 160 : 700;
      if (el && el.getBoundingClientRect().width > 40) {
        const r = el.getBoundingClientRect();
        w = r.width;
        h = r.height;
      }
      const seeded = projectList.map((project) => {
        const x = Math.floor(Math.random() * Math.max(1, w * 0.72)) + Math.floor(w * 0.04);
        const y = Math.floor(Math.random() * Math.max(1, h * 0.5)) + Math.floor(h * 0.08);
        return { name: project.name, variant: 'folder', ...clampFolderPixelPos({ x, y }) };
      });
      seeded.unshift({
        name: 'Resume',
        variant: 'resume',
        ...clampFolderPixelPos({ x: Math.floor(w * 0.08), y: Math.floor(h * 0.1) }),
      });
      setDesktopPositions(seeded);
    };
    const id = requestAnimationFrame(seed);
    return () => cancelAnimationFrame(id);
  }, [clampFolderPixelPos]);

  const updateFolderPosition = useCallback(
    (index, pos) => {
      setDesktopPositions((prev) => {
        const next = [...prev];
        if (!next[index]) return prev;
        const c = clampFolderPixelPos(pos);
        next[index] = { ...next[index], x: c.x, y: c.y };
        return next;
      });
    },
    [clampFolderPixelPos]
  );

  const openModal = useCallback((name) => {
    setOpenModals((prev) => ({ ...prev, [name]: true }));
    setMinimizedWindows((prev) => ({ ...prev, [name]: false }));
  }, []);

  const closeModal = useCallback((name) => {
    setOpenModals((prev) => ({ ...prev, [name]: false }));
    setMinimizedWindows((prev) => ({ ...prev, [name]: false }));
  }, []);

  const minimizeWindow = useCallback((name) => {
    setMinimizedWindows((prev) => ({ ...prev, [name]: true }));
  }, []);

  const restoreWindow = useCallback((name) => {
    setMinimizedWindows((prev) => ({ ...prev, [name]: false }));
  }, []);

  const handleDockClick = useCallback(
    (name) => {
      if (name === 'Mail') return;
      if (!DOCK_APPS.includes(name)) return;
      if (openModals[name] && minimizedWindows[name]) {
        restoreWindow(name);
      } else if (openModals[name] && !minimizedWindows[name]) {
        minimizeWindow(name);
      } else {
        openModal(name);
      }
    },
    [openModals, minimizedWindows, minimizeWindow, openModal, restoreWindow]
  );

  const getWindowPosition = (name, width, height) => {
    if (!windowPositions[name]) {
      return getCenterPosition(width, height);
    }
    return windowPositions[name];
  };

  const setWindowPosition = (name, pos) => {
    setWindowPositions((prev) => ({ ...prev, [name]: pos }));
  };

  const getTopmostModal = useCallback(() => {
    if (openModals['Settings'] && !minimizedWindows['Settings']) return 'Settings';
    if (openModals['Music'] && !minimizedWindows['Music']) return 'Music';
    if (openModals['Safari'] && !minimizedWindows['Safari']) return 'Safari';
    if (openModals['Notes'] && !minimizedWindows['Notes']) return 'Notes';
    if (openModals['Photos'] && !minimizedWindows['Photos']) return 'Photos';
    if (openModals['Messages'] && !minimizedWindows['Messages']) return 'Messages';
    if (openModals['Contacts'] && !minimizedWindows['Contacts']) return 'Contacts';
    if (openModals['Terminal'] && !minimizedWindows['Terminal']) return 'Terminal';
    for (let i = projectList.length - 1; i >= 0; i--) {
      if (openModals[projectList[i].name]) return projectList[i].name;
    }
    return null;
  }, [openModals, minimizedWindows]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSpotlightOpen) {
          e.preventDefault();
          setIsSpotlightOpen(false);
          return;
        }
        const top = getTopmostModal();
        if (top) {
          e.preventDefault();
          closeModal(top);
        }
      } else if (e.metaKey || e.ctrlKey) {
        if (e.key === 'm') {
          e.preventDefault();
          handleDockClick('Messages');
        } else if (e.key === 't') {
          e.preventDefault();
          handleDockClick('Terminal');
        } else if (e.key === 'k') {
          e.preventDefault();
          setIsSpotlightOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getTopmostModal, isSpotlightOpen, closeModal, handleDockClick]);

  if (showLoader) return <Loader onFinish={() => setShowLoader(false)} />;

  const modalProps = (name, width, height) => ({
    isOpen: true,
    isClose: () => closeModal(name),
    onMinimize: () => minimizeWindow(name),
    position: getWindowPosition(name, width, height),
    onPositionChange: (pos) => setWindowPosition(name, pos),
  });

  return (
    <div className="relative min-h-dvh h-dvh max-w-full overflow-x-hidden mainBg transition-colors">
      <div className="absolute inset-0 z-0">
        <img
          src={grid}
          alt="grid-bg"
          className="w-full h-full object-cover opacity-40 dark:opacity-20"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col">
        <Headbar />

        {/* Desktop: hero centered, folders scattered, dock at bottom */}
        <div ref={desktopAreaRef} className="hidden md:block flex-1 min-h-0 relative">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center px-4
              text-[#1d1d1f] dark:text-[#f5f5f7] animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <p className="font-chillax text-2xl font-semibold opacity-90">
              Full-Stack Developer • Designer • Builder
            </p>
            <p className="font-chillax text-7xl lg:text-8xl font-semibold mt-1">
              Aditya Kundra
            </p>
          </div>

          {desktopPositions.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="absolute animate-fade-in-up z-[1]"
              style={{
                animationDelay: `${0.2 + index * 0.05}s`,
                animationFillMode: 'both',
                left: item.x,
                top: item.y,
              }}
            >
              <Folder
                name={item.name}
                position={{}}
                variant={item.variant}
                draggable
                dragPosition={{ x: item.x, y: item.y }}
                onDragPositionChange={(pos) => updateFolderPosition(index, pos)}
                openModal={() =>
                  item.name === 'Resume'
                    ? window.open('https://drive.google.com/file/d/1Y5SerpDnMvF0BpDn11yJozSNHiyTx1m-/view?usp=sharing', '_blank')
                    : openModal(item.name)
                }
              />
            </div>
          ))}
        </div>

        {/* Mobile: compact hero at top, scrollable grid of folders + Resume, dock at bottom */}
        <div className="md:hidden flex-1 min-h-0 flex flex-col overflow-hidden">
          <div
            className="shrink-0 pt-2 pb-1 px-4 text-center text-[#1d1d1f] dark:text-[#f5f5f7] animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'both' }}
          >
            <p className="font-chillax text-sm font-semibold opacity-90">
              Full-Stack Developer • Designer • Builder
            </p>
            <p className="font-chillax text-2xl sm:text-3xl font-semibold mt-0.5">
              Aditya Kundra
            </p>
          </div>

          <div
            className="flex-1 min-h-0 overflow-y-auto px-4 py-4 animate-fade-in-up"
            style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-md mx-auto justify-items-center">
              <Folder
                name="Resume"
                position={{}}
                variant="resume"
                openModal={() => window.open('https://drive.google.com/file/d/1Y5SerpDnMvF0BpDn11yJozSNHiyTx1m-/view?usp=sharing', '_blank')}
              />
              {projectList.map((project, index) => (
                <Folder
                  key={index}
                  name={project.name}
                  position={{}}
                  openModal={() => openModal(project.name)}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          className="shrink-0 animate-fade-in-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'both' }}
        >
          <AppDrawer
            openModals={handleDockClick}
            openWindows={openModals}
            minimizedWindows={minimizedWindows}
          />
        </div>

          {isSpotlightOpen && (
            <Suspense fallback={null}>
              <Spotlight
                isOpen
                onClose={() => setIsSpotlightOpen(false)}
                onLaunch={(item) => {
                  if (item.type === 'app' || item.type === 'project') {
                    openModal(item.value);
                  } else if (item.type === 'link') {
                    window.open(item.value, '_blank');
                  }
                }}
              />
            </Suspense>
          )}

          {projectList.map(
            (project, index) =>
              openModals[project.name] && !minimizedWindows[project.name] && (
                <Suspense key={index} fallback={<ModalFallback />}>
                  <Modal
                    name={project.name}
                    isOpen
                    isClose={() => closeModal(project.name)}
                    onMinimize={() => minimizeWindow(project.name)}
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

          {openModals['Safari'] && !minimizedWindows['Safari'] && (
            <Suspense fallback={<ModalFallback />}>
              <Safari {...modalProps('Safari', 860, 560)} />
            </Suspense>
          )}

          {openModals['Music'] && !minimizedWindows['Music'] && (
            <Suspense fallback={<ModalFallback />}>
              <Music {...modalProps('Music', 400, 460)} />
            </Suspense>
          )}

          {openModals['Settings'] && !minimizedWindows['Settings'] && (
            <Suspense fallback={<ModalFallback />}>
              <Settings {...modalProps('Settings', 500, 470)} />
            </Suspense>
          )}
      </div>
    </div>
  );
};

export default App;
