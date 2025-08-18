import React from 'react';
import { AppDrawerIcons } from './Icons';
import { contact } from './Info';

const AppDrawer = ({ openModals }) => {
  const iconsList = Object.entries(AppDrawerIcons);
  const dividerIndex = iconsList.length - 2;

  const modalIcons = ['Messages', 'Contacts', 'Terminal'];

  return (
    <div className='appDrawer flex justify-center items-center my-4'>
      <div className='w-auto px-1 py-1 bg-[rgba(219,225,227,0.65)] flex justify-start items-center rounded-[12px] gap-1'>
        {iconsList.map(([name, icon], index) => (
          <React.Fragment key={index}>
            {dividerIndex === index && (
              <span className='divider h-10 w-[1px] border-[0.5px] border-[#b0b8ba] mx-2'></span>
            )}

            <div className='relative group w-fit'>
              <div
                className='transition-transform duration-300 ease-out hover:-translate-y-2.25 hover:scale-120 cursor-pointer'
                onClick={() => {
                  if (name === 'Mail') {
                    window.location.href = `mailto:${contact.email}`;
                  } else if (modalIcons.includes(name)) {
                    openModals(name);
                  }
                }}
              >
                <img src={icon} alt={name} className='h-12' loading='lazy' />
              </div>
              {
                modalIcons.includes(name) && (
                  <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 mb-6 opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 ease-out bg-white text-[#272727] text-xs rounded-full px-2 py-1 whitespace-nowrap z-50 shadow-2xl font-medium">
                    Open me
                  </div>
                )
              }
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AppDrawer;
