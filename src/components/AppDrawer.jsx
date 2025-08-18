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

            <div
              className='transition-transform duration-280 ease-in-out hover:-translate-y-2.5 hover:scale-150 cursor-pointer'
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
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AppDrawer;
