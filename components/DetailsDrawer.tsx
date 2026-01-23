
import React, { useState, useEffect } from 'react';
import { WebApp } from '../types';

interface DetailsDrawerProps {
  app: WebApp | null;
  onClose: () => void;
}

const DetailsDrawer: React.FC<DetailsDrawerProps> = ({ app, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [app]);

  if (!app) return null;

  const images = app.images || [];
  const hasMultipleImages = images.length > 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden font-mono">
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-md pointer-events-auto transition-opacity duration-300 ${app ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      <div 
        className={`absolute top-0 right-0 h-full w-full max-w-xl bg-[#0000B9] border-l-4 border-black shadow-2xl pointer-events-auto transition-transform duration-300 transform ${app ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full border-4 border-[#0000BF] m-2">
          {/* Header */}
          <div className="px-6 py-4 border-b-2 border-black flex items-center justify-between bg-[#441DBF] text-[#4CF190]">
            <h2 className="text-2xl font-bold uppercase tracking-tighter truncate">
              {">"} FILE_{app.id.slice(0, 4)}: {app.name}
            </h2>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-black/20 text-[#4CF190] border-2 border-[#4CF190] rounded-sm"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {/* Carousel */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-[#4CF190] uppercase tracking-widest bg-black/30 px-3 py-1 inline-block">Visual_Assets</h3>
              
              <div className="relative group bg-white border-4 border-black shadow-[4px_4px_0px_0px_#441DBF]" style={{ height: '500px' }}>
                {images.length > 0 ? (
                  <>
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <img 
                        src={images[currentImageIndex]} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain filter contrast-110"
                        key={currentImageIndex}
                      />
                    </div>

                    {hasMultipleImages && (
                      <>
                        <button 
                          onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0000B9] text-white border-2 border-black retro-btn flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button 
                          onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#0000B9] text-white border-2 border-black retro-btn flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-[#4CF190] px-4 py-1 text-sm border-2 border-[#4CF190]">
                          IMAGE_0{currentImageIndex + 1}/0{images.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#4CF190]">
                    <p className="font-bold">NULL_DATA: NO_IMAGES</p>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6 text-[#4CF190]">
              <div className="bg-black/30 p-4 border border-[#4CF190]/30 border-dashed">
                <p className="text-[#B6F9D7] text-sm uppercase mb-1 underline">Creator_Identity</p>
                <p className="text-2xl font-bold">{app.author}</p>
              </div>
              
              <div className="bg-black/30 p-4 border border-[#4CF190]/30">
                <p className="text-[#B6F9D7] text-sm uppercase mb-1 underline">System_Log (Description)</p>
                <p className="text-lg leading-relaxed opacity-90">
                  {app.description || "NO_LOGS_AVAILABLE_FOR_THIS_OBJECT."}
                </p>
              </div>

              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="retro-btn flex items-center justify-center w-full py-5 bg-[#005900] text-[#4CF190] font-bold text-xl uppercase border-4 border-black"
              >
                <span>INITIATE_REMOTE_LINK</span>
                <svg className="w-6 h-6 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="p-4 border-t-2 border-black bg-black text-[#4CF190] flex justify-between text-xs tracking-widest">
            <span>TIMESTAMP: {new Date(app.timestamp).toISOString()}</span>
            <span>STATUS: STABLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsDrawer;
