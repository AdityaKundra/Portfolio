import Document from "../assets/Document.svg"
const Resume = () => {
  return (
   <div className='absolute cursor-pointer top-60 left-[300px]' onClick={()=>window.open('https://drive.google.com/file/d/1Y5SerpDnMvF0BpDn11yJozSNHiyTx1m-/view?usp=sharing','_blank')}>
        <img src={Document} alt="Folder" className='w-[60px] m-auto' loading='lazy'/>
        <p className='text-xs font-bold text-gray-800'>Resume</p>
    </div>
  )
}

export default Resume
