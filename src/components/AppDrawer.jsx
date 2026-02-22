import React from 'react';
import { AppDrawerIcons } from './Icons';
import { contact } from './Info';

const modalIcons = ['Messages', 'Contacts', 'Terminal', 'Photos', 'Notes'];

const AppDrawer = ({ openModals, openWindows = {}, minimizedWindows = {} }) => {
  const iconsList = Object.entries(AppDrawerIcons);
  const dividerIndex = iconsList.length - 2;

  const getTooltip = (name) => {
    if (name === 'Mail') return null;
    if (!modalIcons.includes(name)) return null;
    if (openWindows[name] && minimizedWindows[name]) return 'Restore';
    if (openWindows[name]) return 'Minimize';
    return 'Open me';
  };

  const hasOpenWindow = (name) => modalIcons.includes(name) && openWindows[name];
  const isMinimized = (name) => minimizedWindows[name];

  return (
    <div className='appDrawer flex justify-center items-center my-2 md:my-4 px-2 overflow-x-auto'>
      <div className='w-auto px-1 py-1 bg-[rgba(219,225,227,0.65)] dark:bg-[rgba(45,45,47,0.9)] flex justify-start items-center rounded-[12px] gap-1 shrink-0'>
        {iconsList.map(([name, icon], index) => (
          <React.Fragment key={index}>
            {dividerIndex === index && (
              <span className='divider h-10 w-[1px] border-[0.5px] border-[#b0b8ba] mx-2'></span>
            )}

            <div className='relative group w-fit'>
              <div
                className="transition-transform duration-300 ease-out hover:-translate-y-2.25 hover:scale-120 cursor-pointer relative"
                onClick={() => {
                  if (name === 'Mail') {
                    window.location.href = `mailto:${contact.email}`;
                  } else if (modalIcons.includes(name)) {
                    openModals(name);
                  }
                }}
              >
                <img src={icon} alt={name} className='h-10 sm:h-12' loading='lazy' />
                {hasOpenWindow(name) && (
                  <span className='absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gray-600/80' />
                )}
              </div>
              {getTooltip(name) && (
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 mb-6 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out bg-white dark:bg-[#2d2d2d] text-[#272727] dark:text-[#f5f5f7] text-xs rounded-full px-2 py-1 whitespace-nowrap z-50 shadow-2xl font-medium">
                  {getTooltip(name)}
                </div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AppDrawer;
