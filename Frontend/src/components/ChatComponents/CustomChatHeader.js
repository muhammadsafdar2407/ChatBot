import React, { useState } from "react";
import { LogOut, MoreVertical, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomChatHeader = ({ avatar, name, status }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shadow-sm" style={{ backgroundColor: 'rgb(240, 242, 245)' }}>
      {/* User Avatar and Info */}
      <div className="flex items-center flex-1">
        <div className="relative mr-3">
          <img
            src={avatar || "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face"}
            alt={name}
            className="w-11 h-11 rounded-full object-cover border-2 border-gray-200"
          />
          {/* Online status indicator */}
          <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        
        <div>
          <div className="font-semibold text-gray-900 text-base leading-tight">
            {name || "Alice"}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
            {status || "Online"}
          </div>
        </div>
      </div>

      {/* Actions Menu */}
      <div className="dropdown-container relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center justify-center w-9 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <MoreVertical size={20} />
        </button>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg min-w-44 z-50 overflow-hidden">
            <div className="py-2">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Handle profile action
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
              >
                <User size={16} />
                Profile
              </button>
              
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  // Handle settings action
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-gray-700 transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>

              <div className="h-px bg-gray-200 my-2"></div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="w-full px-4 py-3 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomChatHeader;