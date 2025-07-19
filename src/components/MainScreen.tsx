
import { useState } from 'react';

interface MainScreenProps {
  onEnter: () => void;
}

const MainScreen = ({ onEnter }: MainScreenProps) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-4xl mb-4 tracking-wider">VEGGIEWARE 2.1</h1>
          <div className="text-sm opacity-75">Advanced OSINT Intelligence Platform</div>
        </div>
        
        <button
          onClick={onEnter}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`
            border-2 border-green-400 bg-black text-green-400 
            px-12 py-6 text-2xl font-bold tracking-widest
            transition-all duration-150 hover:bg-green-400 hover:text-black
            ${isPressed ? 'scale-95' : 'hover:scale-105'}
          `}
        >
          ENTER
        </button>
        
        <div className="mt-8 text-xs opacity-50">
          <div>Authorized Access Only</div>
          <div className="mt-2">© 2024 Veggieware Systems</div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
