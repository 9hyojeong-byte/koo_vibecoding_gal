
import React, { useState, useEffect, useCallback } from 'react';
import { WebApp } from './types';
import { GAS_WEBAPP_URL, GLOBAL_PASSWORD } from './constants';
import Header from './components/Header';
import GalleryGrid from './components/GalleryGrid';
import RegistrationModal from './components/RegistrationModal';
import PasswordModal from './components/PasswordModal';
import DetailsDrawer from './components/DetailsDrawer';

const App: React.FC = () => {
  const [apps, setApps] = useState<WebApp[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [globalAuthModal, setGlobalAuthModal] = useState<boolean>(false);
  const [selectedApp, setSelectedApp] = useState<WebApp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchApps = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${GAS_WEBAPP_URL}?action=fetchApps`);
      const result = await response.json();
      if (result.success) {
        setApps(result.data);
      } else {
        setError('앱 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error(err);
      setError('서버 연결 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenRegister = () => {
    setGlobalAuthModal(true);
  };

  const onGlobalAuthSuccess = () => {
    setGlobalAuthModal(false);
    setIsRegisterOpen(true);
  };

  const handleOpenDetails = (app: WebApp) => {
    setSelectedApp(app);
  };

  const handleCloseDetails = () => {
    setSelectedApp(null);
  };

  // Author가 '구효정' 또는 '쿠효정'인 데이터만 필터링
  const filteredApps = apps.filter(app => app.author === '구효정' || app.author === '쿠효정');

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <Header onRegisterClick={handleOpenRegister} />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="terminal-screen bg-[#AA0C00] text-white p-4 rounded-none mb-6 border-2 border-black font-bold uppercase">
            {"> ERROR_DETECTED: "} {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-[#4CF190] border-t-transparent animate-spin"></div>
            <p className="mt-4 text-[#4CF190] font-bold tracking-widest uppercase animate-pulse">Initializing System...</p>
          </div>
        ) : (
          <GalleryGrid 
            apps={filteredApps} 
            onRefresh={fetchApps} 
            onOpenDetails={handleOpenDetails}
          />
        )}
      </main>

      <footer className="bg-black/20 border-t-2 border-black py-6">
        <div className="container mx-auto px-4 text-center text-[#4CF190] text-sm font-mono opacity-60">
          &copy; {new Date().getFullYear()} ARCADE_GALLERY_V1 // AUTHORIZED_ACCESS_ONLY
        </div>
      </footer>

      {/* Global Password Check */}
      {globalAuthModal && (
        <PasswordModal 
          title="SYSTEM_AUTH"
          description="ENTER MASTER KEY TO ACCESS UPLOAD"
          correctPassword={GLOBAL_PASSWORD}
          onSuccess={onGlobalAuthSuccess}
          onClose={() => setGlobalAuthModal(false)}
        />
      )}

      {/* Registration Form Modal */}
      {isRegisterOpen && (
        <RegistrationModal 
          onClose={() => setIsRegisterOpen(false)} 
          onSuccess={() => {
            setIsRegisterOpen(false);
            fetchApps();
          }}
        />
      )}

      {/* Details Drawer */}
      <DetailsDrawer 
        app={selectedApp} 
        onClose={handleCloseDetails} 
      />
    </div>
  );
};

export default App;
