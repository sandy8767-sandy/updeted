import React, { useState } from 'react';
import { User, History, MessageSquare, Settings, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileDropdownProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenFeedback: () => void;
  onOpenHistory: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onLogout,
  onOpenSettings,
  onOpenFeedback,
  onOpenHistory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">
            {user.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-medium">{user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenHistory();
            }}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <History className="w-4 h-4" />
            <span>Activity History</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenFeedback();
            }}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Feedback</span>
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              onOpenSettings();
            }}
            className="w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>

          <div className="border-t border-gray-700">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};