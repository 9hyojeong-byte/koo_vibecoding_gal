
import React from 'react';

interface HeaderProps {
  onRegisterClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRegisterClick }) => {
  return (
    <header className="bg-[#441DBF] border-b-4 border-black sticky top-0 z-[120] py-2">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#0000BF] border-2 border-black rounded-sm flex items-center justify-center shadow-[4px_4px_0px_0px_#000000]">
            <svg className="w-8 h-8 text-[#4CF190]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white tracking-widest hidden sm:block uppercase italic">
              Koo VibeCoding Arcade
            </h1>
            <span className="text-[#4CF190] text-xs font-mono hidden sm:block tracking-tighter">EST. 2024 // SYSTEM ACTIVE</span>
          </div>
        </div>

        <button
          onClick={onRegisterClick}
          className="retro-btn bg-[#005900] text-[#4CF190] px-6 py-2 rounded-sm font-bold flex items-center space-x-2 border-2 border-black hover:bg-[#007a00]"
        >
          <span className="text-xl">INSERT COIN (ADD APP)</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
