
import React from 'react';
import { WebApp } from '../types';
import AppCard from './AppCard';

interface GalleryGridProps {
  apps: WebApp[];
  onRefresh: () => void;
  onOpenDetails: (app: WebApp) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ apps, onRefresh, onOpenDetails }) => {
  if (apps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-[#4CF190] border-4 border-dashed border-black bg-black/20 rounded-sm">
        <svg className="w-24 h-24 mb-6 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <p className="text-3xl font-bold uppercase tracking-[0.2em]">Gallery_Empty</p>
        <p className="text-lg opacity-70 mt-2 italic underline">Waiting for initial upload...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      {apps.map((app) => (
        <AppCard 
          key={app.id} 
          app={app} 
          onRefresh={onRefresh} 
          onOpenDetails={() => onOpenDetails(app)}
        />
      ))}
    </div>
  );
};

export default GalleryGrid;
