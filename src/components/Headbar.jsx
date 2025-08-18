import { useState, useEffect } from 'react'
import Wifi from '../assets/Wifi.svg'
import Battery from '../assets/Battery.svg'
import Search from '../assets/Search.svg'
import Switch from '../assets/Switch.svg'
import {contact} from './Info'

const Headbar = () => {

    const [clock, setClock] = useState(new Date())

    useEffect(() => {
        const time = setInterval(() => setClock(new Date()), 1000);
        return () => clearInterval(time);
    })
    const formatClockTime = (date) => {
        const weekday = date.toLocaleString('en-US', { weekday: 'short' });
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' });
        const time = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });

        return `${weekday} ${day} ${month} ${time}`;

    }

    return (
        <div className='w-full px-5 py-2 flex items-center justify-between' style={{ backgroundColor: '#fafafa' }}>
            <div className='leftHeader gap-4 flex items-center'>
                <span className='appleLogo dark:text-[#272727]'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="100%" viewBox="0 0 24 24"><path fill="currentColor" d="M17.458 12.625A4.523 4.523 0 0 1 19.62 8.82a4.672 4.672 0 0 0-3.658-1.984c-1.558-.158-3.04.917-3.829.917c-.79 0-2.009-.894-3.3-.87a4.896 4.896 0 0 0-4.14 2.508c-1.762 3.06-.449 7.593 1.268 10.076c.84 1.214 1.843 2.581 3.158 2.532c1.268-.05 1.746-.82 3.277-.82c1.531 0 1.962.82 3.3.795c1.364-.025 2.229-1.239 3.062-2.457a10.946 10.946 0 0 0 1.385-2.845a4.42 4.42 0 0 1-2.685-4.047Zm-2.517-7.432A4.405 4.405 0 0 0 15.981 2a4.483 4.483 0 0 0-2.945 1.516a4.186 4.186 0 0 0-1.061 3.093a3.71 3.71 0 0 0 2.966-1.416Z" /></svg>
                </span>
                <a href={`mailto:${contact.email}`} className='contactInfo text-sm cursor-pointer font-[500] dark:text-[#272727]'>
                    Contact
                </a>
                {/* <span className='contactInfo text-sm cursor-pointer font-[500]'>
                    Contact
                </span> */}
                <a href='src/assets/Aditya_Kundra_Resume_FullStack.pdf' className='resumeLink text-sm cursor-pointer font-[500] dark:text-[#272727]' target='_blank'>
                    Resume
                </a>
                {/* <span className='resumeLink text-sm cursor-pointer font-[500]'>
                    Resume
                </span> */}
            </div>

            <div className='rightHeader gap-2 flex items-center justify-center'>
                <div className='icons gap-4 mr-4 flex items-center justify-center'>
                    <span className='cursor-pointer'>
                        <img src={Battery} alt='Battery' className='h-3' loading='lazy'/>
                    </span>
                    <span className='cursor-pointer'>
                        <img src={Wifi} alt='Wifi' className='h-3' loading='lazy'/>
                    </span>
                    <span className='cursor-pointer'>
                        <img src={Search} alt='Search' className='h-4' loading='lazy'/>
                    </span>
                    <span className='cursor-pointer'>
                        <img src={Switch} alt='Switch' className='h-4' loading='lazy'/>
                    </span>

                </div>
                <span className='clock text-sm cursor-pointer font-[500] dark:text-[#272727]'>
                    {formatClockTime(clock)}
                </span>
            </div>
        </div>
    )
}

export default Headbar
