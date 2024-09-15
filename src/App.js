import React, { createContext, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './routes/Routes/Routes';
import VantaBackground from './Hooks/VantaBackground';

// Create context
export const EffectContext = createContext();

function App() {
  const [currentEffect, setCurrentEffect] = useState('RINGS');

  const handleEffectChange = () => {
    const effects = ['RINGS', 'CLOUDS2', 'FOG', 'WAVES', 'NET', 'BIRDS', 'HALO'];
    const currentIndex = effects.indexOf(currentEffect);
    const nextIndex = (currentIndex + 1) % effects.length;
    setCurrentEffect(effects[nextIndex]);
  };

  return (
    <EffectContext.Provider value={{ currentEffect, handleEffectChange }}>
      <div className='max-w-[1440px] mx-auto'>
        <VantaBackground effect={currentEffect} />
        <RouterProvider router={router} />
        <Toaster />
      </div>
    </EffectContext.Provider>
  );
}

export default App;
