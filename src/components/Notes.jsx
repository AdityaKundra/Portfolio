import {useState} from 'react'
import { notes } from './Info'


const Notes = () => {
  const [activeNote, setActiveNote] = useState(notes[0])
  return (
    <div className="absolute top-0 left-0 modal min-h-screen min-w-screen z-10 flex justify-center items-center shadow-2xl" style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 30px 0px' }} >
      <div className='h-[350px] w-[600px] bg-white rounded-xl z-20 flex flex-col'>
        <div className="documentHeader bg-[#ebebeb] flex items-center justify-between rounded-tr-xl rounded-tl-xl py-3 px-3">
          <div className='actionButtons flex gap-2'>
            <span className='cursor-pointer close h-3 w-3 block rounded-full bg-[#ED6A5E] border border-[#CE5347]'></span>
            <span className='minimize h-3 w-3 block rounded-full bg-[#F6BE4F] border border-[#D6A243]'></span>
            <span className='expand  h-3 w-3 block rounded-full bg-[#62C554] border border-[#58A942]'></span>
            <span className='cursor-pointer ml-2'>


              <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M14 0C14.5523 0 15 0.447715 15 1V11C15 11.5523 14.5523 12 14 12H1C0.447715 12 0 11.5523 0 11V1C0 0.447715 0.447715 0 1 0H14ZM6 1H14V11H6V1ZM5 11H1L1 1H5V11Z" fill="#585758" />
                <path d="M2 2H4V3H2V2Z" fill="#979798" />
                <path d="M2 4H4V5H2V4Z" fill="#979798" />
                <path d="M4 6H2V7H4V6Z" fill="#979798" />
              </svg>

            </span>
          </div>
          <div className="docActions flex gap-2">
            <span className='cursor-pointer downloadIcon'>
              <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 22.4736C21.1318 22.4736 24.9668 18.6304 24.9668 14.0068C24.9668 9.375 21.1235 5.54004 16.4917 5.54004C11.8682 5.54004 8.0332 9.375 8.0332 14.0068C8.0332 18.6304 11.8765 22.4736 16.5 22.4736ZM16.5 21.0625C12.582 21.0625 9.45264 17.9248 9.45264 14.0068C9.45264 10.0889 12.5737 6.95117 16.4917 6.95117C20.4097 6.95117 23.5474 10.0889 23.5557 14.0068C23.564 17.9248 20.418 21.0625 16.5 21.0625ZM16.5 9.78174C16.1431 9.78174 15.8774 10.0391 15.8774 10.4043V14.5547L15.9438 16.3062L15.1138 15.3101L14.126 14.314C14.0098 14.2061 13.8604 14.1313 13.686 14.1313C13.3457 14.1313 13.0884 14.397 13.0884 14.729C13.0884 14.9033 13.1382 15.0527 13.2461 15.1606L16.0186 17.9248C16.1846 18.0908 16.3257 18.1572 16.5 18.1572C16.6826 18.1572 16.832 18.0825 16.9897 17.9248L19.7539 15.1606C19.8618 15.0527 19.9282 14.9033 19.9282 14.729C19.9282 14.397 19.6626 14.1313 19.3223 14.1313C19.1396 14.1313 18.9902 14.1978 18.8823 14.314L17.9028 15.3101L17.0562 16.3145L17.1226 14.5547V10.4043C17.1226 10.0391 16.8652 9.78174 16.5 9.78174Z" fill="#737373" />
              </svg>

            </span>
            <span className='cursor-pointer shareIcon'>
              <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 16.2646C16.8569 16.2646 17.1558 15.9658 17.1558 15.6172V7.09229L17.106 5.84717L17.6704 6.43652L18.9238 7.78125C19.04 7.91406 19.2144 7.98047 19.3721 7.98047C19.7207 7.98047 19.978 7.73145 19.978 7.39111C19.978 7.2168 19.9116 7.08398 19.7871 6.95947L16.9814 4.25342C16.8154 4.0874 16.666 4.0293 16.5 4.0293C16.334 4.0293 16.1846 4.0874 16.0186 4.25342L13.2129 6.95947C13.0884 7.08398 13.0137 7.2168 13.0137 7.39111C13.0137 7.73145 13.271 7.98047 13.6113 7.98047C13.7773 7.98047 13.9517 7.91406 14.0679 7.78125L15.3296 6.43652L15.894 5.84717L15.8359 7.09229V15.6172C15.8359 15.9658 16.1431 16.2646 16.5 16.2646ZM11.7354 22.7642H21.2563C22.9912 22.7642 23.8628 21.9009 23.8628 20.1909V11.9067C23.8628 10.1968 22.9912 9.3335 21.2563 9.3335H18.9404V10.6699H21.2314C22.0532 10.6699 22.5264 11.1182 22.5264 11.9814V20.1162C22.5264 20.9795 22.0532 21.4277 21.2314 21.4277H11.752C10.9219 21.4277 10.4653 20.9795 10.4653 20.1162V11.9814C10.4653 11.1182 10.9219 10.6699 11.752 10.6699H14.0513V9.3335H11.7354C10.0005 9.3335 9.12891 10.1968 9.12891 11.9067V20.1909C9.12891 21.9009 10.0005 22.7642 11.7354 22.7642Z" fill="#737373" />
              </svg>

            </span>
            <span className='cursor-pointer copyIcon '>
              <svg width="25" height="30" viewBox="0 0 25 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.3242 18.8711H11.7437V20.1411C11.7437 21.8511 12.6069 22.7144 14.3501 22.7144H22.6841C24.4106 22.7144 25.2822 21.8511 25.2822 20.1411V11.7407C25.2822 10.0308 24.4106 9.16748 22.6841 9.16748H21.2563V7.89746C21.2563 6.1875 20.3848 5.32422 18.6582 5.32422H10.3242C8.58105 5.32422 7.71777 6.1875 7.71777 7.89746V16.2979C7.71777 18.0078 8.58105 18.8711 10.3242 18.8711ZM10.3408 17.5347C9.51074 17.5347 9.0542 17.0864 9.0542 16.2231V7.97217C9.0542 7.10889 9.51074 6.66064 10.3408 6.66064H18.6333C19.4551 6.66064 19.9199 7.10889 19.9199 7.97217V9.16748H14.3501C12.6069 9.16748 11.7437 10.0225 11.7437 11.7407V17.5347H10.3408ZM14.3667 21.3779C13.5449 21.3779 13.0801 20.9297 13.0801 20.0664V11.8154C13.0801 10.9521 13.5449 10.5039 14.3667 10.5039H22.6592C23.481 10.5039 23.9458 10.9521 23.9458 11.8154V20.0664C23.9458 20.9297 23.481 21.3779 22.6592 21.3779H14.3667Z" fill="#737373" />
              </svg>

            </span>
          </div>
        </div>
        <div className="documentContent flex flex-grow min-h-0">
          <div className='w-4/12 min-h-full border overflow-y-scroll'>
          <p className='text-start text-xs font-semibold px-4 py-1'>Notes</p>
            <ul className='text-sm h-full'>
            {notes.map((note,index)=>(
              <li className={`m-1 cursor-pointer p-3 transition ease-in-out rounded-xl hover:bg-gray-300 ${activeNote.id === note.id ? ' font-semibold' : ''}`} key={index}  onClick={() => setActiveNote(note)}>
                  {note.title}...
                <p className='text-xs text-gray-500'>
                  <span>{note.modified}</span>
                </p>
              </li>
            ))}
            </ul>
          </div>
          <div className='w-8/12 overflow-y-scroll px-6 text-sm text-start leading-6'>
          {activeNote ? (
            <>
              <p className='text-center text-xs fint-semibold py-2'>{activeNote.modified}</p>
              {activeNote.content}
            </>
            ):<p className='text-center text-gray-400'>Select a note to view</p>
          }
          </div>
        </div>
      </div>
    </div>

  )
}

export default Notes
