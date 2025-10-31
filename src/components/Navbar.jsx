import React, { useState, useEffect, useRef } from 'react';

const Navbar = ({ activeTab, setActiveTab, user, onLogout, onReportClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold">Fix My Street</h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-2 lg:space-x-4 items-center">
              <li>
                <button 
                  className={`py-2 px-3 lg:px-4 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  className={`py-2 px-3 lg:px-4 rounded-lg transition-colors ${activeTab === 'map' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('map')}
                >
                  Map
                </button>
              </li>
              <li>
                <button 
                  className={`py-2 px-3 lg:px-4 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
                  onClick={() => setActiveTab('reports')}
                >
                  Reports
                </button>
              </li>
              <li>
                <button 
                  className={`py-2 px-3 lg:px-4 rounded-lg transition-colors ${activeTab === 'report' ? 'bg-white text-blue-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  onClick={onReportClick}
                >
                  Report Issue
                </button>
              </li>
              
              {/* User Menu */}
              {user ? (
                <li className="relative ml-2" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 py-2 px-3 lg:px-4 bg-blue-100 bg-opacity-20 text-black rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>  
                    <span className="hidden lg:inline">{user.name}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="space-y-2">
              <li>
                <button 
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'home' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
                  onClick={() => {
                    setActiveTab('home');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'map' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
                  onClick={() => {
                    setActiveTab('map');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Map
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-white text-blue-600' : 'text-white hover:bg-blue-700'}`}
                  onClick={() => {
                    setActiveTab('reports');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Reports
                </button>
              </li>
              <li>
                <button 
                  className={`w-full text-left py-2 px-4 rounded-lg transition-colors ${activeTab === 'report' ? 'bg-white text-blue-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  onClick={() => {
                    onReportClick();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Report Issue
                </button>
              </li>
              
              {/* Mobile User Menu */}
              {user && (
                <>
                  <li className="pt-4 border-t border-blue-500">
                    <div className="px-4 py-2 text-white">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-blue-200">{user.email}</p>
                    </div>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 px-4 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
