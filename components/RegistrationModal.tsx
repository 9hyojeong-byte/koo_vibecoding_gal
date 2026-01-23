
import React, { useState } from 'react';
import { GAS_WEBAPP_URL } from '../constants';

interface RegistrationModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const RegistrationModal: React.FC<RegistrationModalProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    author: '',
    name: '',
    description: '',
    url: '',
    password: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3);
      setFiles(selectedFiles);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); 
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (files.length === 0) {
      alert('UPLOAD AT LEAST ONE IMAGE!');
      return;
    }

    setIsSubmitting(true);
    setProgress('ENCODING...');

    try {
      const imagePayloads = await Promise.all(
        files.map(async (file) => ({
          base64: await fileToBase64(file),
          name: file.name,
          type: file.type
        }))
      );

      setProgress('UPLOADING...');
      
      const response = await fetch(GAS_WEBAPP_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          action: 'registerApp',
          ...formData,
          images: imagePayloads
        }),
        redirect: 'follow'
      });

      const text = await response.text();
      const result = JSON.parse(text);

      if (result.success) {
        alert('DATA UPLOAD COMPLETE!');
        onSuccess();
      } else {
        alert('SERVER_ERROR: ' + result.message);
      }
    } catch (err: any) {
      alert('CRITICAL_SYSTEM_ERROR');
    } finally {
      setIsSubmitting(false);
      setProgress('');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#6839FF] border-4 border-black shadow-[15px_15px_0px_0px_#441DBF] w-full max-w-2xl my-8 overflow-hidden">
        <div className="px-8 py-4 bg-[#441DBF] border-b-4 border-black flex items-center justify-between text-[#4CF190]">
          <h2 className="text-3xl font-bold uppercase tracking-widest italic">Register New Object</h2>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 hover:bg-black/20 text-[#4CF190] border-2 border-[#4CF190]"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xl font-bold text-[#4CF190] uppercase underline">Creator_Name</label>
              <input
                required
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0000B9] border-2 border-black text-white focus:outline-none focus:border-[#4CF190]"
                placeholder="USER_ID_01"
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xl font-bold text-[#4CF190] uppercase underline">Object_Title</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0000B9] border-2 border-black text-white focus:outline-none focus:border-[#4CF190]"
                placeholder="APP_NAME"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-[#4CF190] uppercase underline">Function_Log (Description)</label>
            <textarea
              required
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#0000B9] border-2 border-black text-white focus:outline-none focus:border-[#4CF190]"
              placeholder="INITIALIZING_DESCRIPTION..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-[#4CF190] uppercase underline">Remote_Address (URL)</label>
            <input
              required
              type="url"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#0000B9] border-2 border-black text-white focus:outline-none focus:border-[#4CF190]"
              placeholder="https://..."
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-[#4CF190] uppercase underline">Visual_Input (Screenshots)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-4 border-black border-dashed bg-black/20 hover:bg-black/40 transition-colors">
              <div className="space-y-2 text-center">
                <div className="flex text-lg text-white items-center justify-center">
                  <label className="relative cursor-pointer bg-[#0000B9] border-2 border-black px-4 py-1 text-[#4CF190] retro-btn font-bold uppercase">
                    <span>UPLOAD_FILES</span>
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" disabled={isSubmitting} />
                  </label>
                </div>
                <p className="text-xs text-[#B6F9D7] uppercase tracking-tighter italic">Max 3 Slots Available</p>
                {files.length > 0 && (
                  <div className="mt-2 text-left">
                    {files.map((f, i) => (
                      <p key={i} className="text-sm font-bold text-[#4CF190]">[{i+1}] {f.name.slice(0, 20)}...</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xl font-bold text-[#4CF190] uppercase underline">Access_Key (Password)</label>
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-[#0000B9] border-2 border-black text-[#4CF190] focus:outline-none"
              placeholder="****"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="retro-btn flex-1 px-6 py-4 bg-[#AD7D00] text-white font-bold border-2 border-black uppercase text-xl"
              disabled={isSubmitting}
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="retro-btn grow-[2] px-6 py-4 bg-[#005900] text-[#4CF190] font-bold border-2 border-black uppercase text-xl flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-4 border-[#4CF190] border-t-transparent animate-spin mr-3" />
                  <span>{progress}</span>
                </>
              ) : 'Store_Record_Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationModal;
