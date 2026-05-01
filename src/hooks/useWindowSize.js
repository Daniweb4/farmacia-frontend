import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [ancho, setAncho] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setAncho(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { ancho, esMobil: ancho < 768 };
};

export default useWindowSize;