import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';

// Import components
import Navbar from '../src/components/Navbar';
import Footer from '../src/components/Footer';
import ReportForm from '../src/components/ReportForm';
import AuthPage from '../src/components/AuthPage';
import ReportsList from '../src/components/ReportsList';
import MapView from '../src/components/MapView';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setActiveTab('home');
  };

  const handleReportClick = () => {
    if (!user) {
      setShowAuthPrompt(true);
    } else {
      setActiveTab('report');
    }
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        onReportClick={handleReportClick}
      />
      <div className="min-h-screen bg-gray-100">
        {/* Navigation component */}

        <main className="container mx-auto px-4 py-8 pt-20 sm:pt-24 transition-all duration-300">
          {/* Home Tab Content */}
          {activeTab === 'home' && (
            <div className="space-y-8 sm:space-y-12 bg-white rounded-lg shadow-md p-4 sm:p-6">
              {/* Welcome Message Section */}
              <section className="bg-white rounded-lg shadow-md p-4 sm:p-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4">Welcome to Fix My Street</h2>
                <div className="max-w-3xl mx-auto">
                  <p className="text-base sm:text-lg text-gray-700 mb-6">
                    Making our community better, one fix at a time. Report local issues like potholes, broken streetlights,
                    graffiti, or fly-tipping and help keep our streets clean, safe, and well-maintained.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => setActiveTab('map')}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Issues Map
                    </button>
                    <button
                      onClick={handleReportClick}
                      className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Report an Issue
                    </button>
                  </div>
                </div>
              </section>

              {/* How to Use Section */}
              <section className="bg-white rounded-lg shadow-md p-4 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">How to Use Fix My Street</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
                  <div className="text-center p-4">
                    <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">1</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Sign In</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Create an account or sign in to access the reporting features.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">2</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Upload Photo</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Take or upload a photo of the street issue. Our AI will automatically detect the problem and location.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">3</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Review & Submit</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Review the detected issue and location, add any notes, and submit your report.
                    </p>
                  </div>
                  <div className="text-center p-4">
                    <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl font-bold text-blue-600">4</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">Track Progress</h3>
                    <p className="text-sm sm:text-base text-gray-600">
                      Local authorities are notified instantly. Track the status on the map and get email updates.
                    </p>
                  </div>
                </div>
              </section>

              {/* Community Impact Stats */}
              <section className="bg-blue-600 text-white rounded-lg shadow-md p-6 sm:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Our Impact</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold mb-2">1,250+</p>
                    <p className="text-sm sm:text-base">Issues Reported</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold mb-2">975</p>
                    <p className="text-sm sm:text-base">Issues Fixed</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold mb-2">15</p>
                    <p className="text-sm sm:text-base">Neighborhoods Improved</p>
                  </div>
                  <div>
                    <p className="text-3xl sm:text-4xl font-bold mb-2">5,000+</p>
                    <p className="text-sm sm:text-base">Community Members</p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Map Tab Content */}
          {activeTab === 'map' && (
            <MapView />
          )}

          {/* Reports Tab Content */}
          {activeTab === 'reports' && (
            <ReportsList />
          )}

          {/* Report Tab Content */}
          {activeTab === 'report' && (
            user ? (
              <ReportForm user={user} />
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 lg:p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="mb-4 sm:mb-6">
                    <svg className="w-16 h-16 sm:w-20 sm:h-20 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                    Login Required
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-6">
                    You need to be logged in to report street issues. Please sign in or create an account to continue.
                  </p>
                  <button
                    onClick={() => setShowAuthPrompt(true)}
                    className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
                  >
                    Sign In / Register
                  </button>
                </div>
              </div>
            )
          )}
        </main>

        <Footer />
      </div>

      {/* Auth Modal/Page Overlay */}
      {showAuthPrompt && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <AuthPage onAuthenticated={(userData) => {
            handleLogin(userData);
            setShowAuthPrompt(false);
            setActiveTab('report');
          }} />
          <button
            onClick={() => setShowAuthPrompt(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 bg-white bg-opacity-20 text-white rounded-full p-2 hover:bg-opacity-30 transition-colors shadow-lg"
            aria-label="Close"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

export default HomePage;
