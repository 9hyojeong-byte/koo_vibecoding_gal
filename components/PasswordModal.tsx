
import React, { useState } from 'react';

interface PasswordModalProps {
  title: string;
  description: string;
  onSuccess: (password: string) => void;
  onClose: () => void;
  correctPassword?: string;
  isActionModal?: boolean;
  verifyAction?: (pw: string) => Promise<boolean>;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ 
  title, 
  description, 
  onSuccess, 
  onClose, 
  correctPassword,
  verifyAction
}) => {
  const [password, setPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setIsError(false);

    if (correctPassword) {
      if (password === correctPassword) {
        onSuccess(password);
      } else {
        setIsError(true);
        setIsVerifying(false);
      }
    } else if (verifyAction) {
        const isValid = await verifyAction(password);
        if (isValid) {
            onSuccess(password);
        } else {
            setIsError(true);
            setIsVerifying(false);
        }
    } else {
        onSuccess(password);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#441DBF] border-4 border-black shadow-[10px_10px_0px_0px_#000000] w-full max-w-sm overflow-hidden p-8">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-16 h-16 bg-[#AA0C00] border-4 border-black text-white flex items-center justify-center shadow-[4px_4px_0px_0px_#000000]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8-8v4" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-[#4CF190] uppercase tracking-tighter">{title}</h2>
            <p className="text-white text-lg font-mono opacity-80 underline italic">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="****"
                autoFocus
                className="w-full px-4 py-4 bg-[#0000B9] border-4 border-black text-[#4CF190] text-3xl text-center font-bold tracking-[1em] focus:outline-none focus:ring-0"
              />
              {isError && (
                <div className="mt-2 bg-[#AA0C00] text-white p-2 border-2 border-black text-sm font-bold animate-bounce uppercase">
                  Access Denied: Invalid Key
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="retro-btn flex-1 px-4 py-3 bg-[#AD7D00] text-white font-bold border-2 border-black uppercase text-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying}
                className="retro-btn flex-1 px-4 py-3 bg-[#005900] text-[#4CF190] font-bold border-2 border-black uppercase text-xl"
              >
                {isVerifying ? 'Wait..' : 'Confirm'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
