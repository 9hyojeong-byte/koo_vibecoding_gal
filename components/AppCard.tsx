
import React, { useState } from 'react';
import { WebApp } from '../types';
import { GAS_WEBAPP_URL } from '../constants';
import PasswordModal from './PasswordModal';
import EditModal from './EditModal';

interface AppCardProps {
  app: WebApp;
  onRefresh: () => void;
  onOpenDetails: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onRefresh, onOpenDetails }) => {
  const [showDeleteAuth, setShowDeleteAuth] = useState(false);
  const [showEditAuth, setShowEditAuth] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (password: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'deleteApp',
          id: app.id,
          password: password
        })
      });
      const text = await response.text();
      const result = JSON.parse(text);
      
      if (result.success) {
        onRefresh();
      } else {
        alert(result.message || '삭제 실패!');
      }
    } catch (err) {
      alert('통신 에러!');
    } finally {
      setIsDeleting(false);
      setShowDeleteAuth(false);
    }
  };

  const thumbnail = app.images && app.images.length > 0 
    ? app.images[0] 
    : 'https://picsum.photos/400/225?grayscale';

  return (
    <div className="terminal-screen overflow-hidden group flex flex-col h-full shadow-[8px_8px_0px_0px_#000000]">
      <div 
        className="relative aspect-video overflow-hidden border-b-2 border-black cursor-pointer"
        onClick={onOpenDetails}
      >
        <img 
          src={thumbnail} 
          alt={app.name} 
          className="w-full h-full object-cover filter brightness-75 contrast-125 group-hover:brightness-100 transition-all"
        />
        <div className="absolute top-2 left-2 bg-[#AA0C00] text-white text-[10px] px-2 py-0.5 border border-black uppercase font-bold">
          LIVE FEED
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col space-y-3">
        <div>
          <h3 
            className="text-2xl font-bold text-[#4CF190] line-clamp-1 cursor-pointer hover:underline uppercase"
            onClick={onOpenDetails}
          >
            {app.name}
          </h3>
          <div className="flex justify-between items-center text-[14px] text-[#B6F9D7]">
            <span>USER: {app.author}</span>
            <span className="opacity-60">ID:{app.id.slice(0, 4)}</span>
          </div>
        </div>

        <div className="bg-[#000044] p-2 border border-black/50 flex-grow">
          <p className="text-[#4CF190] text-sm line-clamp-2 font-mono">
            {"> "} {app.description || 'NO_DESCRIPTION_FOUND'}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={onOpenDetails}
            className="retro-btn flex-1 bg-[#0000BF] text-white py-2 font-bold border-2 border-black text-sm uppercase"
          >
            Details
          </button>
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="retro-btn flex-1 bg-[#AD7D00] text-white py-2 font-bold border-2 border-black text-sm text-center uppercase"
          >
            Launch
          </a>
        </div>
        
        <div className="flex justify-end space-x-3 text-xs opacity-50 hover:opacity-100 transition-opacity">
          <button onClick={() => setShowEditAuth(true)} className="hover:text-white uppercase">[Edit]</button>
          <button onClick={() => setShowDeleteAuth(true)} className="hover:text-[#AA0C00] uppercase">[Delete]</button>
        </div>
      </div>

      {showDeleteAuth && (
        <PasswordModal 
          title="DELETE_RECORD"
          description="ENTER AUTH KEY"
          onSuccess={handleDelete}
          onClose={() => setShowDeleteAuth(false)}
        />
      )}

      {showEditAuth && (
        <PasswordModal 
          title="EDIT_RECORD"
          description="ENTER AUTH KEY"
          onSuccess={() => {
            setShowEditAuth(false);
            setShowEditModal(true);
          }}
          onClose={() => setShowEditAuth(false)}
        />
      )}

      {showEditModal && (
        <EditModal 
          app={app} 
          onClose={() => setShowEditModal(false)} 
          onSuccess={() => {
            setShowEditModal(false);
            onRefresh();
          }} 
        />
      )}
    </div>
  );
};

export default AppCard;
