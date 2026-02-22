import Document from "../assets/Document.svg"

const Resume = () => {
  return (
    <div
      className='absolute cursor-pointer top-1/2 -translate-y-1/2 left-4 md:left-[300px] md:top-60 md:translate-y-0'
      onClick={() => window.open('https://drive.google.com/file/d/1Y5SerpDnMvF0BpDn11yJozSNHiyTx1m-/view?usp=sharing', '_blank')}
    >
      <img src={Document} alt="Resume" className='w-12 md:w-[60px] m-auto' loading='lazy' />
      <p className='text-xs font-bold text-gray-800 dark:text-gray-200 mt-1'>Resume</p>
    </div>
  )
}

export default Resume
