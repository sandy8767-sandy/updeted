import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, X } from 'lucide-react';
import { UserSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <SettingsIcon className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Display Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Display</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings.darkMode}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        darkMode: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
                  />
                  <span>Dark Mode</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Chart Animation Speed
                </label>
                <select
                  value={localSettings.chartAnimationSpeed}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      chartAnimationSpeed: e.target.value as '0' | '400' | '1000',
                    })
                  }
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="0">No Animation</option>
                  <option value="400">Fast</option>
                  <option value="1000">Slow</option>
                </select>
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Alerts</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings.enableNotifications}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        enableNotifications: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
                  />
                  <span>Enable Desktop Notifications</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Alert Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={localSettings.alertRefreshInterval}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      alertRefreshInterval: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Data Settings */}
          <div>
            <h3 className="text-lg font-medium mb-4">Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximum Events to Display
                </label>
                <select
                  value={localSettings.maxEventsToDisplay}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      maxEventsToDisplay: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-md bg-gray-700 border-gray-600 text-white focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="100">100 events</option>
                  <option value="500">500 events</option>
                  <option value="1000">1000 events</option>
                  <option value="5000">5000 events</option>
                </select>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={localSettings.autoRefresh}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        autoRefresh: e.target.checked,
                      })
                    }
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
                  />
                  <span>Auto-refresh Data</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};