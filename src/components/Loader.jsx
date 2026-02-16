// import React, { useState, useEffect } from 'react';
// import '../Loader.css';

// const greetings = [
//   "नमस्ते", "Hello", "Hola", "Bonjour", "Ciao", "Hallo",
//   "Olá", "こんにちは", "안녕하세요",
//   "你好", "Привет", "مرحبا"
// ];

// const Loader = () => {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex(prev => (prev + 1) % greetings.length);
//     }, 200);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="loader-screen">
//       <h1 className="loader-text">{greetings[index]}</h1>
//     </div>
//   );
// };

// export default Loader;


import React, { useState, useEffect } from 'react';
import '../Loader.css';

const greetings = [
  "नमस्ते", "Hello", "Hola", "Bonjour", "Ciao", "Hallo",
  "Olá", "こんにちは", "안녕하세요",
  "你好", "Привет", "مرحبا"
];

const Loader = ({ onFinish }) => {
  const [index, setIndex] = useState(0);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % greetings.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExit(true); // Start exit animation
    }, 2000); // Start animation after delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (exit) {
      const timer = setTimeout(() => {
        onFinish(); // Notify parent to unmount
      }, 600); // Match slideUp duration

      return () => clearTimeout(timer);
    }
  }, [exit, onFinish]);

  return (
    <div className={`loader-screen ${exit ? 'exit' : ''}`}>
      <h1 className="loader-text">{greetings[index]}</h1>
    </div>
  );
};

export default Loader;
